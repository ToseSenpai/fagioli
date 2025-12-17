# Analisi Post-Colloquio: Carrozzeria Fagioli

**Data colloquio:** 14 Dicembre 2025
**Cliente:** Gianni (Carrozzeria Fagioli)
**Analisi:** 14 Dicembre 2025

---

## 1. Sintesi Situazione Attuale

### Numeri Chiave

| Indicatore | Valore |
|------------|--------|
| Veicoli gestiti | ~200/mese |
| Sedi | 2 |
| Dipendenti | 25 |
| Impiegate ufficio | 5 + 2 titolari |
| Software gestionale | WinCar |

### Tecnologia Già Presente (Sottoutilizzata)

| Strumento | Stato | Problema |
|-----------|-------|----------|
| **WinCar** | Attivo | Usato solo per fatturazione/preventivi, non integrato |
| **Totem Touchscreen** | Presente | Usato solo come timbracartellino, non per tracking lavori |
| **Tintobox** | Collegabile | Mai configurato per tracciare consumi vernice |
| **App Fagioli** | Dismessa | Fallita per mancanza di gestione editoriale |
| **Totem soddisfazione** | Rotto | Mai riparato né gestito |

### Lezione Critica dai Fallimenti Passati

> **Qualunque strumento che richiede manutenzione manuale/editoriale fallirà.**

L'App Fagioli è stata abbandonata perché richiedeva aggiornamenti e promozioni manuali che nessuno aveva tempo di fare. Il nuovo sistema deve funzionare con **trigger automatici**, non con input umano discrezionale.

---

## 2. I Problemi Reali (In Ordine di Priorità)

### Problema #1: Il Lunedì è un Inferno

**Citazione:** *"7 persone bloccate a fare accettazione e lista danni, perdendo tutta la mattina e talvolta il pomeriggio del lunedì"*

#### Cosa Succede
```
┌─────────────────────────────────────────────────────────────┐
│                    LUNEDÌ MATTINA                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Cliente arriva                                            │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │ COLLO DI BOTTIGLIA                                  │  │
│   │ ─────────────────                                   │  │
│   │ • Accettazione fisica del veicolo                   │  │
│   │ • Raccolta dati (targa, danni, foto)               │  │
│   │ • Educazione cliente (come compilare CAI/CID)      │  │
│   │ • Apertura pratica su WinCar                       │  │
│   │ • Assegnazione lavoro                              │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   7 persone occupate × 4-6 ore = 28-42 ore/settimana       │
│   BRUCIATE in attività ripetitive                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Impatto Economico Stimato
| Calcolo | Valore |
|---------|--------|
| Ore perse/settimana | 28-42 |
| Costo orario medio | ~€15 |
| Costo settimanale | €420-630 |
| **Costo annuale** | **€20.000-30.000** |

---

### Problema #2: Telefonate "A Che Punto È?"

**Citazione:** *"I clienti chiamano continuamente per sapere: 'A che punto è la macchina?'"*

#### Cosa Succede
- Le impiegate vengono interrotte continuamente
- Devono cercare manualmente lo stato della pratica
- Perdono il flusso di lavoro ("catena di montaggio" rotta)
- Errori di comunicazione (es. ricambio arrivato sbagliato, cliente arriva a vuoto)

#### Impatto
- Produttività distrutta
- Staff specializzato sprecato in attività a basso valore
- Frustrazione dipendenti e clienti

---

### Problema #3: Zero Dati Reali sui Costi

**Citazione:** *"WinCar stima 30 ore, ma non so se ce ne hanno messe 40"*

#### Cosa Manca
| Dato | Disponibile? |
|------|--------------|
| Ore preventivate | ✅ (WinCar) |
| Ore reali lavorate | ❌ |
| Vernice preventivata | ✅ (WinCar) |
| Vernice reale usata | ❌ (Tintobox non integrato) |
| Marginalità per commessa | ❌ |

#### Conseguenza
Gianni non sa quali lavori sono profittevoli e quali no. Possibili perdite occulte su ogni commessa.

---

## 3. Cosa NON È Prioritario (Ora)

Gianni ha menzionato diverse idee che **non** devono entrare nell'MVP:

| Idea | Perché Rimandare |
|------|------------------|
| "Hub dell'Auto" (assicurazioni, patenti, trapassi) | Scope creep, richiede competenze diverse |
| Vendita su eBay del materiale morto | Nice-to-have, non risolve il problema del lunedì |
| Terza sede/capannone | Infrastruttura fisica, non software |
| CRM scadenze patenti/bollo | Fase 2, dopo aver risolto l'operatività |
| Pagamenti online | Non urgente (clienti "sani", pochi no-show) |

> **Rischio:** Se quotate tutto insieme, il progetto diventa €80k e non chiude. Oppure chiude ma le aspettative sono impossibili da soddisfare.

---

## 4. Il Vero MVP

### Principio Guida

> **Risolvere il lunedì. Tutto il resto viene dopo.**

### Funzionalità Core (e basta)

| Priorità | Funzionalità | Problema Risolto | Effort |
|----------|--------------|------------------|--------|
| 🔴 **P0** | Pre-check-in digitale | Libera il lunedì mattina | 8-10 giorni |
| 🔴 **P0** | Link tracking cliente | Elimina telefonate WISMO | 5-7 giorni |
| 🔴 **P0** | Notifiche automatiche | Conferme, "auto pronta" | 4-5 giorni |
| 🟡 **P1** | Dashboard stato lavori (interno) | Visione d'insieme per ufficio | 5-6 giorni |
| 🟢 **P2** | Tracking tempi operatore | Dati reali vs preventivo | 6-8 giorni |

### Cosa Fa il Pre-Check-in

```
┌─────────────────────────────────────────────────────────────┐
│                PRE-CHECK-IN DIGITALE                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PRIMA (Cliente a casa/in auto)                            │
│  ───────────────────────────────                           │
│  1. Riceve link via WhatsApp/SMS                           │
│  2. Apre PWA (no installazione)                            │
│  3. Compila wizard guidato:                                │
│     • Targa (auto-fill dati veicolo se possibile)         │
│     • Tipo intervento (sinistro / estetico / meccanica)   │
│     • Foto danni (guidate: fronte, retro, dettaglio)      │
│     • CAI/CID digitale guidato (se sinistro)              │
│     • Preferenza data/ora                                  │
│  4. Invia                                                  │
│                                                             │
│  DOPO (Ufficio Fagioli)                                    │
│  ───────────────────────────────                           │
│  • Riceve pratica pre-compilata                            │
│  • Revisiona in 5 minuti invece di 30                      │
│  • Conferma appuntamento con un click                      │
│  • Cliente arriva → check-in fisico in 2 minuti            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Cosa Fa il Link Tracking

