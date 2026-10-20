"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Volume2,
  VolumeX,
  RefreshCw,
  Wifi,
  WifiOff,
  Shield,
  Building,
  CheckCircle2,
  Lock,
  Unlock,
  Radio,
  Layers,
  Sparkles
} from "lucide-react";
import { playTacticalClick, playNoticeFreezeSound } from "./SoundFx";

interface HeaderProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  lowBwMode?: boolean;
  setLowBwMode?: (val: boolean | ((prev: boolean) => boolean)) => void;
  soundEnabled?: boolean;
  setSoundEnabled?: (val: boolean | ((prev: boolean) => boolean)) => void;
  onRefresh?: () => void;
  onEmergencyFreeze?: () => void;
  freezeActive?: boolean;
  onTriggerLoading?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab = "cockpit",
  setActiveTab,
  lowBwMode = true,
  setLowBwMode,
  soundEnabled = true,
  setSoundEnabled,
  onRefresh,
  onEmergencyFreeze,
  freezeActive = false,
  onTriggerLoading,
}) => {
  const [clockStr, setClockStr] = useState<string>("21:15:00 IST");
  const pathname = usePathname();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setClockStr(`${hours}:${minutes}:${seconds} IST`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { href: "/", id: "home", label: "Portal Home" },
    { href: "/cameras", id: "cctv", label: "Live Cameras (12)" },
    { href: "/dashboard", id: "cockpit", label: "Surveillance Cockpit" },
    { href: "/database", id: "database", label: "AEBAS Database" },
    { href: "/directory", id: "directory", label: "Centres Directory" },
    { href: "/compliance", id: "section12a", label: "Grant Compliance" },
    { href: "/audit", id: "audit", label: "Attendance Roster" },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 select-none shadow-sm">
      {/* National Tricolor Top Accent Strip */}
      <div className="w-full h-1 bg-gradient-to-r from-amber-500 via-slate-100 to-emerald-600"></div>

      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Ministry & Portal Brand Identity */}
        <Link
          href="/"
          onClick={() => playTacticalClick()}
          className="flex items-center gap-3 group text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-slate-800 transition-colors shrink-0">
            <Building className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                CENTRE SENTINEL
              </span>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                MSDE ID 26245
              </span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
              <span>National Skill Surveillance • Ministry of Skill Development</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-700 font-medium">{clockStr}</span>
            </div>
          </div>
        </Link>

        {/* Center: Navigation Links & Subpage Routes */}
        <nav className="hidden xl:flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
          {navLinks.map((tab) => {
            const isRouteActive = pathname === tab.href || (pathname === "/" && tab.href === "/" && activeTab === "home");
            const isTabActive = activeTab === tab.id;
            const isActive = isRouteActive || isTabActive;

            return (
              <Link
                key={tab.id}
                href={tab.href}
                onClick={() => {
                  playTacticalClick();
                  if (setActiveTab) setActiveTab(tab.id);
                }}
                className={`text-xs px-3.5 py-1.5 rounded-full transition-all duration-150 font-semibold ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2">
          {/* Re-sync Grid / Loading Trigger */}
          {onTriggerLoading && (
            <button
              onClick={() => {
                playTacticalClick();
                onTriggerLoading();
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              title="Re-run National Skill Development Grid Synchronization"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              <span>Sync Grid</span>
            </button>
          )}

          {/* Live Edge Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>12 Feeds Active</span>
          </div>

          {/* Rural Low-Bandwidth Mode */}
          {setLowBwMode && (
            <button
              onClick={() => {
                playTacticalClick();
                setLowBwMode((prev) => !prev);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all ${
                lowBwMode
                  ? "bg-blue-50 border-blue-200 text-blue-800 font-semibold"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
              title="Rural Low-Bandwidth Mode (<64 kbps)"
            >
              {lowBwMode ? <Wifi className="w-3.5 h-3.5 text-blue-600" /> : <WifiOff className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden sm:inline">{lowBwMode ? "Rural Mode" : "High BW"}</span>
            </button>
          )}

          {/* Refresh Action */}
          {onRefresh && (
            <button
              onClick={() => {
                playTacticalClick();
                onRefresh();
              }}
              className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              title="Refresh Attendance & Vision Telemetry"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Statutory Section 12-A Holding Order Button */}
          {onEmergencyFreeze && (
            <button
              onClick={() => {
                playNoticeFreezeSound();
                onEmergencyFreeze();
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                freezeActive
                  ? "bg-rose-600 text-white border-rose-700 shadow-sm"
                  : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
              }`}
            >
              {freezeActive ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{freezeActive ? "Grant Frozen" : "Section 12-A"}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
