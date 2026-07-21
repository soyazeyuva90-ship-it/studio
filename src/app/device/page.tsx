
"use client";

import { useState, useEffect } from "react";
import { useUser, useFirestore } from "@/firebase";
import { doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Radio, Battery, MapPin, ShieldCheck, Loader2, Phone, MessageSquare, Bell, Mic, Wifi, Signal, Power, MessageCircle, Instagram, Ghost, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

/**
 * @fileOverview SafeGuard Mobile Agent Simulator.
 * This acts as the "APK" interface for testing. 
 * Handles real-time telemetry heartbeats and log generation.
 */

export default function DeviceAgent() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  
  const [battery, setBattery] = useState(92);
  const [isReporting, setIsReporting] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [lat, setLat] = useState(40.7128);
  const [lng, setLng] = useState(-74.0060);

  // Requirement: Signups/Registration must happen here
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?role=child");
    }
  }, [user, authLoading, router]);

  // Real-time Telemetry Service Simulation (Heartbeat)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReporting && db && user) {
      interval = setInterval(async () => {
        const newLat = lat + (Math.random() - 0.5) * 0.0005;
        const newLng = lng + (Math.random() - 0.5) * 0.0005;
        const newBattery = Math.max(1, battery - 0.02);
        
        setLat(newLat);
        setLng(newLng);
        setBattery(newBattery);

        const deviceId = `device_${user.uid}`;
        const deviceRef = doc(db, "devices", deviceId);
        
        try {
          await setDoc(deviceRef, {
            id: deviceId,
            userId: user.uid,
            name: `${user.displayName || 'Managed User'}'s Device`,
            batteryLevel: Math.floor(newBattery),
            lastSeen: new Date().toISOString(),
            isOnline: true,
            currentLat: newLat,
            currentLng: newLng,
            model: "Simulator v2.9",
            osVersion: "Android 14"
          }, { merge: true });
        } catch (e) {
          console.error("Sync error:", e);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isReporting, db, user, lat, lng, battery]);

  async function simulateCall() {
    if (!db || !user) return;
    setIsCalling(true);
    const deviceId = `device_${user.uid}`;
    
    toast({ title: "Call Intercepted", description: "Recording initiated in background." });

    setTimeout(async () => {
      await addDoc(collection(db, "devices", deviceId, "calls"), {
        phoneNumber: "+1 (917) " + Math.floor(1000000 + Math.random() * 9000000),
        contactName: "Unknown Participant",
        type: "INCOMING",
        duration: 45,
        timestamp: new Date().toISOString(),
        isRecorded: true
      });
      setIsCalling(false);
      toast({ title: "Log Synced", description: "Encrypted call log uploaded." });
    }, 4000);
  }

  async function simulateSocial(platform: string) {
    if (!db || !user) return;
    const deviceId = `device_${user.uid}`;
    
    await addDoc(collection(db, "devices", deviceId, "sms"), {
      address: platform,
      body: `[Intercepted Notification] New activity detected on ${platform} feed.`,
      type: "RECEIVED",
      timestamp: new Date().toISOString()
    });
    
    toast({ title: "Syncing Notification", description: `${platform} metadata updated.` });
  }

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-black"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-body">
      <div className="w-full max-w-sm space-y-10">
        
        {/* Native UI Header */}
        <header className="flex justify-between items-center text-white/40 px-4">
          <div className="flex items-center gap-2 font-black text-[9px] uppercase tracking-[0.2em]">
            <ShieldCheck className="w-4 h-4 text-primary" /> 
            AGENT ACTIVE
          </div>
          <div className="flex items-center gap-4">
            <Signal className="w-4 h-4" />
            <div className="flex items-center gap-1.5">
               <span className="text-[10px] font-black">{Math.floor(battery)}%</span>
               <Battery className="w-4 h-4 text-green-500" />
            </div>
          </div>
        </header>

        {/* Device Viewport */}
        <div className="flex justify-center">
          <div className="relative">
            <div className={`w-44 h-80 border-[8px] transition-all duration-700 ${isCalling ? 'border-primary shadow-[0_0_80px_rgba(139,92,246,0.2)]' : 'border-zinc-800'} rounded-[3.5rem] p-6 bg-zinc-950 flex flex-col items-center justify-center gap-6 relative overflow-hidden`}>
              <div className={`absolute inset-0 transition-opacity duration-1000 ${isReporting ? 'bg-primary/5 opacity-100' : 'opacity-0'}`} />
              <div className="w-20 h-1.5 bg-white/5 absolute top-4 rounded-full" />
              
              {isCalling ? (
                <div className="text-center space-y-3 relative z-10 animate-pulse">
                  <Mic className="w-10 h-10 text-primary mx-auto" />
                  <p className="text-[7px] text-primary font-black uppercase tracking-widest">Recording Audio</p>
                </div>
              ) : (
                <>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${isReporting ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-white/5 text-white/10'}`}>
                    <Radio className={`w-8 h-8 ${isReporting ? 'animate-ping' : ''}`} />
                  </div>
                  <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.3em] text-center leading-relaxed">
                    {isReporting ? "Syncing\nActive" : "Agent\nPaused"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Control Interface */}
        <Card className="bg-zinc-900/50 border-white/5 shadow-3xl rounded-[2.5rem] overflow-hidden backdrop-blur-md">
          <CardContent className="p-8 space-y-6 text-center">
            <div className="space-y-1 mb-6">
              <h2 className="text-xl font-black text-white tracking-tight">SafeGuard Node</h2>
              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Endpoint Security v2.9</p>
            </div>

            <Button 
              className={`w-full h-14 rounded-2xl text-xs font-black transition-all ${
                isReporting ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-primary text-white shadow-xl shadow-primary/20'
              }`}
              onClick={() => setIsReporting(!isReporting)}
            >
              {isReporting ? <Power className="w-4 h-4 mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
              {isReporting ? 'SUSPEND SERVICE' : 'INITIATE AGENT'}
            </Button>

            <div className="grid grid-cols-2 gap-3 pt-4">
                <button onClick={simulateCall} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all gap-2 group">
                  <Phone className="text-green-500 w-4 h-4" />
                  <span className="text-[7px] font-black uppercase text-zinc-500">Call Log</span>
                </button>
                <button onClick={() => simulateSocial('WhatsApp')} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all gap-2 group">
                  <MessageCircle className="text-blue-400 w-4 h-4" />
                  <span className="text-[7px] font-black uppercase text-zinc-500">WhatsApp</span>
                </button>
                <button onClick={() => simulateSocial('Snapchat')} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all gap-2 group">
                  <Ghost className="text-yellow-500 w-4 h-4" />
                  <span className="text-[7px] font-black uppercase text-zinc-500">Snapchat</span>
                </button>
                <button onClick={() => simulateSocial('Instagram')} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all gap-2 group">
                  <Instagram className="text-pink-500 w-4 h-4" />
                  <span className="text-[7px] font-black uppercase text-zinc-500">Instagram</span>
                </button>
            </div>
            
            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[7px] font-black text-zinc-500 uppercase tracking-widest">
                  <Wifi className="w-3 h-3 text-primary" />
                  <span>Vault Connected</span>
                </div>
                <Badge variant="outline" className="text-[7px] border-white/10 text-zinc-600 font-black">ENCRYPTED</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
