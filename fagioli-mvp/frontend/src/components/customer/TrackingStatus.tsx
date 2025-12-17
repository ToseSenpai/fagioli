import { Phone, Mail, Calendar, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import TrackingTimeline from './TrackingTimeline';
import type { Repair, RepairStatus, TrackingStep } from '../../types/repair';

interface TrackingStatusProps {
  repair: Repair;
}

/**
 * TrackingStatus Component
 *
 * Main tracking view showing:
 * - Vehicle info header
 * - Customer details
 * - Visual timeline of repair progress
 * - Estimated completion date
 * - Contact button
 *
 * Mobile-first card design with Premium Dark theme
 *
 * @example
 * <TrackingStatus repair={repairData} />
 */
export default function TrackingStatus({ repair }: TrackingStatusProps) {
  const { vehicle, customer, status, estimatedCompletion, actualCompletion, statusHistory } = repair;

  // Define all tracking steps
  const allSteps: Array<{ key: RepairStatus; label: string; description: string }> = [
    {
      key: 'accepted',
      label: 'Accettazione',
      description: 'Veicolo ricevuto e registrato',
    },
    {
      key: 'disassembly',
      label: 'Smontaggio',
      description: 'Rimozione parti danneggiate',
    },
    {
      key: 'bodywork',
      label: 'Carrozzeria',
      description: 'Riparazione struttura carrozzeria',
    },
    {
      key: 'painting',
      label: 'Verniciatura',
      description: 'Preparazione e verniciatura',
    },
    {
      key: 'reassembly',
      label: 'Rimontaggio',
      description: 'Installazione parti e componenti',
    },
    {
      key: 'quality_check',
      label: 'Controllo Qualità',
      description: 'Verifica finale e controlli',
    },
    {
      key: 'ready',
      label: 'Pronta per Ritiro',
      description: 'Veicolo pronto per la consegna',
    },
  ];

  // Map statuses to timeline steps
  const statusOrder: RepairStatus[] = [
    'pre_checkin',
    'confirmed',
    'accepted',
    'disassembly',
    'bodywork',
    'painting',
    'reassembly',
    'quality_check',
    'ready',
    'delivered',
  ];

  const currentIndex = statusOrder.indexOf(status);

  // Build tracking steps with completion status
  const trackingSteps: TrackingStep[] = allSteps.map((step) => {
    const stepIndex = statusOrder.indexOf(step.key);
    const completed = stepIndex < currentIndex;
    const current = stepIndex === currentIndex;

    // Find timestamp from status history
    const historyItem = statusHistory.find((h) => h.status === step.key);
    const timestamp = historyItem?.changedAt;

    return {
      ...step,
      completed,
      current,
      timestamp,
    };
  });

  // Check if repair is ready or delivered
  const isReady = status === 'ready';
  const isDelivered = status === 'delivered';
  const isWaiting = status === 'pre_checkin' || status === 'confirmed';

  // Format vehicle display
  const vehicleDisplay = vehicle
    ? `${vehicle.brand || ''} ${vehicle.model || ''} - ${vehicle.plate}`.trim()
    : 'Veicolo';

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header with branding */}
      <header className="bg-slate-800 border-b border-slate-700 text-white px-4 py-6 shadow-lg">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <h1 className="text-2xl font-bold mb-1 text-gold-500">Carrozzeria Fagioli</h1>
          <p className="text-slate-300 text-sm">Tracking Riparazione</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Tracking code card */}
        <div className="bg-slate-800 rounded-lg shadow-xl p-4 border border-slate-700 animate-scale-in">
          <div className="text-sm text-slate-400 mb-1">Codice Tracking</div>
          <div className="text-2xl font-bold text-gold-500 tracking-wider">
            {repair.trackingCode}
          </div>
        </div>

        {/* Vehicle info card */}
        <div className="bg-slate-800 rounded-lg shadow-xl p-4 border border-slate-700 animate-fade-in">
          <h2 className="text-lg font-semibold text-white mb-3">{vehicleDisplay}</h2>

          {customer && (
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="font-medium text-gold-500">Cliente:</span>
                <span>{customer.name}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-4 h-4 text-gold-500" aria-hidden="true" />
                  <a href={`tel:${customer.phone}`} className="hover:text-gold-400 transition-colors">
                    {customer.phone}
                  </a>
                </div>
              )}
              {customer.email && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-4 h-4 text-gold-500" aria-hidden="true" />
                  <a href={`mailto:${customer.email}`} className="hover:text-gold-400 transition-colors">
                    {customer.email}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Ready banner */}
        {isReady && (
          <div className="bg-slate-800 border-2 border-gold-500 rounded-lg p-4 shadow-xl animate-scale-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-gold-500 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-gold-500">
                  Pronta per il Ritiro!
                </h3>
                <p className="text-slate-300 text-sm mt-1">
                  La sua auto è pronta. Può venire a ritirarla quando vuole.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Delivered banner */}
        {isDelivered && actualCompletion && (
          <div className="bg-slate-800 border-2 border-slate-600 rounded-lg p-4 shadow-xl animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-slate-400 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-white">Consegnata</h3>
                <p className="text-slate-400 text-sm mt-1">
                  Riparazione completata il{' '}
                  {format(new Date(actualCompletion), 'd MMMM yyyy', { locale: it })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Waiting banner */}
        {isWaiting && (
          <div className="bg-slate-800 border border-gold-500 rounded-lg p-4 shadow-xl animate-fade-in">
            <h3 className="text-base font-semibold text-gold-500 mb-1">
              In Attesa di Accettazione
            </h3>
            <p className="text-slate-300 text-sm">
              La riparazione verrà avviata una volta che il veicolo sarà stato accettato dal
              nostro staff.
            </p>
          </div>
        )}

        {/* Timeline card */}
        {!isWaiting && (
          <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700 animate-fade-in">
            <h2 className="text-lg font-semibold text-white mb-6">
              Stato Riparazione
            </h2>
            <TrackingTimeline steps={trackingSteps} />
          </div>
        )}

        {/* Estimated completion */}
        {estimatedCompletion && !isDelivered && (
          <div className="bg-slate-800 rounded-lg shadow-xl p-4 border border-slate-700 animate-fade-in">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gold-500 flex-shrink-0" />
              <div>
                <div className="text-sm text-slate-400">Completamento stimato</div>
                <div className="text-base font-semibold text-white">
                  {format(new Date(estimatedCompletion), "EEEE d MMMM yyyy", {
                    locale: it,
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact button */}
        <div className="bg-slate-800 rounded-lg shadow-xl p-4 border border-slate-700 animate-fade-in">
          <h3 className="text-base font-semibold text-white mb-3">
            Hai domande?
          </h3>
          <a
            href="tel:+390123456789"
            className="block w-full bg-gold-500 hover:bg-gold-400 text-slate-900 font-semibold py-3 px-4 rounded-lg transition-colors text-center shadow-lg hover:shadow-gold-500/20"
          >
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              <span>Contattaci</span>
            </div>
          </a>
          <p className="text-xs text-slate-400 text-center mt-2">
            Disponibili Lun-Ven 8:00-18:00
          </p>
        </div>
      </main>
    </div>
  );
}
