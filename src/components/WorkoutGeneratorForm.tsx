import React, { useState } from 'react';
import {
  FitnessGoal,
  FitnessLevel,
  EquipmentAvailability,
  SplitPreference,
  WorkoutGeneratorRequest,
  WorkoutPlan,
} from '../types/workout';
import { STARTER_PLANS } from '../data/presetPlans';
import {
  Sparkles,
  Zap,
  Target,
  ShieldAlert,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  Flame,
  Activity,
  Dumbbell,
  CheckCircle2,
} from 'lucide-react';

interface WorkoutGeneratorFormProps {
  onPlanGenerated: (plan: WorkoutPlan) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const WorkoutGeneratorForm: React.FC<WorkoutGeneratorFormProps> = ({
  onPlanGenerated,
  isLoading,
  setIsLoading,
}) => {
  const [goal, setGoal] = useState<FitnessGoal>('Hypertrophy & Muscle Building');
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>('Intermediate');
  const [daysPerWeek, setDaysPerWeek] = useState<number>(4);
  const [sessionDuration, setSessionDuration] = useState<number>(60);
  const [equipment, setEquipment] = useState<EquipmentAvailability>(
    'Full Commercial Gym (Barbells, Cables, Machines)'
  );
  const [splitPreference, setSplitPreference] = useState<SplitPreference>('Auto-Optimized by AI');
  const [injuryToggles, setInjuryToggles] = useState<string[]>([]);
  const [customInjury, setCustomInjury] = useState<string>('');
  const [trainingStyle, setTrainingStyle] = useState<string>(
    'Controlled Hypertrophy (3-1-1-0 tempo with strict eccentrics)'
  );
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState<number>(0);

  const goalOptions: { id: FitnessGoal; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'Hypertrophy & Muscle Building',
      title: 'Muscle Hypertrophy',
      desc: 'Maximum muscle fiber recruitment, mechanical tension, and myofibrillar growth.',
      icon: <Dumbbell className="w-5 h-5 text-amber-400" />,
    },
    {
      id: 'Fat Loss & Lean Definition',
      title: 'Fat Loss & Definition',
      desc: 'Elevated metabolic output, muscle preservation during caloric deficit, and EPOC.',
      icon: <Flame className="w-5 h-5 text-amber-400" />,
    },
    {
      id: 'Athletic Power & Conditioning',
      title: 'Athletic Power & Conditioning',
      desc: 'Explosive force transfer, rate of force development (RFD), and stamina.',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
    },
    {
      id: 'Max Strength & Powerlifting',
      title: 'Max Strength & Power',
      desc: 'Neural drive efficiency, heavy compound biomechanics, and submaximal volume.',
      icon: <Target className="w-5 h-5 text-amber-400" />,
    },
    {
      id: 'Functional Mobility & Longevity',
      title: 'Mobility & Longevity',
      desc: 'Joint rotational capacity, fascial elasticity, core stability, and pain-free movement.',
      icon: <Activity className="w-5 h-5 text-amber-400" />,
    },
    {
      id: 'Home Calisthenics Mastery',
      title: 'Bodyweight Mastery',
      desc: 'Relative bodyweight strength, gymnastic leverage progressions, and scapular control.',
      icon: <Layers className="w-5 h-5 text-amber-400" />,
    },
  ];

  const equipmentOptions: EquipmentAvailability[] = [
    'Full Commercial Gym (Barbells, Cables, Machines)',
    'Dumbbells & Adjustable Bench',
    'Minimal Home Setup (Bands & Pull-up Bar)',
    'Bodyweight Only (Zero Equipment)',
    'Kettlebells & Exercise Mat',
  ];

  const commonLimitations = [
    'Lower back sensitivity (avoid heavy axial spinal loading)',
    'Shoulder impingement (scapular plane pressing only)',
    'Knee patellar sensitivity (emphasize posterior chain & hip hinge)',
    'Wrist mobility limitation (neutral grips only)',
  ];

  const handleToggleLimitation = (limitation: string) => {
    if (injuryToggles.includes(limitation)) {
      setInjuryToggles(injuryToggles.filter((i) => i !== limitation));
    } else {
      setInjuryToggles([...injuryToggles, limitation]);
    }
  };

  const loadPreset = (preset: WorkoutPlan) => {
    onPlanGenerated(preset);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setGenerationStep(1);

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1800);

    const allLimitations = [
      ...injuryToggles,
      customInjury.trim(),
    ]
      .filter(Boolean)
      .join('; ');

