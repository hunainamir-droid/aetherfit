export type FitnessGoal =
  | 'Hypertrophy & Muscle Building'
  | 'Fat Loss & Lean Definition'
  | 'Athletic Power & Conditioning'
  | 'Max Strength & Powerlifting'
  | 'Functional Mobility & Longevity'
  | 'Home Calisthenics Mastery';

export type FitnessLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite Athlete';

export type EquipmentAvailability =
  | 'Full Commercial Gym (Barbells, Cables, Machines)'
  | 'Dumbbells & Adjustable Bench'
  | 'Minimal Home Setup (Bands & Pull-up Bar)'
  | 'Bodyweight Only (Zero Equipment)'
  | 'Kettlebells & Exercise Mat';

export type SplitPreference =
  | 'Auto-Optimized by AI'
  | 'Push / Pull / Legs (PPL)'
  | 'Upper / Lower'
  | 'Full Body Compound'
  | 'High-Intensity Conditioning & Core';

export interface WorkoutGeneratorRequest {
  goal: FitnessGoal;
  fitnessLevel: FitnessLevel;
  daysPerWeek: number;
  sessionDuration: number; // in minutes
  equipment: EquipmentAvailability;
  splitPreference: SplitPreference;
  injuriesOrLimitations?: string;
  trainingStyle?: string;
  notes?: string;
}

export interface WarmupItem {
  name: string;
  durationOrReps: string;
  cue: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  targetMuscle: string;
  secondaryMuscles: string[];
  sets: number;
  reps: string;
  rpe: string; // e.g. "RPE 7-8"
  restSeconds: number;
  tempo: string; // e.g. "3-0-1-0"
  coachingCues: string[];
  commonMistakes: string[];
  substitutions: string[];
}

export interface WorkoutDay {
  dayNumber: number;
  dayName: string;
  targetMuscles: string[];
  estimatedTimeMinutes: number;
  warmup: WarmupItem[];
  exercises: ExerciseItem[];
  cooldown: WarmupItem[];
}

export interface WorkoutPlan {
  id: string;
  createdAt: string;
  title: string;
  tagline: string;
  goal: string;
  fitnessLevel: string;
  weeklyFrequency: number;
  sessionDuration: number;
  equipment: string;
  scienceOverview: string;
  periodization: {
    progressionModel: string;
    rpeGuideline: string;
    recoveryRecommendation: string;
  };
  nutritionGuidance: {
    calorieStrategy: string;
    proteinTargetGramsPerKg: number;
    keyHabits: string[];
  };
  days: WorkoutDay[];
}

export interface LoggedSet {
  setNumber: number;
  weightLbs?: number;
  repsCompleted: number;
  completed: boolean;
}

export interface LoggedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: LoggedSet[];
  notes?: string;
}

export interface WorkoutSessionLog {
  id: string;
  planId: string;
  planTitle: string;
  dayNumber: number;
  dayName: string;
  startedAt: string;
  completedAt?: string;
  durationMinutes: number;
  exercises: LoggedExercise[];
  totalVolumeLbs: number;
  feedbackRating?: number; // 1 to 5
}
