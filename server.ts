import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Gemma 4 via the Gemini API. The 26B MoE variant is much faster and more reliable than gemma-4-31b-it.
const MODEL = process.env.GEMMA_MODEL || 'gemma-4-26b-a4b-it';

// Gemma endpoints intermittently return 5xx; retry once before failing the request.
async function generate(params: Omit<Parameters<typeof ai.models.generateContent>[0], 'model'>) {
  try {
    return await ai.models.generateContent({ model: MODEL, ...params });
  } catch (error: any) {
    if (error?.status >= 500) {
      return await ai.models.generateContent({ model: MODEL, ...params });
    }
    throw error;
  }
}

// Gemma's native JSON mode (responseSchema) is unreliable: it returns empty arrays or runs away
// until the output is truncated. Instead the schema goes in the prompt and we extract the JSON here.
function jsonInstruction(schema: object) {
  return `\n\nRespond with ONLY valid JSON (no markdown fences, no prose before or after) matching this JSON schema:\n${JSON.stringify(schema)}`;
}

function parseModelJson(text: string) {
  const match = text.match(/[\[{][\s\S]*[\]}]/);
  if (!match) throw new Error('Model did not return JSON.');
  return JSON.parse(match[0]);
}

// Workout Generation Endpoint
app.post('/api/workout/generate', async (req, res) => {
  try {
    const {
      goal,
      fitnessLevel,
      daysPerWeek,
      sessionDuration,
      equipment,
      splitPreference,
      injuriesOrLimitations,
      trainingStyle,
      notes,
    } = req.body;

    if (!goal || !fitnessLevel || !daysPerWeek) {
      return res.status(400).json({ error: 'Missing required training profile parameters.' });
    }

    const systemPrompt = `You are an elite exercise physiologist, CSCS (Certified Strength and Conditioning Specialist), and biomechanics coach.
Your job is to generate an authentic, scientifically grounded, personalized workout program tailored specifically to the user's inputs.
Rules:
1. Exactly match the requested daysPerWeek (between 2 and 6 days). Generate an array with exactly that many days.
2. Respect all physical limitations or injuries (e.g., if lower back pain is specified, avoid heavy spinal compression like loaded back squats; prioritize Bulgarian split squats, hip thrusts, chest-supported rows).
3. Align equipment with what the user actually has available (${equipment}).
4. Use realistic, science-backed rep tempos (e.g. "3-0-1-0" for 3s eccentric, 0s pause, 1s concentric, 0s top).
5. Provide actionable coaching cues focused on internal and external biomechanical focus (e.g. "pack lats", "drive heels", "maintain scapular retraction").
6. Provide calculated nutrition targets (protein g/kg, calorie surplus/deficit guidelines).`;

    const userPrompt = `Generate a complete personalized workout program with the following profile:
- Primary Fitness Goal: ${goal}
- Experience Level: ${fitnessLevel}
- Training Frequency: ${daysPerWeek} days per week
- Target Session Duration: ${sessionDuration || 55} minutes per workout
- Available Equipment: ${equipment}
- Preferred Split Style: ${splitPreference || 'Auto-Optimized'}
- Biomechanical Limitations / Injuries: ${injuriesOrLimitations || 'None'}
- Training Style & Tempo: ${trainingStyle || 'Controlled Hypertrophy'}
- Extra User Notes: ${notes || 'None'}`;

    const workoutSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Creative, inspiring title of the training program' },
        tagline: { type: Type.STRING, description: 'One-line strategic summary of the protocol' },
        goal: { type: Type.STRING, description: 'The primary goal' },
        fitnessLevel: { type: Type.STRING, description: 'The target experience level' },
        weeklyFrequency: { type: Type.INTEGER, description: 'Number of workout days per week' },
        sessionDuration: { type: Type.INTEGER, description: 'Average session duration in minutes' },
        equipment: { type: Type.STRING, description: 'Equipment utilized' },
        scienceOverview: {
          type: Type.STRING,
          description: 'Detailed scientific rationale explaining how mechanical tension, volume, or metabolic conditioning achieve the goal'
        },
        periodization: {
          type: Type.OBJECT,
          properties: {
            progressionModel: { type: Type.STRING, description: 'How to progressively overload week to week' },
            rpeGuideline: { type: Type.STRING, description: 'Target Rate of Perceived Exertion strategy' },
            recoveryRecommendation: { type: Type.STRING, description: 'Rest day active recovery and sleep protocol' }
          },
          required: ['progressionModel', 'rpeGuideline', 'recoveryRecommendation']
        },
        nutritionGuidance: {
          type: Type.OBJECT,
          properties: {
            calorieStrategy: { type: Type.STRING, description: 'Calorie intake directive (surplus, maintenance, or deficit)' },
            proteinTargetGramsPerKg: { type: Type.NUMBER, description: 'Target grams of daily protein per kg of bodyweight' },
            keyHabits: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 practical nutrition habits to accelerate results'
            }
          },
          required: ['calorieStrategy', 'proteinTargetGramsPerKg', 'keyHabits']
        },
        days: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              dayNumber: { type: Type.INTEGER, description: 'Day sequence number (1, 2, ...)' },
              dayName: { type: Type.STRING, description: 'Descriptive day title e.g. Day 1 - Push Hypertrophy' },
              targetMuscles: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Primary muscle groups targeted'
              },
              estimatedTimeMinutes: { type: Type.INTEGER, description: 'Estimated session length in minutes' },
              warmup: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    durationOrReps: { type: Type.STRING },
                    cue: { type: Type.STRING }
                  },
                  required: ['name', 'durationOrReps', 'cue']
                }
              },
              exercises: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING, description: 'Unique string id for the exercise' },
                    name: { type: Type.STRING, description: 'Full exercise name' },
                    targetMuscle: { type: Type.STRING, description: 'Main prime mover muscle' },
                    secondaryMuscles: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    sets: { type: Type.INTEGER, description: 'Number of working sets' },
                    reps: { type: Type.STRING, description: 'Target rep range e.g. 8-10 or 12-15' },
                    rpe: { type: Type.STRING, description: 'Target intensity e.g. RPE 8' },
                    restSeconds: { type: Type.INTEGER, description: 'Rest time between sets in seconds' },
                    tempo: { type: Type.STRING, description: 'Eccentric-pause-concentric tempo e.g. 3-0-1-0' },
                    coachingCues: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Specific biomechanical form tips'
                    },
                    commonMistakes: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Frequent errors to avoid'
                    },
                    substitutions: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Alternative exercises with similar muscle recruitment'
                    }
                  },
                  required: ['id', 'name', 'targetMuscle', 'secondaryMuscles', 'sets', 'reps', 'rpe', 'restSeconds', 'tempo', 'coachingCues', 'commonMistakes', 'substitutions']
                }
              },
              cooldown: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    durationOrReps: { type: Type.STRING },
                    cue: { type: Type.STRING }
                  },
                  required: ['name', 'durationOrReps', 'cue']
                }
              }
            },
            required: ['dayNumber', 'dayName', 'targetMuscles', 'estimatedTimeMinutes', 'warmup', 'exercises', 'cooldown']
          }
        }
      },
      required: ['title', 'tagline', 'goal', 'fitnessLevel', 'weeklyFrequency', 'sessionDuration', 'equipment', 'scienceOverview', 'periodization', 'nutritionGuidance', 'days']
    };

    const response = await generate({
      contents: userPrompt + jsonInstruction(workoutSchema),
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 24000,
      },
    });

    const responseText = response.text || '';
    const parsedData = parseModelJson(responseText);

    const fullPlan = {
      ...parsedData,
      id: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    return res.json({ success: true, plan: fullPlan });
  } catch (error: any) {
    console.error('Error generating workout plan:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate personalized workout plan.',
    });
  }
});

