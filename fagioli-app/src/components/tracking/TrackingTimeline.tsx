"use client";

import {
  ClipboardList,
  CheckCircle,
  Package,
  Wrench,
  Paintbrush,
  Search,
  Car,
  PartyPopper,
  Check,
} from "lucide-react";

import type { StatoPratica } from "@/types";
import { STATI_PRATICA, STATI_TIMELINE_BASE } from "@/types";

interface TimelineItem {
  stato: StatoPratica;
  timestamp?: string;
  note?: string;
}

interface TrackingTimelineProps {
  statoCorrente: StatoPratica;
  storicoStati: TimelineItem[];
  hasWaitingParts?: boolean;
}

const ICON_MAP: Record<StatoPratica, React.ElementType> = {
  PRE_CHECKIN: ClipboardList,
  ACCETTATO: CheckCircle,
  IN_ATTESA_RICAMBI: Package,
  IN_LAVORAZIONE: Wrench,
  IN_VERNICIATURA: Paintbrush,
  CONTROLLO_QUALITA: Search,
  PRONTO: Car,
  CONSEGNATO: PartyPopper,
};

export function TrackingTimeline({
  statoCorrente,
  storicoStati,
  hasWaitingParts = false,
}: TrackingTimelineProps) {
  // Determine which statuses to show in timeline
  let statiToShow = STATI_TIMELINE_BASE;
  if (hasWaitingParts) {
    statiToShow = [
      "PRE_CHECKIN",
      "ACCETTATO",
      "IN_ATTESA_RICAMBI",
      "IN_LAVORAZIONE",
      "IN_VERNICIATURA",
      "CONTROLLO_QUALITA",
      "PRONTO",
      "CONSEGNATO",
    ];
  }

  const currentIndex = statiToShow.indexOf(statoCorrente);

  const getTimestampForStato = (stato: StatoPratica): string | undefined => {
    const entry = storicoStati.find((s) => s.stato === stato);
    return entry?.timestamp;
  };

  const formatTimestamp = (timestamp: string | undefined): string => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative py-2">
      {statiToShow.map((stato, index) => {
        const Icon = ICON_MAP[stato];
        const config = STATI_PRATICA[stato];
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;
        const timestamp = getTimestampForStato(stato);

        return (
          <div
            key={stato}
            className={`relative flex gap-4 pb-8 last:pb-0 ${
              isPending ? "opacity-50" : ""
            }`}
          >
            {/* Vertical line */}
            {index < statiToShow.length - 1 && (
              <div
                className={`absolute left-5 top-12 w-0.5 h-[calc(100%-40px)] transition-colors duration-500 ${
                  isCompleted
                    ? "bg-gradient-to-b from-emerald-500 to-emerald-400"
                    : isCurrent
                      ? "bg-gradient-to-b from-primary/50 to-border"
                      : "bg-border"
                }`}
              />
            )}

            {/* Icon circle */}
            <div
              className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isCurrent
                  ? "bg-gradient-to-br from-primary to-orange-500 text-white shadow-brand scale-110"
                  : isCompleted
                    ? "bg-emerald-500 text-white shadow-md"
                    : "bg-secondary text-muted-foreground"
              }`}
            >
              {isCompleted ? (
                <Check className="w-5 h-5" />
              ) : (
                <Icon className="w-5 h-5" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-1.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3
                    className={`font-semibold transition-colors ${
                      isCurrent
                        ? "text-foreground"
                        : isCompleted
                          ? "text-foreground/80"
                          : "text-muted-foreground"
                    }`}
                  >
                    {config.label}
                  </h3>
                  {(isCurrent || isCompleted) && (
                    <p
                      className={`text-sm mt-0.5 ${
                        isCurrent ? "text-muted-foreground" : "text-muted-foreground/70"
                      }`}
                    >
                      {config.description}
                    </p>
                  )}
                </div>

                {/* Timestamp */}
                {timestamp && (
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md whitespace-nowrap">
                    {formatTimestamp(timestamp)}
                  </span>
                )}
              </div>

              {/* Current status indicator */}
              {isCurrent && (
                <div className="mt-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-primary to-orange-500 text-white shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    In corso
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
