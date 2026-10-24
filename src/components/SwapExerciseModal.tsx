import React, { useState, useEffect } from 'react';
import { ExerciseItem } from '../types/workout';
import { RotateCcw, X, Check, Sparkles } from 'lucide-react';

interface SwapExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  exercise: ExerciseItem | null;
  equipment: string;
  onConfirmSwap: (dayNumber: number, oldExerciseId: string, newExercise: Partial<ExerciseItem>) => void;
}

interface AlternativeExercise {
  name: string;
  equipmentNeeded: string;
  whyItWorks: string;
  coachingCue: string;
}

export const SwapExerciseModal: React.FC<SwapExerciseModalProps> = ({
  isOpen,
  onClose,
  dayNumber,
  exercise,
  equipment,
  onConfirmSwap,
}) => {
  const [alternatives, setAlternatives] = useState<AlternativeExercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState('Equipment currently busy / unavailable');

  useEffect(() => {
    if (!isOpen || !exercise) return;

    const fetchSubstitutions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/workout/exercise-swap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            exerciseName: exercise.name,
            targetMuscle: exercise.targetMuscle,
            equipment: equipment,
            limitationReason: reason,
          }),
        });

        if (!res.ok) throw new Error('Failed to load substitutions');
        const data = await res.json();
        setAlternatives(data.alternatives || []);
      } catch {
        // Fallback to exercise's predefined substitutions
        const fallbacks: AlternativeExercise[] = (exercise.substitutions || [
          'Dumbbell Variation',
          'Bodyweight / Machine Match',
        ]).map((sub) => ({
          name: sub,
          equipmentNeeded: equipment,
          whyItWorks: `Replicates the primary force vector and length-tension stimulus for ${exercise.targetMuscle}.`,
          coachingCue: 'Control the eccentric phase and maintain neutral spinal alignment.',
        }));
        setAlternatives(fallbacks);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubstitutions();
  }, [isOpen, exercise, equipment, reason]);

  if (!isOpen || !exercise) return null;

  const handleSelectAlternative = (alt: AlternativeExercise) => {
    onConfirmSwap(dayNumber, exercise.id, {
      name: alt.name,
      coachingCues: [alt.coachingCue, ...exercise.coachingCues.slice(1)],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/30">
              <RotateCcw className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Swap Exercise</h3>
              <p className="text-xs text-slate-400">
                Replace <span className="text-amber-400 font-semibold">{exercise.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Reason for Substitution:
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
          >
            <option value="Equipment currently busy / unavailable">Equipment busy / unavailable</option>
            <option value="Joint discomfort or previous injury constraint">Joint discomfort / injury constraint</option>
            <option value="Want higher hypertrophy pump / isolation">Want higher isolation / pump stimulus</option>
            <option value="Prefer dumbbell / home alternative">Prefer dumbbell or free weight alternative</option>
          </select>
        </div>

        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
            AI-Recommended Substitutions
          </span>

          {isLoading ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Analyzing biomechanical curve matches...</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {alternatives.map((alt, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400/60 transition-all flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-white text-sm">{alt.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {alt.equipmentNeeded}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{alt.whyItWorks}</p>
                    <div className="text-[11px] text-amber-300 mt-1 font-mono">
                      Cue: {alt.coachingCue}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectAlternative(alt)}
                    className="w-full py-2 bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Select & Replace Exercise</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
