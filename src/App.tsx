/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WorkoutPlan, WorkoutSessionLog, ExerciseItem } from './types/workout';
import { STARTER_PLANS } from './data/presetPlans';
import { Navbar } from './components/Navbar';
import { WorkoutGeneratorForm } from './components/WorkoutGeneratorForm';
import { WorkoutPlanView } from './components/WorkoutPlanView';
import { ActiveWorkoutSession } from './components/ActiveWorkoutSession';
import { SavedPlansList } from './components/SavedPlansList';
import { CoachModal } from './components/CoachModal';
import { SwapExerciseModal } from './components/SwapExerciseModal';

export default function App() {
  const [plans, setPlans] = useState<WorkoutPlan[]>(() => {
    try {
      const stored = localStorage.getItem('aetherfit_saved_plans');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return STARTER_PLANS;
  });

  const [activePlan, setActivePlan] = useState<WorkoutPlan>(() => {
    return plans[0] || STARTER_PLANS[0];
  });

  const [sessionLogs, setSessionLogs] = useState<WorkoutSessionLog[]>(() => {
    try {
      const stored = localStorage.getItem('aetherfit_session_logs');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return [];
  });

  const [currentTab, setCurrentTab] = useState<
    'generator' | 'plan' | 'active-session' | 'saved' | 'coach'
  >('generator');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeDayNumber, setActiveDayNumber] = useState<number>(1);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);

  // Coach Modal State
  const [coachModal, setCoachModal] = useState<{
    isOpen: boolean;
    exerciseName?: string;
    targetMuscle?: string;
  }>({ isOpen: false });

  // Swap Modal State
  const [swapModal, setSwapModal] = useState<{
    isOpen: boolean;
    dayNumber: number;
    exercise: ExerciseItem | null;
  }>({
    isOpen: false,
    dayNumber: 1,
    exercise: null,
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aetherfit_saved_plans', JSON.stringify(plans));
    } catch {
      // storage quota or private browsing
    }
  }, [plans]);

  useEffect(() => {
    try {
      localStorage.setItem('aetherfit_session_logs', JSON.stringify(sessionLogs));
    } catch {
      // storage quota or private browsing
    }
  }, [sessionLogs]);

  const handlePlanGenerated = (newPlan: WorkoutPlan) => {
    setActivePlan(newPlan);
    setPlans((prev) => {
      const filtered = prev.filter((p) => p.id !== newPlan.id);
      return [newPlan, ...filtered];
    });
    setCurrentTab('plan');
  };

  const handleStartSession = (dayNumber: number) => {
    setActiveDayNumber(dayNumber);
    setIsSessionActive(true);
    setCurrentTab('active-session');
  };

  const handleFinishSession = (log: WorkoutSessionLog) => {
    setSessionLogs((prev) => [log, ...prev]);
    setIsSessionActive(false);
    setCurrentTab('saved');
  };

  const handleCancelSession = () => {
    setIsSessionActive(false);
    setCurrentTab('plan');
  };

  const handleSavePlan = (planToSave: WorkoutPlan) => {
    setPlans((prev) => {
      if (prev.some((p) => p.id === planToSave.id)) return prev;
      return [planToSave, ...prev];
    });
  };

  const handleDeletePlan = (planId: string) => {
    setPlans((prev) => {
      const remaining = prev.filter((p) => p.id !== planId);
      if (activePlan?.id === planId && remaining.length > 0) {
        setActivePlan(remaining[0]);
      }
      return remaining;
    });
  };

  const handleAskCoach = (exerciseName: string, targetMuscle: string) => {
    setCoachModal({
      isOpen: true,
      exerciseName,
      targetMuscle,
    });
  };

  const handleOpenSwapModal = (dayNumber: number, exercise: ExerciseItem) => {
    setSwapModal({
      isOpen: true,
      dayNumber,
      exercise,
    });
  };

  const handleConfirmSwap = (
    dayNumber: number,
    oldExerciseId: string,
    newExercisePartial: Partial<ExerciseItem>
  ) => {
    if (!activePlan) return;

    const updatedDays = activePlan.days.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      return {
        ...day,
        exercises: day.exercises.map((ex) => {
          if (ex.id !== oldExerciseId) return ex;
          return {
            ...ex,
            ...newExercisePartial,
          };
        }),
      };
    });

    const updatedPlan: WorkoutPlan = {
      ...activePlan,
      days: updatedDays,
    };

    setActivePlan(updatedPlan);
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
  };

  const activeDayForSession =
    activePlan?.days.find((d) => d.dayNumber === activeDayNumber) || activePlan?.days[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'coach') {
            setCoachModal({ isOpen: true });
          } else {
            setCurrentTab(tab);
          }
        }}
        hasActivePlan={!!activePlan}
        isSessionActive={isSessionActive}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-8">
        {currentTab === 'generator' && (
          <WorkoutGeneratorForm
            onPlanGenerated={handlePlanGenerated}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}

        {currentTab === 'plan' && activePlan && (
          <WorkoutPlanView
            plan={activePlan}
            onStartSession={handleStartSession}
            onAskCoach={handleAskCoach}
            onSwapExercise={handleOpenSwapModal}
            onSavePlan={handleSavePlan}
            isSaved={plans.some((p) => p.id === activePlan.id)}
          />
        )}

        {currentTab === 'active-session' && activeDayForSession && activePlan && (
          <ActiveWorkoutSession
            day={activeDayForSession}
            planTitle={activePlan.title}
            planId={activePlan.id}
            onFinishSession={handleFinishSession}
            onCancelSession={handleCancelSession}
            onAskCoach={handleAskCoach}
          />
        )}

        {currentTab === 'saved' && (
          <SavedPlansList
            plans={plans}
            activePlanId={activePlan?.id || ''}
            onSelectPlan={(selected) => {
              setActivePlan(selected);
              setCurrentTab('plan');
            }}
            onDeletePlan={handleDeletePlan}
            onStartSession={(dayNum) => {
              handleStartSession(dayNum);
            }}
            sessionLogs={sessionLogs}
          />
        )}
      </main>

      {/* Biomechanics Coach Modal */}
      <CoachModal
        isOpen={coachModal.isOpen}
        onClose={() => setCoachModal({ isOpen: false })}
        initialExerciseName={coachModal.exerciseName}
        initialTargetMuscle={coachModal.targetMuscle}
      />

      {/* Exercise Swap Modal */}
      <SwapExerciseModal
        isOpen={swapModal.isOpen}
        onClose={() => setSwapModal({ ...swapModal, isOpen: false })}
        dayNumber={swapModal.dayNumber}
        exercise={swapModal.exercise}
        equipment={activePlan?.equipment || 'Standard Gym'}
        onConfirmSwap={handleConfirmSwap}
      />

      {/* Subtle Footer adhering to Section 1.B: Quiet, natural editorial */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">AetherFit</span>
            <span aria-hidden="true">·</span>
            <span>Personalized Exercise Science & Hypertrophy Engineering</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemma 4</span>
            <span aria-hidden="true">·</span>
            <span>CSCS-Grounded Biomechanics</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
