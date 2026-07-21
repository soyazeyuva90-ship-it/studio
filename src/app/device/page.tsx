
"use client";

import { useState, useEffect } from "react";
import { useUser, useFirestore } from "@/firebase";
import { doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Radio, Battery, MapPin, ShieldCheck, Loader2, Phone, MessageSquare, Bell, Mic, Wifi, Signal, Power, MessageCircle, Instagram, Ghost } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function DeviceAgent() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  
  const [battery, setBattery] = useState(92);
  const [isReporting, setIsReporting] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [lat, setLat] = useState(40.7128);
  const [lng, setLng] = useState(-74.0060);

  // If not logged in, force registration on the "app"
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?role=child");
    }
  }, [user, authLoading, router]);

  // Real-time Telemetry Service Simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReporting && db && user) {
      interval = setInterval(async () => {
        const newLat = lat + (Math.random() - 0.5) * 0.0002;
        const newLng = lng + (Math.random() - 0.5) * 0.0002;
        const newBattery = Math.max(1, battery - 0.01);
        
        setLat(newLat);
        setLng(newLng);
        setBattery(newBattery);

        const deviceId = `device_${user.uid}`;
        const deviceRef = doc(db, "devices", deviceId);
        
        await setDoc(deviceRef, {
          id: deviceId,
          name: `${user.displayName || user.email?.split("@")[0]}'s Managed Phone`,
          batteryLevel: Math.floor(newBattery),
          lastSeen: new Date().toISOString(),
          isOnline: true,
          parentUid: user.uid, // In this model, the parent logs into the same account
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
    
    // Simulate Foreground Recording completion
    setTimeout(async () => {
      await addDoc(collection(db, "devices", deviceId, "calls"), {
        deviceId,
        phoneNumber: "+1 (917) 555-0198",
        contactName: "Julian Vance",
        type: "incoming",
        durationSeconds: 312,
        timestamp: new Date().toISOString(),
        isRecorded: true,
        recordingUrl: "https://storage.googleapis.com/safeguard-vault/rec_vance_09.mp3"
      });
      setIsCalling(false);
      toast({
        title: "Call Sync Complete",
        description: "Encrypted log & recording sent to Parent Hub."
      });
    }, 5000);
  }

  async function simulateSocial(platform: string) {
    if (!db || !user) return;
    const deviceId = `device_${user.uid}`;
    let content = "";
    let title = "";
    
    switch(platform) {
      case 'WhatsApp':
        title = "Marcus (WhatsApp)";
        content = "Hey, are we still heading to the old dock tonight?";
        break;
      case 'Snapchat':
        title = "New Snap from Chloe";
        content = "Intercepted preview: 'Check this out!'";
        break;
      case 'Instagram':
        title = "Instagram Direct: @lexi_v";
        content = "You should definitely join us at the party.";
        break;
    }

    await addDoc(collection(db, "devices", deviceId, "notifications"), {
      deviceId,
      appName: platform,
      title,
      content,
      timestamp: new Date().toISOString()
    });
    toast({ title: `${platform} Intercepted`, description: "Social log sent to Dashboard." });
  }

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-black"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 selection:bg-primary/40">
      <div className="w-full max-w-sm space-y-10">
        
        {/* Fake OS Status Bar */}
        <header className="flex justify-between items-center text-white/40 px-4">
          <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em]">
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

        {/* Visual Phone Frame */}
        <div className="flex justify-center">
          <div className="relative group">
            <div className={`w-40 h-72 border-[10px] transition-all duration-700 ${isCalling ? 'border-primary shadow-[0_0_80px_rgba(139,92,246,0.3)]' : 'border-zinc-800 shadow-2xl'} rounded-[4rem] p-6 bg-zinc-950 flex flex-col items-center justify-center gap-6 relative overflow-hidden`}>
              <div className={`absolute inset-0 transition-opacity duration-1000 ${isReporting ? 'bg-primary/5 opacity-100' : 'opacity-0'}`} />
              <div className="w-24 h-1.5 bg-white/5 absolute top-5 rounded-full" />
              
              {isCalling ? (
                <div className="text-center space-y-2 relative z-10">
                  <Mic className="w-12 h-12 text-primary animate-pulse mx-auto" />
                  <p className="text-[8px] text-primary font-black uppercase tracking-widest">Recording...</p>
                </div>
              ) : (
                <>
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${isReporting ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/10'}`}>
                    <Radio className={`w-10 h-10 ${isReporting ? 'animate-ping' : ''}`} />
                  </div>
                  <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] text-center leading-relaxed">
                    {isReporting ? "Live Sync\nActive" : "Agent\nPaused"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Agent Controls */}
        <Card className="bg-zinc-900 border-white/5 shadow-2xl overflow-hidden rounded-[3rem]">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-black text-white">SafeGuard Agent</CardTitle>
            <CardDescription className="text-[9px] font-black text-white/20 uppercase tracking-widest">Version 2.9.1 (Stable)</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <Button 
              className={`w-full h-14 rounded-2xl text-md font-black transition-all ${
                isReporting ? 'bg-destructive/20 text-destructive border border-destructive/20' : 'bg-primary text-white'
              }`}
              onClick={() => setIsReporting(!isReporting)}
            >
              {isReporting ? <Power className="w-4 h-4 mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
              {isReporting ? 'Stop Background Service' : 'Start Monitoring Service'}
            </Button>

            <div className="grid grid-cols-2 gap-3">
                <button disabled={isCalling} onClick={simulateCall} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all gap-2 group">
                  <Phone className="text-green-500 w-5 h-5 group-hover:scale-110" />
                  <span className="text-[8px] font-black uppercase text-white/40">Sim Call</span>
                </button>

                <button onClick={() => simulateSocial('WhatsApp')} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all gap-2 group">
                  <MessageCircle className="text-green-500 w-5 h-5 group-hover:scale-110" />
                  <span className="text-[8px] font-black uppercase text-white/40">WhatsApp</span>
                </button>

                <button onClick={() => simulateSocial('Snapchat')} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all gap-2 group">
                  <Ghost className="text-yellow-500 w-5 h-5 group-hover:scale-110" />
                  <span className="text-[8px] font-black uppercase text-white/40">Snapchat</span>
                </button>

                <button onClick={() => simulateSocial('Instagram')} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all gap-2 group">
                  <Instagram className="text-pink-500 w-5 h-5 group-hover:scale-110" />
                  <span className="text-[8px] font-black uppercase text-white/40">Instagram</span>
                </button>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[8px] font-black text-white/20 uppercase tracking-widest">
                  <MapPin className="w-3 h-3 text-primary" />
                  <span>GPS Sync: {isReporting ? 'OK' : 'OFF'}</span>
                </div>
                <Badge variant="outline" className="text-[8px] border-white/10 text-white/40">ENCRYPTED</Badge>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-[9px] text-white/20 font-bold px-10 leading-relaxed uppercase tracking-widest">
          Account connected: {user?.email}<br/>
          Persistent notification visible to user.
        </p>
      </div>
    </div>
  );
}
