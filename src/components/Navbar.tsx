"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Shield, Smartphone, LogOut } from "lucide-react";
import { useUser, useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

export function Navbar() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  async function handleLogout() {
    if (auth) {
      await signOut(auth);
      router.push("/");
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between glass-morphism border-b border-white/5">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center neon-border shadow-primary/20 group-hover:scale-110 transition-transform">
          <Shield className="text-white w-6 h-6" />
        </div>
        <span className="font-headline font-bold text-2xl tracking-tighter text-white">SafeGuard</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground uppercase tracking-widest">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        {user && (
          <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <LayoutGrid className="w-4 h-4" /> Hub
          </Link>
        )}
        <Link href="/device" className="hover:text-primary transition-colors flex items-center gap-1.5">
          <Smartphone className="w-4 h-4" /> Agent App
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="w-5 h-5" />
            </Button>
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 shadow-lg shadow-primary/20">
                Dashboard
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/login?role=parent">
              <Button variant="ghost" className="text-white hover:bg-white/5 rounded-full px-6">
                Login
              </Button>
            </Link>
            <Link href="/login?role=parent">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 shadow-lg shadow-primary/20">
                Get Started
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
