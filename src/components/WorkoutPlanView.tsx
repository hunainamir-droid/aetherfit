import React, { useState } from 'react';
import { WorkoutPlan, ExerciseItem } from '../types/workout';
import {
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Clock,
  Dumbbell,
  Check,
  Share2,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Flame,
  Info,
} from 'lucide-react';

interface WorkoutPlanViewProps {
  plan: WorkoutPlan;
  onStartSession: (dayNumber: number) => void;
  onAskCoach: (exerciseName: string, targetMuscle: string) => void;
  onSwapExercise: (dayNumber: number, exercise: ExerciseItem) => void;
  onSavePlan: (plan: WorkoutPlan) => void;
  isSaved: boolean;
}

export const WorkoutPlanView: React.FC<WorkoutPlanViewProps> = ({
  plan,
  onStartSession,
  onAskCoach,
  onSwapExercise,
  onSavePlan,
  isSaved,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  const activeDay = plan.days[selectedDayIndex] || plan.days[0];

  const handleCopySummary = () => {
    const text = `${plan.title}\n${plan.tagline}\nGoal: ${plan.goal} | Level: ${plan.fitnessLevel} | ${plan.weeklyFrequency} days/week\n\n${plan.days
      .map(
        (d) =>
          `Day ${d.dayNumber}: ${d.dayName}\n${d.exercises
            .map((ex) => `  - ${ex.name}: ${ex.sets} sets × ${ex.reps} reps (${ex.rpe}, tempo: ${ex.tempo})`)
            .join('\n')}`
      )
      .join('\n\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedExerciseId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Program Header */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="space-y-3">
            {/* Zero-Pill Unboxed Metadata with Typographic Separators */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
              <span className="text-amber-400 font-bold">{plan.goal}</span>
              <span aria-hidden="true">·</span>
              <span>{plan.fitnessLevel}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{plan.weeklyFrequency} Days / Week</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{plan.sessionDuration} Mins</span>
              <span aria-hidden="true">·</span>
              <span>{plan.equipment}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {plan.title}
            </h1>

            <p className="text-base text-slate-300 max-w-3xl leading-relaxed">
              {plan.tagline}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onSavePlan(plan)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 ${
                isSaved
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{isSaved ? 'Program Saved' : 'Save Program'}</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Share / Copy'}</span>
            </button>

            <button
              onClick={() => onStartSession(activeDay.dayNumber)}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-400/20 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Start Day {activeDay.dayNumber} Session</span>
            </button>
          </div>
        </div>

        {/* Science & Periodization Insights Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Exercise Physiology Rationale</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
              {plan.scienceOverview}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Periodization Model</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {plan.periodization.progressionModel}
            </p>
            <div className="mt-2 text-xs text-slate-400">
              Guideline: <span className="text-slate-200 font-medium">{plan.periodization.rpeGuideline}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Nutrition & Hypertrophy Fuel</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {plan.nutritionGuidance.calorieStrategy}
            </p>
            <div className="mt-2 text-xs text-slate-300 font-mono">
              Protein Target:{' '}
              <span className="text-amber-400 font-bold tabular-nums">
                {plan.nutritionGuidance.proteinTargetGramsPerKg}g / kg bodyweight
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Day Selector Segmented Tabs */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Weekly Training Schedule</h2>
          <span className="text-xs text-slate-400">
            Select a day to review movements or launch live mode
          </span>
        </div>

        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/80 border border-slate-800 rounded-xl">
          {plan.days.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            return (
              <button
                key={day.dayNumber}
                type="button"
                onClick={() => setSelectedDayIndex(idx)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Day {day.dayNumber}: {day.dayName.split(':')[1]?.trim() || day.dayName}
              </button>
            );
          })}
        </div>

        {/* Selected Day View */}
        {activeDay && (
          <div className="space-y-6">
            {/* Day Overview Banner */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">{activeDay.dayName}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span>Target Muscle Groups:</span>
                  <span className="text-slate-200 font-medium">
                    {activeDay.targetMuscles.join(' · ')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="tabular-nums">~{activeDay.estimatedTimeMinutes} mins</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Dumbbell className="w-4 h-4 text-amber-400" />
                  <span className="tabular-nums">{activeDay.exercises.length} Exercises</span>
                </div>
              </div>
            </div>

            {/* Dynamic Warmup Routine */}
            {activeDay.warmup && activeDay.warmup.length > 0 && (
              <div className="p-5 rounded-xl bg-slate-900/30 border border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Phase 1: Biomechanical Prep & Dynamic Warm-up</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {activeDay.warmup.map((w, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <div className="font-semibold text-white">{w.name}</div>
                      <div className="text-amber-300/90 font-mono mt-0.5">{w.durationOrReps}</div>
                      <p className="text-slate-400 mt-1 leading-relaxed">{w.cue}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exercise Movements List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wider">
                <span>Phase 2: Main Working Movements</span>
                <span className="text-slate-400 font-normal normal-case">
                  Click any card to reveal biomechanical coaching cues & mistakes
                </span>
              </div>

              {activeDay.exercises.map((exercise, idx) => {
                const isExpanded = expandedExerciseId === exercise.id;
                return (
                  <div
                    key={exercise.id}
                    className="rounded-xl border border-slate-800 bg-slate-900/70 hover:border-slate-700/80 transition-all overflow-hidden"
                  >
                    {/* Main Exercise Row */}
                    <div
                      onClick={() => toggleExpand(exercise.id)}
                      className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="font-mono text-amber-400 font-bold tabular-nums">
                            0{idx + 1}.
                          </span>
                          <span className="font-medium text-slate-300">{exercise.targetMuscle}</span>
                          {exercise.secondaryMuscles.length > 0 && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-slate-500">
                                {exercise.secondaryMuscles.join(', ')}
                              </span>
                            </>
                          )}
                        </div>

                        <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                          {exercise.name}
                        </h4>
                      </div>

                      {/* Movement Prescription Metrics */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                        <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700/60">
                          <span className="text-slate-400 block text-[10px] uppercase">Sets × Reps</span>
                          <span className="text-white font-bold text-sm tabular-nums">
                            {exercise.sets} × {exercise.reps}
                          </span>
                        </div>

                        <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700/60">
                          <span className="text-slate-400 block text-[10px] uppercase">Intensity</span>
                          <span className="text-amber-400 font-bold text-sm">{exercise.rpe}</span>
                        </div>

                        <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700/60">
                          <span className="text-slate-400 block text-[10px] uppercase">Rest</span>
                          <span className="text-slate-200 font-bold text-sm tabular-nums">
                            {exercise.restSeconds}s
                          </span>
                        </div>

                        <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700/60">
                          <span className="text-slate-400 block text-[10px] uppercase">Tempo</span>
                          <span className="text-slate-200 font-bold text-sm">{exercise.tempo}</span>
                        </div>

                        <div className="text-slate-400 pl-2">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Coaching & Form Breakdown */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 bg-slate-950/40 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Coaching Cues */}
                          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 mb-2">
                              <Sparkles className="w-3.5 h-3.5" />
                              Biomechanical Form Cues
                            </span>
                            <ul className="space-y-1.5 text-xs text-slate-300">
                              {exercise.coachingCues.map((cue, cIdx) => (
                                <li key={cIdx} className="flex items-start gap-2">
                                  <span className="text-amber-400 mt-0.5">•</span>
                                  <span>{cue}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Common Mistakes */}
                          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5 mb-2">
                              <Info className="w-3.5 h-3.5" />
                              Common Errors to Avoid
                            </span>
                            <ul className="space-y-1.5 text-xs text-slate-300">
                              {exercise.commonMistakes.map((mistake, mIdx) => (
                                <li key={mIdx} className="flex items-start gap-2">
                                  <span className="text-rose-400 mt-0.5">✕</span>
                                  <span>{mistake}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Interactive Exercise Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <div className="text-xs text-slate-400 flex items-center gap-2">
                            <span>Equipment substitutions available:</span>
                            <span className="text-slate-300">
                              {exercise.substitutions.slice(0, 2).join(' or ')}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSwapExercise(activeDay.dayNumber, exercise);
                              }}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700/80 transition-colors flex items-center gap-1.5"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Swap Exercise</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onAskCoach(exercise.name, exercise.targetMuscle);
                              }}
                              className="px-3 py-1.5 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 rounded-lg text-xs font-medium border border-amber-400/40 transition-colors flex items-center gap-1.5"
                            >
                              <HelpCircle className="w-3.5 h-3.5" />
                              <span>Ask AI Coach</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Cooldown Routine */}
            {activeDay.cooldown && activeDay.cooldown.length > 0 && (
              <div className="p-5 rounded-xl bg-slate-900/30 border border-slate-800/80 space-y-3">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Phase 3: Fascial Decompression & Parasympathetic Cooldown
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeDay.cooldown.map((c, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <div className="font-semibold text-white">{c.name}</div>
                      <div className="text-amber-300/90 font-mono mt-0.5">{c.durationOrReps}</div>
                      <p className="text-slate-400 mt-1 leading-relaxed">{c.cue}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