// Coach Advice & Biomechanics Guidance Endpoint
app.post('/api/workout/coach-advice', async (req, res) => {
  try {
    const { exerciseName, targetMuscle, question, userContext } = req.body;

    const prompt = `You are an elite strength & biomechanics coach. The user is asking about the exercise: "${exerciseName}" (targeting ${targetMuscle || 'muscles'}).
User question: "${question}"
Additional context: ${userContext || 'None'}

Provide a direct, practical, and scientifically accurate response in 3-4 bullet points covering:
1. Direct answer / technique cue to fix the issue or optimize recruitment.
2. Joint safety & alignment checkpoints.
3. How to adjust intensity or tempo if experiencing fatigue or discomfort.`;

    const response = await generate({
      contents: prompt,
      config: {
        temperature: 0.4,
      },
    });

    return res.json({ advice: response.text || 'Ensure proper bracing and control the eccentric phase.' });
  } catch (error: any) {
    console.error('Error getting coach advice:', error);
    return res.status(500).json({ error: error.message || 'Failed to get coach advice.' });
  }
});

// Exercise Swap Endpoint
app.post('/api/workout/exercise-swap', async (req, res) => {
  try {
    const { exerciseName, targetMuscle, equipment, limitationReason } = req.body;

    const prompt = `Suggest the best 3 alternative exercises for "${exerciseName}" (primary muscle: ${targetMuscle}).
Available equipment: ${equipment || 'Standard Gym'}.
Reason for swap: ${limitationReason || 'Equipment availability or joint comfort'}.
For each alternative, explain why it's a great match and how to execute it properly.`;

    const swapSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          equipmentNeeded: { type: Type.STRING },
          whyItWorks: { type: Type.STRING },
          coachingCue: { type: Type.STRING },
        },
        required: ['name', 'equipmentNeeded', 'whyItWorks', 'coachingCue'],
      },
    };

    const response = await generate({
      contents: prompt + jsonInstruction(swapSchema),
      config: {
        temperature: 0.4,
        maxOutputTokens: 4096,
      },
    });

    const parsed = parseModelJson(response.text || '[]');
    return res.json({ alternatives: parsed });
  } catch (error: any) {
    console.error('Error swapping exercise:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate substitutions.' });
  }
});

// Vite or Static Serving
// Hosting platforms (e.g. Render) assign the port via PORT.
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
