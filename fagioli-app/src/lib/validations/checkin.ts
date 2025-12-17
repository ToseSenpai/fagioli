import { z } from "zod";

// ============================================
// Step 1: Dati Cliente (Customer Data)
// ============================================
export const datiClienteSchema = z.object({
  nome: z
    .string()
    .min(2, "Il nome deve avere almeno 2 caratteri")
    .max(50, "Il nome non può superare 50 caratteri"),
  cognome: z
    .string()
    .min(2, "Il cognome deve avere almeno 2 caratteri")
    .max(50, "Il cognome non può superare 50 caratteri"),
  telefono: z
    .string()
    .regex(
      /^(\+39)?[\s]?3[0-9]{2}[\s]?[0-9]{6,7}$/,
      "Inserisci un numero di telefono valido (es. 333 1234567)"
    ),
  email: z
    .string()
    .email("Inserisci un indirizzo email valido")
    .optional()
    .or(z.literal("")),
});

// ============================================
// Step 2: Dati Veicolo (Vehicle Data)
// ============================================
export const datiVeicoloSchema = z.object({
  targa: z
    .string()
    .min(5, "La targa deve avere almeno 5 caratteri")
    .max(10, "La targa non può superare 10 caratteri")
    .transform((val) => val.toUpperCase().replace(/\s/g, "")),
  marca: z
    .string()
    .min(2, "Seleziona o inserisci la marca del veicolo"),
  modello: z
    .string()
    .min(1, "Inserisci il modello del veicolo"),
  anno: z
    .number()
    .min(1950, "Anno non valido")
    .max(new Date().getFullYear() + 1, "Anno non valido")
    .optional(),
  colore: z.string().optional(),
});

// ============================================
// Step 3: Tipo Intervento
// ============================================
export const tipoInterventoSchema = z.object({
  tipo: z.enum(["SINISTRO", "ESTETICO", "MECCANICA"], {
    message: "Seleziona il tipo di intervento",
  }),
  descrizione: z
    .string()
    .max(500, "La descrizione non può superare 500 caratteri")
    .optional(),
});

// ============================================
// Step 4: Dati Sinistro (only if tipo = SINISTRO)
// ============================================
export const datiSinistroSchema = z.object({
  dataIncidente: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), "Data non valida")
    .optional(),
  luogoIncidente: z
    .string()
    .max(200, "Il luogo non può superare 200 caratteri")
    .optional(),
  caiCompilato: z.boolean(),
  controparteNome: z.string().optional(),
  controparteTarga: z.string().optional(),
  assicurazione: z.string().optional(),
  numeroPolizza: z.string().optional(),
});

// ============================================
// Step 5: Foto
// ============================================
export const fotoSchema = z.object({
  foto: z
    .array(
      z.object({
        file: z.instanceof(File).optional(),
        preview: z.string(),
        tipo: z.enum([
          "FRONTE",
          "RETRO",
          "LATO_SINISTRO",
          "LATO_DESTRO",
          "DETTAGLIO_DANNO",
          "CAI",
          "DOCUMENTO",
        ]),
      })
    )
    .min(1, "Carica almeno una foto del danno"),
});

// ============================================
// Step 6: Appuntamento
// ============================================
export const appuntamentoSchema = z.object({
  dataAppuntamento: z.string().optional(),
  oraPreferita: z.enum(["mattina", "pomeriggio"]).optional(),
  note: z
    .string()
    .max(500, "Le note non possono superare 500 caratteri")
    .optional(),
});

// ============================================
// Complete Check-in Form Schema
// ============================================
export const checkinFormSchema = z.object({
  // Cliente
  nome: datiClienteSchema.shape.nome,
  cognome: datiClienteSchema.shape.cognome,
  telefono: datiClienteSchema.shape.telefono,
  email: datiClienteSchema.shape.email,

  // Veicolo
  targa: datiVeicoloSchema.shape.targa,
  marca: datiVeicoloSchema.shape.marca,
  modello: datiVeicoloSchema.shape.modello,
  anno: datiVeicoloSchema.shape.anno,
  colore: datiVeicoloSchema.shape.colore,

  // Tipo intervento
  tipo: tipoInterventoSchema.shape.tipo,
  descrizione: tipoInterventoSchema.shape.descrizione,

  // Dati sinistro (optional)
  dataIncidente: datiSinistroSchema.shape.dataIncidente,
  luogoIncidente: datiSinistroSchema.shape.luogoIncidente,
  caiCompilato: datiSinistroSchema.shape.caiCompilato,
  controparteNome: datiSinistroSchema.shape.controparteNome,
  controparteTarga: datiSinistroSchema.shape.controparteTarga,
  assicurazione: datiSinistroSchema.shape.assicurazione,
  numeroPolizza: datiSinistroSchema.shape.numeroPolizza,

  // Appuntamento
  dataAppuntamento: appuntamentoSchema.shape.dataAppuntamento,
  oraPreferita: appuntamentoSchema.shape.oraPreferita,
  note: appuntamentoSchema.shape.note,
});

export type CheckinFormData = z.infer<typeof checkinFormSchema>;
export type DatiCliente = z.infer<typeof datiClienteSchema>;
export type DatiVeicolo = z.infer<typeof datiVeicoloSchema>;
export type TipoIntervento = z.infer<typeof tipoInterventoSchema>;
export type DatiSinistro = z.infer<typeof datiSinistroSchema>;
export type Appuntamento = z.infer<typeof appuntamentoSchema>;
