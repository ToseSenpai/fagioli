"use client";

import { useFormContext } from "react-hook-form";
import { Calendar, Clock, MessageSquare } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import type { CheckinFormData } from "@/lib/validations/checkin";

export function StepAppuntamento() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CheckinFormData>();

  const oraPreferita = watch("oraPreferita");

  // Calculate minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Calculate maximum date (2 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Scegli quando preferisci portare il veicolo.</strong> Ti
          contatteremo per confermare la disponibilità.
        </p>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6 space-y-6">
          {/* Data preferita */}
          <div className="space-y-2">
            <Label htmlFor="dataAppuntamento" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              Data preferita
            </Label>
            <Input
              id="dataAppuntamento"
              type="date"
              min={minDate}
              max={maxDateStr}
              {...register("dataAppuntamento")}
            />
            <p className="text-xs text-slate-500">
              Seleziona una data a partire da domani
            </p>
          </div>

          {/* Ora preferita */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              Fascia oraria preferita
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue("oraPreferita", "mattina")}
                className={`py-4 px-4 rounded-xl border-2 transition-all ${
                  oraPreferita === "mattina"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="text-2xl mb-1">🌅</div>
                <div className="font-medium">Mattina</div>
                <div className="text-xs text-slate-500">08:00 - 12:00</div>
              </button>
              <button
                type="button"
                onClick={() => setValue("oraPreferita", "pomeriggio")}
                className={`py-4 px-4 rounded-xl border-2 transition-all ${
                  oraPreferita === "pomeriggio"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="text-2xl mb-1">🌇</div>
                <div className="font-medium">Pomeriggio</div>
                <div className="text-xs text-slate-500">14:00 - 18:00</div>
              </button>
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              Note aggiuntive{" "}
              <span className="text-slate-400">(opzionale)</span>
            </Label>
            <Textarea
              id="note"
              placeholder="es. Ho bisogno di un'auto sostitutiva, preferisco essere contattato su WhatsApp..."
              rows={4}
              {...register("note")}
              className={errors.note ? "border-red-500" : ""}
            />
            {errors.note && (
              <p className="text-sm text-red-500">{errors.note.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hours info */}
      <div className="bg-slate-100 rounded-xl p-4">
        <h4 className="font-medium text-slate-900 mb-2">Orari di apertura</h4>
        <div className="text-sm text-slate-600 space-y-1">
          <p>Lunedì - Venerdì: 08:00 - 12:00, 14:00 - 18:00</p>
          <p>Sabato: 08:00 - 12:00</p>
          <p>Domenica: Chiuso</p>
        </div>
      </div>
    </div>
  );
}
