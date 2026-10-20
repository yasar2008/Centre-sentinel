"use client";

import React, { useEffect, useState } from "react";
import {
  Volume2,
  VolumeX,
  RefreshCw,
  Wifi,
  WifiOff,
  Lock,
  Unlock,
  Shield,
  Activity
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
  const [clockStr, setClockStr] = useState<string>("13:42:09 IST");

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
    { id: "cockpit", label: "Executive Overview" },
    { id: "directory", label: "Centres Registry" },
    { id: "audit", label: "Discrepancy Matrix" },
    { id: "section12a", label: "Section 12-A Enforcement" },
    { id: "waterfall", label: "Telemetry & Audit" },
  ];

  return (
    <header className="w-full px-6 lg:px-8 flex items-center justify-between border-b border-white/[0.06] bg-[#080c14]/80 backdrop-blur-2xl h-16 sticky top-0 z-50 select-none transition-all">
      {/* Brand & Executive Identity */}
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/[0.1] flex items-center justify-center relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
          <Shield className="w-5 h-5 text-sky-400 stroke-[1.5]" />
          <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight text-white">
              KAUSHAL-DRISHTI
            </span>
            <span className="text-[10px] font-medium text-slate-400 bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 rounded-md">
              MSDE 26245
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-normal flex items-center gap-2">
            <span>Ministry of Skill Development & Entrepreneurship</span>
            <span className="text-slate-600">•</span>
            <span className="font-mono text-[10px] text-slate-500">{clockStr}</span>
          </div>
        </div>
      </div>

      {/* Center: Minimalist Floating Segmented Nav Pill */}
      <nav className="hidden lg:flex items-center bg-white/[0.03] border border-white/[0.06] p-1 rounded-full backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
        {navLinks.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playTacticalClick();
                setActiveTab(tab.id);
              }}
              className={`text-xs px-3.5 py-1.5 rounded-full transition-all duration-200 font-medium ${
                isActive
                  ? "bg-white/[0.1] text-white shadow-sm border border-white/[0.1]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right Action Cluster */}
      <div className="flex items-center gap-2.5">
        {/* Live Network Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/[0.06] border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Edge Sync • 14ms</span>
        </div>

        {/* Low-Bandwidth Mode Pill */}
        <button
          onClick={() => {
            playTacticalClick();
            setLowBwMode((prev) => !prev);
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all ${
            lowBwMode
              ? "bg-sky-500/[0.08] border-sky-500/30 text-sky-400"
              : "bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-white"
          }`}
          title="Rural 2KB Telemetry Mode"
        >
          {lowBwMode ? <Wifi className="w-3.5 h-3.5 text-sky-400" /> : <WifiOff className="w-3.5 h-3.5 text-slate-500" />}
          <span>2KB Rural</span>
        </button>

        {/* Emergency Section 12-A Grant Freeze Button */}
        <button
          onClick={() => {
            playNoticeFreezeSound();
            onEmergencyFreeze();
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all ${
            freezeActive
              ? "bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.25)]"
              : "bg-rose-500/[0.06] border-rose-500/20 hover:border-rose-500/40 text-rose-400"
          }`}
          title="Emergency PFMS Subsidy Freeze"
        >
          {freezeActive ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          <span>{freezeActive ? "Grant Frozen" : "Freeze Grant"}</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={() => {
            playTacticalClick();
            setSoundEnabled((prev) => !prev);
          }}
          className="w-8 h-8 rounded-full border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          title={soundEnabled ? "Mute Feedback" : "Enable Sound"}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-slate-300" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
        </button>

        {/* Refresh */}
        <button
          onClick={() => {
            playTacticalClick();
            onRefresh();
          }}
          className="w-8 h-8 rounded-full border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          title="Refresh Telemetry"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-300" />
        </button>
      </div>
    </header>
  );
};
