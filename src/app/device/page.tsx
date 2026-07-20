
"use client";

import { useState, useEffect } from "react";
import { useUser, useFirestore } from "@/firebase";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Radio, Battery, MapPin, ShieldCheck, Loader2, Phone, MessageSquare, Bell, Mic } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function DeviceSimulator() {
  const { user } = useUser();
  const db = useFirestore();
  
  const [battery, setBattery] = useState(85);
  const [isReporting, setIsReporting] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [lat, setLat] = useState(37.7749);
  const [lng, setLng] = useState(-122.4194);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReporting && db && user) {
      interval = setInterval(() => {
        const newLat = lat + (Math.random() - 0.5) * 0.001;
        const newLng = lng + (Math.random() - 0.5) * 0.001;
        const newBattery = Math.max(0, battery - 0.1);
        
        setLat(newLat);
        setLng(newLng);
        setBattery(newBattery);

        const deviceId = `device_${user.uid}`;
        const deviceRef = doc(db, "devices", deviceId);
        
        setDoc(deviceRef, {
          id: deviceId,
          name: `${user.email?.split("@")[0]}'s Device`,
          batteryLevel: Math.floor(newBattery),
          lastSeen: new Date().toISOString(),
          isOnline: true,
          parentUid: user.uid,
          childUid: user.uid,
          currentLat: newLat,
          currentLng: newLng
        }, { merge: true });
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [isReporting, db, user, lat, lng, battery]);

  async function simulateCall() {
    if (!db || !user) return;
    setIsCalling(true);
    const deviceId = `device_${user.uid}`;
    
    // Simulate call connection and automatic recording start
    setTimeout(async () => {
      await addDoc(collection(db, "devices", deviceId, "calls"), {
        deviceId,
        phoneNumber: "+1 (555) 012-3456",
        contactName: "Alex Thompson",
        type: "incoming",
        durationSeconds: 124,
        timestamp: new Date().toISOString(),
        isRecorded: true,
        recordingUrl: "https://example.com/recordings/call_001.mp3"
      });
      setIsCalling(false);
      toast({
        title: "Call Ended",
        description: "Call recorded and uploaded to Family Hub automatically."
      });
    }, 5000);
  }

  async function simulateSms() {
    if (!db || !user) return;
    const deviceId = `device_${user.uid}`;
    await addDoc(collection(db, "devices", deviceId, "sms"), {
      deviceId,
      phoneNumber: "+1 (555) 987-6543",
      messageBody: "Hey, are we still meeting at the park at 5?",
      type: "inbox",
      timestamp: new Date().toISOString()
    });
    toast({ title: "SMS Intercepted", description: "Message synced to dashboard." });
  }

  async function simulateNotification(app: string) {
    if (!db || !user) return;
    const deviceId = `device_${user.uid}`;
    const content = app === "Instagram" ? "Liked your photo." : "Sent you a snap!";
    await addDoc(collection(db, "devices", deviceId, "notifications"), {
      deviceId,
      appName: app,
      title: "New Message",
      content: content,
      timestamp: new Date().toISOString()
    });
    toast({ title: `${app} Sync`, description: "Social notification captured." });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 pb-24">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className={`w-24 h-44 border-4 ${isCalling ? 'border-primary animate-pulse' : 'border-muted'} rounded-[2.5rem] p-4 bg-black shadow-2xl relative transition-colors`}>
              <div className="w-12 h-1 bg-muted mx-auto rounded-full mb-4" />
              <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
                {isCalling ? (
                  <>
                    <Mic className="w-8 h-8 text-primary animate-bounce" />
                    <span className="text-[10px] text-primary font-bold uppercase">Recording...</span>
                  </>
                ) : (
                  <ShieldCheck className={`w-8 h-8 ${isReporting ? 'text-primary' : 'text-muted-foreground'}`} />
                )}
              </div>
            </div>
            {isReporting && (
              <div className="absolute -top-4 -right-4 bg-primary text-white p-2 rounded-full animate-pulse shadow-lg shadow-primary/50">
                <Radio className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>

        <Card className="bg-card border-white/5">
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <CardTitle className="text-2xl font-bold">Client Simulator</CardTitle>
              <Badge variant={isReporting ? "default" : "secondary"}>
                {isReporting ? "Active" : "Standby"}
              </Badge>
            </div>
            <CardDescription>Simulate device activity to test parental monitoring.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className={`w-full h-14 rounded-xl font-bold ${isReporting ? 'bg-destructive' : 'bg-primary'}`}
              onClick={() => setIsReporting(!isReporting)}
            >
              {isReporting ? "Stop Service" : "Start Service"}
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={simulateCall} disabled={isCalling}>
                <Phone className="w-5 h-5 text-green-500" />
                <span className="text-xs">Simulate Call</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={simulateSms}>
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <span className="text-xs">Simulate SMS</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => simulateNotification("Instagram")}>
                <Bell className="w-5 h-5 text-pink-500" />
                <span className="text-xs">IG Notif</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => simulateNotification("Snapchat")}>
                <Bell className="w-5 h-5 text-yellow-500" />
                <span className="text-xs">Snap Notif</span>
              </Button>
            </div>

            <div className="p-4 bg-white/5 rounded-xl space-y-2">
              <div className="flex justify-between text-[10px] text-muted-foreground uppercase">
                <span>Telemetry</span>
                <span>Live GPS</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Battery className="w-4 h-4 text-primary" />
                  <span className="font-bold">{Math.floor(battery)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-secondary" />
                  <span className="text-[10px] font-mono">{lat.toFixed(3)}, {lng.toFixed(3)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
