"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Car,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  Clock,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { STATI_PRATICA } from "@/types";
import type { StatoPratica } from "@/types";

interface DashboardStats {
  totale: number;
  preCheckin: number;
  inLavorazione: number;
  pronte: number;
  recentPratiche: {
    id: string;
    trackingCode: string;
    statoCorrente: StatoPratica;
    veicolo: {
      targa: string;
      marca: string;
      modello: string;
    };
    cliente: {
      nome: string;
      cognome: string;
    };
    createdAt: string;
  }[];
}

export default function StaffDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const res = await fetch("/api/staff/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("staff_logged_in");
    if (!isLoggedIn) {
      window.location.href = "/staff/login";
      return;
    }
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <RefreshCw className="w-6 h-6 text-white animate-spin" />
          </div>
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Pre-Check-in",
      value: stats?.preCheckin || 0,
      description: "In attesa di accettazione",
      icon: ClipboardList,
      gradient: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      href: "/staff/pratiche?stato=PRE_CHECKIN",
    },
    {
      title: "In Lavorazione",
      value: stats?.inLavorazione || 0,
      description: "Lavori in corso",
      icon: Wrench,
      gradient: "from-orange-500 to-amber-500",
      bgLight: "bg-orange-50",
      href: "/staff/pratiche?stato=IN_LAVORAZIONE",
    },
    {
      title: "Pronte",
      value: stats?.pronte || 0,
      description: "Da ritirare",
      icon: CheckCircle,
      gradient: "from-emerald-500 to-emerald-600",
      bgLight: "bg-emerald-50",
      href: "/staff/pratiche?stato=PRONTO",
    },
    {
      title: "Totale Attive",
      value: stats?.totale || 0,
      description: "Pratiche non consegnate",
      icon: Car,
      gradient: "from-slate-700 to-slate-800",
      bgLight: "bg-slate-100",
      href: "/staff/pratiche",
    },
  ];

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}min fa`;
    if (diffHours < 24) return `${diffHours}h fa`;
    return `${diffDays}g fa`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Panoramica delle pratiche
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => fetchStats(true)}
          disabled={isRefreshing}
          className="shadow-soft"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Aggiorna
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card
                className="border-0 shadow-soft hover-lift cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-4xl font-bold text-foreground mt-2">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1.5">
                        {stat.description}
                      </p>
                    </div>
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Alert for pre-checkin */}
      {(stats?.preCheckin || 0) > 0 && (
        <Card className="border-0 shadow-soft bg-gradient-to-r from-blue-50 to-indigo-50 animate-slide-up">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-blue-900">
                {stats?.preCheckin} nuov{stats?.preCheckin === 1 ? "a" : "e"}{" "}
                richiest{stats?.preCheckin === 1 ? "a" : "e"} di pre-check-in
              </p>
              <p className="text-sm text-blue-700/80">
                Clienti in attesa di conferma appuntamento
              </p>
            </div>
            <Link href="/staff/pratiche?stato=PRE_CHECKIN">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                Gestisci
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Recent pratiche */}
      <Card className="border-0 shadow-soft-lg animate-slide-up animation-delay-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-lg font-bold">Pratiche Recenti</CardTitle>
            </div>
            <Link href="/staff/pratiche">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Vedi tutte
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {stats?.recentPratiche && stats.recentPratiche.length > 0 ? (
            <div className="space-y-2">
              {stats.recentPratiche.map((pratica, index) => {
                const statoConfig = STATI_PRATICA[pratica.statoCorrente];
                return (
                  <Link
                    key={pratica.id}
                    href={`/staff/pratiche/${pratica.id}`}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-all group animate-slide-up"
                    style={{ animationDelay: `${(index + 3) * 100}ms` }}
                  >
                    <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Car className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {pratica.veicolo.marca} {pratica.veicolo.modello}
                        </span>
                        <span className="text-sm text-muted-foreground font-mono">
                          {pratica.veicolo.targa}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm text-muted-foreground">
                          {pratica.cliente.nome} {pratica.cliente.cognome}
                        </span>
                        <span className="text-muted-foreground/50">•</span>
                        <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(pratica.createdAt)}
                        </span>
                      </div>
                    </div>
                    <Badge
                      className={`${statoConfig.color} text-white border-0 whitespace-nowrap shadow-sm`}
                    >
                      {statoConfig.label}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Nessuna pratica recente</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
