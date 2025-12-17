"use client";

import { CheckCircle2, Copy, ExternalLink, Phone } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface StepConfermaProps {
  trackingCode: string;
}

export function StepConferma({ trackingCode }: StepConfermaProps) {
  const [copied, setCopied] = useState(false);
  const trackingUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/track/${trackingCode}`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(trackingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-slate-100 flex flex-col items-center justify-center px-4 py-8">
      {/* Success icon */}
      <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <CheckCircle2 className="w-12 h-12 text-white" />
      </div>

      {/* Success message */}
      <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
        Richiesta inviata!
      </h1>
      <p className="text-slate-600 text-center mb-8 max-w-sm">
        Ti contatteremo al più presto per confermare l&apos;appuntamento.
      </p>

      {/* Tracking code card */}
      <Card className="w-full max-w-sm border-0 shadow-xl mb-6">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-sm text-slate-500 mb-2">
              Il tuo codice di tracciamento
            </p>
            <div className="bg-slate-100 rounded-xl p-4 mb-4">
              <span className="text-3xl font-mono font-bold text-slate-900 tracking-wider">
                {trackingCode}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={handleCopyCode}
              className="w-full mb-3"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copiato!" : "Copia codice"}
            </Button>
            <p className="text-xs text-slate-500">
              Conserva questo codice per controllare lo stato della tua pratica
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="w-full max-w-sm space-y-3">
        <Link href={`/track/${trackingCode}`} className="block">
          <Button className="w-full bg-slate-900 hover:bg-slate-800">
            <ExternalLink className="w-4 h-4 mr-2" />
            Vai alla pagina di tracking
          </Button>
        </Link>

        <Button
          variant="outline"
          onClick={handleCopyLink}
          className="w-full"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copia link tracking
        </Button>
      </div>

      {/* Contact info */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500 mb-2">Hai domande urgenti?</p>
        <a
          href="tel:+390123456789"
          className="inline-flex items-center gap-2 text-blue-600 font-medium"
        >
          <Phone className="w-4 h-4" />
          Chiama la carrozzeria
        </a>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-xs text-slate-400">
          Carrozzeria Fagioli - Qualità e professionalità dal 1985
        </p>
      </div>
    </div>
  );
}
