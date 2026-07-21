"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, useFirestore, useUser } from "@/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Loader2, Smartphone, AlertCircle, Terminal } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isFirebaseConfigValid } from "@/firebase/config";

/**
 * @fileOverview Standardized Login/Signup for SafeGuard.
 * Signups are strictly forced through the "Agent" context (role=child).
 */

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const db = useFirestore();
  const { user } = useUser();
  
  const roleContext = searchParams.get("role") || "parent";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isAgentSetup = roleContext === "child";
  const configValid = isFirebaseConfigValid();

  useEffect(() => {
    if (!configValid) {
      setError("Critical Configuration Error: Firebase API Key is missing. Please check your .env file.");
    }
  }, [configValid]);

  useEffect(() => {
    if (user && !loading) {
      if (isAgentSetup) router.push("/device");
      else router.push("/dashboard");
    }
  }, [user, loading, isAgentSetup, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!configValid) {
      setError("Cannot authenticate: Firebase is not configured.");
      return;
    }

    if (!auth || !db) {
      setError("Initialization Error: Service not ready.");
      return;
    }

    if (!email || !password) {
      setError("Required: Email and Password.");
      return;
    }

    setLoading(true);
    try {
      if (isAgentSetup) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const displayName = email.split("@")[0];
        
        await updateProfile(userCredential.user, { displayName });
        
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          email,
          role: "child",
          displayName: displayName,
          createdAt: new Date().toISOString()
        });

        toast({ title: "Agent Provisioned", description: "Node added to secure fleet." });
        router.push("/device");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Authorized", description: "Vault access granted." });
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Authentication Fault:", err);
      let message = "System Access Denied.";
      
      if (err.code === 'auth/invalid-api-key' || err.message.includes('api-key-not-valid')) {
        message = "Configuration Error: Invalid Firebase API Key. Check your environment variables.";
      } else if (err.code === 'auth/user-not-found') {
        message = "Identity not found. Registration must be completed via the Monitoring Agent.";
      } else if (err.code === 'auth/wrong-password') {
        message = "Incorrect vault credentials.";
      } else if (err.code === 'auth/email-already-in-use') {
        message = "This identity is already registered in the fleet.";
      } else {
        message = err.message;
      }
      
      setError(message);
      toast({
        variant: "destructive",
        title: "Access Violation",
        description: message
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 selection:bg-primary/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <Card className="w-full max-w-md bg-zinc-900/40 border-white/5 shadow-3xl backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <CardHeader className="text-center pt-10">
          <div className="mx-auto w-16 h-16 rounded-3xl bg-primary flex items-center justify-center mb-8 shadow-2xl shadow-primary/40 group">
            {isAgentSetup ? <Smartphone className="text-white w-9 h-9" /> : <Shield className="text-white w-9 h-9" />}
          </div>
          <CardTitle className="text-4xl font-black text-white tracking-tighter mb-2 uppercase italic">
            {isAgentSetup ? "Agent Node" : "Command Hub"}
          </CardTitle>
          <CardDescription className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
            {isAgentSetup 
              ? "Initialize endpoint telemetry." 
              : "End-to-end encrypted dashboard."}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 text-destructive rounded-2xl">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-black uppercase text-[10px] tracking-widest">System Error</AlertTitle>
                <AlertDescription className="text-xs font-medium opacity-90 leading-relaxed">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <div className="space-y-1.5 px-1">
                <Label htmlFor="email" className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">User Identification</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@safeguard.net" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-black/40 border-white/5 focus:border-primary/50 h-14 rounded-2xl text-white placeholder:text-zinc-700 transition-all"
                />
              </div>
              <div className="space-y-1.5 px-1">
                <Label htmlFor="password" className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Secure Vault Key</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-black/40 border-white/5 focus:border-primary/50 h-14 rounded-2xl text-white transition-all"
                />
              </div>
            </div>
            
            <Button 
              className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-2xl shadow-primary/20 text-sm tracking-widest uppercase italic transition-all active:scale-[0.98]" 
              disabled={loading || !configValid}
            >
              {loading ? <Loader2 className="animate-spin" /> : (isAgentSetup ? "INITIATE PAIRING" : "BYPASS FIREWALL")}
            </Button>
            
            <div className="pt-4 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-zinc-700">
                <Terminal className="w-3 h-3" />
                <span className="text-[8px] font-black uppercase tracking-[0.3em]">Status: Ready for Handshake</span>
              </div>
              
              <p className="text-[9px] text-zinc-600 font-bold text-center uppercase tracking-widest px-8 leading-relaxed opacity-50">
                {isAgentSetup 
                  ? "Monitored telemetry will be synced to the master control hub." 
                  : "All logs are subject to end-to-end encryption protocols."}
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><Loader2 className="animate-spin w-10 h-10 text-primary" /></div>}>
      <LoginFormContent />
    </Suspense>
  );
}
