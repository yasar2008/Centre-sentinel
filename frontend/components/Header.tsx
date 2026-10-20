"use client";

import React, { useEffect, useState } from "react";
import {
  Volume2,
  VolumeX,
  RefreshCw,
  Wifi,
  WifiOff,
  Gavel,
  ShieldCheck,
  Bell,
  Terminal as TerminalIcon,
  HardDrive
} from "lucide-react";
import { playTacticalClick, playAlertChime, playNoticeFreezeSound } from "./SoundFx";

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
  const [clockStr, setClockStr] = useState<string>("13:42:09.184 IST");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const millis = String(now.getMilliseconds()).padStart(3, "0");
      setClockStr(`${hours}:${minutes}:${seconds}.${millis} IST`);
    }, 97);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full px-4 lg:px-6 flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest backdrop-blur-md h-13 sticky top-0 z-50 select-none">
      {/* Brand / Sovereign Identity */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-sm border border-primary-container bg-surface-container-high flex items-center justify-center relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-primary-container/10"></div>
          {/* Sovereign Indian Tricolor Micro Stripe */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FF9933]"></div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981]"></div>
          <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-wider uppercase text-primary flex items-center gap-2">
            KAUSHAL-DRISHTI <span className="text-[10px] text-outline font-normal border border-outline-variant px-1 rounded-sm">ID: 26245</span>
          </span>
          <span className="font-mono text-[10px] text-on-surface-variant flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-tertiary inline-block rounded-none animate-pulse"></span>
            MSDE SOVEREIGN EDGE AI CLUSTER • NODE: DEL-NCR-092
          </span>
        </div>
      </div>

      {/* Live Telemetry Spine */}
      <div className="hidden xl:flex items-center gap-4 px-4 py-1 border-x border-outline-variant/60 bg-surface-container-low/70">
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-outline uppercase text-[10px]">MISSION TIME:</span>
          <span className="text-primary font-bold tracking-tight">{clockStr}</span>
        </div>
        <div className="h-3 w-px bg-outline-variant"></div>
        <div className="flex items-center gap-1.5">
          <span className="text-outline uppercase text-[10px] font-mono">AUDIT LEVEL:</span>
          <span className="px-1.5 py-0.5 border border-secondary-container/80 bg-secondary-container/20 text-secondary font-mono text-[10px] font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-secondary animate-pulse"></span>
            AMBER-ALPHA (DISCREPANCY DETECTED)
          </span>
        </div>
        <div className="h-3 w-px bg-outline-variant"></div>
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="text-outline uppercase text-[10px]">LEDGER:</span>
          <span className="text-tertiary">#849,201 VERIFIED [SHA-256]</span>
        </div>
      </div>

      {/* Navigation Links & Action Cluster */}
      <div className="flex items-center gap-3">
        <nav className="hidden lg:flex items-center gap-3">
          {[
            { id: "cockpit", label: "Cockpit HUD" },
            { id: "directory", label: "National Centres" },
            { id: "audit", label: "Discrepancy Matrix" },
            { id: "section12a", label: "Section 12-A Notice" },
            { id: "waterfall", label: "Telemetry & DevTools" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playTacticalClick();
                setActiveTab(tab.id);
              }}
              className={`font-mono text-[11px] uppercase tracking-wider py-1 px-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "text-primary border-primary font-bold bg-primary/5"
                  : "text-on-surface-variant border-transparent hover:text-on-surface hover:border-outline"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Action Triggers */}
        <div className="flex items-center gap-2">
          {/* Low-BW Mode Toggle */}
          <button
            onClick={() => {
              playTacticalClick();
              setLowBwMode((prev) => !prev);
            }}
            className={`px-2.5 py-1 border font-mono text-[11px] flex items-center gap-1.5 transition-colors ${
              lowBwMode
                ? "border-tertiary bg-tertiary/10 text-tertiary font-bold"
                : "border-outline-variant bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
            title="Toggle LoRaWAN 2.04KB Telemetry Mode"
          >
            {lowBwMode ? <Wifi className="w-3.5 h-3.5 text-tertiary" /> : <WifiOff className="w-3.5 h-3.5 text-outline" />}
            <span className="hidden sm:inline">2KB Low-BW</span>
          </button>

          {/* Emergency Freeze Trigger */}
          <button
            onClick={() => {
              playNoticeFreezeSound();
              onEmergencyFreeze();
            }}
            className={`px-2.5 py-1 border font-mono text-[11px] uppercase font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
              freezeActive
                ? "border-red-500 bg-red-950 text-red-400 animate-pulse"
                : "border-error bg-error-container/30 hover:bg-error-container/50 text-error"
            }`}
            title="Freeze Section 12-A Direct Benefit Transfer Disbursement"
          >
            <Gavel className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{freezeActive ? "PFMS FROZEN" : "Emergency Freeze"}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              playTacticalClick();
              setSoundEnabled((prev) => !prev);
            }}
            className="p-1.5 border border-outline-variant hover:border-outline bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
            title={soundEnabled ? "Mute Tactical Sounds" : "Enable Tactical Sounds"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 text-outline" />}
          </button>

          {/* Refresh Edge State */}
          <button
            onClick={() => {
              playTacticalClick();
              onRefresh();
            }}
            className="p-1.5 border border-outline-variant hover:border-outline bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
            title="Poll Latest Edge Telemetry"
          >
            <RefreshCw className="w-4 h-4 text-primary" />
          </button>
        </div>
      </div>
    </header>
  );
};
