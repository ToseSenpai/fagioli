"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Car,
  Search,
  RefreshCw,
  Filter,
  ChevronRight,
  Calendar,
  User,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATI_PRATICA, STATI_ORDER } from "@/types";
import type { StatoPratica, TipoIntervento } from "@/types";

interface Pratica {
  id: string;
  trackingCode: string;
  tipo: TipoIntervento;
  statoCorrente: StatoPratica;
  dataConsegnaPrevista: string | null;
  createdAt: string;
  veicolo: {
    targa: string;
    marca: string;
    modello: string;
  };
  cliente: {
    nome: string;
    cognome: string;
    telefono: string;
  };
}

function PraticheContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pratiche, setPratiche] = useState<Pratica[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statoFilter, setStatoFilter] = useState<string>(
    searchParams.get("stato") || "all"
  );

  const fetchPratiche = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statoFilter && statoFilter !== "all") {
        params.set("stato", statoFilter);
      }
      if (searchQuery) {
        params.set("search", searchQuery);
      }

      const res = await fetch(`/api/staff/pratiche?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPratiche(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch pratiche:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check login
    const isLoggedIn = localStorage.getItem("staff_logged_in");
    if (!isLoggedIn) {
      window.location.href = "/staff/login";
      return;
    }
    fetchPratiche();
  }, [statoFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPratiche();
  };

  const handleStatoChange = (value: string) => {
    setStatoFilter(value);
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("stato");
    } else {
      params.set("stato", value);
    }
    router.push(`/staff/pratiche?${params.toString()}`);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getTipoLabel = (tipo: TipoIntervento) => {
    switch (tipo) {
      case "SINISTRO":
        return { label: "Sinistro", color: "bg-red-100 text-red-700" };
      case "ESTETICO":
        return { label: "Estetico", color: "bg-blue-100 text-blue-700" };
      case "MECCANICA":
        return { label: "Meccanica", color: "bg-orange-100 text-orange-700" };
      default:
        return { label: tipo, color: "bg-slate-100 text-slate-700" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pratiche</h1>
        <p className="text-slate-500">Gestisci tutte le pratiche</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Cerca per targa, nome, tracking..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" variant="secondary">
                Cerca
              </Button>
            </form>

            {/* Status filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <Select value={statoFilter} onValueChange={handleStatoChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtra per stato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti gli stati</SelectItem>
                  {STATI_ORDER.map((stato) => (
                    <SelectItem key={stato} value={stato}>
                      {STATI_PRATICA[stato].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Refresh */}
            <Button
              variant="outline"
              onClick={() => fetchPratiche()}
              disabled={isLoading}
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pratiche list */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
        </div>
      ) : pratiche.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Car className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Nessuna pratica trovata</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {pratiche.map((pratica) => {
            const statoConfig = STATI_PRATICA[pratica.statoCorrente];
            const tipoConfig = getTipoLabel(pratica.tipo);

            return (
              <Link key={pratica.id} href={`/staff/pratiche/${pratica.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Vehicle icon */}
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Car className="w-6 h-6 text-slate-600" />
                      </div>

                      {/* Main info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-900">
                            {pratica.veicolo.marca} {pratica.veicolo.modello}
                          </span>
                          <span className="text-sm font-mono text-slate-500">
                            {pratica.veicolo.targa}
                          </span>
                          <Badge
                            variant="secondary"
                            className={tipoConfig.color}
                          >
                            {tipoConfig.label}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {pratica.cliente.nome} {pratica.cliente.cognome}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(pratica.createdAt)}
                          </span>
                          <span className="font-mono text-xs">
                            {pratica.trackingCode}
                          </span>
                        </div>
                      </div>

                      {/* Status badge */}
                      <Badge
                        className={`${statoConfig.color} text-white border-0 whitespace-nowrap`}
                      >
                        {statoConfig.label}
                      </Badge>

                      {/* Arrow */}
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PratichePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
        </div>
      }
    >
      <PraticheContent />
    </Suspense>
  );
}
