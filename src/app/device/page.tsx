
"use client";

import { useState, useEffect } from "react";
import { useUser, useFirestore } from "@/firebase";
import { doc, setDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Radio, Battery, MapPin, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function DeviceSimulator() {
  const { user } = useUser();
  const db = useFirestore();
  
  const [battery, setBattery] = useState(85);
  const [isReporting, setIsReporting] = useState(false);
  const [lat, setLat] = useState(37.7749);
  const [lng, setLng] = useState(-122.4194);

  // Simulate background location updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReporting && db && user) {
      interval = setInterval(() => {
        // Minor movement simulation
        const newLat = lat + (Math.random() - 0.5) * 0.001;
        const newLng = lng + (Math.random() - 0.5) * 0.001;
        const newBattery = Math.max(0, battery - 0.1);
        
        setLat(newLat);
        setLng(newLng);
        setBattery(newBattery);

        const deviceId = `device_${user.uid}`;
        const deviceRef = doc(db, "devices", deviceId);
        
        // Update current status
        setDoc(deviceRef, {
          id: deviceId,
          name: `${user.email?.split("@")[0]}'s iPhone`,
          batteryLevel: Math.floor(newBattery),
          lastSeen: new Date().toISOString(),
          isOnline: true,
          parentUid: user.uid, // In a real app, this would be the linked parent UID
          childUid: user.uid,
          currentLat: newLat,
          currentLng: newLng
        }, { merge: true });

        // Log history
        addDoc(collection(db, "devices", deviceId, "locations"), {
          deviceId,
          latitude: newLat,
          longitude: newLng,
          timestamp: new Date().toISOString()
        });

      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isReporting, db, user, lat, lng, battery]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-44 border-4 border-muted rounded-[2.5rem] p-4 bg-black shadow-2xl relative">
              <div className="w-12 h-1 bg-muted mx-auto rounded-full mb-4" />
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <ShieldCheck className={`w-8 h-8 ${isReporting ? 'text-primary' : 'text-muted-foreground'}`} />
                {isReporting && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
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
              <CardTitle className="text-2xl font-bold">Managed Device</CardTitle>
              <Badge variant={isReporting ? "default" : "secondary"}>
                {isReporting ? "Active Monitoring" : "Standby"}
              </Badge>
            </div>
            <CardDescription>
              This device is linked to the Family Hub. Monitoring is transparent.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl flex flex-col items-center gap-2">
                <Battery className="w-5 h-5 text-primary" />
                <span className="text-xl font-bold">{Math.floor(battery)}%</span>
                <span className="text-[10px] uppercase text-muted-foreground">Battery</span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl flex flex-col items-center gap-2">
                <MapPin className="w-5 h-5 text-secondary" />
                <span className="text-xs font-mono">{lat.toFixed(4)}, {lng.toFixed(4)}</span>
                <span className="text-[10px] uppercase text-muted-foreground">GPS Location</span>
              </div>
            </div>

            <Button 
              size="lg" 
              className={`w-full h-16 rounded-2xl text-lg font-bold shadow-xl transition-all ${isReporting ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'}`}
              onClick={() => {
                setIsReporting(!isReporting);
                toast({
                  title: isReporting ? "Monitoring Disabled" : "Monitoring Enabled",
                  description: isReporting ? "Your location is no longer being shared." : "Location sharing is now active and transparent."
                });
              }}
            >
              {isReporting ? "Disable Tracking" : "Start Location Service"}
            </Button>
          </CardContent>
        </Card>

        <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex gap-3 items-center">
          <Radio className="text-primary w-5 h-5 shrink-0" />
          <p className="text-[10px] italic text-primary/80 leading-relaxed">
            Policy Notice: This device reports periodic heartbeat telemetry. A persistent notification will be displayed on the device status bar.
          </p>
        </div>
      </div>
    </div>
  );
}
