"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithGoogle } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";
import { useAuth } from "@/lib/useAuth";

// Import new modular components
import Navbar from "./landing/Navbar";
import Hero from "./landing/Hero";
import Features from "./landing/Features";
import { Stats, Footer } from "./landing/StatsFooter";

export default function LandingView() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      showToast("Signed in successfully!", "success");
      router.push("/dashboard");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-700 bg-white">
      <Navbar />
      <main>
        <Hero onGoogleLogin={handleGoogleLogin} />
        <Features />
        <Stats />
      </main>
      <Footer />
    </div>
  );
}

