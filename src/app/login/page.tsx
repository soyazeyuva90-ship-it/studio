
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
import { Shield, Loader2 } from "lucide-react";
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
  const [isSignUp, setIsSignUp] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!auth || !db) return;

    setLoading(true);
    try {
      if (isSignUp && initialRole === "child") {
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
        
        router.push("/device");
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        const userData = userDoc.data();
        
        if (userData?.role === "parent") {
          router.push("/dashboard");
        } else {
          router.push("/device");
        }
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
            <Shield className="text-white w-7 h-7" />
          </div>
          <CardTitle className="text-3xl font-bold">
            {initialRole === "parent" ? "Parent Access" : "Agent Setup"}
          </CardTitle>
          <CardDescription>
            {isSignUp ? "Create your SafeGuard account" : "Sign in to access your family dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
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
              {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
            
            {initialRole === "child" ? (
              <div className="text-center text-sm">
                <button 
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-primary hover:underline font-medium"
                >
                  {isSignUp ? "Already have an account? Sign in" : "Need to register? Create account"}
                </button>
              </div>
            ) : (
              <div className="text-center text-xs text-muted-foreground mt-4">
                Signups are restricted to the SafeGuard Mobile Agent. 
                Please install the application on the target device to register.
              </div>
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
