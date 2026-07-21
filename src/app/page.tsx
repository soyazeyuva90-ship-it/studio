
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, MapPin, Lock, ArrowRight, Download, CheckCircle2, Activity, SmartphoneNfc } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

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
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">v2.9 Enterprise Secure</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-bold font-headline tracking-tighter mb-8 leading-[0.85] animate-fade-in-up">
            SafeGuard <br />
            <span className="text-primary italic">Monitoring.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-100">
            Professional parental monitoring for the modern age. Install the agent on the target device to begin secure tracking and communication logs.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in-up delay-200">
            <Link href="/device">
              <Button size="lg" className="h-16 px-12 text-lg gap-3 rounded-[2rem] font-black shadow-2xl shadow-primary/40 group bg-primary hover:bg-primary/90">
                <Download className="w-5 h-5" /> Download Agent APK
              </Button>
            </Link>
            <Link href="/login?role=parent">
              <Button size="lg" variant="outline" className="h-16 px-12 text-lg gap-3 rounded-[2rem] border-white/10 font-black hover:bg-white/5 transition-all">
                Parent Dashboard Login <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <p className="mt-8 text-xs text-muted-foreground animate-fade-in-up delay-300">
            Signups are disabled on the web. You must register an account through the Mobile Agent app.
          </p>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-12 bg-card border border-white/5 rounded-[3rem] hover:border-primary/20 transition-all group">
              <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <MapPin className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Live Tracking</h3>
              <p className="text-muted-foreground leading-relaxed">High-precision GPS coordinates synced every 5 seconds with movement history.</p>
            </div>
            <div className="p-12 bg-card border border-white/5 rounded-[3rem] hover:border-secondary/20 transition-all group">
              <div className="w-16 h-16 bg-secondary/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Activity className="text-secondary w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Communications</h3>
              <p className="text-muted-foreground leading-relaxed">Automatic call recording, SMS capture, and social media notification alerts.</p>
            </div>
            <div className="p-12 bg-card border border-white/5 rounded-[3rem] hover:border-accent/20 transition-all group">
              <div className="w-16 h-16 bg-accent/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Lock className="text-accent w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Secure Vault</h3>
              <p className="text-muted-foreground leading-relaxed">End-to-end encryption ensures only authorized parent logins can access data.</p>
            </div>
          </div>
        </section>

        {/* App Demo Frame */}
        <section className="py-32 px-6 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
            <div className="flex-1 space-y-8 text-left">
              <Badge className="bg-secondary/20 text-secondary border-secondary/30 px-4 py-1.5 font-black text-[10px] uppercase tracking-widest">Setup Guide</Badge>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">Start Real-Time <br/><span className="text-secondary italic">Monitoring.</span></h2>
              <ul className="space-y-4 text-lg text-muted-foreground">
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold text-sm shrink-0">1</span>
                  <span>Download and install the <strong>SafeGuard APK</strong> on the target phone.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold text-sm shrink-0">2</span>
                  <span>Create an account within the app and grant necessary permissions.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold text-sm shrink-0">3</span>
                  <span>Log in to this website using the same credentials to start viewing logs.</span>
                </li>
              </ul>
            </div>
            <div className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[600px]">
               <div className="absolute inset-0 bg-secondary/20 blur-[100px] rounded-full" />
               <div className="relative z-10 w-full h-full border-[10px] border-zinc-800 rounded-[4rem] bg-black shadow-2xl overflow-hidden flex flex-col items-center justify-center p-10">
                  <SmartphoneNfc className="w-24 h-24 text-secondary mb-6 animate-pulse" />
                  <div className="text-center space-y-2">
                    <p className="text-xs font-black text-secondary uppercase tracking-[0.3em]">SafeGuard APK Active</p>
                    <p className="text-sm text-white/40 italic">"Waiting for Parent Handshake..."</p>
                  </div>
               </div>
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
