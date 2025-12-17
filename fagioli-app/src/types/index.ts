// ============================================
// Enums (mirror Prisma enums)
// ============================================

export type TipoIntervento = "SINISTRO" | "ESTETICO" | "MECCANICA";

export type StatoPratica =
  | "PRE_CHECKIN"
  | "ACCETTATO"
  | "IN_ATTESA_RICAMBI"
  | "IN_LAVORAZIONE"
  | "IN_VERNICIATURA"
  | "CONTROLLO_QUALITA"
  | "PRONTO"
  | "CONSEGNATO";

export type TipoFoto =
  | "FRONTE"
  | "RETRO"
  | "LATO_SINISTRO"
  | "LATO_DESTRO"
  | "DETTAGLIO_DANNO"
  | "CAI"
  | "DOCUMENTO";

// ============================================
// Status display configuration
// ============================================

export interface StatusConfig {
  label: string;
  description: string;
  icon: string;
  color: string;
}

export const STATI_PRATICA: Record<StatoPratica, StatusConfig> = {
  PRE_CHECKIN: {
    label: "Pre-check-in",
    description: "Richiesta ricevuta, in attesa di conferma appuntamento",
    icon: "ClipboardList",
    color: "bg-blue-500",
  },
  ACCETTATO: {
    label: "Accettato",
    description: "Veicolo consegnato in carrozzeria",
    icon: "CheckCircle",
    color: "bg-green-500",
  },
  IN_ATTESA_RICAMBI: {
    label: "In attesa ricambi",
    description: "In attesa di ricambi necessari",
    icon: "Package",
    color: "bg-yellow-500",
  },
  IN_LAVORAZIONE: {
    label: "In lavorazione",
    description: "Lavori in corso sul veicolo",
    icon: "Wrench",
    color: "bg-orange-500",
  },
  IN_VERNICIATURA: {
    label: "In verniciatura",
    description: "Fase di verniciatura in corso",
    icon: "Paintbrush",
    color: "bg-purple-500",
  },
  CONTROLLO_QUALITA: {
    label: "Controllo qualità",
    description: "Verifica finale in corso",
    icon: "Search",
    color: "bg-indigo-500",
  },
  PRONTO: {
    label: "Pronto per il ritiro",
    description: "Il veicolo è pronto! Puoi venire a ritirarlo",
    icon: "Car",
    color: "bg-emerald-500",
  },
  CONSEGNATO: {
    label: "Consegnato",
    description: "Veicolo ritirato dal cliente",
    icon: "PartyPopper",
    color: "bg-gray-500",
  },
};

// Order of statuses for the timeline
export const STATI_ORDER: StatoPratica[] = [
  "PRE_CHECKIN",
  "ACCETTATO",
  "IN_ATTESA_RICAMBI",
  "IN_LAVORAZIONE",
  "IN_VERNICIATURA",
  "CONTROLLO_QUALITA",
  "PRONTO",
  "CONSEGNATO",
];

// Statuses that should be shown in the basic timeline (skip IN_ATTESA_RICAMBI if not used)
export const STATI_TIMELINE_BASE: StatoPratica[] = [
  "PRE_CHECKIN",
  "ACCETTATO",
  "IN_LAVORAZIONE",
  "IN_VERNICIATURA",
  "CONTROLLO_QUALITA",
  "PRONTO",
  "CONSEGNATO",
];

// ============================================
// API Response types
// ============================================

export interface TrackingResponse {
  success: boolean;
  data?: {
    trackingCode: string;
    veicolo: {
      targa: string;
      marca: string;
      modello: string;
      colore?: string;
    };
    tipo: TipoIntervento;
    statoCorrente: StatoPratica;
    dataConsegnaPrevista?: string;
    storicoStati: {
      stato: StatoPratica;
      timestamp: string;
      note?: string;
    }[];
  };
  error?: string;
}

export interface CheckinResponse {
  success: boolean;
  trackingCode?: string;
  error?: string;
}

// ============================================
// Component Props Types
// ============================================

export interface WizardStep {
  id: string;
  title: string;
  description: string;
}

export interface PhotoUpload {
  file?: File;
  preview: string;
  tipo: TipoFoto;
}