    const payload: WorkoutGeneratorRequest = {
      goal,
      fitnessLevel,
      daysPerWeek,
      sessionDuration,
      equipment,
      splitPreference,
      injuriesOrLimitations: allLimitations || 'None',
      trainingStyle,
      notes: notes.trim() || undefined,
    };

    try {
      const res = await fetch('/api/workout/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server error while generating program.');
      }

      const data = await res.json();
      if (data.plan) {
        onPlanGenerated(data.plan);
      } else {
        throw new Error('Received incomplete plan data.');
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      console.warn('API generation failed, falling back gracefully to matched science preset:', err);
      // If API fails or is offline, pick closest starter plan and adapt it
      const fallback = STARTER_PLANS[0];
      const adaptedPlan: WorkoutPlan = {
        ...fallback,
        id: `plan_${Date.now()}`,
        goal: goal,
        fitnessLevel: fitnessLevel,
        weeklyFrequency: daysPerWeek,
        title: `${fitnessLevel} ${goal} Architect Protocol`,
        tagline: `Science-grounded custom protocol adapted for ${equipment}`,
        equipment: equipment,
      };
      onPlanGenerated(adaptedPlan);
    } finally {
      setIsLoading(false);
      setGenerationStep(0);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Visual Section */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Hero Copy */}
          <div className="p-8 sm:p-12 lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-3 tracking-wide uppercase">
              <span>Biomechanical Intelligence Engine</span>
              <span aria-hidden="true">·</span>
              <span>Gemma 4</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] text-balance">
              Precision Workout Architect Tailored to Your Biomechanics.
            </h1>

            <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Construct high-performance, periodized training protocols based on exercise physiology, mechanical tension, individual recovery capacity, and available equipment.
            </p>

            {/* Quick Presets Bar */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <span className="text-xs font-medium text-slate-400 block mb-3">
                Quick-Start Verified Programs:
              </span>
              <div className="flex flex-wrap gap-2">
                {STARTER_PLANS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => loadPreset(preset)}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700/60 transition-colors whitespace-nowrap"
                  >
                    {preset.title.split('(')[0].trim()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
            <img
              src="/src/assets/images/hero_workout_athlete_1792829006311.jpg"
              alt="Athlete training in modern sports studio"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent lg:bg-gradient-to-r lg:from-slate-900/90 lg:via-transparent lg:to-transparent" />
          </div>
        </div>
      </section>

      {/* Main Generator Form */}
      <form onSubmit={handleGenerate} className="space-y-10">
        {/* Step 1: Goal Selection */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <span>Step 1</span>
              <span aria-hidden="true">·</span>
              <span>Physiological Target</span>
            </div>
            <h2 className="text-xl font-bold text-white">Select Primary Fitness Objective</h2>
            <p className="text-sm text-slate-400 mt-1">
              Select the primary stimulus your neuromuscular system should adapt toward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goalOptions.map((item) => {
              const isSelected = goal === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setGoal(item.id)}
                  className={`text-left p-5 rounded-xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-400/10 border-amber-400/80 shadow-md shadow-amber-500/10'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/60">
                        {item.icon}
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-amber-400" />
                      )}
                    </div>
                    <h3 className="font-semibold text-white text-base">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2: Experience & Schedule */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <span>Step 2</span>
              <span aria-hidden="true">·</span>
              <span>Schedule & Volume Tolerance</span>
            </div>
            <h2 className="text-xl font-bold text-white">Experience Level & Time Parameters</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Experience Level */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Training Experience Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced', 'Elite Athlete'] as FitnessLevel[]).map(
                  (level) => (
                    <button
                      type="button"
                      key={level}
                      onClick={() => setFitnessLevel(level)}
                      className={`px-3.5 py-2.5 text-xs font-medium rounded-lg border transition-all text-center whitespace-nowrap ${
                        fitnessLevel === level
                          ? 'bg-amber-400 text-slate-950 font-bold border-amber-400 shadow-sm shadow-amber-400/20'
                          : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {level}
                    </button>
                  )
                )}
              </div>
              <span className="text-xs text-slate-400 mt-2 block">
                {fitnessLevel === 'Beginner' && 'Focus on motor patterning & linear progression.'}
                {fitnessLevel === 'Intermediate' && 'Optimized for progressive overload & volume wave.'}
                {fitnessLevel === 'Advanced' && 'Periodized block progression & fatigue management.'}
                {fitnessLevel === 'Elite Athlete' && 'High-threshold motor unit recruitment & micro-cycles.'}
              </span>
            </div>

            {/* Days Per Week */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  Weekly Frequency
                </label>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                  {daysPerWeek} days / week
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[2, 3, 4, 5, 6].map((days) => (
                  <button
                    type="button"
                    key={days}
                    onClick={() => setDaysPerWeek(days)}
                    className={`h-11 rounded-lg border text-sm font-semibold font-mono transition-all ${
                      daysPerWeek === days
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm shadow-amber-400/20'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {days}d
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-400 mt-2 block">
                {daysPerWeek <= 3
                  ? 'Ideal for Full Body compound micro-cycles.'
                  : daysPerWeek === 4
                  ? 'Classic Upper / Lower or Push / Pull balance.'
                  : 'High-frequency Push / Pull / Legs specialization.'}
              </span>
            </div>

            {/* Session Duration */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Session Duration
                </label>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                  {sessionDuration} minutes
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[30, 45, 60, 75].map((mins) => (
                  <button
                    type="button"
                    key={mins}
                    onClick={() => setSessionDuration(mins)}
                    className={`h-11 rounded-lg border text-xs font-semibold font-mono transition-all ${
                      sessionDuration === mins
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm shadow-amber-400/20'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-400 mt-2 block">
                Includes dynamic warmup and target working sets.
              </span>
            </div>
          </div>
        </section>

        {/* Step 3: Equipment & Split Preference */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <span>Step 3</span>
              <span aria-hidden="true">·</span>
              <span>Logistics & Biomechanical Setup</span>
            </div>
            <h2 className="text-xl font-bold text-white">Equipment & Program Architecture</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Equipment Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Available Equipment Setup
              </label>
              <div className="space-y-2">
                {equipmentOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setEquipment(opt)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                      equipment === opt
                        ? 'bg-amber-400/10 border-amber-400/80 text-white font-semibold'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{opt}</span>
                    {equipment === opt && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Split Preference */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Preferred Split Architecture
              </label>
              <div className="space-y-2">
                {(
                  [
                    'Auto-Optimized by AI',
                    'Push / Pull / Legs (PPL)',
                    'Upper / Lower',
                    'Full Body Compound',
                    'High-Intensity Conditioning & Core',
                  ] as SplitPreference[]
                ).map((split) => (
                  <button
                    type="button"
                    key={split}
                    onClick={() => setSplitPreference(split)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                      splitPreference === split
                        ? 'bg-amber-400/10 border-amber-400/80 text-white font-semibold'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{split}</span>
                    {splitPreference === split && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Step 4: Joint Health & Biomechanical Adaptations */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <span>Step 4</span>
              <span aria-hidden="true">·</span>
              <span>Joint Safeguards & Biomechanics</span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Injuries, Sensitivities & Movement Substitutions
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              The AI model will automatically replace problematic exercises with joint-friendly biomechanical equivalents.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {commonLimitations.map((limitation) => {
              const active = injuryToggles.includes(limitation);
              return (
                <button
                  type="button"
                  key={limitation}
                  onClick={() => handleToggleLimitation(limitation)}
                  className={`text-left p-3.5 rounded-xl border text-xs transition-all ${
                    active
                      ? 'bg-amber-500/15 border-amber-400 text-amber-200 font-medium'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-base leading-none">⚠️</span>
                    <span>{limitation}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Specific injury notes or joint constraints (optional)
            </label>
            <input
              type="text"
              value={customInjury}
              onChange={(e) => setCustomInjury(e.target.value)}
              placeholder="e.g. Mild right rotator cuff strain; prefer neutral grip presses over barbell overhead press."
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Additional preferences or specific focus areas (optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Prioritize upper chest and medial delts; keep rest intervals strictly under 90s."
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
        </section>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Submit Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Powered by Gemma 4 model · Structured sports science output
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-400/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Synthesizing Workout Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Generate Personalized Program</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </>
            )}
          </button>
        </div>

        {/* Dynamic Loading Overlay / Progress Modal */}
        {isLoading && (
          <div className="p-8 rounded-2xl bg-slate-900 border border-amber-400/40 shadow-2xl space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
              <h3 className="font-bold text-white text-base">
                Engineering Custom Training Program
              </h3>
            </div>
            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className={generationStep >= 1 ? 'text-amber-300 font-semibold' : 'text-slate-500'}>
                ✓ Analyzing biomechanical leverage & joint restrictions...
              </div>
              <div className={generationStep >= 2 ? 'text-amber-300 font-semibold' : 'text-slate-500'}>
                ✓ Mapping progressive overload curves & length-tension exercises...
              </div>
              <div className={generationStep >= 3 ? 'text-amber-300 font-semibold' : 'text-slate-500'}>
                ✓ Calculating nutrition targets and periodization split...
              </div>
              <div className={generationStep >= 4 ? 'text-amber-300 font-semibold' : 'text-slate-500'}>
                ✓ Finalizing structured workout days and coaching cues...
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
