"use client";

import React, { useState, useEffect } from "react";
import { Shield, Building, CheckCircle2, ChevronRight, Lock, Cpu, Globe2, Radio, Sparkles } from "lucide-react";
import { playSuccessChime, playTacticalClick } from "./SoundFx";

interface LoadingScreenProps {
  onComplete: () => void;
  forceShow?: boolean;
}

interface StepItem {
  tag: string;
  title: string;
  detail: string;
  latency: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, forceShow = false }) => {
  const [progress, setProgress] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);

  const steps: StepItem[] = [
    {
      tag: "NSDG-GRID",
      title: "Authenticating National Skill Development Grid Handshake",
      detail: "TLS 1.3 4096-bit mutual auth with NIC Central Cloud...",
      latency: "14ms",
    },
    {
      tag: "UIDAI-AEBAS",
      title: "Synchronizing Aadhaar AEBAS Biometric Attendance Logs",
      detail: "Reconciling daily morning shifts across 15,482 accredited centres...",
      latency: "28ms",
    },
    {
      tag: "EDGE-ENCLAVES",
      title: "Connecting 12 State Edge CCTV Video Analytics Nodes",
      detail: "Establishing WebRTC RTSP neural pipelines (UP, MH, BR, JH, MP, TN...)...",
      latency: "19ms",
    },
    {
      tag: "DPDP-2023",
      title: "Mounting DPDP Act 2023 Facial Privacy Masking Engine",
      detail: "Enforcing zero biometric storage with k=51 hardware face obfuscation...",
      latency: "9ms",
    },
    {
      tag: "PFMS-12A",
      title: "Auditing Section 12-A Direct Benefit Transfer (DBT) Ledger",
      detail: "Reconciling physical seat occupancy with automated penalty escrow...",
      latency: "22ms",
    },
  ];

  useEffect(() => {
    // Check if previously loaded in this session unless forced
    const hasLoaded = sessionStorage.getItem("ps_portal_loaded");
    if (hasLoaded && !forceShow) {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDone(true);
          sessionStorage.setItem("ps_portal_loaded", "true");
          try {
            playSuccessChime();
          } catch {
            // Audio context may require user gesture
          }
          setTimeout(() => {
            onComplete();
          }, 800);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 11) + 6;
        const capped = Math.min(100, next);

        if (capped > 20 && capped <= 40) setCurrentStep(1);
        else if (capped > 40 && capped <= 65) setCurrentStep(2);
        else if (capped > 65 && capped <= 85) setCurrentStep(3);
        else if (capped > 85) setCurrentStep(4);

        return capped;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete, forceShow]);

  const handleSkip = () => {
    playTacticalClick();
    sessionStorage.setItem("ps_portal_loaded", "true");
    onComplete();
  };

  // Circumference for radial progress ring (r = 44 => C = 2 * PI * 44 ≈ 276.46)
  const strokeDashoffset = 276.46 - (276.46 * progress) / 100;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 selection:bg-amber-500/30 selection:text-amber-200 animate-in fade-in duration-500">
      {/* Background Ambient Tricolor Halo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-xl bg-slate-900/95 border border-slate-700/80 rounded-3xl p-7 sm:p-9 shadow-[0_25px_70px_rgba(0,0,0,0.7)] text-center space-y-6 overflow-hidden backdrop-blur-2xl">
        {/* Sovereign Tricolor Radiant Header Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-white to-emerald-600 shadow-sm"></div>

        {/* Official Lion Capital & MSDE Ministry Seal */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <div className="relative">
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-700/80 p-3 shadow-xl flex items-center justify-center relative z-10 group">
              {/* Ashoka Stambh / Emblem Vector Representation */}
              <svg viewBox="0 0 100 100" className="w-12 h-12 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)]" fill="currentColor">
                {/* Simplified Official Ashoka Chakra & Lions Motif */}
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1.5" />
                {/* 24 Spoke representation */}
                {[...Array(12)].map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="14"
                    x2="50"
                    y2="86"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    transform={`rotate(${i * 15} 50 50)`}
                    opacity="0.6"
                  />
                ))}
                <circle cx="50" cy="50" r="9" fill="currentColor" />
                <circle cx="50" cy="50" r="4" fill="#0f172a" />
              </svg>
            </div>
            {/* Soft gold ring aura */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 blur-sm"></div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-600/40 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
              सत्यमेव जयते • Government of India
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2 flex items-center justify-center gap-2">
              <span>CENTRE SENTINEL</span>
              <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-700/50">
                PRO v2.6
              </span>
            </h1>
            <div className="text-xs font-semibold text-blue-300 tracking-wide mt-1">
              National Skill Training Surveillance &amp; Attendance Verification Portal
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Ministry of Skill Development and Entrepreneurship (MSDE) • SIH 2026 Problem ID 26245
            </p>
          </div>
        </div>

        {/* Central Radial Progress & Metric Dial */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-inner">
          {/* Circular SVG Meter */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="currentColor"
                strokeWidth="7"
                className="text-slate-800"
                fill="transparent"
              />
              {/* Animated Progress Gradient Ring */}
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="url(#progressGrad)"
                strokeWidth="7"
                strokeDasharray="276.46"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-300 ease-out"
              />
              <defs>
                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Percentage Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-white tracking-tighter">
                {progress}%
              </span>
              <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400">
                {isDone ? "Ready" : "Syncing"}
              </span>
            </div>
          </div>

          {/* Real-Time Calibration Stage Info */}
          <div className="text-left space-y-2 flex-1 w-full">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-blue-400">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Stage {currentStep + 1} of {steps.length}
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                Ping: {steps[currentStep].latency}
              </span>
            </div>

            <div className="text-sm font-bold text-white tracking-tight">
              {steps[currentStep].title}
            </div>

            <div className="text-xs text-slate-400 line-clamp-1">
              {steps[currentStep].detail}
            </div>

            {/* Micro Linear Progress */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-200"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 5 Sequential Verification Checkpoints */}
        <div className="bg-slate-950/40 rounded-2xl p-3 border border-slate-800/80 text-left space-y-1.5">
          {steps.map((s, idx) => {
            const stepActive = idx === currentStep && !isDone;
            const stepCompleted = idx < currentStep || isDone;

            return (
              <div
                key={s.tag}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all ${
                  stepActive
                    ? "bg-blue-950/40 border border-blue-600/40 text-blue-200"
                    : stepCompleted
                    ? "text-slate-300"
                    : "text-slate-600 opacity-60"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {stepCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : stepActive ? (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin shrink-0"></div>
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0"></div>
                  )}
                  <span className="font-mono text-[10px] text-amber-300/80 font-bold">[{s.tag}]</span>
                  <span className="truncate font-medium">{s.title}</span>
                </div>

                <span className="text-[10px] font-mono shrink-0 font-semibold text-slate-400">
                  {stepCompleted ? "VERIFIED" : stepActive ? "CONNECTING..." : "PENDING"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar: Security Certification & Skip Control */}
        <div className="flex items-center justify-between pt-1 text-xs border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>DPDP Act 2023 Compliant • Zero Facial Biometric Storage</span>
          </div>

          <button
            onClick={handleSkip}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <span>Skip to Cockpit</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
