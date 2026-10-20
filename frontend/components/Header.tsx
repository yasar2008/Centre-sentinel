"use client";

import React, { useEffect, useState } from "react";
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
  Unlock
} from "lucide-react";
import { playTacticalClick, playNoticeFreezeSound } from "./SoundFx";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lowBwMode: boolean;
  setLowBwMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
  onRefresh: () => void;
  onEmergencyFreeze: () => void;
  freezeActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lowBwMode,
  setLowBwMode,
  soundEnabled,
  setSoundEnabled,
  onRefresh,
  onEmergencyFreeze,
  freezeActive,
}) => {
  const [clockStr, setClockStr] = useState<string>("20:59:17 IST");

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
    { id: "cockpit", label: "Overview" },
    { id: "database", label: "Database & AEBAS" },
    { id: "cctv", label: "Live Cameras" },
    { id: "audit", label: "Attendance Verification" },
    { id: "directory", label: "Centres Directory" },
    { id: "section12a", label: "Grant Compliance" },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 select-none shadow-sm">
      {/* Subtle National Tricolor Top Accent Strip */}
      <div className="w-full h-1 bg-gradient-to-r from-amber-500 via-slate-100 to-emerald-600"></div>

      <div className="px-5 lg:px-8 flex items-center justify-between h-16">
        {/* Ministry & Portal Brand Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm">
            <Building className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-slate-900">
                KAUSHAL-DRISHTI
              </span>
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                MSDE ID 26245
              </span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
              <span>Ministry of Skill Development and Entrepreneurship</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">{clockStr}</span>
            </div>
          </div>
        </div>

        {/* Center: Clean Human Navigation Tabs */}
        <nav className="hidden lg:flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
          {navLinks.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playTacticalClick();
                  setActiveTab(tab.id);
                }}
                className={`text-xs px-3.5 py-1.5 rounded-full transition-all duration-150 font-medium ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2.5">
          {/* Live Edge Status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Live Center Sync</span>
          </div>

          {/* Rural Low-Bandwidth Mode */}
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
            <span>Rural Mode (2 KB)</span>
          </button>

          {/* Refresh Action */}
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

          {/* Statutory Section 12-A Holding Order Button */}
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
            <span>{freezeActive ? "Grant Frozen" : "Section 12-A Action"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
