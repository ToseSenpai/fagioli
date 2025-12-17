"use client";

import { useFormContext } from "react-hook-form";
import { Calendar, MapPin, FileText, Shield, Car } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CheckinFormData } from "@/lib/validations/checkin";

export function StepDatiSinistro() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CheckinFormData>();

  const caiCompilato = watch("caiCompilato");

  return (
    <div className="space-y-4">
      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Queste informazioni sono opzionali</strong> ma ci aiutano a
          velocizzare la pratica con l&apos;assicurazione.
        </p>
      </div>

      {/* Dati incidente */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Dati dell&apos;incidente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Data incidente */}
          <div className="space-y-2">
            <Label htmlFor="dataIncidente" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              Data incidente
            </Label>
            <Input
              id="dataIncidente"
              type="date"
              max={new Date().toISOString().split("T")[0]}
              {...register("dataIncidente")}
            />
          </div>

          {/* Luogo incidente */}
          <div className="space-y-2">
            <Label htmlFor="luogoIncidente" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              Luogo incidente
            </Label>
            <Input
              id="luogoIncidente"
              placeholder="es. Via Roma 123, Milano"
              {...register("luogoIncidente")}
            />
          </div>

          {/* CAI compilato */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              Hai compilato il CAI/CID (constatazione amichevole)?
            </Label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setValue("caiCompilato", true)}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  caiCompilato === true
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                Sì
              </button>
              <button
                type="button"
                onClick={() => setValue("caiCompilato", false)}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  caiCompilato === false
                    ? "border-slate-500 bg-slate-50 text-slate-700"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                No
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Se hai il CAI/CID, potrai fotografarlo nel prossimo step
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Dati controparte */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Car className="w-5 h-5" />
            Controparte
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="controparteNome">Nome controparte</Label>
            <Input
              id="controparteNome"
              placeholder="es. Mario Bianchi"
              {...register("controparteNome")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="controparteTarga">Targa controparte</Label>
            <Input
              id="controparteTarga"
              placeholder="es. CD456EF"
              className="uppercase"
              {...register("controparteTarga")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dati assicurazione */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            La tua assicurazione
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assicurazione">Compagnia assicurativa</Label>
            <Input
              id="assicurazione"
              placeholder="es. Generali, Allianz, UnipolSai..."
              {...register("assicurazione")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numeroPolizza">Numero polizza</Label>
            <Input
              id="numeroPolizza"
              placeholder="es. 123456789"
              {...register("numeroPolizza")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
