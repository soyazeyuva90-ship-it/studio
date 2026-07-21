
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

  useEffect(() => {
    if (!authLoading && !user) router.push("/login?role=child");
  }, [user, authLoading, router]);

  // Simulated Foreground Service Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReporting && db && user) {
      interval = setInterval(() => {
        const newLat = lat + (Math.random() - 0.5) * 0.0002;
        const newLng = lng + (Math.random() - 0.5) * 0.0002;
        const newBattery = Math.max(1, battery - 0.01);
        
        setLat(newLat);
        setLng(newLng);
        setBattery(newBattery);

        const deviceId = `device_${user.uid}`;
        const deviceRef = doc(db, "devices", deviceId);
        
        setDoc(deviceRef, {
          id: deviceId,
          name: `${user.displayName || user.email?.split("@")[0]}'s Primary Device`,
          batteryLevel: Math.floor(newBattery),
          lastSeen: new Date().toISOString(),
          isOnline: true,
          parentUid: user.uid, // Simulated linking
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
    
    // Simulate Surround Recording completion
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
        title: "Security Event Uploaded",
        description: "Encrypted call recording synced to Parent Hub."
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
        content = "Click to view snap - Intercepted preview: 'Check this out!'";
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
    toast({ title: `${platform} Intercepted`, description: "Social notification captured and synced." });
  }

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-black"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 sm:p-12 selection:bg-primary/40">
      <div className="w-full max-w-sm space-y-10">
        
        {/* Fake OS Status Bar */}
        <header className="flex justify-between items-center text-white/40 px-4">
          <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em]">
            <ShieldCheck className="w-4 h-4 text-primary animate-pulse" /> 
            SafeGuard Agent ACTIVE
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
            <div className={`w-40 h-72 border-[10px] transition-all duration-700 ${isCalling ? 'border-primary shadow-[0_0_80px_rgba(139,92,246,0.3)]' : 'border-zinc-800 shadow-2xl'} rounded-[4rem] p-6 bg-zinc-950 flex flex-col items-center justify-center gap-6 relative overflow-hidden`}>
              <div className={`absolute inset-0 transition-opacity duration-1000 ${isReporting ? 'bg-primary/5 opacity-100' : 'opacity-0'}`} />
              <div className="w-24 h-1.5 bg-white/5 absolute top-5 rounded-full" />
              
              {isCalling ? (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse rounded-full" />
                    <Mic className="w-16 h-16 text-primary animate-bounce relative z-10" />
                  </div>
                  <div className="text-center space-y-1">
                    <span className="text-[8px] text-primary font-black uppercase tracking-[0.2em]">Surround Rec</span>
                    <p className="text-[10px] text-white/50">Uploading...</p>
                  </div>
                </>
              ) : (
                <>
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${isReporting ? 'bg-primary/20 text-primary scale-110' : 'bg-white/5 text-white/10'}`}>
                    <Radio className={`w-12 h-12 ${isReporting ? 'animate-ping' : ''}`} />
                  </div>
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] text-center leading-relaxed">
                    {isReporting ? "Syncing\nTelemetry" : "Agent\nPaused"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Agent Controls */}
        <Card className="bg-zinc-900/90 border-white/5 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden rounded-[3rem] border-t-white/10">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-black tracking-tight text-white">Agent Control</CardTitle>
            <CardDescription className="text-[9px] font-black text-white/20 uppercase tracking-widest pt-1">SafeGuard Secure v2.9</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <Button 
              className={`w-full h-16 rounded-3xl text-lg font-black tracking-tight transition-all active:scale-95 ${
                isReporting ? 'bg-destructive/20 text-destructive border border-destructive/20 hover:bg-destructive/30' : 'bg-primary shadow-2xl shadow-primary/30 hover:bg-primary/90 text-white'
              }`}
              onClick={() => setIsReporting(!isReporting)}
            >
              {isReporting ? <><Power className="w-5 h-5 mr-2" /> Stop Agent Service</> : <><ShieldCheck className="w-5 h-5 mr-2" /> Start Safety Sync</>}
            </Button>

            <div className="grid grid-cols-2 gap-4">
                <button disabled={isCalling} onClick={simulateCall} className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/5 border border-white/5 active:scale-95 hover:bg-white/10 transition-all gap-3 group">
                  <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="text-green-500 w-6 h-6" />
                  </div>
                  <span className="text-[9px] font-black uppercase text-white/40">Sim Call</span>
                </button>

                <button onClick={() => simulateSocial('WhatsApp')} className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/5 border border-white/5 active:scale-95 hover:bg-white/10 transition-all gap-3 group">
                  <div className="w-12 h-12 bg-green-600/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle className="text-green-500 w-6 h-6" />
                  </div>
                  <span className="text-[9px] font-black uppercase text-white/40">WhatsApp</span>
                </button>

                <button onClick={() => simulateSocial('Snapchat')} className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/5 border border-white/5 active:scale-95 hover:bg-white/10 transition-all gap-3 group">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Ghost className="text-yellow-500 w-6 h-6" />
                  </div>
                  <span className="text-[9px] font-black uppercase text-white/40">Snapchat</span>
                </button>

                <button onClick={() => simulateSocial('Instagram')} className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/5 border border-white/5 active:scale-95 hover:bg-white/10 transition-all gap-3 group">
                  <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Instagram className="text-pink-500 w-6 h-6" />
                  </div>
                  <span className="text-[9px] font-black uppercase text-white/40">Instagram</span>
                </button>
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

        <p className="text-center text-[10px] text-white/20 font-bold px-10 leading-relaxed uppercase tracking-widest">
          Transparent monitoring enabled. A persistent notification is displayed while sync is active.
        </p>
      </div>
    </div>
  );
}
