"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Cpu, Palette, Phone } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between glass-morphism border-b border-white/5">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center neon-border shadow-primary/20">
          <span className="font-headline font-bold text-xl">O</span>
        </div>
        <span className="font-headline font-bold text-2xl tracking-tighter text-white">OBy</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <Link href="/gallery" className="hover:text-primary transition-colors flex items-center gap-1.5">
          <Palette className="w-4 h-4 stroke-[1.5px]" /> Trend Gallery
        </Link>
        <Link href="/architect" className="hover:text-primary transition-colors flex items-center gap-1.5">
          <Cpu className="w-4 h-4 stroke-[1.5px]" /> Design Architect
        </Link>
        <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1.5">
          <LayoutGrid className="w-4 h-4 stroke-[1.5px]" /> Project Hub
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/quote">
          <Button variant="outline" className="border-primary/50 hover:bg-primary/10 text-primary rounded-full px-6">
            Get Quote
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 shadow-lg shadow-primary/20">
            Login
          </Button>
        </Link>
      </div>
    </nav>
  );
}