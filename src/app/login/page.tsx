
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Loader2, Smartphone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const db = useFirestore();
  const initialRole = searchParams.get("role") || "parent";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(initialRole === "child"); // Default to signup if child app simulation

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!auth || !db) return;

    setLoading(true);
    try {
      if (isSignUp) {
        // Signup is only allowed for the "child" role simulation
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const displayName = email.split("@")[0];
        
        await updateProfile(userCredential.user, { displayName });
        
        // Save profile with child role
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          email,
          role: "child",
          displayName: displayName,
          createdAt: new Date().toISOString()
        });

        // Redirect to the agent controller
        router.push("/device");
      } else {
        // Login for Parents or already registered Child Agent
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        const userData = userDoc.data();
        
        // If parent login from website, go to dashboard
        // Note: In this simple implementation, the account created on the app 
        // acts as both child and parent identity for ease of use as requested.
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-card border-white/5 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4">
            {isSignUp ? <Smartphone className="text-white w-7 h-7" /> : <Shield className="text-white w-7 h-7" />}
          </div>
          <CardTitle className="text-3xl font-bold">
            {isSignUp ? "Agent Installation" : "Parent Login"}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? "Create a SafeGuard account for this device." 
              : "Access the monitoring dashboard with your credentials."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Account Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50 border-white/10 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/50 border-white/10 focus:border-primary"
              />
            </div>
            <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? "Register Managed Device" : "Authorize & Login")}
            </Button>
            
            {!isSignUp && (
              <div className="text-center text-xs text-muted-foreground mt-4 leading-relaxed">
                If you haven't installed the agent yet, please download the APK on your child's phone first.
              </div>
            )}
            
            {initialRole === "child" && (
                <button 
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="w-full text-xs text-primary hover:underline font-medium mt-2"
                >
                  {isSignUp ? "Already have an agent account? Sign In" : "Need to register this phone? Create account"}
                </button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-primary" /></div>}>
      <LoginFormContent />
    </Suspense>
  );
}