```
┌─────────────────────────────────────────────────────────────┐
│              TRACKING RIPARAZIONE (Stile Amazon)            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Cliente riceve: fagioli.app/track/ABC123                  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  🚗 FIAT PANDA - AB123CD                           │   │
│  │                                                     │   │
│  │  ● Accettazione         ✓ 14/12 ore 09:30         │   │
│  │  ● In lavorazione       ✓ 14/12 ore 14:00         │   │
│  │  ● Verniciatura         ◐ In corso                │   │
│  │  ○ Controllo qualità                              │   │
│  │  ○ Pronta per ritiro                              │   │
│  │                                                     │   │
│  │  Consegna stimata: Mercoledì 18/12                │   │
│  │                                                     │   │
│  │  [Contattaci solo se urgente]                     │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  → Cliente NON chiama per sapere "a che punto è"           │
│  → Impiegate lavorano senza interruzioni                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Cosa NON Fare

### Errori da Evitare

| Errore | Perché È un Problema |
|--------|---------------------|
| Sostituire WinCar | È il cuore dell'azienda, gli operatori lo conoscono |
| Richiedere data entry manuale | Fallirà come l'App Fagioli |
| Costruire un CRM completo | Scope creep, non è il problema urgente |
| Promettere integrazione WinCar | Non ha API pubbliche, è rischioso |
| Includere troppe funzionalità | MVP deve essere snello e veloce da rilasciare |

### Approccio Corretto

| Invece di... | Fare... |
|--------------|---------|
| Sostituire WinCar | Affiancare WinCar con sistema complementare |
| Integrazione automatica | Export/import manuale iniziale (CSV) |
| CRM completo | Anagrafica minima (cliente + veicolo + pratica) |
| Tutto subito | MVP in 8-10 settimane, poi iterare |

---

## 6. Calcolo ROI per Gianni

### Risparmio Diretto

| Voce | Calcolo | Risparmio/Anno |
|------|---------|----------------|
| Ore accettazione | 30 ore/sett × €15 × 50 sett | €22.500 |
| Ore telefonate WISMO | 10 ore/sett × €15 × 50 sett | €7.500 |
| **Totale risparmio** | | **€30.000/anno** |

### Confronto Investimento

| Voce | Costo |
|------|-------|
| MVP sviluppo | €20.000 (una tantum) |
| Costi operativi | €600/anno (~€50/mese) |
| **Costo primo anno** | **€20.600** |
| **Costo anni successivi** | **€600/anno** |

### Payback

| Metrica | Valore |
|---------|--------|
| Risparmio anno 1 | €30.000 |
| Costo anno 1 | €20.600 |
| **ROI anno 1** | **+€9.400** |
| **Payback period** | **~8 mesi** |

---

## 7. Strategia: Come Procedere

### Prossimi Passi Immediati

| # | Azione | Quando |
|---|--------|--------|
| 1 | Inviare email di ringraziamento + sintesi colloquio | Entro 24h |
| 2 | Preparare proposta commerciale MVP | Entro 3-4 giorni |
| 3 | Call/incontro per presentare proposta | Entro 1 settimana |
| 4 | Raccogliere feedback e chiudere | Entro 2 settimane |

### Domande Chiave da Porre a Gianni (Prima della Proposta)

Queste domande servono a validare le assunzioni e dimensionare correttamente:

#### Sulla Quantificazione

> **"Se il cliente potesse caricare foto e dati del danno da casa prima di venire, quanto tempo risparmiereste per ogni accettazione? 10 minuti? 20?"**

*Obiettivo: Quantificare il risparmio per calcolare ROI credibile.*

#### Sul Flusso Attuale

> **"Oggi quando un cliente chiama per sapere lo stato, quanto tempo ci mette l'impiegata a trovare l'informazione e rispondere?"**

*Obiettivo: Quantificare il costo delle chiamate WISMO.*

#### Sulla Priorità Reale

> **"Se dovessi scegliere UNA sola cosa da risolvere subito, sarebbe il caos del lunedì o le telefonate continue?"**

*Obiettivo: Confermare la priorità P0.*

#### Sul Budget

> **"Per un sistema che vi fa risparmiare 20-30 ore a settimana, quale investimento vi sembrerebbe ragionevole?"**

*Obiettivo: Ancorare la percezione del valore prima di dare il prezzo.*

#### Sull'Integrazione WinCar

> **"Sareste disposti, almeno inizialmente, a esportare un file da WinCar e caricarlo nel nuovo sistema una volta al giorno? Oppure è fondamentale che sia automatico?"**

*Obiettivo: Capire se accettano un workaround manuale (riduce complessità e rischio).*

#### Sul Go-Live

> **"Quando vorreste essere operativi? C'è una deadline o un periodo dell'anno migliore?"**

*Obiettivo: Capire urgenza e pianificare timeline.*

---

### Struttura della Proposta Commerciale

#### Cosa Includere

```
1. CONTESTO
   - Riepilogo situazione attuale (dal colloquio)
   - Problemi identificati
   - Costo attuale del problema

