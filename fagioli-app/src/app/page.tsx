"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Car,
  ClipboardList,
  Search,
  ArrowRight,
  Phone,
  MapPin,
  Clock,
  Wrench,
  Paintbrush,
  Shield,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  const router = useRouter();
  const [trackingCode, setTrackingCode] = useState("");

  const handleTrackingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingCode.trim()) {
      router.push(`/track/${trackingCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        </div>

        <div className="relative max-w-lg mx-auto px-4 pt-12 pb-16 sm:pt-16 sm:pb-20">
          {/* Logo/Brand */}
          <div className="text-center mb-10 animate-slide-down">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-orange-500 rounded-2xl shadow-brand mb-5 animate-float">
              <Car className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              Carrozzeria <span className="text-gradient">Fagioli</span>
            </h1>
            <p className="text-slate-400 text-lg">
              Qualità e professionalità dal 1985
            </p>
          </div>

          {/* Main Actions */}
          <div className="space-y-4">
            {/* Pre-check-in CTA */}
            <Link href="/checkin" className="block group">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-orange-500 p-[1px] shadow-brand hover-lift">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-r from-primary to-orange-500 rounded-2xl p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <ClipboardList className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white mb-1">
                        Pre-Check-in Online
                      </h2>
                      <p className="text-white/80 text-sm">
                        Compila i dati comodamente da casa e risparmia tempo
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Tracking Search */}
            <Card className="border-0 shadow-soft-lg animate-slide-up animation-delay-100">
              <CardContent className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Search className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground text-lg">
                      Traccia la tua riparazione
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Inserisci il codice ricevuto via SMS
                    </p>
                  </div>
                </div>
                <form onSubmit={handleTrackingSubmit} className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="es. FAG-ABC123"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    className="flex-1 uppercase font-mono text-base h-12 px-4"
                  />
                  <Button
                    type="submit"
                    disabled={!trackingCode.trim()}
                    className="h-12 px-6 font-semibold"
                  >
                    Cerca
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-8 space-y-10">
        {/* Services */}
        <section className="animate-slide-up animation-delay-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">
              I nostri servizi
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: Wrench,
                title: "Riparazioni",
                desc: "Carrozzeria e meccanica",
                color: "bg-blue-500",
                bgColor: "bg-blue-50",
              },
              {
                icon: Paintbrush,
                title: "Verniciatura",
                desc: "Finitura professionale",
                color: "bg-purple-500",
                bgColor: "bg-purple-50",
              },
              {
                icon: Shield,
                title: "Sinistri",
                desc: "Gestione pratiche",
                color: "bg-red-500",
                bgColor: "bg-red-50",
              },
              {
                icon: Sparkles,
                title: "Estetica",
                desc: "Graffi e ammaccature",
                color: "bg-amber-500",
                bgColor: "bg-amber-50",
              },
            ].map((service, index) => (
              <Card
                key={service.title}
                className="border-0 shadow-soft hover-lift cursor-pointer group animate-scale-in"
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
              >
                <CardContent className="p-5">
                  <div
                    className={`w-12 h-12 ${service.bgColor} rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}
                  >
                    <service.icon
                      className={`w-6 h-6 text-${service.color.replace("bg-", "").replace("-500", "-600")}`}
                      style={{
                        color: service.color
                          .replace("bg-", "")
                          .includes("blue")
                          ? "#2563eb"
                          : service.color.replace("bg-", "").includes("purple")
                            ? "#9333ea"
                            : service.color.replace("bg-", "").includes("red")
                              ? "#dc2626"
                              : "#d97706",
                      }}
                    />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">
                    {service.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Info */}
        <section className="animate-slide-up animation-delay-300">
          <h3 className="text-xl font-bold text-foreground mb-6">Contatti</h3>

          <div className="space-y-3">
            {/* Phone */}
            <a
              href="tel:+390123456789"
              className="flex items-center gap-4 p-4 bg-card rounded-2xl shadow-soft hover-lift group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Chiamaci</p>
                <p className="text-muted-foreground">0123 456 789</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
            </a>

            {/* Address */}
            <a
              href="https://maps.google.com/?q=Carrozzeria+Fagioli"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-card rounded-2xl shadow-soft hover-lift group"
            >
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Vieni a trovarci</p>
                <p className="text-muted-foreground">Via Roma 123, Milano</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
            </a>

            {/* Hours */}
            <div className="flex items-center gap-4 p-4 bg-card rounded-2xl shadow-soft">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Orari</p>
                <p className="text-muted-foreground">
                  Lun-Ven 08:00-18:00 • Sab 08:00-12:00
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Staff Access - Hidden link */}
        <section className="pt-4">
          <Link
            href="/staff/login"
            className="block text-center text-sm text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            Accesso Staff
          </Link>
        </section>

        {/* Footer */}
        <footer className="pt-6 pb-8 text-center border-t border-border">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Carrozzeria Fagioli
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Tutti i diritti riservati
          </p>
        </footer>
      </main>
    </div>
  );
}
