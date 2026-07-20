
"use client";

import { Button } from "@/components/ui/button";
import { Shield, MapPin, Battery, Lock, ArrowRight, Smartphone, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="p-4 md:p-6 flex justify-between items-center border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Shield className="text-white w-6 h-6" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tighter">SafeGuard</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-sm font-bold uppercase tracking-widest">Login</Button>
          </Link>
          <Link href="/login?role=parent">
            <Button className="bg-primary hover:bg-primary/90 rounded-full px-6 font-bold shadow-lg shadow-primary/30">Get Started</Button>
          </Link>
        </div>
      </nav>

      <main>
        <section className="pt-20 pb-20 px-6 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">v2.0 Now Live</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-bold font-headline tracking-tighter mb-8 leading-[0.9]">
            Digital safety <br />
            <span className="text-primary italic">for your family</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            A transparent monitoring suite designed for modern parenting. Real-time location, device health, and activity insights with full privacy respect.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login?role=parent">
              <Button size="lg" className="h-16 px-10 text-lg gap-2 rounded-full font-bold shadow-xl shadow-primary/20">
                Setup Parent Hub <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login?role=child">
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg gap-2 rounded-full border-white/10 font-bold hover:bg-white/5">
                Install Child Agent <Smartphone className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-24 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: MapPin, color: "text-primary", bg: "bg-primary/10", title: "Live Tracking", desc: "Precise GPS monitoring with street-level accuracy and movement history." },
              { icon: Battery, color: "text-secondary", bg: "bg-secondary/10", title: "Status Sync", desc: "Real-time battery levels and connectivity heartbeats to ensure they stay reachable." },
              { icon: Lock, color: "text-accent", bg: "bg-accent/10", title: "Privacy First", desc: "No stealth mode. Children are notified when monitoring is active, fostering mutual trust." }
            ].map((feature, i) => (
              <div key={i} className="group p-8 bg-card/50 border border-white/5 rounded-[2rem] hover:border-primary/30 transition-all duration-500">
                <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`${feature.color} w-7 h-7`} />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
