
"use client";

import { useUser, useCollection, useFirestore } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { collection, query, where } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, Battery, Clock, Smartphone, Plus, Settings, LogOut, ShieldCheck } from "lucide-react";
import { format } from "date-fns";

export default function ParentDashboard() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const devicesQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, "devices"), where("parentUid", "==", user.uid));
  }, [db, user]);

  const { data: devices, loading: devicesLoading } = useCollection(devicesQuery);

  if (authLoading || devicesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShieldCheck className="w-12 h-12 text-primary animate-pulse mx-auto" />
          <p className="text-muted-foreground animate-pulse">Loading secure dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-white/5 bg-card/50 backdrop-blur-xl sticky top-0 z-50 px-6 h-20 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-primary w-6 h-6" />
          <span className="font-headline font-bold text-xl">Family Hub</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="hidden md:flex gap-2">
            <Plus className="w-4 h-4" /> Add Device
          </Button>
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </nav>

      <main className="p-6 lg:p-12 max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground tracking-wide">Monitoring {devices?.length || 0} active devices across your family.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Map View Placeholder */}
          <Card className="lg:col-span-2 h-[500px] bg-card border-white/5 overflow-hidden relative group">
            <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/1200/800')] bg-cover bg-center grayscale opacity-40 group-hover:grayscale-0 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="relative p-8 h-full flex flex-col justify-end">
              <div className="bg-black/50 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-fit">
                <p className="text-sm font-bold flex items-center gap-2">
                  <MapPin className="text-primary w-4 h-4" /> Global Family View
                </p>
                <p className="text-xs text-muted-foreground">All devices reporting normal activity.</p>
              </div>
            </div>
            
            {/* Mock Markers */}
            {devices?.map((dev, idx) => (
              <div 
                key={dev.id} 
                className="absolute w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_rgba(139,92,246,0.6)] animate-ping"
                style={{ top: `${30 + idx * 20}%`, left: `${40 + idx * 15}%` }}
              />
            ))}
          </Card>

          {/* Device List */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Smartphone className="w-5 h-5" /> Managed Devices
            </h2>
            {devices && devices.length > 0 ? (
              devices.map((device) => (
                <Card key={device.id} className="bg-card border-white/5 hover:border-primary/20 transition-all overflow-hidden">
                  <CardHeader className="p-6 pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={device.isOnline ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}>
                        {device.isOnline ? "Online" : "Last seen " + format(new Date(device.lastSeen), "p")}
                      </Badge>
                      <Battery className={device.batteryLevel < 20 ? "text-destructive" : "text-primary"} />
                    </div>
                    <CardTitle className="text-lg">{device.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Battery Level</span>
                          <span>{device.batteryLevel}%</span>
                        </div>
                        <Progress value={device.batteryLevel} className="h-1.5" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>Last sync: {format(new Date(device.lastSeen), "MMM d, HH:mm")}</span>
                      </div>
                      <Button variant="outline" className="w-full text-xs h-8">View History</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="p-8 border border-dashed border-white/10 rounded-3xl text-center">
                <p className="text-sm text-muted-foreground">No devices linked yet.</p>
                <Button variant="link" className="text-primary mt-2">Generate Setup Link</Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
