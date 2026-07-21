"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, MapPin, Lock, ArrowRight, Download, CheckCircle2, Activity } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

/**
 * @fileOverview SafeGuard Landing Page.
 * Acts as the primary funnel for the monitoring service.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="pt-40 pb-20 px-6 text-center max-w-5xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -z-10" />
          
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in-up">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">SafeGuard Enterprise v2.9</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-bold font-headline tracking-tighter mb-8 leading-[0.85] animate-fade-in-up">
            SafeGuard <br />
            <span className="text-primary italic">Monitoring.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-100">
            Invisible, powerful, and real-time monitoring for your family's safety. Deploy the agent on any target Android device in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in-up delay-200">
            <Link href="/login?role=child">
              <Button size="lg" className="h-16 px-12 text-lg gap-3 rounded-[2rem] font-black shadow-2xl shadow-primary/40 group bg-primary hover:bg-primary/90">
                <Download className="w-5 h-5" /> Download Agent APK
              </Button>
            </Link>
            <Link href="/login?role=parent">
              <Button size="lg" variant="outline" className="h-16 px-12 text-lg gap-3 rounded-[2rem] border-white/10 font-black hover:bg-white/5 transition-all">
                Parent Dashboard Login <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-12 bg-card border border-white/5 rounded-[3rem] hover:border-primary/20 transition-all group">
              <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <MapPin className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Live Handshake</h3>
              <p className="text-muted-foreground leading-relaxed">High-precision GPS coordinates synced every 5 seconds with persistent movement history.</p>
            </div>
            <div className="p-12 bg-card border border-white/5 rounded-[3rem] hover:border-secondary/20 transition-all group">
              <div className="w-16 h-16 bg-secondary/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Activity className="text-secondary w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Stealth Telemetry</h3>
              <p className="text-muted-foreground leading-relaxed">Automated call interception, SMS mirroring, and real-time app usage statistics.</p>
            </div>
            <div className="p-12 bg-card border border-white/5 rounded-[3rem] hover:border-accent/20 transition-all group">
              <div className="w-16 h-16 bg-accent/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Lock className="text-accent w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Vault Encryption</h3>
              <p className="text-muted-foreground leading-relaxed">End-to-end encryption ensures only verified parent accounts can decrypt monitored data.</p>
            </div>
          </div>
        </section>

        <footer className="py-20 px-6 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-headline font-black tracking-tighter text-white">SafeGuard Security Systems</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-40">© 2024 SafeGuard. All Rights Reserved.</p>
        </footer>
      </main>
    </div>
  );
}
