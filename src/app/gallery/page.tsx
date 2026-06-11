"use client";

import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Box, Layers, MousePointer2, Zap, Layout, Maximize2 } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";

export default function GalleryPage() {
  const trends = [
    {
      id: "trend-3d",
      title: "Interactive WebGL Models",
      desc: "Move beyond static imagery with real-time 3D product previews and interactive environments.",
      image: "trend-3d",
      tags: ["3D", "WebGL", "eCommerce"]
    },
    {
      id: "trend-bento",
      title: "Modular Bento Grids",
      desc: "Asymmetric, responsive layouts that create a visual narrative through structured hierarchy.",
      image: "trend-bento",
      tags: ["Layout", "UI", "Responsive"]
    },
    {
      id: "trend-kinetic",
      title: "Kinetic Typography",
      desc: "Text that moves, scales, and interacts with the user scroll to emphasize brand messaging.",
      image: "trend-kinetic",
      tags: ["Motion", "Branding", "Accessibility"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6">
        <header className="max-w-7xl mx-auto mb-20">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8">
            <div className="max-w-2xl">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">TREND GALLERY 2026</Badge>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">FUTURE <span className="text-primary italic">STANDARDS</span></h1>
              <p className="text-muted-foreground text-xl">
                A living showcase of the technologies and aesthetics shaping the digital frontier. Scroll to witness the evolution.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest border-l border-white/10 pl-8 h-20">
              <Box className="w-5 h-5 text-primary" /> 
              <span>Curated by<br/>OOBy Design Labs</span>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto space-y-32">
          {trends.map((trend, idx) => (
            <div key={trend.id} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 lg:gap-24 items-center`}>
              <div className="flex-1 space-y-8 animate-fade-in-up">
                <div className="flex gap-2">
                  {trend.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-[10px] tracking-widest border-white/10 uppercase py-1">{tag}</Badge>
                  ))}
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-none">{trend.title}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
                  {trend.desc}
                </p>
                <div className="flex gap-6 pt-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-primary">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">High Performance</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-secondary">
                      <MousePointer2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Interactive</span>
                  </div>
                </div>
                <Button className="rounded-full px-8 h-12 group bg-white text-black hover:bg-white/90">
                  Case Study <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <div className="flex-1 w-full relative">
                <div className="aspect-[4/3] rounded-[3rem] overflow-hidden border border-white/10 neon-border bg-card group cursor-none">
                  <Image 
                    src={PlaceHolderImages.find(i => i.id === trend.image)?.imageUrl || "https://picsum.photos/seed/ooby/800/600"} 
                    alt={trend.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    data-ai-hint="futuristic interface design"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100 border border-white/20">
                     <Maximize2 className="text-white w-8 h-8" />
                  </div>
                  <div className="absolute bottom-10 left-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <p className="text-xs font-bold text-white uppercase tracking-[0.2em]">Prototype Available</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="max-w-7xl mx-auto mt-48 py-24 bg-card rounded-[4rem] border border-white/5 text-center px-6">
          <Badge className="mb-6 bg-secondary/20 text-secondary border-secondary/30">CUSTOM ARCHITECTURE</Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter">Your project, <span className="text-primary italic">reimagined</span>.</h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-12">
            Let's apply these innovations to your specific brand goals. Use our AI assistant to start your journey.
          </p>
          <Link href="/architect">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full h-16 px-12 text-xl shadow-2xl shadow-primary/40">
              Consult The Architect
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}

import Link from "next/link";