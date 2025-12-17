"use client";

import { useFormContext } from "react-hook-form";
import { Car, Palette } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CheckinFormData } from "@/lib/validations/checkin";

const MARCHE_AUTO = [
  "Alfa Romeo",
  "Audi",
  "BMW",
  "Citroen",
  "Dacia",
  "Fiat",
  "Ford",
  "Honda",
  "Hyundai",
  "Jeep",
  "Kia",
  "Lancia",
  "Land Rover",
  "Mazda",
  "Mercedes-Benz",
  "Mini",
  "Nissan",
  "Opel",
  "Peugeot",
  "Renault",
  "Seat",
  "Skoda",
  "Smart",
  "Suzuki",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
  "Altro",
];

export function StepDatiVeicolo() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CheckinFormData>();

  const marca = watch("marca");

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6 space-y-5">
        {/* Targa */}
        <div className="space-y-2">
          <Label htmlFor="targa" className="flex items-center gap-2">
            <Car className="w-4 h-4 text-slate-500" />
            Targa *
          </Label>
          <Input
            id="targa"
            placeholder="AB123CD"
            autoCapitalize="characters"
            {...register("targa")}
            className={`uppercase ${errors.targa ? "border-red-500" : ""}`}
          />
          {errors.targa && (
            <p className="text-sm text-red-500">{errors.targa.message}</p>
          )}
        </div>

        {/* Marca */}
        <div className="space-y-2">
          <Label htmlFor="marca" className="flex items-center gap-2">
            Marca *
          </Label>
          <Select
            value={marca}
            onValueChange={(value) => setValue("marca", value, { shouldValidate: true })}
          >
            <SelectTrigger className={errors.marca ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleziona la marca" />
            </SelectTrigger>
            <SelectContent>
              {MARCHE_AUTO.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.marca && (
            <p className="text-sm text-red-500">{errors.marca.message}</p>
          )}
        </div>

        {/* Modello */}
        <div className="space-y-2">
          <Label htmlFor="modello">Modello *</Label>
          <Input
            id="modello"
            placeholder="es. Panda, Golf, 500..."
            {...register("modello")}
            className={errors.modello ? "border-red-500" : ""}
          />
          {errors.modello && (
            <p className="text-sm text-red-500">{errors.modello.message}</p>
          )}
        </div>

        {/* Anno (opzionale) */}
        <div className="space-y-2">
          <Label htmlFor="anno">
            Anno <span className="text-slate-400">(opzionale)</span>
          </Label>
          <Input
            id="anno"
            type="number"
            placeholder="2020"
            min={1950}
            max={new Date().getFullYear() + 1}
            {...register("anno", { valueAsNumber: true })}
            className={errors.anno ? "border-red-500" : ""}
          />
          {errors.anno && (
            <p className="text-sm text-red-500">{errors.anno.message}</p>
          )}
        </div>

        {/* Colore (opzionale) */}
        <div className="space-y-2">
          <Label htmlFor="colore" className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-slate-500" />
            Colore <span className="text-slate-400">(opzionale)</span>
          </Label>
          <Input
            id="colore"
            placeholder="es. Bianco, Nero, Grigio metallizzato..."
            {...register("colore")}
          />
        </div>
      </CardContent>
    </Card>
  );
}
