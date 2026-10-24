import React from 'react';
import { WorkoutPlan, WorkoutSessionLog } from '../types/workout';
import { Bookmark, Play, Trash2, Calendar, Dumbbell, Clock, Award } from 'lucide-react';

interface SavedPlansListProps {
  plans: WorkoutPlan[];
  activePlanId: string;
  onSelectPlan: (plan: WorkoutPlan) => void;
  onDeletePlan: (planId: string) => void;
  onStartSession: (dayNumber: number) => void;
  sessionLogs: WorkoutSessionLog[];
}

export const SavedPlansList: React.FC<SavedPlansListProps> = ({
  plans,
  activePlanId,
  onSelectPlan,
  onDeletePlan,
  onStartSession,
  sessionLogs,
}) => {
  const totalVolumeAllTime = sessionLogs.reduce((acc, log) => acc + (log.totalVolumeLbs || 0), 0);
  const totalCompletedSessions = sessionLogs.length;

  return (
    <div className="space-y-10 pb-20">
      {/* Overview Stat Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Saved Programs</span>
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              {plans.length}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Completed Workouts</span>
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              {totalCompletedSessions}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Total Volume Lifted</span>
            <span className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
              {totalVolumeAllTime.toLocaleString()} lbs
            </span>
          </div>
        </div>
      </section>

      {/* Program Cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Your Training Programs</h2>

        {plans.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400">
              No saved programs found. Use the Plan Architect to generate your first personalized program!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((p) => {
              const isActive = p.id === activePlanId;
              return (
                <div
                  key={p.id}
                  className={`p-6 rounded-2xl border transition-all flex flex-col justify-between gap-6 ${
                    isActive
                      ? 'bg-slate-900/90 border-amber-400/70 shadow-lg shadow-amber-400/5'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <span className="text-amber-400 font-bold">{p.goal}</span>
                        <span aria-hidden="true">·</span>
                        <span>{p.fitnessLevel}</span>
                      </div>
                      {isActive && (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950">
                          Active
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white leading-snug">{p.title}</h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {p.tagline}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span className="tabular-nums">{p.weeklyFrequency} Days/wk</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span className="tabular-nums">{p.sessionDuration} mins</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
                        <span className="tabular-nums">{p.days.length} Days</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => onSelectPlan(p)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      {isActive ? 'View Active Plan' : 'Select Plan'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectPlan(p);
                          onStartSession(1);
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
                        title="Start Day 1"
                      >
                        <Play className="w-4 h-4 fill-amber-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeletePlan(p.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete Program"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Session History Log */}
      {sessionLogs.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-slate-800">
          <h2 className="text-xl font-bold text-white">Recent Workout History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Workout</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Volume Lifted</th>
                  <th className="py-3 px-3">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {sessionLogs.slice(0, 10).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-3 text-slate-300">
                      {new Date(log.startedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      {log.dayName}
                      <span className="block text-[10px] text-slate-500 font-normal">
                        {log.planTitle}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 tabular-nums">
                      {log.durationMinutes} mins
                    </td>
                    <td className="py-3 px-3 text-amber-400 font-bold tabular-nums">
                      {log.totalVolumeLbs.toLocaleString()} lbs
                    </td>
                    <td className="py-3 px-3 text-amber-300">
                      {'★'.repeat(log.feedbackRating || 5)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};
