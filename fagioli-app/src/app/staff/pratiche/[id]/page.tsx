"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Car,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Shield,
  FileText,
  Clock,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  Loader2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATI_PRATICA, STATI_ORDER } from "@/types";
import type { StatoPratica, TipoIntervento } from "@/types";

interface PraticaDetail {
  id: string;
  trackingCode: string;
  tipo: TipoIntervento;
  descrizione: string | null;
  dataIncidente: string | null;
  luogoIncidente: string | null;
  caiCompilato: boolean;
  controparteNome: string | null;
  controparteTarga: string | null;
  assicurazione: string | null;
  numeroPolizza: string | null;
  statoCorrente: StatoPratica;
  dataConsegnaPrevista: string | null;
  dataAppuntamento: string | null;
  oraPreferita: string | null;
  note: string | null;
  createdAt: string;
  veicolo: {
    targa: string;
    marca: string;
    modello: string;
    anno: number | null;
    colore: string | null;
  };
  cliente: {
    nome: string;
    cognome: string;
    telefono: string;
    email: string | null;
  };
  storicoStati: {
    stato: StatoPratica;
    timestamp: string;
    note: string | null;
  }[];
  foto: {
    id: string;
    url: string;
    tipo: string;
  }[];
}

export default function PraticaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [pratica, setPratica] = useState<PraticaDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStato, setNewStato] = useState<StatoPratica | "">("");
  const [statoNote, setStatoNote] = useState("");
  const [dataConsegna, setDataConsegna] = useState("");

  const fetchPratica = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/staff/pratiche/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setPratica(data.data);
        setNewStato(data.data.statoCorrente);
        setDataConsegna(
          data.data.dataConsegnaPrevista
            ? data.data.dataConsegnaPrevista.split("T")[0]
            : ""
        );
      }
    } catch (error) {
      console.error("Failed to fetch pratica:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("staff_logged_in");
    if (!isLoggedIn) {
      window.location.href = "/staff/login";
      return;
    }
    fetchPratica();
  }, [params.id]);

  const handleUpdateStato = async () => {
    if (!newStato || newStato === pratica?.statoCorrente) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/staff/pratiche/${params.id}/stato`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stato: newStato,
          note: statoNote || undefined,
          dataConsegnaPrevista: dataConsegna || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatoNote("");
        fetchPratica();
      }
    } catch (error) {
      console.error("Failed to update stato:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("it-IT", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTipoLabel = (tipo: TipoIntervento) => {
    switch (tipo) {
      case "SINISTRO":
        return { label: "Sinistro", color: "bg-red-500" };
      case "ESTETICO":
        return { label: "Estetico", color: "bg-blue-500" };
      case "MECCANICA":
        return { label: "Meccanica", color: "bg-orange-500" };
      default:
        return { label: tipo, color: "bg-slate-500" };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (!pratica) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Pratica non trovata</p>
        <Link href="/staff/pratiche">
          <Button variant="link">Torna alle pratiche</Button>
        </Link>
      </div>
    );
  }

  const statoConfig = STATI_PRATICA[pratica.statoCorrente];
  const tipoConfig = getTipoLabel(pratica.tipo);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">
                {pratica.veicolo.marca} {pratica.veicolo.modello}
              </h1>
              <Badge className={`${tipoConfig.color} text-white`}>
                {tipoConfig.label}
              </Badge>
            </div>
            <p className="text-slate-500 font-mono">{pratica.trackingCode}</p>
          </div>
        </div>

        <Link
          href={`/track/${pratica.trackingCode}`}
          target="_blank"
          className="flex-shrink-0"
        >
          <Button variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            Vedi tracking
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status update card */}
          <Card className="border-2 border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>Stato Pratica</span>
                <Badge className={`${statoConfig.color} text-white`}>
                  {statoConfig.label}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nuovo stato</Label>
                  <Select
                    value={newStato}
                    onValueChange={(v) => setNewStato(v as StatoPratica)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATI_ORDER.map((stato) => (
                        <SelectItem key={stato} value={stato}>
                          {STATI_PRATICA[stato].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Data consegna prevista</Label>
                  <Input
                    type="date"
                    value={dataConsegna}
                    onChange={(e) => setDataConsegna(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Note (opzionale)</Label>
                <Textarea
                  placeholder="Aggiungi una nota per questo cambio di stato..."
                  value={statoNote}
                  onChange={(e) => setStatoNote(e.target.value)}
                  rows={2}
                />
              </div>

              <Button
                onClick={handleUpdateStato}
                disabled={
                  isUpdating ||
                  !newStato ||
                  newStato === pratica.statoCorrente
                }
                className="w-full sm:w-auto"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Aggiornamento...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aggiorna stato
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Vehicle info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Veicolo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Targa</p>
                  <p className="font-mono font-semibold">
                    {pratica.veicolo.targa}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Modello</p>
                  <p className="font-semibold">
                    {pratica.veicolo.marca} {pratica.veicolo.modello}
                  </p>
                </div>
                {pratica.veicolo.anno && (
                  <div>
                    <p className="text-slate-500">Anno</p>
                    <p className="font-semibold">{pratica.veicolo.anno}</p>
                  </div>
                )}
                {pratica.veicolo.colore && (
                  <div>
                    <p className="text-slate-500">Colore</p>
                    <p className="font-semibold">{pratica.veicolo.colore}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {pratica.descrizione && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Descrizione
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">{pratica.descrizione}</p>
              </CardContent>
            </Card>
          )}

          {/* Accident info (if sinistro) */}
          {pratica.tipo === "SINISTRO" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Dati Sinistro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Data incidente</p>
                    <p className="font-semibold">
                      {formatDate(pratica.dataIncidente)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Luogo</p>
                    <p className="font-semibold">
                      {pratica.luogoIncidente || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">CAI compilato</p>
                    <p className="font-semibold">
                      {pratica.caiCompilato ? "Sì" : "No"}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Assicurazione</p>
                    <p className="font-semibold">
                      {pratica.assicurazione || "-"}
                    </p>
                  </div>
                  {pratica.controparteNome && (
                    <div>
                      <p className="text-slate-500">Controparte</p>
                      <p className="font-semibold">{pratica.controparteNome}</p>
                    </div>
                  )}
                  {pratica.controparteTarga && (
                    <div>
                      <p className="text-slate-500">Targa controparte</p>
                      <p className="font-mono font-semibold">
                        {pratica.controparteTarga}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status history */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Storico Stati
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pratica.storicoStati.map((entry, index) => {
                  const config = STATI_PRATICA[entry.stato];
                  return (
                    <div key={index} className="flex gap-4">
                      <div
                        className={`w-3 h-3 rounded-full ${config.color} mt-1.5 flex-shrink-0`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{config.label}</p>
                          <p className="text-xs text-slate-400">
                            {formatDateTime(entry.timestamp)}
                          </p>
                        </div>
                        {entry.note && (
                          <p className="text-sm text-slate-500 mt-1">
                            {entry.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-lg">
                  {pratica.cliente.nome} {pratica.cliente.cognome}
                </p>
              </div>
              <Separator />
              <a
                href={`tel:${pratica.cliente.telefono}`}
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <Phone className="w-4 h-4" />
                {pratica.cliente.telefono}
              </a>
              {pratica.cliente.email && (
                <a
                  href={`mailto:${pratica.cliente.email}`}
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <Mail className="w-4 h-4" />
                  {pratica.cliente.email}
                </a>
              )}
            </CardContent>
          </Card>

          {/* Appointment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Appuntamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-slate-500">Data richiesta</p>
                <p className="font-semibold">
                  {formatDate(pratica.dataAppuntamento)}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Fascia oraria</p>
                <p className="font-semibold capitalize">
                  {pratica.oraPreferita || "-"}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Consegna prevista</p>
                <p className="font-semibold">
                  {formatDate(pratica.dataConsegnaPrevista)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {pratica.note && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Note cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{pratica.note}</p>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardContent className="p-4 text-xs text-slate-400">
              <p>Pratica creata: {formatDateTime(pratica.createdAt)}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
