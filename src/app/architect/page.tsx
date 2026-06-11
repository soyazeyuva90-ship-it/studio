"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Cpu, Sparkles, Send, Loader2, Palette, Layout, Lightbulb } from "lucide-react";
import { aiDesignerAssistant, type AIDesignerAssistantOutput } from "@/ai/flows/ai-designer-assistant-flow";

export default function ArchitectPage() {
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<AIDesignerAssistantOutput | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const output = await aiDesignerAssistant({ projectDescription: description });
      setResult(output);
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 py-1.5 px-4 rounded-full">
            <Cpu className="w-3.5 h-3.5 mr-2" />
            GenAI Project Architect
          </Badge>
          <h1 className="text-5xl font-bold mb-4">Design Strategy Engine</h1>
          <p className="text-muted-foreground text-xl">
            Describe your project goals and our AI will architect a 2026-ready design strategy.
          </p>
        </header>

        <div className="grid gap-8">
          <Card className="bg-card border-white/5 shadow-2xl overflow-hidden neon-border">
            <CardHeader className="bg-white/5 border-b border-white/5 px-8 py-6">
              <div className="flex items-center gap-3">
                <Sparkles className="text-primary w-5 h-5" />
                <CardTitle>Project Description</CardTitle>
              </div>
              <CardDescription>Tell us about the website's purpose, audience, and core features.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Textarea 
                placeholder="e.g., A luxury sustainable furniture brand needing an immersive showroom experience with AR furniture previews..."
                className="min-h-[200px] bg-background border-white/10 focus:border-primary text-lg p-6 rounded-2xl mb-6"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button 
                onClick={handleAnalyze} 
                disabled={loading || !description.trim()}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-xl text-lg font-bold shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Architecting Strategy...</>
                ) : (
                  <><Send className="mr-2 h-5 w-5" /> Analyze Design DNA</>
                )}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <div className="animate-fade-in-up space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-card border-primary/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 text-primary font-bold mb-1">
                      <Palette className="w-4 h-4" />
                      <span>2026 TRENDS</span>
                    </div>
                    <CardTitle>Aesthetic Directions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-4">
                    {result.suggestedTrends.map((trend, idx) => (
                      <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-colors">
                        <h4 className="font-bold text-white mb-2">{trend.name}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{trend.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-card border-secondary/20 h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 text-secondary font-bold mb-1">
                      <Layout className="w-4 h-4" />
                      <span>LAYOUT ARCHITECTURE</span>
                    </div>
                    <CardTitle>Configuration Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="prose prose-invert prose-sm">
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {result.layoutConfigurations}
                      </p>
                    </div>
                    <div className="mt-8 p-4 bg-secondary/10 rounded-xl border border-secondary/20 flex gap-4">
                      <Lightbulb className="text-secondary shrink-0 w-6 h-6" />
                      <p className="text-xs text-secondary/80 italic">
                        "These suggestions incorporate OOBy's core bento-box philosophy and kinetic motion guidelines for maximum impact."
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="outline" className="rounded-full px-8 border-white/10">Download Brief</Button>
                <Link href="/dashboard">
                  <Button className="rounded-full px-8 bg-white text-black hover:bg-white/90">Submit to Project Hub</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";