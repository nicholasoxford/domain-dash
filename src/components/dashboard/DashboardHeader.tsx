"use client";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { User } from "@supabase/supabase-js";
import MobileMenuButton from "../MobileMenuButton";
import { UserDropdown } from "./UserDropdown";
import { LoginModal } from "@/app/(dashboard)/marketplace/[domain]/register/LoginModal";
import { useState } from "react";

interface DashboardHeaderProps {
  user?: User;
  profile: any;
  isSubscribed: boolean;
}

export function DashboardHeader({
  user,
  profile,
  isSubscribed,
}: DashboardHeaderProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/95 backdrop-blur-xl">
      <div className="h-full px-4 lg:px-8 flex items-center justify-between">
        <MobileMenuButton />
        <a href="/dashboard" className="text-lg font-medium text-white">
          Dashboard
        </a>

        <div className="flex items-center gap-2 lg:gap-6">
          {user ? (
            <>
              {isSubscribed && (
                <span className="hidden sm:inline-flex px-2 py-1 text-xs font-medium text-purple-400 bg-purple-500/20 rounded-full">
                  {profile?.subscription_tier?.toUpperCase()}
                </span>
              )}

              <Link
                href="/docs"
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Documentation
              </Link>

              <UserDropdown user={user} profile={profile} />
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setShowLoginModal(true);
                }}
                className="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        redirectTo="/dashboard"
      />
    </header>
  );
}
