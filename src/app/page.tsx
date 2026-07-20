
"use client";

import { Button } from "@/components/ui/button";
import { Shield, MapPin, Battery, Lock, ArrowRight, Smartphone } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="p-6 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Shield className="text-white w-6 h-6" />
          </div>
          <span className="font-headline font-bold text-2xl">SafeGuard</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/login?role=parent">
            <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
          </Link>
        </div>
      </nav>

      <main>
        <section className="pt-24 pb-20 px-6 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter mb-8">
            Keep Your Family <span className="text-primary italic">Connected & Secure</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Transparent location tracking, device health monitoring, and activity reports designed for trust and safety.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login?role=parent">
              <Button size="lg" className="h-14 px-8 text-lg gap-2">
                Parent Dashboard <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login?role=child">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg gap-2">
                Setup Child Device <Smartphone className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-24 px-6 bg-card/30">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 bg-card border border-white/5 rounded-3xl">
              <MapPin className="text-primary w-12 h-12 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Real-time Location</h3>
              <p className="text-muted-foreground">Precise GPS monitoring with historical movement logs to know where your loved ones are.</p>
            </div>
            <div className="p-8 bg-card border border-white/5 rounded-3xl">
              <Battery className="text-secondary w-12 h-12 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Device Health</h3>
              <p className="text-muted-foreground">Monitor battery levels and online status to ensure they always stay reachable.</p>
            </div>
            <div className="p-8 bg-card border border-white/5 rounded-3xl">
              <Lock className="text-accent w-12 h-12 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Transparent & Secure</h3>
              <p className="text-muted-foreground">No stealth tracking. Children are notified when monitoring is active, fostering mutual trust.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
