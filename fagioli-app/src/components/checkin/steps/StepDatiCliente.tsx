"use client";

import { useFormContext } from "react-hook-form";
import { User, Phone, Mail } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import type { CheckinFormData } from "@/lib/validations/checkin";

export function StepDatiCliente() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CheckinFormData>();

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6 space-y-5">
        {/* Nome */}
        <div className="space-y-2">
          <Label htmlFor="nome" className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-500" />
            Nome *
          </Label>
          <Input
            id="nome"
            placeholder="Mario"
            autoComplete="given-name"
            {...register("nome")}
            className={errors.nome ? "border-red-500" : ""}
          />
          {errors.nome && (
            <p className="text-sm text-red-500">{errors.nome.message}</p>
          )}
        </div>

        {/* Cognome */}
        <div className="space-y-2">
          <Label htmlFor="cognome" className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-500" />
            Cognome *
          </Label>
          <Input
            id="cognome"
            placeholder="Rossi"
            autoComplete="family-name"
            {...register("cognome")}
            className={errors.cognome ? "border-red-500" : ""}
          />
          {errors.cognome && (
            <p className="text-sm text-red-500">{errors.cognome.message}</p>
          )}
        </div>

        {/* Telefono */}
        <div className="space-y-2">
          <Label htmlFor="telefono" className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-500" />
            Telefono *
          </Label>
          <Input
            id="telefono"
            type="tel"
            placeholder="333 1234567"
            autoComplete="tel"
            {...register("telefono")}
            className={errors.telefono ? "border-red-500" : ""}
          />
          {errors.telefono && (
            <p className="text-sm text-red-500">{errors.telefono.message}</p>
          )}
          <p className="text-xs text-slate-500">
            Ti contatteremo su questo numero per conferme e aggiornamenti
          </p>
        </div>

        {/* Email (opzionale) */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-500" />
            Email <span className="text-slate-400">(opzionale)</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="mario.rossi@email.com"
            autoComplete="email"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
