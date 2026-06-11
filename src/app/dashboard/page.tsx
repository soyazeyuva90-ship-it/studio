"use client";

import { Navbar } from "@/components/Navbar";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Settings, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const projects = [
    { id: 1, name: "EcoShowroom 2026", status: "Architecting", progress: 35, type: "Immersive Web" },
    { id: 2, name: "FinTech HUD Interface", status: "Delivered", progress: 100, type: "Product UI" },
    { id: 3, name: "CryptoVibe Branding", status: "Asset Review", progress: 75, type: "Visual Identity" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 flex min-h-[calc(100vh-80px)]">
        {/* Sidebar Container */}
        <div className="hidden md:block w-64 border-r border-white/5 bg-card/50">
          <div className="p-6 space-y-8">
            <div className="space-y-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Main Hub</p>
              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-primary bg-primary/10 gap-3">
                  <LayoutDashboard className="w-4 h-4" /> Overview
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-white/5">
                  <FileText className="w-4 h-4" /> My Proposals
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-white/5">
                  <ImageIcon className="w-4 h-4" /> Brand Assets
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-white/5">
                  <MessageSquare className="w-4 h-4" /> Messages
                </Button>
              </nav>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Account</p>
              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-white/5">
                  <Settings className="w-4 h-4" /> Agency Settings
                </Button>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-2">Immersive Project Hub</h1>
              <p className="text-muted-foreground">Manage your next-generation digital architectures and brand assets.</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 h-12 shadow-lg shadow-primary/20">
              <Plus className="mr-2 w-5 h-5" /> New Design Request
            </Button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="bg-card border-white/5 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-headline font-bold">02</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Active Cycles</p>
                </div>
              </div>
            </Card>
            <Card className="bg-card border-white/5 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-headline font-bold">14</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Completed Briefs</p>
                </div>
              </div>
            </Card>
            <Card className="bg-card border-white/5 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-destructive/20 text-destructive flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-headline font-bold">01</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Attention Required</p>
                </div>
              </div>
            </Card>
          </div>

          <h2 className="text-2xl font-bold mb-6">Recent Project Pipelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="bg-card border-white/5 hover:border-primary/30 transition-all group overflow-hidden">
                <CardHeader className="p-6 pb-2">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className="border-white/10 text-white text-[10px] py-0 px-2 uppercase tracking-wider">{project.type}</Badge>
                    <Badge className={project.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary'}>
                      {project.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{project.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress Architecture</span>
                        <span className="text-white font-bold">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1.5 bg-white/5" />
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                      <div className="flex -space-x-2">
                        {[1, 2].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold">AD</div>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground italic">Lead: Architect K. Nova</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}