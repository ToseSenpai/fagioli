import { Check, Clock, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import type { TrackingStep } from '../../types/repair';

interface TrackingTimelineProps {
  steps: TrackingStep[];
}

/**
 * TrackingTimeline Component
 *
 * Visual timeline showing repair progress with Premium Dark theme:
 * - Completed steps: gold check, filled circle
 * - Current step: gold pulsing with glow effect
 * - Future steps: slate outline circle
 *
 * Mobile-first vertical layout
 *
 * @example
 * <TrackingTimeline steps={repairSteps} />
 */
export default function TrackingTimeline({ steps }: TrackingTimelineProps) {
  return (
    <div className="relative">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <div key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Timeline connector line */}
            {!isLast && (
              <div
                className={`absolute left-[19px] top-10 w-0.5 h-full ${
                  step.completed ? 'bg-gold-500' : 'bg-slate-700'
                }`}
                aria-hidden="true"
              />
            )}

            {/* Status icon */}
            <div className="relative flex-shrink-0">
              {step.completed ? (
                // Completed step - gold check
                <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center shadow-lg">
                  <Check className="w-5 h-5 text-slate-900" aria-hidden="true" />
                </div>
              ) : step.current ? (
                // Current step - gold pulsing with glow
                <div className="relative w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center shadow-lg shadow-gold-500/50">
                  <Circle className="w-5 h-5 text-slate-900 fill-slate-900" aria-hidden="true" />
                  {/* Pulsing glow animation */}
                  <span className="absolute inset-0 rounded-full bg-gold-400 animate-ping opacity-75" />
                  <span className="absolute inset-0 rounded-full bg-gold-500 blur-md opacity-50" />
                </div>
              ) : (
                // Future step - slate outline
                <div className="w-10 h-10 rounded-full border-2 border-slate-700 bg-slate-800 flex items-center justify-center">
                  <Circle className="w-5 h-5 text-slate-600" aria-hidden="true" />
                </div>
              )}
            </div>

            {/* Step content */}
            <div className="flex-1 pt-1 min-w-0">
              <h3
                className={`text-base font-semibold mb-1 ${
                  step.completed
                    ? 'text-gold-500'
                    : step.current
                    ? 'text-gold-400'
                    : 'text-slate-500'
                }`}
              >
                {step.label}
              </h3>

              <p className={`text-sm mb-2 ${
                step.completed || step.current ? 'text-slate-300' : 'text-slate-500'
              }`}>
                {step.description}
              </p>

              {/* Timestamp for completed/current steps */}
              {step.timestamp && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  <time dateTime={step.timestamp}>
                    {format(new Date(step.timestamp), "d MMM yyyy 'alle' HH:mm", {
                      locale: it,
                    })}
                  </time>
                </div>
              )}

              {/* Current step indicator */}
              {step.current && !step.completed && (
                <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-gold-500/10 text-gold-400 rounded-full text-xs font-medium border border-gold-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                  In corso
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
