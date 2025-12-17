"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Car,
  Calendar,
  Phone,
  RefreshCw,
  AlertCircle,
  Loader2,
  Share2,
  ChevronLeft,
  Clock,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrackingTimeline } from "./TrackingTimeline";
import { STATI_PRATICA } from "@/types";
import type { TrackingResponse } from "@/types";

interface TrackingPageProps {
  trackingCode: string;
}

export function TrackingPage({ trackingCode }: TrackingPageProps) {
  const [data, setData] = useState<TrackingResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchTracking = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const response = await fetch(`/api/tracking/${trackingCode}`);
      const result: TrackingResponse = await response.json();

      if (result.success && result.data) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.error || "Pratica non trovata");
      }
    } catch {
      setError("Errore di connessione. Riprova più tardi.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTracking();
  }, [trackingCode]);

  const handleRefresh = () => {
    fetchTracking(true);
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Tracking ${trackingCode} - Carrozzeria Fagioli`,
          url,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Copy failed
    }
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString("it-IT", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-orange-500 rounded-2xl shadow-brand mb-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-muted-foreground font-medium">
            Caricamento in corso...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle px-4 py-8">
        <div className="max-w-lg mx-auto">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Torna alla home</span>
          </Link>

          <Card className="border-0 shadow-soft-lg animate-scale-in">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Pratica non trovata
              </h1>
              <p className="text-muted-foreground mb-6">
                Il codice{" "}
                <span className="font-mono font-bold text-foreground">
                  {trackingCode}
                </span>{" "}
                non corrisponde a nessuna pratica attiva.
              </p>
              <Button onClick={handleRefresh} variant="outline" className="shadow-soft">
                <RefreshCw className="w-4 h-4 mr-2" />
                Riprova
              </Button>
            </CardContent>
          </Card>

          {/* Contact info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Pensi ci sia un errore?
            </p>
            <a
              href="tel:+390123456789"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              <Phone className="w-4 h-4" />
              Contattaci
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const statoConfig = STATI_PRATICA[data.statoCorrente];
  const hasWaitingParts = data.storicoStati.some(
    (s) => s.stato === "IN_ATTESA_RICAMBI"
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="glass border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-500 rounded-xl flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Carrozzeria Fagioli
                </p>
                <p className="text-sm font-mono font-bold text-foreground">
                  {trackingCode}
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="text-muted-foreground hover:text-foreground"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-muted-foreground hover:text-foreground"
              >
                <RefreshCw
                  className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Vehicle card */}
        <Card className="border-0 shadow-soft-lg overflow-hidden animate-slide-up">
          <div className={`h-1.5 bg-gradient-to-r from-primary to-orange-500`} />
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                <Car className="w-7 h-7 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-foreground">
                  {data.veicolo.marca} {data.veicolo.modello}
                </h1>
                <p className="text-sm font-mono text-muted-foreground">
                  {data.veicolo.targa}
                </p>
                {data.veicolo.colore && (
                  <p className="text-sm text-muted-foreground/70 mt-0.5">
                    {data.veicolo.colore}
                  </p>
                )}
              </div>
              <Badge
                className={`${statoConfig.color} text-white border-0 shadow-sm`}
              >
                {statoConfig.label}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Estimated delivery */}
        {data.dataConsegnaPrevista && data.statoCorrente !== "CONSEGNATO" && (
          <Card className="border-0 shadow-soft bg-emerald-50 animate-slide-up animation-delay-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-700">
                    Consegna prevista
                  </p>
                  <p className="font-bold text-emerald-900 text-lg">
                    {formatDate(data.dataConsegnaPrevista)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ready for pickup banner */}
        {data.statoCorrente === "PRONTO" && (
          <Card className="border-0 shadow-brand bg-gradient-to-r from-emerald-500 to-emerald-600 text-white animate-scale-in">
            <CardContent className="p-6 text-center">
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="text-2xl font-bold mb-2">
                Il tuo veicolo è pronto!
              </h2>
              <p className="text-emerald-100">
                Puoi venire a ritirarlo durante i nostri orari di apertura
              </p>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        <Card className="border-0 shadow-soft-lg animate-slide-up animation-delay-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">
              Stato della riparazione
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TrackingTimeline
              statoCorrente={data.statoCorrente}
              storicoStati={data.storicoStati}
              hasWaitingParts={hasWaitingParts}
            />
          </CardContent>
        </Card>

        {/* Contact card */}
        <Card className="border-0 shadow-soft animate-slide-up animation-delay-300">
          <CardContent className="p-5">
            <h3 className="font-bold text-foreground mb-2">
              Hai bisogno di assistenza?
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Aggiorniamo lo stato più volte al giorno. Prima di chiamare,
              prova ad aggiornare la pagina.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 shadow-soft"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Aggiorna
              </Button>
              <a href="tel:+390123456789" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-brand">
                  <Phone className="w-4 h-4 mr-2" />
                  Chiama
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Opening hours */}
        <Card className="border-0 shadow-soft bg-secondary/50 animate-slide-up animation-delay-400">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-2">
                  Orari di apertura
                </h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Lunedì - Venerdì: 08:00 - 12:00, 14:00 - 18:00</p>
                  <p>Sabato: 08:00 - 12:00</p>
                  <p>Domenica: Chiuso</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <a
          href="https://maps.google.com/?q=Carrozzeria+Fagioli"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Card className="border-0 shadow-soft hover-lift cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">Dove siamo</h4>
                  <p className="text-sm text-muted-foreground">
                    Via Roma 123, Milano
                  </p>
                </div>
                <ChevronLeft className="w-5 h-5 text-muted-foreground rotate-180" />
              </div>
            </CardContent>
          </Card>
        </a>

        {/* Footer */}
        <footer className="text-center pt-6 pb-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Carrozzeria Fagioli
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Qualità e professionalità dal 1985
          </p>
        </footer>
      </main>
    </div>
  );
}
