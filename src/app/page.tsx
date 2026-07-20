
"use client";

import { Button } from "@/components/ui/button";
import { Shield, MapPin, Battery, Lock, ArrowRight, Smartphone, CheckCircle2, Download, Eye, Activity } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <nav className="p-4 md:p-6 flex justify-between items-center border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Shield className="text-white w-6 h-6" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tighter">SafeGuard</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-sm font-bold uppercase tracking-widest hover:bg-white/5">Login</Button>
          </Link>
          <Link href="/login?role=parent">
            <Button className="bg-primary hover:bg-primary/90 rounded-full px-6 font-bold shadow-lg shadow-primary/30">Get Started</Button>
          </Link>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-24 pb-20 px-6 text-center max-w-5xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in-up">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">v2.1 Transparent Monitoring</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold font-headline tracking-tighter mb-8 leading-[0.9] animate-fade-in-up">
            Parenting in the <br />
            <span className="text-primary italic">Digital Era.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
            Real-time safety insights for your family. Monitor locations, device health, and communication patterns with 100% transparency.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-200">
            <Link href="/login?role=parent">
              <Button size="lg" className="h-16 px-10 text-lg gap-2 rounded-full font-bold shadow-xl shadow-primary/20 group">
                Setup Parent Hub <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/device">
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg gap-2 rounded-full border-white/10 font-bold hover:bg-white/5">
                <Download className="w-5 h-5" /> Install Child Agent
              </Button>
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 px-6 border-t border-white/5 bg-card/20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: MapPin, 
                color: "text-primary", 
                bg: "bg-primary/10", 
                title: "Precision Location", 
                desc: "Real-time GPS tracking with movement history and geofencing capabilities." 
              },
              { 
                icon: Activity, 
                color: "text-secondary", 
                bg: "bg-secondary/10", 
                title: "Activity Logs", 
                desc: "Automatically capture call logs, SMS, and app notifications in real-time." 
              },
              { 
                icon: Lock, 
                color: "text-accent", 
                bg: "bg-accent/10", 
                title: "Full Transparency", 
                desc: "No hidden background services. Children are always notified when the agent is active." 
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 bg-card border border-white/5 rounded-[2.5rem] hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 shadow-2xl shadow-black/40">
                <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`${feature.color} w-7 h-7`} />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Parent vs Child Call to Action */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            <div className="bg-primary/5 border border-primary/20 p-12 rounded-[3rem] space-y-6">
              <Eye className="w-12 h-12 text-primary" />
              <h2 className="text-3xl font-bold">For Parents</h2>
              <p className="text-muted-foreground leading-relaxed">
                Access your encrypted dashboard from any browser. Track multiple devices, view call recordings, and get instant safety alerts.
              </p>
              <Link href="/login?role=parent" className="block">
                <Button className="w-full h-14 rounded-2xl bg-primary text-lg font-bold">Open Hub Control</Button>
              </Link>
            </div>
            
            <div className="bg-secondary/5 border border-secondary/20 p-12 rounded-[3rem] space-y-6">
              <Smartphone className="w-12 h-12 text-secondary" />
              <h2 className="text-3xl font-bold">For Children</h2>
              <p className="text-muted-foreground leading-relaxed">
                Install the SafeGuard Agent on your mobile device. Simple pairing code setup and clear foreground status notifications.
              </p>
              <Link href="/device" className="block">
                <Button variant="outline" className="w-full h-14 rounded-2xl border-secondary/30 text-secondary hover:bg-secondary/10 text-lg font-bold">Launch Agent App</Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="py-12 px-6 border-t border-white/5 text-center text-muted-foreground text-sm">
          <p>© 2024 SafeGuard Monitoring Systems. Built for transparency and trust.</p>
        </footer>
      </main>
    </div>
  );
}