2. SOLUZIONE PROPOSTA
   - MVP: cosa include (e cosa NON include)
   - Come risolve i problemi
   - Screenshot/mockup concettuali

3. BENEFICI ATTESI
   - Risparmio ore/settimana
   - ROI stimato
   - Payback period

4. INVESTIMENTO
   - Costo MVP (con breakdown milestone)
   - Costi operativi mensili
   - Opzioni manutenzione

5. TIMELINE
   - Gantt semplificato
   - Milestone e deliverable

6. PROSSIMI PASSI
   - Cosa serve per partire
   - Referente progetto lato cliente
```

#### Pricing Consigliato

| Fase | Deliverable | Prezzo |
|------|-------------|--------|
| **MVP Core** | Pre-check-in + Tracking + Notifiche | €15.000-18.000 |
| **Fase 2** | Dashboard interna + Tracking tempi | €5.000-7.000 |
| **Manutenzione** | Hosting + supporto + bugfix | €300-400/mese |

#### Formula Pagamento

| Milestone | % | Quando |
|-----------|---|--------|
| Acconto | 30% | Alla firma |
| Intermedio | 40% | Demo MVP funzionante |
| Saldo | 30% | Go-live + 2 settimane |

---

### Rischi da Gestire

| Rischio | Probabilità | Mitigazione |
|---------|-------------|-------------|
| **Scope creep** (Gianni vuole tutto) | Alta | Proposta chiara su cosa è incluso/escluso |
| **Integrazione WinCar impossibile** | Media | Proporre workaround CSV, non promettere API |
| **Adozione fallisce** (come App Fagioli) | Media | Sistema "zero-config", notifiche automatiche |
| **Ludovico (figlio) ha idee diverse** | Bassa | Coinvolgerlo nel prossimo incontro |
| **Budget non approvato** | Bassa | ROI chiaro, payback < 1 anno |

---

### Messaggio Chiave da Comunicare

> **"Non vi proponiamo un gestionale. Vi proponiamo di riprendervi il lunedì mattina e di smettere di rispondere al telefono 50 volte al giorno."**

Questo framing sposta la conversazione da "quanto costa il software" a "quanto vale risolvere il problema".

---

## 8. Checklist Pre-Proposta

- [ ] Inviata email di ringraziamento
- [ ] Confermati i numeri (200 veicoli/mese, 7 persone in accettazione)
- [ ] Poste le domande di validazione (risparmio stimato, priorità)
- [ ] Definito scope MVP chiaro (cosa SÌ, cosa NO)
- [ ] Preparati 2-3 mockup concettuali
- [ ] Calcolato ROI con numeri del cliente
- [ ] Preparata proposta con 2 opzioni (MVP base + Fase 2)
- [ ] Definita timeline realistica (10-12 settimane)
- [ ] Identificato chi firma (Gianni? Anche Ludovico?)

---

*Documento creato il 14 Dicembre 2025*
