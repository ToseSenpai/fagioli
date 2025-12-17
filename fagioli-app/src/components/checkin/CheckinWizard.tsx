"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  Car,
  User,
  Wrench,
  FileText,
  Camera,
  Calendar,
  ClipboardCheck,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  checkinFormSchema,
  type CheckinFormData,
} from "@/lib/validations/checkin";
import type { WizardStep, PhotoUpload } from "@/types";

import { StepDatiCliente } from "./steps/StepDatiCliente";
import { StepDatiVeicolo } from "./steps/StepDatiVeicolo";
import { StepTipoIntervento } from "./steps/StepTipoIntervento";
import { StepDatiSinistro } from "./steps/StepDatiSinistro";
import { StepFotoDanni } from "./steps/StepFotoDanni";
import { StepAppuntamento } from "./steps/StepAppuntamento";
import { StepRiepilogo } from "./steps/StepRiepilogo";
import { StepConferma } from "./steps/StepConferma";

const STEP_ICONS: Record<string, typeof User> = {
  cliente: User,
  veicolo: Car,
  tipo: Wrench,
  sinistro: FileText,
  foto: Camera,
  appuntamento: Calendar,
  riepilogo: ClipboardCheck,
};

const WIZARD_STEPS: WizardStep[] = [
  { id: "cliente", title: "I tuoi dati", description: "Nome e contatti" },
  { id: "veicolo", title: "Il veicolo", description: "Targa e modello" },
  { id: "tipo", title: "Tipo intervento", description: "Cosa dobbiamo fare?" },
  { id: "sinistro", title: "Dati sinistro", description: "Info sull'incidente" },
  { id: "foto", title: "Foto danni", description: "Mostraci i danni" },
  { id: "appuntamento", title: "Appuntamento", description: "Quando vieni?" },
  { id: "riepilogo", title: "Riepilogo", description: "Controlla i dati" },
];

export function CheckinWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [photos, setPhotos] = useState<PhotoUpload[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  const methods = useForm<CheckinFormData>({
    resolver: zodResolver(checkinFormSchema),
    defaultValues: {
      nome: "",
      cognome: "",
      telefono: "",
      email: "",
      targa: "",
      marca: "",
      modello: "",
      tipo: undefined,
      descrizione: "",
      caiCompilato: false,
      oraPreferita: undefined,
      note: "",
    },
    mode: "onChange",
  });

  const { watch, trigger } = methods;
  const tipoIntervento = watch("tipo");

  // Get actual steps (skip sinistro if not SINISTRO type)
  const getActiveSteps = () => {
    if (tipoIntervento !== "SINISTRO") {
      return WIZARD_STEPS.filter((step) => step.id !== "sinistro");
    }
    return WIZARD_STEPS;
  };

  const activeSteps = getActiveSteps();
  const totalSteps = activeSteps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Field groups for validation per step
  const stepFields: Record<string, (keyof CheckinFormData)[]> = {
    cliente: ["nome", "cognome", "telefono"],
    veicolo: ["targa", "marca", "modello"],
    tipo: ["tipo"],
    sinistro: [],
    foto: [],
    appuntamento: [],
    riepilogo: [],
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    const stepId = activeSteps[currentStep].id;
    const fields = stepFields[stepId];

    if (fields.length === 0) return true;

    const isValid = await trigger(fields);
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (data: CheckinFormData) => {
    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));

      // Append photos
      photos.forEach((photo, index) => {
        if (photo.file) {
          formData.append(`photo_${index}`, photo.file);
          formData.append(`photo_${index}_tipo`, photo.tipo);
        }
      });

      const response = await fetch("/api/checkin", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setTrackingCode(result.trackingCode);
        setIsComplete(true);
      } else {
        console.error("Submission failed:", result.error);
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const stepId = activeSteps[currentStep].id;

    switch (stepId) {
      case "cliente":
        return <StepDatiCliente />;
      case "veicolo":
        return <StepDatiVeicolo />;
      case "tipo":
        return <StepTipoIntervento />;
      case "sinistro":
        return <StepDatiSinistro />;
      case "foto":
        return <StepFotoDanni photos={photos} setPhotos={setPhotos} />;
      case "appuntamento":
        return <StepAppuntamento />;
      case "riepilogo":
        return <StepRiepilogo photos={photos} />;
      default:
        return null;
    }
  };

  if (isComplete && trackingCode) {
    return <StepConferma trackingCode={trackingCode} />;
  }

  const currentStepData = activeSteps[currentStep];
  const StepIcon = STEP_ICONS[currentStepData.id] || User;

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gradient-subtle">
        {/* Header */}
        <header className="sticky top-0 z-10 glass border-b border-border/50">
          <div className="max-w-lg mx-auto px-4 py-4">
            {/* Top row with navigation */}
            <div className="flex items-center justify-between mb-3">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Home</span>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {currentStep + 1}
                </span>
                <span className="text-muted-foreground">/</span>
                <span className="text-sm text-muted-foreground">
                  {totalSteps}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative">
              <Progress value={progress} className="h-1.5" />
              <div
                className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-primary to-orange-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </header>

        {/* Step indicator with icon */}
        <div className="max-w-lg mx-auto px-4 pt-8 pb-4">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-orange-500 rounded-2xl shadow-brand mb-4">
              <StepIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {currentStepData.title}
            </h2>
            <p className="text-muted-foreground mt-1">
              {currentStepData.description}
            </p>
          </motion.div>
        </div>

        {/* Step dots indicator */}
        <div className="max-w-lg mx-auto px-4 pb-6">
          <div className="flex items-center justify-center gap-2">
            {activeSteps.map((step, index) => (
              <div
                key={step.id}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "w-8 bg-primary"
                    : index < currentStep
                      ? "w-2 bg-primary/50"
                      : "w-2 bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form content */}
        <main className="max-w-lg mx-auto px-4 pb-32">
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </form>
        </main>

        {/* Navigation buttons - Fixed at bottom */}
        <nav className="fixed bottom-0 left-0 right-0 glass border-t border-border/50 p-4 pb-safe">
          <div className="max-w-lg mx-auto flex gap-3">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex-1 h-12 font-semibold shadow-soft"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Indietro
              </Button>
            )}

            {currentStep < totalSteps - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 h-12 font-semibold bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-brand"
              >
                Avanti
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                onClick={methods.handleSubmit(handleSubmit)}
                disabled={isSubmitting}
                className="flex-1 h-12 font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Invio in corso...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Invia richiesta
                  </>
                )}
              </Button>
            )}
          </div>
        </nav>
      </div>
    </FormProvider>
  );
}
