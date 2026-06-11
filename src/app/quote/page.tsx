"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, Clock, DollarSign, Rocket, CheckCircle2 } from "lucide-react";

export default function QuotePage() {
  const [complexity, setComplexity] = useState([50]);
  const [pages, setPages] = useState([5]);
  const [immersive, setImmersive] = useState(true);
  const [aiIntegrations, setAiIntegrations] = useState(false);

  const stats = useMemo(() => {
    const basePrice = 5000;
    const pageMultiplier = pages[0] * 800;
    const complexityMultiplier = complexity[0] * 100;
    const immersiveCost = immersive ? 3000 : 0;
    const aiCost = aiIntegrations ? 4500 : 0;
    
    const total = basePrice + pageMultiplier + complexityMultiplier + immersiveCost + aiCost;
    const weeks = Math.ceil(total / 3000) + 2;

    return {
      price: total.toLocaleString(),
      timeline: `${weeks}-${weeks + 2} Weeks`,
    };
  }, [complexity, pages, immersive, aiIntegrations]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <Badge className="mb-4 bg-accent/20 text-accent border-accent/30 py-1.5 px-4 rounded-full">
            <Calculator className="w-3.5 h-3.5 mr-2" />
            Service Quote Engine
          </Badge>
          <h1 className="text-5xl font-bold mb-4 tracking-tighter">Project Estimation</h1>
          <p className="text-muted-foreground text-xl">Get a dynamic estimate for your next-generation digital presence.</p>
        </header>

        <div className="grid gap-8">
          <Card className="bg-card border-white/5 neon-border shadow-2xl">
            <CardHeader className="bg-white/5 border-b border-white/5 p-8">
              <CardTitle>Configure Your Requirements</CardTitle>
              <CardDescription>Adjust the sliders and toggles to see real-time pricing.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-12">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-bold">Number of Key Pages</Label>
                  <Badge variant="secondary" className="text-lg px-3 py-1">{pages[0]} Pages</Badge>
                </div>
                <Slider value={pages} onValueChange={setPages} max={20} step={1} className="py-4" />
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-bold">Interaction Complexity</Label>
                  <Badge variant="secondary" className="text-lg px-3 py-1">{complexity[0]}% Advanced</Badge>
                </div>
                <Slider value={complexity} onValueChange={setComplexity} max={100} step={10} className="py-4" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="space-y-1">
                    <Label className="text-lg font-bold">Immersive Elements</Label>
                    <p className="text-xs text-muted-foreground">WebGL, 3D Models, Parallax</p>
                  </div>
                  <Switch checked={immersive} onCheckedChange={setImmersive} />
                </div>

                <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="space-y-1">
                    <Label className="text-lg font-bold">AI Integrations</Label>
                    <p className="text-xs text-muted-foreground">GenAI Flows, Smart Search</p>
                  </div>
                  <Switch checked={aiIntegrations} onCheckedChange={setAiIntegrations} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-primary/10 border-primary/20">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
                  <DollarSign className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Estimated Cost</p>
                  <p className="text-4xl font-headline font-bold text-white">${stats.price}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/10 border-secondary/20">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary shadow-lg shadow-secondary/20">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-secondary uppercase tracking-widest mb-1">Delivery Timeline</p>
                  <p className="text-4xl font-headline font-bold text-white">{stats.timeline}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-card border border-white/5 p-8 rounded-[2rem] text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to start the architecting phase?</h3>
            <p className="text-muted-foreground mb-8">Lock in this estimate by submitting your project brief today.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-full px-10 h-14 text-lg">
                <Rocket className="mr-2 w-5 h-5" /> Launch Project Hub
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-lg border-white/10">
                Contact Strategy Team
              </Button>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-primary w-4 h-4" /> Fixed Price Options
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-primary w-4 h-4" /> Dedicated UI/UX Architect
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-primary w-4 h-4" /> 2026 Compliance Checked
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}