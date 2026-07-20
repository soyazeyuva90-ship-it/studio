
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
  MapPin, Battery, Clock, Smartphone, Plus, LogOut, 
  ShieldCheck, Phone, MessageSquare, Bell, Mic, Play
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

  const callsQuery = useMemo(() => {
    if (!db || !selectedDeviceId) return null;
    return query(collection(db, "devices", selectedDeviceId, "calls"), orderBy("timestamp", "desc"), limit(10));
  }, [db, selectedDeviceId]);

  const smsQuery = useMemo(() => {
    if (!db || !selectedDeviceId) return null;
    return query(collection(db, "devices", selectedDeviceId, "sms"), orderBy("timestamp", "desc"), limit(10));
  }, [db, selectedDeviceId]);

  const notifQuery = useMemo(() => {
    if (!db || !selectedDeviceId) return null;
    return query(collection(db, "devices", selectedDeviceId, "notifications"), orderBy("timestamp", "desc"), limit(10));
  }, [db, selectedDeviceId]);

  const { data: calls } = useCollection(callsQuery);
  const { data: sms } = useCollection(smsQuery);
  const { data: notifs } = useCollection(notifQuery);

  if (authLoading || devicesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-white/5 bg-card/50 backdrop-blur-xl sticky top-0 z-50 px-6 h-20 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-primary w-6 h-6" />
          <span className="font-headline font-bold text-xl uppercase tracking-tighter">SafeGuard Hub</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </nav>

      <main className="p-6 lg:p-12 max-w-7xl mx-auto space-y-12">
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Device Selection Sidebar */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Monitored Devices</h2>
            <div className="space-y-3">
              {devices?.map(device => (
                <button
                  key={device.id}
                  onClick={() => setSelectedDeviceId(device.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    selectedDeviceId === device.id 
                    ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(139,92,246,0.1)]" 
                    : "bg-card border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <Smartphone className={`w-5 h-5 ${selectedDeviceId === device.id ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{device.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {device.isOnline ? "Online" : "Last sync: " + format(new Date(device.lastSeen), "HH:mm")}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Center */}
          <div className="lg:col-span-3 space-y-8">
            <Card className="bg-card border-white/5 overflow-hidden">
              <CardHeader className="bg-white/5 border-b border-white/5">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" /> Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="calls" className="w-full">
                  <TabsList className="w-full justify-start h-14 bg-transparent border-b border-white/5 rounded-none px-6 gap-6">
                    <TabsTrigger value="calls" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0">Calls</TabsTrigger>
                    <TabsTrigger value="sms" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0">SMS</TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0">Social Media</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="calls" className="m-0">
                    <div className="divide-y divide-white/5">
                      {calls && calls.length > 0 ? calls.map((call: any) => (
                        <div key={call.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${call.type === 'missed' ? 'bg-destructive/20 text-destructive' : 'bg-green-500/20 text-green-500'}`}>
                              <Phone className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold">{call.contactName || call.phoneNumber}</p>
                              <p className="text-xs text-muted-foreground">{format(new Date(call.timestamp), "MMM d, HH:mm")} • {call.durationSeconds}s</p>
                            </div>
                          </div>
                          {call.isRecorded && (
                            <Button size="sm" variant="outline" className="gap-2 rounded-full border-primary/50 text-primary hover:bg-primary/10">
                              <Play className="w-3 h-3 fill-current" /> Recording
                            </Button>
                          )}
                        </div>
                      )) : <div className="p-12 text-center text-muted-foreground">No call logs available.</div>}
                    </div>
                  </TabsContent>

                  <TabsContent value="sms" className="m-0">
                    <div className="divide-y divide-white/5">
                      {sms && sms.length > 0 ? sms.map((msg: any) => (
                        <div key={msg.id} className="p-6 flex gap-4 hover:bg-white/5 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
                            <MessageSquare className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <p className="font-bold text-sm">{msg.phoneNumber}</p>
                              <p className="text-[10px] text-muted-foreground">{format(new Date(msg.timestamp), "HH:mm")}</p>
                            </div>
                            <p className="text-sm text-muted-foreground italic">"{msg.messageBody}"</p>
                          </div>
                        </div>
                      )) : <div className="p-12 text-center text-muted-foreground">No SMS logs available.</div>}
                    </div>
                  </TabsContent>

                  <TabsContent value="notifications" className="m-0">
                    <div className="divide-y divide-white/5">
                      {notifs && notifs.length > 0 ? notifs.map((notif: any) => (
                        <div key={notif.id} className="p-6 flex gap-4 hover:bg-white/5 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0">
                            <Bell className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-[10px] py-0">{notif.appName}</Badge>
                              <p className="text-[10px] text-muted-foreground">{format(new Date(notif.timestamp), "MMM d, HH:mm")}</p>
                            </div>
                            <p className="text-sm font-bold">{notif.title}</p>
                            <p className="text-sm text-muted-foreground">{notif.content}</p>
                          </div>
                        </div>
                      )) : <div className="p-12 text-center text-muted-foreground">No social notifications captured.</div>}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Live Telemetry Overview */}
            {devices?.find(d => d.id === selectedDeviceId) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border-white/5">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                      <Battery className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Battery Level</p>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold">{devices.find(d => d.id === selectedDeviceId).batteryLevel}%</span>
                        <Progress value={devices.find(d => d.id === selectedDeviceId).batteryLevel} className="flex-1 h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-white/5">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Current GPS</p>
                      <p className="text-sm font-mono font-bold">
                        {devices.find(d => d.id === selectedDeviceId).currentLat.toFixed(4)}, {devices.find(d => d.id === selectedDeviceId).currentLng.toFixed(4)}
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
