import { useState } from 'react';
import {
  Camera,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Shield,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import type {
  CheckinFormData,
  RepairType,
  Photo,
} from '../../types';
import { submitCheckinMock, uploadPhotosMock } from '../../lib/api';
import { clsx } from 'clsx';

const TOTAL_STEPS = 9;

interface FormErrors {
  [key: string]: string;
}

/**
 * Premium check-in wizard component
 * Dark theme with gold accents
 */
export function CheckinWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [trackingCode, setTrackingCode] = useState<string>('');

  // Form data
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [repairType, setRepairType] = useState<RepairType | ''>('');
  const [insuranceCompany, setInsuranceCompany] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 2:
        if (!vehiclePlate.trim()) {
          newErrors.vehiclePlate = 'Targa obbligatoria';
        } else if (!/^[A-Z]{2}[0-9]{3}[A-Z]{2}$/i.test(vehiclePlate.replace(/\s/g, ''))) {
          newErrors.vehiclePlate = 'Formato targa non valido (es. AB123CD)';
        }
        break;

      case 3:
        if (!repairType) {
          newErrors.repairType = 'Seleziona il tipo di intervento';
        }
        break;

      case 4:
        if (repairType === 'sinistro') {
          if (!insuranceCompany.trim()) {
            newErrors.insuranceCompany = 'Compagnia assicurativa obbligatoria';
          }
          if (!policyNumber.trim()) {
            newErrors.policyNumber = 'Numero polizza obbligatorio';
          }
        }
        break;

      case 5:
        if (photos.length === 0) {
          newErrors.photos = 'Carica almeno una foto';
        }
        break;

      case 6:
        if (!customerName.trim()) {
          newErrors.customerName = 'Nome obbligatorio';
        }
        if (!customerPhone.trim()) {
          newErrors.customerPhone = 'Telefono obbligatorio';
        } else if (!/^[\d\s+()-]+$/.test(customerPhone)) {
          newErrors.customerPhone = 'Numero di telefono non valido';
        }
        if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
          newErrors.customerEmail = 'Email non valida';
        }
        break;

      case 7:
        if (!preferredDate) {
          newErrors.preferredDate = 'Seleziona una data';
        }
        if (!preferredTime) {
          newErrors.preferredTime = 'Seleziona un orario';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3 && repairType !== 'sinistro') {
        setCurrentStep(5);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 5 && repairType !== 'sinistro') {
      setCurrentStep(3);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const uploadedPhotos = await uploadPhotosMock(files);
      const newPhotos: Photo[] = files.map((file, index) => ({
        type: 'detail',
        url: uploadedPhotos[index].url,
        thumbnailUrl: uploadedPhotos[index].thumbnailUrl,
        file,
      }));
      setPhotos([...photos, ...newPhotos]);
      setErrors({ ...errors, photos: '' });
    } catch (error) {
      setErrors({ ...errors, photos: 'Errore durante il caricamento' });
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateStep(8)) return;

    setIsSubmitting(true);
    try {
      const formData: CheckinFormData = {
        customer: {
          name: customerName,
          phone: customerPhone,
          email: customerEmail || undefined,
        },
        vehicle: {
          plate: vehiclePlate,
          brand: vehicleBrand || undefined,
          model: vehicleModel || undefined,
        },
        repair: {
          type: repairType as RepairType,
          status: 'pending',
          photos,
          preferredDate,
          preferredTime,
          insuranceInfo:
            repairType === 'sinistro'
              ? {
                  company: insuranceCompany,
                  policyNumber,
                }
              : undefined,
        },
      };

      const response = await submitCheckinMock(formData);
      setTrackingCode(response.trackingCode);
      setCurrentStep(9);
    } catch (error) {
      setErrors({ submit: 'Errore durante linvio. Riprova.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressBar = () => {
    const progress = (currentStep / TOTAL_STEPS) * 100;
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">
            Passo {currentStep} di {TOTAL_STEPS}
          </span>
          <span className="text-xs text-gold-500 font-semibold tracking-wider">
            CARROZZERIA FAGIOLI
          </span>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center py-8 animate-fade-in">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center shadow-gold-lg animate-float">
                <Car className="w-12 h-12 text-slate-900" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Benvenuto!
            </h1>
            <p className="text-lg text-slate-300 mb-8">
              Pre-check-in online per Carrozzeria Fagioli. Compila il modulo e
              riceverai un codice per tracciare il tuo veicolo.
            </p>
            <Button onClick={handleNext} size="lg" fullWidth>
              Inizia
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-gold-500">Dati Veicolo</CardTitle>
              <p className="text-sm text-slate-400 mt-2">
                Inserisci i dati del tuo veicolo
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Targa"
                required
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                error={errors.vehiclePlate}
                placeholder="AB123CD"
                maxLength={7}
              />
              <Input
                label="Marca"
                value={vehicleBrand}
                onChange={(e) => setVehicleBrand(e.target.value)}
                placeholder="Es. Fiat, BMW, Mercedes"
                helperText="Opzionale - il sistema tenterà di rilevarlo automaticamente"
              />
              <Input
                label="Modello"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="Es. 500, Serie 3, Classe A"
                helperText="Opzionale"
              />
            </CardContent>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-gold-500">Tipo di Intervento</CardTitle>
              <p className="text-sm text-slate-400 mt-2">
                Seleziona il tipo di riparazione necessaria
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  value: 'sinistro',
                  label: 'Sinistro',
                  description: 'Danni da incidente con assicurazione',
                  icon: Shield,
                },
                {
                  value: 'estetica',
                  label: 'Estetica',
                  description: 'Riparazioni estetiche e carrozzeria',
                  icon: Car,
                },
                {
                  value: 'meccanica',
                  label: 'Meccanica',
                  description: 'Riparazioni meccaniche generali',
                  icon: FileText,
                },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setRepairType(option.value as RepairType)}
                  className={clsx(
                    'w-full p-4 rounded-xl border-2 text-left transition-all duration-300',
                    'hover:border-gold-500/50 hover:bg-slate-700/50',
                    'focus:outline-none focus:ring-2 focus:ring-gold-500',
                    repairType === option.value
                      ? 'border-gold-500 bg-gold-500/10 shadow-gold'
                      : 'border-slate-700 bg-slate-800'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <option.icon
                      className={clsx(
                        'w-6 h-6 mt-0.5 transition-colors',
                        repairType === option.value
                          ? 'text-gold-500'
                          : 'text-slate-500'
                      )}
                    />
                    <div className="flex-1">
                      <div className={clsx(
                        'font-semibold',
                        repairType === option.value ? 'text-gold-500' : 'text-white'
                      )}>
                        {option.label}
                      </div>
                      <div className="text-sm text-slate-400 mt-1">
                        {option.description}
                      </div>
                    </div>
                    {repairType === option.value && (
                      <Check className="w-5 h-5 text-gold-500" />
                    )}
                  </div>
                </button>
              ))}
              {errors.repairType && (
                <p className="text-sm text-error-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.repairType}
                </p>
              )}
            </CardContent>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-gold-500">Dati Assicurazione</CardTitle>
              <p className="text-sm text-slate-400 mt-2">
                Inserisci i dati della tua assicurazione
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Compagnia Assicurativa"
                required
                value={insuranceCompany}
                onChange={(e) => setInsuranceCompany(e.target.value)}
                error={errors.insuranceCompany}
                placeholder="Es. Generali, Allianz, UnipolSai"
              />
              <Input
                label="Numero Polizza"
                required
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
                error={errors.policyNumber}
                placeholder="123456789"
              />
            </CardContent>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-gold-500">Foto del Veicolo</CardTitle>
              <p className="text-sm text-slate-400 mt-2">
                Carica almeno una foto del danno o del veicolo
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={photo.url}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border border-slate-700"
                    />
                    <button
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-error-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-600 focus:outline-none focus:ring-2 focus:ring-error-500"
                      aria-label="Rimuovi foto"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-gold-500 hover:bg-slate-700/50 cursor-pointer transition-all duration-300">
                  <Camera className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-300">
                    Tocca per caricare foto
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    PNG, JPG fino a 10MB
                  </p>
                </div>
              </label>
              {errors.photos && (
                <p className="text-sm text-error-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.photos}
                </p>
              )}
            </CardContent>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-gold-500">I Tuoi Dati</CardTitle>
              <p className="text-sm text-slate-400 mt-2">
                Come possiamo contattarti?
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Nome e Cognome"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                error={errors.customerName}
                placeholder="Mario Rossi"
              />
              <Input
                label="Telefono"
                required
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                error={errors.customerPhone}
                placeholder="+39 333 1234567"
              />
              <Input
                label="Email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                error={errors.customerEmail}
                placeholder="tua@email.it"
                helperText="Opzionale - riceverai aggiornamenti via email"
              />
            </CardContent>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-gold-500">Appuntamento Preferito</CardTitle>
              <p className="text-sm text-slate-400 mt-2">
                Quando preferisci portare il veicolo?
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Data"
                required
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                error={errors.preferredDate}
                min={new Date().toISOString().split('T')[0]}
              />
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Orario <span className="text-gold-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(
                    (time) => (
                      <button
                        key={time}
                        onClick={() => setPreferredTime(time)}
                        className={clsx(
                          'p-3 rounded-lg border-2 font-medium transition-all duration-300',
                          'hover:border-gold-500/50 hover:bg-slate-700/50',
                          'focus:outline-none focus:ring-2 focus:ring-gold-500',
                          preferredTime === time
                            ? 'border-gold-500 bg-gold-500/10 text-gold-500'
                            : 'border-slate-700 text-slate-300 bg-slate-800'
                        )}
                      >
                        {time}
                      </button>
                    )
                  )}
                </div>
                {errors.preferredTime && (
                  <p className="mt-1.5 text-sm text-error-400">
                    {errors.preferredTime}
                  </p>
                )}
              </div>
            </CardContent>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-gold-500">Riepilogo</CardTitle>
              <p className="text-sm text-slate-400 mt-2">
                Verifica i dati prima di inviare
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="pb-3 border-b border-slate-700">
                  <h3 className="text-sm font-semibold text-slate-400 mb-2">
                    Veicolo
                  </h3>
                  <p className="text-white font-medium">{vehiclePlate}</p>
                  {vehicleBrand && (
                    <p className="text-sm text-slate-400">
                      {vehicleBrand} {vehicleModel}
                    </p>
                  )}
                </div>

                <div className="pb-3 border-b border-slate-700">
                  <h3 className="text-sm font-semibold text-slate-400 mb-2">
                    Tipo di Intervento
                  </h3>
                  <p className="text-white capitalize">{repairType}</p>
                </div>

                {repairType === 'sinistro' && (
                  <div className="pb-3 border-b border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-400 mb-2">
                      Assicurazione
                    </h3>
                    <p className="text-white">{insuranceCompany}</p>
                    <p className="text-sm text-slate-400">
                      Polizza: {policyNumber}
                    </p>
                  </div>
                )}

                <div className="pb-3 border-b border-slate-700">
                  <h3 className="text-sm font-semibold text-slate-400 mb-2">
                    Foto
                  </h3>
                  <p className="text-white">{photos.length} foto caricate</p>
                </div>

                <div className="pb-3 border-b border-slate-700">
                  <h3 className="text-sm font-semibold text-slate-400 mb-2">
                    Contatti
                  </h3>
                  <p className="text-white">{customerName}</p>
                  <p className="text-sm text-slate-400">{customerPhone}</p>
                  {customerEmail && (
                    <p className="text-sm text-slate-400">{customerEmail}</p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-400 mb-2">
                    Appuntamento
                  </h3>
                  <p className="text-white">
                    {new Date(preferredDate).toLocaleDateString('it-IT', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}{' '}
                    ore {preferredTime}
                  </p>
                </div>
              </div>

              {errors.submit && (
                <p className="text-sm text-error-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.submit}
                </p>
              )}
            </CardContent>
          </div>
        );

      case 9:
        return (
          <div className="text-center py-8 animate-scale-in">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-success-400 to-success-600 rounded-full flex items-center justify-center shadow-lg animate-glow-pulse">
                <Check className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Check-in Completato!
            </h1>
            <p className="text-lg text-slate-300 mb-8">
              Grazie per aver completato il pre-check-in. Ti contatteremo a
              breve per confermare l'appuntamento.
            </p>

            <Card variant="bordered" className="mb-6 border-gold-500/50 bg-gold-500/5">
              <CardContent className="py-6">
                <p className="text-sm text-slate-400 mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-500" />
                  Il tuo codice di tracciamento
                </p>
                <p className="text-3xl font-bold text-gold-500 tracking-wider font-mono">
                  {trackingCode}
                </p>
              </CardContent>
            </Card>

            <Button
              onClick={() => {
                window.location.href = `/track/${trackingCode}`;
              }}
              size="lg"
              fullWidth
              className="mb-3"
            >
              Traccia il tuo veicolo
              <ExternalLink className="ml-2 w-5 h-5" />
            </Button>

            <Button
              onClick={() => window.location.reload()}
              size="lg"
              fullWidth
              variant="ghost"
            >
              Nuovo Check-in
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {renderProgressBar()}

      <div className="pt-20 pb-8 px-4">
        <div className="max-w-md mx-auto">
          <Card variant="glass" padding="lg">{renderStep()}</Card>

          {currentStep > 1 && currentStep < 9 && (
            <div className="mt-6 flex gap-3">
              <Button
                onClick={handleBack}
                variant="secondary"
                size="lg"
                className="flex-1"
              >
                <ChevronLeft className="mr-2 w-5 h-5" />
                Indietro
              </Button>
              {currentStep === 8 ? (
                <Button
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  size="lg"
                  className="flex-1"
                >
                  Invia
                  <Check className="ml-2 w-5 h-5" />
                </Button>
              ) : (
                <Button onClick={handleNext} size="lg" className="flex-1">
                  Avanti
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
