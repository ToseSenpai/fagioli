import { TrendingUp, Clock, CheckCircle, Wrench } from 'lucide-react';
import clsx from 'clsx';

/**
 * StatsCards Component
 *
 * Dashboard statistics cards showing key metrics
 *
 * Metrics:
 * - Total repairs today
 * - Pre-check-ins pending
 * - Ready for pickup
 * - Average time in shop
 *
 * Features:
 * - Color-coded icons
 * - Responsive grid layout
 * - Real-time data updates
 */

interface Stats {
  totalToday: number;
  pendingPreCheckin: number;
  readyForPickup: number;
  avgDaysInShop: number;
}

interface StatsCardsProps {
  stats: Stats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Riparazioni Oggi',
      value: stats.totalToday,
      icon: Wrench,
      iconBg: 'bg-gradient-to-br from-gold-500 to-gold-600',
      iconColor: 'text-slate-900',
      gradient: 'from-gold-500/20 to-gold-600/10',
    },
    {
      label: 'Pre-Checkin Pendenti',
      value: stats.pendingPreCheckin,
      icon: Clock,
      iconBg: 'bg-gradient-to-br from-gold-400 to-gold-500',
      iconColor: 'text-slate-900',
      gradient: 'from-gold-400/20 to-gold-500/10',
    },
    {
      label: 'Pronte per Ritiro',
      value: stats.readyForPickup,
      icon: CheckCircle,
      iconBg: 'bg-gradient-to-br from-gold-500 to-gold-600',
      iconColor: 'text-slate-900',
      gradient: 'from-gold-500/20 to-gold-600/10',
    },
    {
      label: 'Media Giorni in Officina',
      value: stats.avgDaysInShop,
      icon: TrendingUp,
      iconBg: 'bg-gradient-to-br from-gold-600 to-gold-700',
      iconColor: 'text-slate-900',
      gradient: 'from-gold-600/20 to-gold-700/10',
      suffix: 'gg',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={clsx(
              'relative bg-slate-800 rounded-xl border border-slate-700 p-6',
              'hover:shadow-2xl hover:shadow-gold-500/20 transition-all duration-300',
              'hover:border-gold-500/50 hover:-translate-y-1',
              'animate-fade-in-up overflow-hidden'
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-2">{card.label}</p>
                <p className="text-4xl font-bold text-white tracking-tight">
                  {card.value}
                  {card.suffix && (
                    <span className="text-lg font-normal text-slate-400 ml-2">
                      {card.suffix}
                    </span>
                  )}
                </p>
              </div>
              <div
                className={clsx(
                  'w-14 h-14 rounded-xl flex items-center justify-center shadow-lg animate-glow-pulse',
                  card.iconBg
                )}
              >
                <Icon className={clsx('w-7 h-7', card.iconColor)} />
              </div>
            </div>
            {/* Decorative gradient overlay */}
            <div
              className={clsx(
                'absolute inset-0 rounded-xl opacity-10 pointer-events-none bg-gradient-to-br',
                card.gradient
              )}
              style={{ mixBlendMode: 'overlay' }}
            />
          </div>
        );
      })}
    </div>
  );
}
