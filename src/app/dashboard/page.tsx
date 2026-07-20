
"use client";

import { useUser, useCollection, useFirestore } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, Battery, Clock, Smartphone, LogOut, 
  ShieldCheck, Phone, MessageSquare, Bell, Play, Loader2, RefreshCw
} from "lucide-react";
import { format } from "date-fns";

export default function ParentDashboard() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const devicesQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, "devices"), where("parentUid", "==", user.uid));
  }, [db, user]);

  const { data: devices, loading: devicesLoading } = useCollection(devicesQuery);

  // Auto-select first device
  useEffect(() => {
    if (devices && devices.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(devices[0].id);
    }
  }, [devices, selectedDeviceId]);

  const currentDevice = useMemo(() => {
    return devices?.find(d => d.id === selectedDeviceId);
  }, [devices, selectedDeviceId]);

  const callsQuery = useMemo(() => {
    if (!db || !selectedDeviceId) return null;
    return query(collection(db, "devices", selectedDeviceId, "calls"), orderBy("timestamp", "desc"), limit(20));
  }, [db, selectedDeviceId]);

  const smsQuery = useMemo(() => {
    if (!db || !selectedDeviceId) return null;
    return query(collection(db, "devices", selectedDeviceId, "sms"), orderBy("timestamp", "desc"), limit(20));
  }, [db, selectedDeviceId]);

  const notifQuery = useMemo(() => {
    if (!db || !selectedDeviceId) return null;
    return query(collection(db, "devices", selectedDeviceId, "notifications"), orderBy("timestamp", "desc"), limit(20));
  }, [db, selectedDeviceId]);

  const { data: calls } = useCollection(callsQuery);
  const { data: sms } = useCollection(smsQuery);
  const { data: notifs } = useCollection(notifQuery);

  if (authLoading || devicesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-white/5 bg-card/50 backdrop-blur-xl sticky top-0 z-50 px-6 h-20 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-primary w-6 h-6" />
          <span className="font-headline font-bold text-xl uppercase tracking-tighter">SafeGuard Hub</span>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{user?.email}</Badge>
          <Button variant="ghost" size="icon" className="hover:bg-destructive/10 hover:text-destructive" onClick={() => router.push("/")}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </nav>

      <main className="p-6 lg:p-12 max-w-7xl mx-auto space-y-12 animate-fade-in-up">
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Device Selection Sidebar */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Active Devices</h2>
              <RefreshCw className="w-3.5 h-3.5 text-muted-foreground hover:rotate-180 transition-all cursor-pointer" />
            </div>
            <div className="space-y-3">
              {devices && devices.length > 0 ? devices.map(device => (
                <button
                  key={device.id}
                  onClick={() => setSelectedDeviceId(device.id)}
                  className={`w-full text-left p-5 rounded-3xl border transition-all duration-300 ${
                    selectedDeviceId === device.id 
                    ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(139,92,246,0.1)] scale-[1.02]" 
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
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                          {device.isOnline ? "Live Sync" : "Last sync: " + format(new Date(device.lastSeen), "HH:mm")}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              )) : (
                <div className="p-8 text-center bg-card border border-dashed border-white/10 rounded-3xl">
                  <p className="text-sm text-muted-foreground">No devices linked.</p>
                  <Button variant="link" className="text-primary p-0" onClick={() => router.push("/")}>Add Device</Button>
                </div>
              )}
            </div>
          </div>

          {/* Activity Center */}
          <div className="lg:col-span-3 space-y-8">
            <Card className="bg-card border-white/5 shadow-2xl overflow-hidden rounded-[2.5rem]">
              <CardHeader className="bg-white/5 border-b border-white/5 p-8">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Clock className="w-6 h-6 text-primary" /> Activity Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="calls" className="w-full">
                  <TabsList className="w-full justify-start h-16 bg-transparent border-b border-white/5 rounded-none px-8 gap-10">
                    <TabsTrigger value="calls" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 text-sm font-bold uppercase tracking-widest transition-all">Calls</TabsTrigger>
                    <TabsTrigger value="sms" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 text-sm font-bold uppercase tracking-widest transition-all">SMS</TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 text-sm font-bold uppercase tracking-widest transition-all">Social Apps</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="calls" className="m-0 max-h-[500px] overflow-y-auto custom-scrollbar">
                    <div className="divide-y divide-white/5">
                      {calls && calls.length > 0 ? calls.map((call: any) => (
                        <div key={call.id} className="p-8 flex items-center justify-between hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${call.type === 'missed' ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-500'}`}>
                              <Phone className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="font-bold text-lg">{call.contactName || call.phoneNumber}</p>
                              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{format(new Date(call.timestamp), "MMM d, HH:mm")} • {Math.floor(call.durationSeconds / 60)}m {call.durationSeconds % 60}s</p>
                            </div>
                          </div>
                          {call.isRecorded && (
                            <Button size="sm" variant="outline" className="gap-2 rounded-full border-primary/30 text-primary hover:bg-primary/10 px-5">
                              <Play className="w-3.5 h-3.5 fill-current" /> Listen
                            </Button>
                          )}
                        </div>
                      )) : <div className="p-20 text-center text-muted-foreground flex flex-col items-center gap-4"><Phone className="w-10 h-10 opacity-20" /> No call activity recorded.</div>}
                    </div>
                  </TabsContent>

                  <TabsContent value="sms" className="m-0 max-h-[500px] overflow-y-auto custom-scrollbar">
                    <div className="divide-y divide-white/5">
                      {sms && sms.length > 0 ? sms.map((msg: any) => (
                        <div key={msg.id} className="p-8 flex gap-6 hover:bg-white/5 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                            <MessageSquare className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                              <p className="font-bold text-blue-400">{msg.phoneNumber}</p>
                              <p className="text-[10px] text-muted-foreground font-bold">{format(new Date(msg.timestamp), "HH:mm")}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none">
                              <p className="text-sm leading-relaxed">"{msg.messageBody}"</p>
                            </div>
                          </div>
                        </div>
                      )) : <div className="p-20 text-center text-muted-foreground flex flex-col items-center gap-4"><MessageSquare className="w-10 h-10 opacity-20" /> No message history.</div>}
                    </div>
                  </TabsContent>

                  <TabsContent value="notifications" className="m-0 max-h-[500px] overflow-y-auto custom-scrollbar">
                    <div className="divide-y divide-white/5">
                      {notifs && notifs.length > 0 ? notifs.map((notif: any) => (
                        <div key={notif.id} className="p-8 flex gap-6 hover:bg-white/5 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                            <Bell className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/20 px-3 py-1 font-bold text-[10px] uppercase tracking-widest">{notif.appName}</Badge>
                              <p className="text-[10px] text-muted-foreground font-bold">{format(new Date(notif.timestamp), "HH:mm")}</p>
                            </div>
                            <p className="text-sm font-black mb-1 text-white/90">{notif.title}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed italic">{notif.content}</p>
                          </div>
                        </div>
                      )) : <div className="p-20 text-center text-muted-foreground flex flex-col items-center gap-4"><Bell className="w-10 h-10 opacity-20" /> No notifications intercepted.</div>}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Live Telemetry Overview */}
            {currentDevice && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-card border-white/5 rounded-[2.5rem] shadow-xl">
                  <CardContent className="p-8 flex items-center gap-6">
                    <div className="w-14 h-14 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
                      <Battery className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Battery Health</p>
                      <div className="flex items-center gap-4">
                        <span className="text-3xl font-black">{currentDevice.batteryLevel}%</span>
                        <Progress value={currentDevice.batteryLevel} className={`flex-1 h-3 ${currentDevice.batteryLevel < 20 ? 'bg-destructive/20' : 'bg-primary/20'}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-white/5 rounded-[2.5rem] shadow-xl">
                  <CardContent className="p-8 flex items-center gap-6">
                    <div className="w-14 h-14 rounded-3xl bg-secondary/10 flex items-center justify-center text-secondary">
                      <MapPin className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Precise Coordinates</p>
                      <p className="text-sm font-mono font-bold bg-white/5 px-4 py-2 rounded-xl text-secondary">
                        {currentDevice.currentLat.toFixed(5)}, {currentDevice.currentLng.toFixed(5)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
