"use client";

import { useUser, useCollection, useFirestore } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, Battery, Clock, Smartphone, LogOut, 
  ShieldCheck, Phone, MessageSquare, Bell, Play, Loader2, RefreshCw, Download, Plus, QrCode, Sparkles, AlertTriangle, CheckCircle2
} from "lucide-react";
import { format } from "date-fns";
import { Navbar } from "@/components/Navbar";
import { generateSafetyReport, type SafetyReportOutput } from "@/ai/flows/safety-report-flow";
import { toast } from "@/hooks/use-toast";

export default function ParentDashboard() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState<SafetyReportOutput | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const devicesQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, "devices"), where("parentUid", "==", user.uid));
  }, [db, user]);

  const { data: devices, loading: devicesLoading } = useCollection(devicesQuery);

  useEffect(() => {
    if (devices && devices.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(devices[0].id);
    }
  }, [devices, selectedDeviceId]);

  const currentDevice = useMemo(() => {
    return devices?.find(d => d.id === selectedDeviceId);
  }, [devices, selectedDeviceId]);

  const activityQueries = useMemo(() => {
    if (!db || !selectedDeviceId) return { calls: null, sms: null, notifs: null };
    return {
      calls: query(collection(db, "devices", selectedDeviceId, "calls"), orderBy("timestamp", "desc"), limit(20)),
      sms: query(collection(db, "devices", selectedDeviceId, "sms"), orderBy("timestamp", "desc"), limit(20)),
      notifs: query(collection(db, "devices", selectedDeviceId, "notifications"), orderBy("timestamp", "desc"), limit(20))
    };
  }, [db, selectedDeviceId]);

  const { data: calls } = useCollection(activityQueries.calls);
  const { data: sms } = useCollection(activityQueries.sms);
  const { data: notifs } = useCollection(activityQueries.notifs);

  async function handleAiAnalysis() {
    if (!currentDevice || !sms || !notifs) return;
    setAiLoading(true);
    try {
      const logs = [
        ...(sms || []).map(s => ({ type: 'SMS', content: s.messageBody, timestamp: s.timestamp, sender: s.phoneNumber })),
        ...(notifs || []).map(n => ({ type: 'Notification', content: n.content, timestamp: n.timestamp, sender: n.appName }))
      ];
      const result = await generateSafetyReport({
        deviceName: currentDevice.name,
        recentLogs: logs
      });
      setAiReport(result);
      toast({ title: "AI Analysis Complete", description: "Review the safety insights below." });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "AI Analysis Failed", description: "Could not generate safety report." });
    } finally {
      setAiLoading(false);
    }
  }

  if (authLoading || devicesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-12 px-6 lg:px-12 max-w-7xl mx-auto space-y-12 animate-fade-in-up">
        
        {(!devices || devices.length === 0) && (
          <Card className="bg-primary/5 border-dashed border-primary/30 rounded-[3rem] overflow-hidden">
            <CardContent className="p-12 text-center space-y-8">
              <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto">
                <Smartphone className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight">Connect Your First Device</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  To start monitoring, you must install the SafeGuard Agent on your child's mobile device.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="h-14 px-8 rounded-2xl bg-primary text-lg font-bold gap-3" onClick={() => router.push("/device")}>
                  <Download className="w-5 h-5" /> Download Agent App
                </Button>
                <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/10 text-lg font-bold gap-3">
                  <QrCode className="w-5 h-5" /> Generate Pair Code
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Family Devices</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => router.push("/device")}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {devices && devices.map(device => (
                <button
                  key={device.id}
                  onClick={() => {
                    setSelectedDeviceId(device.id);
                    setAiReport(null);
                  }}
                  className={`w-full text-left p-5 rounded-3xl border transition-all duration-300 ${
                    selectedDeviceId === device.id 
                    ? "bg-primary/10 border-primary shadow-[0_0_30px_rgba(139,92,246,0.1)] scale-[1.02]" 
                    : "bg-card border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${selectedDeviceId === device.id ? "bg-primary text-white" : "bg-white/5 text-muted-foreground"}`}>
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate text-lg">{device.name}</p>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${device.isOnline ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`} />
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                          {device.isOnline ? "Live Now" : "Offline"}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            {selectedDeviceId ? (
              <>
                <Card className="bg-card border-white/5 shadow-2xl overflow-hidden rounded-[2.5rem]">
                  <CardHeader className="bg-white/5 border-b border-white/5 p-8 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-black">Activity Hub</CardTitle>
                      <CardDescription>Reviewing real-time logs for {currentDevice?.name}</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button 
                        onClick={handleAiAnalysis} 
                        disabled={aiLoading}
                        variant="secondary" 
                        className="bg-primary/20 text-primary hover:bg-primary/30 rounded-full font-bold"
                      >
                        {aiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                        AI Safety Insight
                      </Button>
                      <RefreshCw className="w-5 h-5 text-muted-foreground hover:rotate-180 transition-all cursor-pointer" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Tabs defaultValue="calls" className="w-full">
                      <TabsList className="w-full justify-start h-16 bg-transparent border-b border-white/5 rounded-none px-8 gap-10">
                        <TabsTrigger value="calls" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 text-xs font-black uppercase tracking-[0.2em]">Calls</TabsTrigger>
                        <TabsTrigger value="sms" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 text-xs font-black uppercase tracking-[0.2em]">SMS</TabsTrigger>
                        <TabsTrigger value="notifications" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 text-xs font-black uppercase tracking-[0.2em]">Social</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="calls" className="m-0 max-h-[600px] overflow-y-auto">
                        <div className="divide-y divide-white/5">
                          {calls && calls.length > 0 ? calls.map((call: any) => (
                            <div key={call.id} className="p-8 flex items-center justify-between hover:bg-white/5 transition-colors">
                              <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${call.type === 'missed' ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-500'}`}>
                                  <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                  <p className="font-bold text-xl">{call.contactName || call.phoneNumber}</p>
                                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{format(new Date(call.timestamp), "MMM d, HH:mm")} • {Math.floor(call.durationSeconds / 60)}m {call.durationSeconds % 60}s</p>
                                </div>
                              </div>
                              {call.isRecorded && (
                                <Button size="sm" variant="outline" className="gap-2 rounded-full border-primary/30 text-primary hover:bg-primary/10 px-6 h-10">
                                  <Play className="w-3.5 h-3.5 fill-current" /> Listen
                                </Button>
                              )}
                            </div>
                          )) : <div className="p-32 text-center text-muted-foreground space-y-4"><Phone className="w-12 h-12 mx-auto opacity-10" /><p className="font-black uppercase tracking-widest text-[10px]">No Recorded Calls</p></div>}
                        </div>
                      </TabsContent>

                      <TabsContent value="sms" className="m-0 max-h-[600px] overflow-y-auto">
                        <div className="divide-y divide-white/5">
                          {sms && sms.length > 0 ? sms.map((msg: any) => (
                            <div key={msg.id} className="p-8 flex gap-6 hover:bg-white/5 transition-colors">
                              <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                                <MessageSquare className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-3">
                                  <p className="font-bold text-blue-400 text-lg">{msg.phoneNumber}</p>
                                  <p className="text-[10px] text-muted-foreground font-black uppercase">{format(new Date(msg.timestamp), "HH:mm")}</p>
                                </div>
                                <div className="bg-white/5 p-5 rounded-3xl rounded-tl-none border border-white/5">
                                  <p className="text-sm leading-relaxed text-white/80">"{msg.messageBody}"</p>
                                </div>
                              </div>
                            </div>
                          )) : <div className="p-32 text-center text-muted-foreground space-y-4"><MessageSquare className="w-12 h-12 mx-auto opacity-10" /><p className="font-black uppercase tracking-widest text-[10px]">No Messages Found</p></div>}
                        </div>
                      </TabsContent>

                      <TabsContent value="notifications" className="m-0 max-h-[600px] overflow-y-auto">
                        <div className="divide-y divide-white/5">
                          {notifs && notifs.length > 0 ? notifs.map((notif: any) => (
                            <div key={notif.id} className="p-8 flex gap-6 hover:bg-white/5 transition-colors">
                              <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                                <Bell className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-3">
                                  <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/20 px-4 py-1.5 font-black text-[9px] uppercase tracking-[0.2em]">{notif.appName}</Badge>
                                  <p className="text-[10px] text-muted-foreground font-black uppercase">{format(new Date(notif.timestamp), "HH:mm")}</p>
                                </div>
                                <p className="text-lg font-bold mb-1 text-white">{notif.title}</p>
                                <p className="text-sm text-muted-foreground leading-relaxed italic">"{notif.content}"</p>
                              </div>
                            </div>
                          )) : <div className="p-32 text-center text-muted-foreground space-y-4"><Bell className="w-12 h-12 mx-auto opacity-10" /><p className="font-black uppercase tracking-widest text-[10px]">No Intercepted Apps</p></div>}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {aiReport && (
                  <Card className="bg-primary/5 border-primary/20 rounded-[2.5rem] overflow-hidden animate-fade-in-up">
                    <CardHeader className="p-8 border-b border-primary/10 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-primary" />
                        <CardTitle className="text-xl font-black">Safety Insight Report</CardTitle>
                      </div>
                      <Badge className="bg-primary text-white text-lg px-4 py-1">Safety Score: {aiReport.safetyScore}/100</Badge>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                      <div className="space-y-2">
                        <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">Summary</p>
                        <p className="text-muted-foreground leading-relaxed italic">"{aiReport.summary}"</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <p className="text-xs font-black text-destructive uppercase tracking-[0.2em] flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" /> Potential Concerns
                          </p>
                          <ul className="space-y-2">
                            {aiReport.concerns.map((c, i) => (
                              <li key={i} className="text-sm flex items-start gap-3 bg-destructive/5 p-3 rounded-xl border border-destructive/10">
                                <span className="text-destructive font-bold">•</span>
                                <span>{c}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <p className="text-xs font-black text-green-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3" /> Recommendations
                          </p>
                          <ul className="space-y-2">
                            {aiReport.recommendations.map((r, i) => (
                              <li key={i} className="text-sm flex items-start gap-3 bg-green-500/5 p-3 rounded-xl border border-green-500/10">
                                <span className="text-green-500 font-bold">•</span>
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {currentDevice && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="bg-card border-white/5 rounded-[2.5rem] shadow-xl">
                      <CardContent className="p-8 flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
                          <Battery className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Battery Status</p>
                          <div className="flex items-center gap-4">
                            <span className="text-4xl font-black">{currentDevice.batteryLevel}%</span>
                            <Progress value={currentDevice.batteryLevel} className={`flex-1 h-3 ${currentDevice.batteryLevel < 20 ? 'bg-destructive/20' : 'bg-primary/20'}`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-card border-white/5 rounded-[2.5rem] shadow-xl">
                      <CardContent className="p-8 flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-secondary/10 flex items-center justify-center text-secondary">
                          <MapPin className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">GPS Location</p>
                          <p className="text-sm font-mono font-bold bg-white/5 px-5 py-2.5 rounded-2xl text-secondary border border-white/5">
                            {currentDevice.currentLat.toFixed(5)}, {currentDevice.currentLng.toFixed(5)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            ) : (
              <div className="h-[600px] flex items-center justify-center bg-card border border-white/5 rounded-[3rem] text-muted-foreground italic">
                Select a device from the sidebar to view detailed activity.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
