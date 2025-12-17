"use client";

import { useRef, useState } from "react";
import { Camera, X, Plus, ImageIcon, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PhotoUpload, TipoFoto } from "@/types";

const FOTO_GUIDATE: { tipo: TipoFoto; label: string; hint: string }[] = [
  {
    tipo: "FRONTE",
    label: "Fronte",
    hint: "Foto frontale del veicolo",
  },
  {
    tipo: "RETRO",
    label: "Retro",
    hint: "Foto posteriore del veicolo",
  },
  {
    tipo: "LATO_SINISTRO",
    label: "Lato sinistro",
    hint: "Lato guidatore",
  },
  {
    tipo: "LATO_DESTRO",
    label: "Lato destro",
    hint: "Lato passeggero",
  },
  {
    tipo: "DETTAGLIO_DANNO",
    label: "Dettaglio danno",
    hint: "Foto ravvicinata del danno",
  },
];

interface StepFotoDanniProps {
  photos: PhotoUpload[];
  setPhotos: React.Dispatch<React.SetStateAction<PhotoUpload[]>>;
}

export function StepFotoDanni({ photos, setPhotos }: StepFotoDanniProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentTipo, setCurrentTipo] = useState<TipoFoto>("DETTAGLIO_DANNO");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const preview = event.target?.result as string;
          setPhotos((prev) => [
            ...prev,
            { file, preview, tipo: currentTipo },
          ]);
        };
        reader.readAsDataURL(file);
      }
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddPhoto = (tipo: TipoFoto) => {
    setCurrentTipo(tipo);
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const getPhotosForTipo = (tipo: TipoFoto) => {
    return photos.filter((p) => p.tipo === tipo);
  };

  return (
    <div className="space-y-6">
      {/* Info box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-amber-800">
            <strong>Le foto ci aiutano a preparare il preventivo.</strong>
          </p>
          <p className="text-sm text-amber-700 mt-1">
            Scatta foto chiare con buona luce. Più dettagli = preventivo più
            preciso!
          </p>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        multiple
      />

      {/* Photo grid for guided photos */}
      <div className="space-y-4">
        {FOTO_GUIDATE.map((fotoGuida) => {
          const fotosOfType = getPhotosForTipo(fotoGuida.tipo);
          const hasPhoto = fotosOfType.length > 0;

          return (
            <Card
              key={fotoGuida.tipo}
              className={`border-2 transition-all ${
                hasPhoto
                  ? "border-emerald-300 bg-emerald-50/50"
                  : "border-dashed border-slate-300"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-slate-900">
                      {fotoGuida.label}
                    </h3>
                    <p className="text-xs text-slate-500">{fotoGuida.hint}</p>
                  </div>
                  {hasPhoto && (
                    <span className="text-xs text-emerald-600 font-medium">
                      {fotosOfType.length} foto
                    </span>
                  )}
                </div>

                {/* Photo preview grid */}
                {hasPhoto && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {fotosOfType.map((photo, idx) => {
                      const globalIndex = photos.findIndex((p) => p === photo);
                      return (
                        <div key={idx} className="relative aspect-square">
                          <img
                            src={photo.preview}
                            alt={`${fotoGuida.label} ${idx + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(globalIndex)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add photo button */}
                <Button
                  type="button"
                  variant={hasPhoto ? "outline" : "default"}
                  onClick={() => handleAddPhoto(fotoGuida.tipo)}
                  className={`w-full ${
                    hasPhoto
                      ? ""
                      : "bg-slate-900 hover:bg-slate-800"
                  }`}
                >
                  {hasPhoto ? (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Aggiungi altra foto
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Scatta foto
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CAI/Documenti section */}
      <Card className="border-2 border-dashed border-slate-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-medium text-slate-900">CAI / Documenti</h3>
              <p className="text-xs text-slate-500">
                Modulo CAI/CID, preventivi, altri documenti
              </p>
            </div>
            {getPhotosForTipo("CAI").length > 0 && (
              <span className="text-xs text-emerald-600 font-medium">
                {getPhotosForTipo("CAI").length} doc
              </span>
            )}
          </div>

          {/* Document preview */}
          {getPhotosForTipo("CAI").length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {getPhotosForTipo("CAI").map((photo, idx) => {
                const globalIndex = photos.findIndex((p) => p === photo);
                return (
                  <div key={idx} className="relative aspect-square">
                    <img
                      src={photo.preview}
                      alt={`Documento ${idx + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(globalIndex)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => handleAddPhoto("CAI")}
            className="w-full"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Carica documento
          </Button>
        </CardContent>
      </Card>

      {/* Photo count summary */}
      <div className="text-center">
        <p className="text-sm text-slate-600">
          {photos.length === 0 ? (
            <span className="text-amber-600">
              Nessuna foto caricata. Aggiungi almeno una foto del danno.
            </span>
          ) : (
            <span className="text-emerald-600">
              {photos.length} {photos.length === 1 ? "foto caricata" : "foto caricate"}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
