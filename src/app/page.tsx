"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Box, Zap, Sparkles, Layers, MousePointer2, Cpu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');
  const bentoImages = [
    { id: 'trend-3d', title: 'Immersive 3D', description: 'Interactive models and AR integration.' },
    { id: 'trend-bento', title: 'Bento Layouts', description: 'Structured yet flexible modular grids.' },
    { id: 'trend-kinetic', title: 'Kinetic Motion', description: 'Typography that breathes and moves.' }
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] animate-glow-pulse" />
          <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px]" />
        </div>

        <Badge variant="outline" className="mb-6 py-1.5 px-4 rounded-full border-primary/20 text-primary bg-primary/5 flex gap-2 items-center animate-fade-in-up">
          <Sparkles className="w-3.5 h-3.5" />
          Exploring Web Trends 2026
        </Badge>
        
        <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 max-w-5xl leading-[0.9] glow-text animate-fade-in-up [animation-delay:100ms]">
          THE FUTURE OF <span className="text-primary italic">DIGITAL</span> ARCHITECTURE
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-12 animate-fade-in-up [animation-delay:200ms]">
          We design websites that don't just exist—they immerse. Experience the synergy of 3D elements, bento grids, and AI-driven design thinking.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up [animation-delay:300ms]">
          <Link href="/architect">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full h-14 px-8 text-lg group shadow-xl shadow-primary/20">
              Start Designing <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/gallery">
            <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 rounded-full h-14 px-8 text-lg">
              View Trends
            </Button>
          </Link>
        </div>
      </section>

      {/* Bento Trend Showcase */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Innovation Benchmarks</h2>
            <p className="text-muted-foreground text-lg">Beyond standard interfaces. We implement 2026's most disruptive design philosophies today.</p>
          </div>
          <Link href="/gallery">
            <Button variant="link" className="text-primary p-0 h-auto text-lg hover:no-underline flex items-center gap-2">
              Explore full gallery <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
          {/* Main Bento Feature */}
          <div className="md:col-span-8 group relative overflow-hidden rounded-[2rem] border border-white/5 bg-card neon-border shadow-2xl">
            <div className="absolute inset-0 z-0">
               <Image 
                src={heroImage?.imageUrl || "https://picsum.photos/seed/ooby-bento/1200/800"} 
                alt="Main Bento Feature" 
                fill 
                className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                data-ai-hint="futuristic tech dashboard"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            </div>
            <div className="relative z-10 p-10 h-full flex flex-col justify-end">
              <Badge className="w-fit mb-4 bg-primary/20 text-primary border-primary/30">FEATURED TREND</Badge>
              <h3 className="text-4xl font-bold mb-4">The Bento Paradox</h3>
              <p className="text-muted-foreground text-lg max-w-lg mb-6">
                Organizing complex digital ecosystems into beautiful, interactive modules that flow with organic movement.
              </p>
              <Button variant="secondary" className="w-fit rounded-full px-6">Read More</Button>
            </div>
          </div>

          {/* Side Bento 1 */}
          <div className="md:col-span-4 group relative overflow-hidden rounded-[2rem] border border-white/5 bg-card">
            <div className="absolute inset-0 z-0">
              <Image 
                src={PlaceHolderImages.find(i => i.id === 'trend-3d')?.imageUrl || "https://picsum.photos/seed/ooby-3d/600/600"} 
                alt="3D Interaction" 
                fill 
                className="object-cover opacity-50 group-hover:rotate-2 group-hover:scale-110 transition-transform duration-700"
                data-ai-hint="3D rendering abstract"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
            <div className="relative z-10 p-8 h-full flex flex-col justify-end">
              <h3 className="text-2xl font-bold mb-2">Z-Axis Depth</h3>
              <p className="text-sm text-muted-foreground">True 3D depth using WebGL models for tangible interactions.</p>
            </div>
          </div>

          {/* Bottom Bento row */}
          <div className="md:col-span-4 group relative overflow-hidden rounded-[2rem] border border-white/5 bg-card p-8 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">High Flux Logic</h3>
              <p className="text-sm text-muted-foreground">Lightning fast transitions powered by modern edge-rendering.</p>
            </div>
          </div>

          <div className="md:col-span-8 group relative overflow-hidden rounded-[2rem] border border-white/5 bg-card p-8 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-primary/10 to-transparent">
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-4">AI-Assisted Architecture</h3>
              <p className="text-muted-foreground mb-6">Use our Design Project Architect to generate custom trend suggestions tailored to your client needs.</p>
              <Link href="/architect">
                <Button className="bg-white text-black hover:bg-white/90 rounded-full px-8">Try Architect</Button>
              </Link>
            </div>
            <div className="relative w-48 h-48 animate-float">
               <div className="absolute inset-0 border-[1px] border-primary/40 rounded-full animate-[spin_10s_linear_infinite]" />
               <div className="absolute inset-4 border-[1px] border-secondary/40 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
               <div className="absolute inset-0 flex items-center justify-center text-primary">
                 <Cpu className="w-16 h-16" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services/CTA */}
      <section className="bg-card/30 py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to evolve your digital presence?</h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-12">
            Join the forward-thinking brands building the next generation of the web with OOBy.
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl font-headline font-bold text-primary">12+</span>
              <span className="text-muted-foreground uppercase tracking-widest text-xs">Innovation Awards</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl font-headline font-bold text-secondary">200+</span>
              <span className="text-muted-foreground uppercase tracking-widest text-xs">Next-Gen Launches</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl font-headline font-bold text-white">99%</span>
              <span className="text-muted-foreground uppercase tracking-widest text-xs">Client Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-sm">
             <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-headline font-bold text-sm">O</span>
              </div>
              <span className="font-headline font-bold text-xl tracking-tighter text-white">OOBy</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              Leading website design agency specializing in 2026 trends, immersive UI, and AI-driven digital architecture.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'Dribbble', 'LinkedIn', 'Instagram'].map(social => (
                <Link key={social} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-primary/50 transition-colors text-xs font-medium">
                  {social[0]}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-sm">
            <div className="flex flex-col gap-4">
              <span className="font-bold text-white uppercase tracking-widest text-xs">Agency</span>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Case Studies</Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold text-white uppercase tracking-widest text-xs">Resources</span>
              <Link href="/gallery" className="text-muted-foreground hover:text-primary transition-colors">Trend Gallery</Link>
              <Link href="/architect" className="text-muted-foreground hover:text-primary transition-colors">AI Architect</Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Design Basics</Link>
            </div>
            <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
              <span className="font-bold text-white uppercase tracking-widest text-xs">Newsletter</span>
              <p className="text-muted-foreground text-xs mb-2">Get the latest 2026 design insights monthly.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-primary" />
                <Button size="sm" className="bg-primary hover:bg-primary/90">Join</Button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <span>&copy; 2025 OOBy Agency. All rights reserved.</span>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
