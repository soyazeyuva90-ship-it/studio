
"use client";

import { useState, useEffect } from "react";
import { useUser, useFirestore } from "@/firebase";
import { doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Radio, Battery, MapPin, ShieldCheck, Loader2, Phone, MessageSquare, Bell, Mic, Wifi, Signal, Power } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function DeviceAgent() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  
  const [battery, setBattery] = useState(88);
  const [isReporting, setIsReporting] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [lat, setLat] = useState(34.0522);
  const [lng, setLng] = useState(-118.2437);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login?role=child");
  }, [user, authLoading, router]);

  // Simulated Background Service
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReporting && db && user) {
      interval = setInterval(() => {
        const newLat = lat + (Math.random() - 0.5) * 0.0003;
        const newLng = lng + (Math.random() - 0.5) * 0.0003;
        const newBattery = Math.max(1, battery - 0.02);
        
        setLat(newLat);
        setLng(newLng);
        setBattery(newBattery);

        const deviceId = `device_${user.uid}`;
        const deviceRef = doc(db, "devices", deviceId);
        
        setDoc(deviceRef, {
          id: deviceId,
          name: `${user.displayName || user.email?.split("@")[0]}'s Managed Device`,
          batteryLevel: Math.floor(newBattery),
          lastSeen: new Date().toISOString(),
          isOnline: true,
          parentUid: user.uid, // In production, this would be a linked parent's UID
          childUid: user.uid,
          currentLat: newLat,
          currentLng: newLng
        }, { merge: true });
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isReporting, db, user, lat, lng, battery]);

  async function simulateCall() {
    if (!db || !user) return;
    setIsCalling(true);
    const deviceId = `device_${user.uid}`;
    
    // Auto-save log after simulation completes
    setTimeout(async () => {
      await addDoc(collection(db, "devices", deviceId, "calls"), {
        deviceId,
        phoneNumber: "+1 (310) 900-1122",
        contactName: "Alex Rivera",
        type: "incoming",
        durationSeconds: 142,
        timestamp: new Date().toISOString(),
        isRecorded: true,
        recordingUrl: "https://example.com/vault/rec_092.mp3"
      });
      setIsCalling(false);
      toast({
        title: "Call Log Synchronized",
        description: "Encrypted recording uploaded to Parent Hub."
      });
    }, 4000);
  }

  async function simulateSms() {
    if (!db || !user) return;
    const deviceId = `device_${user.uid}`;
    await addDoc(collection(db, "devices", deviceId, "sms"), {
      deviceId,
      phoneNumber: "555-010-998",
      messageBody: "I'll be home in 10 minutes. Don't worry!",
      type: "inbox",
      timestamp: new Date().toISOString()
    });
    toast({ title: "SMS Data Synced", description: "Metadata securely logged." });
  }

  async function simulateNotification() {
    if (!db || !user) return;
    const deviceId = `device_${user.uid}`;
    await addDoc(collection(db, "devices", deviceId, "notifications"), {
      deviceId,
      appName: "Instagram",
      title: "New Message from @j_doe",
      content: "Hey! Are we still meeting at the park?",
      timestamp: new Date().toISOString()
    });
    toast({ title: "Interception Active", description: "Social notification captured." });
  }

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-black"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 sm:p-12 font-body selection:bg-primary/40">
      <div className="w-full max-w-sm space-y-10">
        
        {/* Fake OS Status Bar */}
        <header className="flex justify-between items-center text-white/40 px-4">
          <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em]">
            <ShieldCheck className="w-4 h-4 text-primary animate-pulse" /> 
            SafeGuard Agent v2.1
          </div>
          <div className="flex items-center gap-4">
            <Signal className="w-4 h-4" />
            <Wifi className="w-4 h-4" />
            <div className="flex items-center gap-1.5">
               <span className="text-[10px] font-black">{Math.floor(battery)}%</span>
               <Battery className="w-4 h-4 text-green-500" />
            </div>
          </div>
        </header>

        {/* Visual Phone Frame */}
        <div className="flex justify-center">
          <div className="relative group">
            <div className={`w-36 h-64 border-[8px] transition-all duration-700 ${isCalling ? 'border-primary shadow-[0_0_60px_rgba(139,92,246,0.4)]' : 'border-zinc-800 shadow-2xl'} rounded-[3.5rem] p-6 bg-zinc-950 flex flex-col items-center justify-center gap-6 relative overflow-hidden`}>
              {/* Dynamic Glow Background */}
              <div className={`absolute inset-0 transition-opacity duration-1000 ${isReporting ? 'bg-primary/5 opacity-100' : 'opacity-0'}`} />
              
              <div className="w-20 h-1.5 bg-white/5 absolute top-5 rounded-full" />
              
              {isCalling ? (
                <>
                  <Mic className="w-16 h-16 text-primary animate-bounce" />
                  <div className="text-center space-y-1">
                    <span className="text-[8px] text-primary font-black uppercase tracking-[0.2em]">Live Encryption</span>
                    <p className="text-[10px] text-white/50">Recording Active...</p>
                  </div>
                </>
              ) : (
                <>
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${isReporting ? 'bg-primary/20 text-primary scale-110' : 'bg-white/5 text-white/10'}`}>
                    <Radio className={`w-10 h-10 ${isReporting ? 'animate-ping' : ''}`} />
                  </div>
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] text-center">
                    {isReporting ? "Syncing\nTelemetry" : "Standby\nMode"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Agent Controls */}
        <Card className="bg-zinc-900/80 border-white/5 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden rounded-[2.5rem] border-t-white/10">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-headline font-black tracking-tight text-white">Agent Settings</CardTitle>
            <CardDescription className="text-xs font-bold text-white/20 uppercase tracking-widest pt-1">Client ID: AG-{user?.uid.substring(0,6)}</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <Button 
              className={`w-full h-16 rounded-[1.25rem] text-lg font-black tracking-tight transition-all active:scale-95 ${
                isReporting ? 'bg-destructive/20 text-destructive border border-destructive/20 hover:bg-destructive/30' : 'bg-primary shadow-2xl shadow-primary/40 hover:bg-primary/90'
              }`}
              onClick={() => setIsReporting(!isReporting)}
            >
              {isReporting ? <><Power className="w-5 h-5 mr-2" /> Stop Agent</> : <><ShieldCheck className="w-5 h-5 mr-2" /> Start Service</>}
            </Button>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Phone, label: "Sim Call", onClick: simulateCall, color: "text-green-500", bg: "bg-green-500/10" },
                { icon: MessageSquare, label: "Sim SMS", onClick: simulateSms, color: "text-blue-500", bg: "bg-blue-500/10" },
                { icon: Bell, label: "IG Sim", onClick: simulateNotification, color: "text-pink-500", bg: "bg-pink-500/10" },
                { icon: Signal, label: "Heartbeat", onClick: () => toast({ title: "Manual Pulse Sent" }), color: "text-secondary", bg: "bg-secondary/10" }
              ].map((tool, idx) => (
                <button 
                  key={idx}
                  disabled={isCalling}
                  onClick={tool.onClick}
                  className="flex flex-col items-center justify-center p-6 rounded-[1.5rem] bg-white/5 border border-white/5 active:scale-95 hover:bg-white/10 transition-all gap-3 group"
                >
                  <div className={`w-12 h-12 ${tool.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <tool.icon className={`${tool.color} w-6 h-6`} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white/40">{tool.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-6 border-t border-white/5">
               <div className="flex items-center justify-between text-[10px] font-black text-white/20 uppercase tracking-widest">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-3.5 h-3.5 text-secondary" />
                    <span>LOC: {lat.toFixed(4)}, {lng.toFixed(4)}</span>
                  </div>
                  <Badge variant="outline" className="text-[8px] h-5 py-0 border-white/10 text-white/40 font-black">ENCRYPTED</Badge>
               </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-white/20 font-bold px-10 leading-relaxed uppercase tracking-wider">
          Transparent monitoring active. User notifications are displayed for all background activities.
        </p>
      </div>
    </div>
  );
}
