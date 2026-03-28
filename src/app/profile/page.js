"use client";
import ProfileView from "@/components/ProfileView";
import Navbar from "@/components/Navbar";
import AIChatbot from "@/components/AIChatbot";

export default function ProfilePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f4f7ff]">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none -translate-y-12"></div>
      <Navbar />
      <ProfileView />
      <AIChatbot />
    </div>
  );
}
