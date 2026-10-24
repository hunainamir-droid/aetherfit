import React, { useState, useEffect, useRef } from 'react';
import { WorkoutDay, LoggedExercise, WorkoutSessionLog, ExerciseItem } from '../types/workout';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  Clock,
  Dumbbell,
  Check,
  Award,
  ChevronRight,
  Flame,
  ArrowLeft,
  HelpCircle,
} from 'lucide-react';

interface ActiveWorkoutSessionProps {
  day: WorkoutDay;
  planTitle: string;
  planId: string;
  onFinishSession: (sessionLog: WorkoutSessionLog) => void;
  onCancelSession: () => void;
  onAskCoach: (exerciseName: string, targetMuscle: string) => void;
}

export const ActiveWorkoutSession: React.FC<ActiveWorkoutSessionProps> = ({
  day,
  planTitle,
  planId,
  onFinishSession,
  onCancelSession,
  onAskCoach,
}) => {
  // Overall session elapsed time
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Audio toggles
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundManager.soundEnabled);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(soundManager.voiceEnabled);

  // Rest timer
  const [restRemaining, setRestRemaining] = useState<number>(0);
  const [isRestActive, setIsRestActive] = useState<boolean>(false);
  const [currentRestTotal, setCurrentRestTotal] = useState<number>(90);

  // Exercise set tracking
  const [loggedExercises, setLoggedExercises] = useState<LoggedExercise[]>(() =>
    day.exercises.map((ex) => ({
      exerciseId: ex.id,
      exerciseName: ex.name,
      sets: Array.from({ length: ex.sets }, (_, i) => ({
        setNumber: i + 1,
        weightLbs: 0,
        repsCompleted: parseInt(ex.reps.split('-')[0]) || 10,
        completed: false,
      })),
    }))
  );

  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [userRating, setUserRating] = useState<number>(5);

  const restTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Master Session Timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Rest Timer Countdown and Audio Signals
  useEffect(() => {
    if (!isRestActive || restRemaining <= 0) {
      if (isRestActive && restRemaining <= 0) {
        setIsRestActive(false);
        soundManager.playCompletionChime();
        soundManager.speak('Rest complete. Prepare for your next set.');
      }
      return;
    }

    // Beep on 3, 2, 1
    if (restRemaining === 3 || restRemaining === 2 || restRemaining === 1) {
      soundManager.playShortBeep(restRemaining === 1 ? 880 : 587, 0.1);
    }

    restTimerRef.current = setTimeout(() => {
      setRestRemaining((prev) => prev - 1);
    }, 1000);

    return () => {
      if (restTimerRef.current) clearTimeout(restTimerRef.current);
    };
  }, [isRestActive, restRemaining]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.soundEnabled = next;
  };

  const toggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    soundManager.voiceEnabled = next;
  };

  const startRestTimer = (seconds: number) => {
    setCurrentRestTotal(seconds);
    setRestRemaining(seconds);
    setIsRestActive(true);
    soundManager.playShortBeep(523, 0.15);
  };

  const addRestTime = (additionalSeconds: number) => {
    setRestRemaining((prev) => prev + additionalSeconds);
    setCurrentRestTotal((prev) => prev + additionalSeconds);
  };

  const skipRest = () => {
    setIsRestActive(false);
    setRestRemaining(0);
  };

  const handleUpdateSet = (
    exIndex: number,
    setIndex: number,
    field: 'weightLbs' | 'repsCompleted',
    val: number
  ) => {
    setLoggedExercises((prev) => {
      const copy = [...prev];
      copy[exIndex].sets[setIndex] = {
        ...copy[exIndex].sets[setIndex],
        [field]: val,
      };
      return copy;
    });
  };

  const handleCompleteSet = (exIndex: number, setIndex: number, defaultRest: number) => {
    setLoggedExercises((prev) => {
      const copy = [...prev];
      const currentSet = copy[exIndex].sets[setIndex];
      const nextCompleted = !currentSet.completed;

      copy[exIndex].sets[setIndex] = {
        ...currentSet,
        completed: nextCompleted,
      };

      if (nextCompleted) {
        startRestTimer(defaultRest || 90);
      }
      return copy;
    });
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculations
  const totalSets = loggedExercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = loggedExercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  const totalVolumeLbs = loggedExercises.reduce((acc, ex) => {
    return (
      acc +
      ex.sets.reduce((setAcc, s) => {
        if (!s.completed) return setAcc;
        return setAcc + (s.weightLbs || 0) * (s.repsCompleted || 0);
      }, 0)
    );
  }, 0);

  const handleFinishPrompt = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    soundManager.playCompletionChime();
    setShowSummaryModal(true);
  };

  const handleConfirmFinish = () => {
    const sessionLog: WorkoutSessionLog = {
      id: `session_${Date.now()}`,
      planId,
      planTitle,
      dayNumber: day.dayNumber,
      dayName: day.dayName,
      startedAt: new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
      exercises: loggedExercises,
      totalVolumeLbs,
      feedbackRating: userRating,
    };

    onFinishSession(sessionLog);
  };

  const activeExercise: ExerciseItem = day.exercises[activeExerciseIndex] || day.exercises[0];
  const activeLogged = loggedExercises[activeExerciseIndex];

  return (
    <div className="space-y-8 pb-24">
      {/* Top Session Dashboard Header */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <button
              onClick={onCancelSession}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Program Architecture</span>
            </button>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {day.dayName}
            </h1>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span className="text-amber-400 font-bold">{planTitle}</span>
              <span aria-hidden="true">·</span>
              <span>{day.targetMuscles.join(' · ')}</span>
            </div>
          </div>

          {/* Real-time Session Metrics */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Workout Stopwatch */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                  Elapsed Time
                </span>
                <span className="font-mono text-xl font-bold text-white tabular-nums">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors ml-2"
                title={isPaused ? 'Resume Session' : 'Pause Session'}
              >
                {isPaused ? <Play className="w-4 h-4 fill-slate-300" /> : <Pause className="w-4 h-4" />}
              </button>
            </div>

            {/* Sound & Voice Toggles */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleSound}
                className={`p-3 rounded-xl border text-xs font-medium transition-all ${
                  soundEnabled
                    ? 'bg-amber-400/10 border-amber-400/40 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
                title="Toggle Beep Synthesizer"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {/* Finish Workout CTA */}
            <button
              type="button"
              onClick={handleFinishPrompt}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Complete Session</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Set Completion Counter */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              Completed Sets:{' '}
              <strong className="text-white tabular-nums">
                {completedSets} of {totalSets}
              </strong>
            </span>
            <span className="text-slate-400">
              Volume Lifted:{' '}
              <strong className="text-amber-400 tabular-nums">
                {totalVolumeLbs.toLocaleString()} lbs
              </strong>
            </span>
            <span className="text-amber-400 font-bold tabular-nums">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* Floating Sticky Rest Timer Banner when active */}
      {isRestActive && (
        <section className="sticky top-20 z-30 p-5 rounded-2xl bg-amber-400 text-slate-950 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-mono font-bold text-lg">
              {restRemaining}s
            </div>
            <div>
              <div className="font-extrabold text-sm uppercase tracking-wide">
                Rest & Recovery Interval
              </div>
              <div className="text-xs font-medium text-slate-800">
                Replenish ATP-CP stores. Breathe deeply through diaphragm.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => addRestTime(30)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-950/15 hover:bg-slate-950/25 text-slate-950 font-bold text-xs transition-colors"
            >
              +30s
            </button>
            <button
              onClick={skipRest}
              className="px-4 py-1.5 rounded-lg bg-slate-950 text-amber-400 font-bold text-xs hover:bg-slate-900 transition-colors shadow-sm"
            >
              Skip Rest
            </button>
          </div>
        </section>
      )}

      {/* Exercise Navigation Tabs (Jump between movements) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Movement Pipeline</h2>
          <span className="text-xs text-slate-400">
            Exercise {activeExerciseIndex + 1} of {day.exercises.length}
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {day.exercises.map((ex, idx) => {
            const isCurrent = idx === activeExerciseIndex;
            const exSets = loggedExercises[idx]?.sets || [];
            const allCompleted = exSets.length > 0 && exSets.every((s) => s.completed);
            return (
              <button
                key={ex.id}
                onClick={() => setActiveExerciseIndex(idx)}
                className={`p-3 rounded-xl border text-left shrink-0 min-w-[200px] transition-all ${
                  isCurrent
                    ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold shadow-md shadow-amber-400/10'
                    : allCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-[10px] opacity-80">0{idx + 1}</span>
                  {allCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="font-bold text-sm truncate">{ex.name}</div>
                <div className="text-[11px] opacity-80 mt-0.5">{ex.sets} working sets</div>
              </button>
            );
          })}
        </div>

        {/* Active Exercise Logger Card */}
        {activeExercise && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span className="font-semibold text-amber-400">
                    {activeExercise.targetMuscle}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Target Intensity: {activeExercise.rpe}</span>
                  <span aria-hidden="true">·</span>
                  <span>Tempo: {activeExercise.tempo}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {activeExercise.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => onAskCoach(activeExercise.name, activeExercise.targetMuscle)}
                className="px-4 py-2 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 rounded-xl text-xs font-semibold border border-amber-400/40 transition-colors flex items-center gap-1.5 self-start"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Ask AI Coach</span>
              </button>
            </div>

            {/* Set by Set Tracking Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider">
                    <th className="py-3 px-3">Set</th>
                    <th className="py-3 px-3">Previous / Target</th>
                    <th className="py-3 px-3">Weight (lbs / kg)</th>
                    <th className="py-3 px-3">Reps Completed</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {activeLogged?.sets.map((set, sIdx) => (
                    <tr
                      key={sIdx}
                      className={`transition-colors ${
                        set.completed ? 'bg-emerald-500/5' : 'hover:bg-slate-850'
                      }`}
                    >
                      <td className="py-3.5 px-3 font-bold text-white text-sm">
                        Set {set.setNumber}
                      </td>
                      <td className="py-3.5 px-3 text-slate-400">
                        {activeExercise.reps} reps · {activeExercise.rpe}
                      </td>
                      <td className="py-3.5 px-3">
                        <input
                          type="number"
                          min="0"
                          step="2.5"
                          value={set.weightLbs === 0 ? '' : set.weightLbs}
                          placeholder="e.g. 135"
                          onChange={(e) =>
                            handleUpdateSet(
                              activeExerciseIndex,
                              sIdx,
                              'weightLbs',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-24 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                        />
                      </td>
                      <td className="py-3.5 px-3">
                        <input
                          type="number"
                          min="0"
                          value={set.repsCompleted}
                          onChange={(e) =>
                            handleUpdateSet(
                              activeExerciseIndex,
                              sIdx,
                              'repsCompleted',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-20 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                        />
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            handleCompleteSet(
                              activeExerciseIndex,
                              sIdx,
                              activeExercise.restSeconds
                            )
                          }
                          className={`px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ml-auto ${
                            set.completed
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>{set.completed ? 'Completed' : 'Check Set'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Biomechanical Cues for Active Exercise */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-2">
              <span className="font-semibold text-amber-400 block">
                Form Focus & Joint Alignment:
              </span>
              <ul className="space-y-1 text-slate-400">
                {activeExercise.coachingCues.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exercise Advance CTA */}
            {activeExerciseIndex < day.exercises.length - 1 && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveExerciseIndex(activeExerciseIndex + 1)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Next Exercise ({day.exercises[activeExerciseIndex + 1].name})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Workout Summary & Confirmation Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/40 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Workout Completed!</h3>
              <p className="text-xs text-slate-400">
                Outstanding effort. Your neuromuscular adaptations and progressive overload have been recorded.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Duration</span>
                <span className="text-lg font-bold text-white tabular-nums">
                  {Math.round(elapsedSeconds / 60)} mins
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Volume Lifted</span>
                <span className="text-lg font-bold text-amber-400 tabular-nums">
                  {totalVolumeLbs.toLocaleString()} lbs
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Rate Session Intensity & Fatigue (1 to 5):
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setUserRating(val)}
                    className={`py-2 rounded-lg text-xs font-bold font-mono transition-all ${
                      userRating === val
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    ★ {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleConfirmFinish}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-400/20 transition-all"
              >
                Log Session & Save Progress
              </button>
              <button
                type="button"
                onClick={() => setShowSummaryModal(false)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors"
              >
                Keep Logging Sets
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
