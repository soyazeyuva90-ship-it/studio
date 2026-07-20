
"use client";

import { useState, useEffect } from "react";
import { useUser, useFirestore } from "@/firebase";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Radio, Battery, MapPin, ShieldCheck, Loader2, Phone, MessageSquare, Bell, Mic, Wifi, Signal } from "lucide-react";
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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReporting && db && user) {
      interval = setInterval(() => {
        const newLat = lat + (Math.random() - 0.5) * 0.0005;
        const newLng = lng + (Math.random() - 0.5) * 0.0005;
        const newBattery = Math.max(0, battery - 0.05);
        
        setLat(newLat);
        setLng(newLng);
        setBattery(newBattery);

        const deviceId = `device_${user.uid}`;
        const deviceRef = doc(db, "devices", deviceId);
        
        setDoc(deviceRef, {
          id: deviceId,
          name: `${user.displayName || user.email?.split("@")[0]}'s iPhone`,
          batteryLevel: Math.floor(newBattery),
          lastSeen: new Date().toISOString(),
          isOnline: true,
          parentUid: user.uid, // In a real app, this would be the parent's UID
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
    
    setTimeout(async () => {
      await addDoc(collection(db, "devices", deviceId, "calls"), {
        deviceId,
        phoneNumber: "+1 (415) 555-0199",
        contactName: "Ryan Sparks",
        type: "incoming",
        durationSeconds: 156,
        timestamp: new Date().toISOString(),
        isRecorded: true,
        recordingUrl: "https://example.com/recordings/call_v2.mp3"
      });
      setIsCalling(false);
      toast({
        title: "Call Synchronized",
        description: "Recording successfully uploaded to Parent Hub."
      });
    }, 4000);
  }

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        
        <header className="flex justify-between items-center text-white/50 px-2">
          <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-tighter">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> 
            SafeGuard Agent
          </div>
          <div className="flex items-center gap-3">
            <Signal className="w-4 h-4" />
            <Wifi className="w-4 h-4" />
            <div className="flex items-center gap-1">
               <span className="text-[10px] font-bold">{Math.floor(battery)}%</span>
               <Battery className="w-4 h-4" />
            </div>
          </div>
        </header>

        <div className="flex justify-center">
          <div className="relative">
            <div className={`w-32 h-60 border-[6px] ${isCalling ? 'border-primary shadow-[0_0_40px_rgba(139,92,246,0.3)] animate-pulse' : 'border-white/10'} rounded-[3rem] p-4 bg-zinc-950 flex flex-col items-center justify-center gap-4 transition-all duration-700`}>
              <div className="w-16 h-1 bg-white/5 absolute top-4 rounded-full" />
              {isCalling ? (
                <>
                  <Mic className="w-12 h-12 text-primary animate-bounce" />
                  <span className="text-[10px] text-primary font-black uppercase tracking-widest text-center">Encrypted<br/>Recording...</span>
                </>
              ) : (
                <>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isReporting ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/20'}`}>
                    <Radio className={`w-8 h-8 ${isReporting ? 'animate-ping' : ''}`} />
                  </div>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    {isReporting ? "Sync Active" : "Standby"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <Card className="bg-zinc-900 border-white/5 shadow-2xl overflow-hidden rounded-[2rem]">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-headline tracking-tighter">Device Controls</CardTitle>
            <CardDescription className="text-xs">Agent v2.0.4 is running in foreground</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <Button 
              className={`w-full h-16 rounded-2xl text-lg font-black tracking-tighter transition-all ${
                isReporting ? 'bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20' : 'bg-primary shadow-xl shadow-primary/30'
              }`}
              onClick={() => setIsReporting(!isReporting)}
            >
              {isReporting ? "Disable Agent" : "Enable Agent"}
            </Button>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Phone, label: "Sim Call", onClick: simulateCall, color: "text-green-500", bg: "bg-green-500/10" },
                { icon: MessageSquare, label: "Sim SMS", onClick: () => toast({ title: "SMS Captured" }), color: "text-blue-500", bg: "bg-blue-500/10" },
                { icon: Bell, label: "IG Sim", onClick: () => toast({ title: "IG Notification Sent" }), color: "text-pink-500", bg: "bg-pink-500/10" },
                { icon: ShieldCheck, label: "Status", onClick: () => toast({ title: "Self-Check Passed" }), color: "text-primary", bg: "bg-primary/10" }
              ].map((tool, idx) => (
                <button 
                  key={idx}
                  disabled={isCalling}
                  onClick={tool.onClick}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 active:scale-95 transition-all gap-2"
                >
                  <div className={`w-10 h-10 ${tool.bg} rounded-xl flex items-center justify-center`}>
                    <tool.icon className={`${tool.color} w-5 h-5`} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">{tool.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-white/5">
               <div className="flex items-center justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-secondary" />
                    <span>Location: {lat.toFixed(4)}, {lng.toFixed(4)}</span>
                  </div>
                  <Badge variant="outline" className="text-[8px] h-4 py-0 border-white/10 text-white/40">Secure</Badge>
               </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-white/20 font-medium px-8 leading-relaxed">
          The child user is aware this application is active. No data is collected without user-friendly foreground notifications.
        </p>
      </div>
    </div>
  );
}
