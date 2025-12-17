"use client";

import { useFormContext } from "react-hook-form";
import {
  User,
  Car,
  AlertTriangle,
  Sparkles,
  Wrench,
  Calendar,
  ImageIcon,
  Edit2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CheckinFormData } from "@/lib/validations/checkin";
import type { PhotoUpload } from "@/types";

interface StepRiepilogoProps {
  photos: PhotoUpload[];
}

export function StepRiepilogo({ photos }: StepRiepilogoProps) {
  const { watch } = useFormContext<CheckinFormData>();
  const data = watch();

  const getTipoIcon = () => {
    switch (data.tipo) {
      case "SINISTRO":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "ESTETICO":
        return <Sparkles className="w-5 h-5 text-blue-600" />;
      case "MECCANICA":
        return <Wrench className="w-5 h-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getTipoLabel = () => {
    switch (data.tipo) {
      case "SINISTRO":
        return "Sinistro / Incidente";
      case "ESTETICO":
        return "Riparazione estetica";
      case "MECCANICA":
        return "Meccanica";
      default:
        return "-";
    }
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("it-IT", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {/* Info box */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <p className="text-sm text-emerald-800">
          <strong>Controlla che i dati siano corretti</strong> prima di inviare
          la richiesta. Potrai modificarli tornando indietro.
        </p>
      </div>

      {/* Dati cliente */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4" />
            I tuoi dati
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Nome</span>
            <span className="font-medium">
              {data.nome} {data.cognome}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Telefono</span>
            <span className="font-medium">{data.telefono}</span>
          </div>
          {data.email && (
            <div className="flex justify-between">
              <span className="text-slate-500">Email</span>
              <span className="font-medium">{data.email}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dati veicolo */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Car className="w-4 h-4" />
            Veicolo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Targa</span>
            <span className="font-medium font-mono">{data.targa}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Veicolo</span>
            <span className="font-medium">
              {data.marca} {data.modello}
            </span>
          </div>
          {data.anno && (
            <div className="flex justify-between">
              <span className="text-slate-500">Anno</span>
              <span className="font-medium">{data.anno}</span>
            </div>
          )}
          {data.colore && (
            <div className="flex justify-between">
              <span className="text-slate-500">Colore</span>
              <span className="font-medium">{data.colore}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tipo intervento */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            {getTipoIcon()}
            Intervento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Tipo</span>
            <span className="font-medium">{getTipoLabel()}</span>
          </div>
          {data.descrizione && (
            <div>
              <span className="text-slate-500 block mb-1">Descrizione</span>
              <p className="text-slate-700 bg-slate-50 p-2 rounded">
                {data.descrizione}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dati sinistro (se presenti) */}
      {data.tipo === "SINISTRO" && (data.dataIncidente || data.assicurazione) && (
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Dati sinistro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {data.dataIncidente && (
              <div className="flex justify-between">
                <span className="text-slate-500">Data incidente</span>
                <span className="font-medium">
                  {formatDate(data.dataIncidente)}
                </span>
              </div>
            )}
            {data.luogoIncidente && (
              <div className="flex justify-between">
                <span className="text-slate-500">Luogo</span>
                <span className="font-medium">{data.luogoIncidente}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">CAI compilato</span>
              <span className="font-medium">
                {data.caiCompilato ? "Sì" : "No"}
              </span>
            </div>
            {data.assicurazione && (
              <div className="flex justify-between">
                <span className="text-slate-500">Assicurazione</span>
                <span className="font-medium">{data.assicurazione}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Foto */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Foto caricate
          </CardTitle>
        </CardHeader>
        <CardContent>
          {photos.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {photos.map((photo, idx) => (
                <div key={idx} className="aspect-square">
                  <img
                    src={photo.preview}
                    alt={`Foto ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-amber-600">Nessuna foto caricata</p>
          )}
        </CardContent>
      </Card>

      {/* Appuntamento */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Appuntamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Data preferita</span>
            <span className="font-medium">
              {data.dataAppuntamento
                ? formatDate(data.dataAppuntamento)
                : "Non specificata"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Fascia oraria</span>
            <span className="font-medium capitalize">
              {data.oraPreferita || "Non specificata"}
            </span>
          </div>
          {data.note && (
            <div>
              <span className="text-slate-500 block mb-1">Note</span>
              <p className="text-slate-700 bg-slate-50 p-2 rounded">
                {data.note}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Edit hint */}
      <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
        <Edit2 className="w-4 h-4" />
        <span>Usa &quot;Indietro&quot; per modificare i dati</span>
      </div>
    </div>
  );
}
