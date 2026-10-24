import React, { useState, useEffect } from 'react';
import { Sparkles, X, Send, Dumbbell, ShieldCheck, HelpCircle } from 'lucide-react';

// Renders **bold** and *italic* spans inside a line of model output.
const renderInline = (text: string) =>
  text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="text-amber-200 font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : part.length > 2 && part.startsWith('*') && part.endsWith('*') ? (
      <em key={i} className="text-slate-400">
        {part.slice(1, -1)}
      </em>
    ) : (
      part
    )
  );

// Minimal markdown for coach advice: bullet lists, numbered lists, bold, paragraphs.
const AdviceText: React.FC<{ text: string }> = ({ text }) => {
  const blocks: React.ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flush = () => {
    if (!list) return;
    const items = list.items.map((item, i) => <li key={i}>{renderInline(item)}</li>);
    blocks.push(
      list.ordered ? (
        <ol key={blocks.length} className="list-decimal pl-5 space-y-2">{items}</ol>
      ) : (
        <ul key={blocks.length} className="list-disc pl-5 space-y-2 marker:text-amber-400">{items}</ul>
      )
    );
    list = null;
  };

  for (const raw of text.split('\n')) {
    const line = raw.trim();
    const bullet = line.match(/^[*\-•]\s+(.*)/);
    const numbered = line.match(/^\d+[.)]\s+(.*)/);
    if (bullet || numbered) {
      const ordered = !!numbered;
      if (list && list.ordered !== ordered) flush();
      if (!list) list = { ordered, items: [] };
      list.items.push((bullet || numbered)![1]);
    } else {
      flush();
      if (line) blocks.push(<p key={blocks.length}>{renderInline(line.replace(/^#+\s*/, ''))}</p>);
    }
  }
  flush();

  return <>{blocks}</>;
};

interface CoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialExerciseName?: string;
  initialTargetMuscle?: string;
}

export const CoachModal: React.FC<CoachModalProps> = ({
  isOpen,
  onClose,
  initialExerciseName = '',
  initialTargetMuscle = '',
}) => {
  const [exerciseName, setExerciseName] = useState(initialExerciseName);
  const [targetMuscle, setTargetMuscle] = useState(initialTargetMuscle);
  const [question, setQuestion] = useState('');
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialExerciseName) {
      setExerciseName(initialExerciseName);
      setTargetMuscle(initialTargetMuscle);
      setQuestion(`How do I optimize biomechanical form and avoid joint strain on ${initialExerciseName}?`);
    } else {
      setQuestion('');
      setAdvice(null);
    }
  }, [initialExerciseName, initialTargetMuscle, isOpen]);

  if (!isOpen) return null;

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setAdvice(null);

    try {
      const res = await fetch('/api/workout/coach-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseName: exerciseName || 'Compound Lift',
          targetMuscle: targetMuscle || 'Target Muscle Group',
          question: question.trim(),
        }),
      });

      if (!res.ok) throw new Error('Failed to consult biomechanics coach.');
      const data = await res.json();
      setAdvice(data.advice);
    } catch {
      setAdvice(
        'Maintain a rigid core brace, pull slack prior to movement initiation, and ensure the eccentric tempo is at least 2-3 seconds to maximize mechanical tension while sparing connective tissue.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    'How do I feel more lat activation instead of biceps on rows?',
    'How to prevent lower back pain during Romanian deadlifts?',
    'What is the ideal foot stance for quad-biased squats?',
    'How do I warm up stiff shoulders before heavy overhead pressing?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400">
            <div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/30">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">AI Biomechanics Coach</h3>
              <p className="text-xs text-slate-400">CSCS-Grounded Movement Guidance & Form Diagnosis</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAsk} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Exercise Name (Optional)
              </label>
              <input
                type="text"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="e.g. Barbell Incline Bench"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Primary Target Muscle (Optional)
              </label>
              <input
                type="text"
                value={targetMuscle}
                onChange={(e) => setTargetMuscle(e.target.value)}
                placeholder="e.g. Upper Chest / Pectoralis Major"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Your Form Question or Limitation:
            </label>
            <textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. I feel a pinch in my left front shoulder when benching. What should my elbow angle and scapular position be?"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Quick Questions */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-slate-400">Quick Prompts:</span>
            <div className="flex flex-wrap gap-1.5">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setQuestion(q)}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-400/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Consulting Biomechanics Specialist...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Ask Coach</span>
              </>
            )}
          </button>
        </form>

        {/* AI Output Result */}
        {advice && (
          <div className="p-5 rounded-xl bg-slate-950 border border-amber-400/30 text-xs text-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Biomechanical Recommendation</span>
            </div>
            <div className="space-y-3 leading-relaxed text-slate-300">
              <AdviceText text={advice} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
