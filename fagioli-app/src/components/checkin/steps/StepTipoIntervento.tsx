"use client";

import { useFormContext } from "react-hook-form";
import { AlertTriangle, Sparkles, Wrench } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import type { CheckinFormData } from "@/lib/validations/checkin";

const TIPI_INTERVENTO = [
  {
    value: "SINISTRO",
    label: "Sinistro / Incidente",
    description: "Danni da incidente stradale con o senza controparte",
    icon: AlertTriangle,
    color: "border-red-200 bg-red-50 hover:border-red-400",
    selectedColor: "border-red-500 bg-red-100 ring-2 ring-red-500",
    iconColor: "text-red-600",
  },
  {
    value: "ESTETICO",
    label: "Riparazione estetica",
    description: "Graffi, ammaccature, botte da parcheggio, grandine",
    icon: Sparkles,
    color: "border-blue-200 bg-blue-50 hover:border-blue-400",
    selectedColor: "border-blue-500 bg-blue-100 ring-2 ring-blue-500",
    iconColor: "text-blue-600",
  },
  {
    value: "MECCANICA",
    label: "Meccanica",
    description: "Problemi meccanici, tagliandi, manutenzione",
    icon: Wrench,
    color: "border-orange-200 bg-orange-50 hover:border-orange-400",
    selectedColor: "border-orange-500 bg-orange-100 ring-2 ring-orange-500",
    iconColor: "text-orange-600",
  },
] as const;

export function StepTipoIntervento() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CheckinFormData>();

  const selectedTipo = watch("tipo");

  return (
    <div className="space-y-6">
      {/* Tipo intervento cards */}
      <div className="space-y-3">
        {TIPI_INTERVENTO.map((tipo) => {
          const Icon = tipo.icon;
          const isSelected = selectedTipo === tipo.value;

          return (
            <button
              key={tipo.value}
              type="button"
              onClick={() => setValue("tipo", tipo.value as "SINISTRO" | "ESTETICO" | "MECCANICA", { shouldValidate: true })}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                isSelected ? tipo.selectedColor : tipo.color
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-full ${
                    isSelected ? "bg-white" : "bg-white/60"
                  }`}
                >
                  <Icon className={`w-6 h-6 ${tipo.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{tipo.label}</h3>
                  <p className="text-sm text-slate-600 mt-0.5">
                    {tipo.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {errors.tipo && (
        <p className="text-sm text-red-500 text-center">{errors.tipo.message}</p>
      )}

      {/* Descrizione */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-2">
            <Label htmlFor="descrizione">
              Descrivi brevemente il problema{" "}
              <span className="text-slate-400">(opzionale)</span>
            </Label>
            <Textarea
              id="descrizione"
              placeholder="es. Ammaccatura sulla portiera destra, graffio sul paraurti anteriore..."
              rows={4}
              {...register("descrizione")}
              className={errors.descrizione ? "border-red-500" : ""}
            />
            {errors.descrizione && (
              <p className="text-sm text-red-500">{errors.descrizione.message}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
