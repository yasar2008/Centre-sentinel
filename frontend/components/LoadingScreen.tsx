"use client";

import React, { useState, useEffect } from "react";
import { Shield, Building, CheckCircle2, ChevronRight, Lock } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
  forceShow?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, forceShow = false }) => {
  const [progress, setProgress] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);

  const steps = [
    "Establishing secure handshake with National Skill Development Grid (NSDG)...",
    "Synchronizing with UIDAI Aadhaar AEBAS Biometric Attendance Servers...",
    "Connecting to 12 Regional Edge CCTV Analytics Nodes across India...",
    "Activating DPDP Act 2023 Facial Privacy Anonymization Engine...",
    "Verifying Section 12-A PFMS Direct Benefit Transfer Compliance Ledger...",
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
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 14) + 8;
        const capped = Math.min(100, next);

        if (capped > 20 && capped <= 40) setCurrentStep(1);
        else if (capped > 40 && capped <= 65) setCurrentStep(2);
        else if (capped > 65 && capped <= 85) setCurrentStep(3);
        else if (capped > 85) setCurrentStep(4);

        return capped;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [onComplete, forceShow]);

  const handleSkip = () => {
    sessionStorage.setItem("ps_portal_loaded", "true");
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 selection:bg-amber-100 selection:text-amber-900 animate-in fade-in duration-300">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
        {/* National Tricolor Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-slate-100 to-emerald-600"></div>

        {/* Ministry Official Seal / Emblem */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
            <Building className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Government of India • Ministry Portal
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5">
              PRASHIKSHAN SAMIKSHA
            </h1>
            <div className="text-xs font-semibold text-slate-700">
              प्रशिक्षण समीक्षा पोर्टल
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Ministry of Skill Development and Entrepreneurship (MSDE)
            </p>
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              Secure National Grid Handshake
            </span>
            <span className="text-blue-700 font-bold">{progress}%</span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div
              className="bg-gradient-to-r from-blue-600 to-emerald-600 h-full rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Sequential Diagnostic Steps */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            {isDone ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0"></div>
            )}
            <span className="truncate">{steps[currentStep]}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-200">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              12 Regional Feeds Online
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              DPDP Act Privacy Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              AEBAS Biometric Active
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              PFMS DBT Audited
            </span>
          </div>
        </div>

        {/* Skip / Enter Action */}
        <div className="flex justify-between items-center pt-1 text-xs">
          <span className="text-slate-400 text-[11px]">MSDE Problem ID 26245 • SIH 2026</span>
          <button
            onClick={handleSkip}
            className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors font-medium flex items-center gap-1"
          >
            <span>Skip Introduction</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
