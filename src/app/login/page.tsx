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
import { Shield, Loader2, Smartphone, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  
  // Only allow signup if the user is coming from the "Install Agent" path
  const isAgentSetup = roleContext === "child";

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      if (isAgentSetup) router.push("/device");
      else router.push("/dashboard");
    }
  }, [user, loading, isAgentSetup, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!auth || !db) {
      setError("Firebase not properly initialized. Check your configuration.");
      return;
    }

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      if (isAgentSetup) {
        // Create account on the child's device
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

        toast({ title: "Agent Registered", description: "This device is now linked to your vault." });
        router.push("/device");
      } else {
        // Parent Login only
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Authenticated", description: "Welcome back to the SafeGuard Hub." });
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let message = "An unexpected error occurred.";
      if (err.code === 'auth/invalid-api-key') message = "Invalid Firebase API Key. Check .env file.";
      else if (err.code === 'auth/user-not-found') message = "Account not found. Did you register via the Agent App?";
      else if (err.code === 'auth/wrong-password') message = "Incorrect password.";
      else if (err.code === 'auth/email-already-in-use') message = "This email is already registered.";
      else message = err.message;
      
      setError(message);
      toast({
        variant: "destructive",
        title: "Auth Error",
        description: message
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 selection:bg-primary/30">
      <Card className="w-full max-w-md bg-zinc-900/50 border-white/5 shadow-2xl backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-2xl shadow-primary/20">
            {isAgentSetup ? <Smartphone className="text-white w-8 h-8" /> : <Shield className="text-white w-8 h-8" />}
          </div>
          <CardTitle className="text-3xl font-bold text-white tracking-tighter">
            {isAgentSetup ? "Agent Setup" : "Parent Portal"}
          </CardTitle>
          <CardDescription className="text-zinc-500 font-medium">
            {isAgentSetup 
              ? "Initialize this device into the SafeGuard fleet." 
              : "Access real-time telemetry from your linked devices."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Authentication Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-400 text-xs font-black uppercase tracking-widest">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@safeguard.io" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/50 border-white/5 focus:border-primary h-12 rounded-xl text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-400 text-xs font-black uppercase tracking-widest">Vault Key</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black/50 border-white/5 focus:border-primary h-12 rounded-xl text-white"
              />
            </div>
            
            <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl shadow-primary/10" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : (isAgentSetup ? "REGISTER AGENT" : "AUTHENTICATE")}
            </Button>
            
            <div className="text-center">
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">
                {isAgentSetup 
                  ? "This device will be visible to the master vault account." 
                  : "Authorized personnel only. Logs are end-to-end encrypted."}
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
