# Carrozzeria Fagioli MVP

Sistema di check-in digitale e tracking riparazioni per Carrozzeria Fagioli.

## Funzionalità

### Per i Clienti (PWA Mobile)
- **Pre-check-in digitale**: Compila i dati del veicolo e carica foto dei danni prima di venire in carrozzeria
- **Tracking riparazione**: Segui lo stato della riparazione in tempo reale (stile Amazon)
- **Notifiche SMS**: Ricevi aggiornamenti automatici sullo stato

### Per lo Staff (Dashboard Web)
- **Dashboard pipeline**: Visualizza tutte le riparazioni in corso in formato Kanban
- **Gestione riparazioni**: Aggiorna stati, conferma appuntamenti, aggiungi note
- **Notifiche automatiche**: Il sistema invia SMS ai clienti quando lo stato cambia

## Stack Tecnologico

- **Frontend**: React + Vite + TypeScript + TailwindCSS (PWA)
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite (via Prisma ORM)
- **SMS**: Twilio (opzionale per demo)

## Installazione

```bash
# Clona il repository
cd fagioli-mvp

# Installa dipendenze
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# Configura il database
cd backend
npx prisma migrate dev
npm run db:seed
cd ..
```

## Configurazione

### Backend (.env)
```env
DATABASE_URL="file:./dev.db"
PORT=3001
JWT_SECRET=your-secret-key
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## Avvio

```bash
# Avvia tutto (backend + frontend)
npm run dev

# Oppure separatamente:
npm run dev:backend  # Backend su http://localhost:3001
npm run dev:frontend # Frontend su http://localhost:5173
```

## URL Demo

- **Check-in Cliente**: http://localhost:5173/
- **Tracking**: http://localhost:5173/track/ABC123
- **Staff Login**: http://localhost:5173/staff/login
- **Staff Dashboard**: http://localhost:5173/staff

### Credenziali Demo
- Email: `admin@fagioli.it`
- Password: `password123`

## Struttura Progetto

```
fagioli-mvp/
├── backend/
│   ├── src/
│   │   ├── index.ts         # Server Express
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth middleware
│   │   ├── services/        # SMS service
│   │   └── utils/           # Utilities
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── uploads/             # Foto caricate
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── customer/    # Check-in wizard, tracking
│   │   │   ├── staff/       # Dashboard components
│   │   │   └── ui/          # Shared UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   └── lib/             # Utilities, API client
│   └── public/              # Static assets
└── package.json             # Root package.json
```

## Flusso Stati Riparazione

```
pre_checkin → confirmed → accepted → disassembly → bodywork
    → painting → reassembly → quality_check → ready → delivered
```

## API Endpoints

### Pubblici
- `POST /api/checkin` - Invia pre-check-in
- `POST /api/checkin/:id/photos` - Carica foto
- `GET /api/track/:code` - Stato riparazione

### Staff (protetti)
- `POST /api/auth/login` - Login staff
- `GET /api/repairs` - Lista riparazioni
- `GET /api/repairs/:id` - Dettaglio riparazione
- `PATCH /api/repairs/:id` - Aggiorna riparazione
- `POST /api/repairs/:id/status` - Cambia stato

## Licenza

Proprietario - Carrozzeria Fagioli
