"use client";

import React from "react";
import { Building, Users, CheckCircle2, AlertTriangle, Activity, Lock } from "lucide-react";

interface MetricRibbonProps {
  centreId: string;
  centreName: string;
  portalClaim: number;
  detectedCount: number;
  discrepancyCount: number;
  operabilityScore: number;
  frozenAmount: number;
}

export const MetricRibbon: React.FC<MetricRibbonProps> = ({
  centreId,
  centreName,
  portalClaim,
  detectedCount,
  discrepancyCount,
  operabilityScore,
  frozenAmount,
}) => {
  const discrepancyPercent = portalClaim > 0 ? ((discrepancyCount / portalClaim) * 100).toFixed(1) : "0.0";
  const isOciSubThreshold = operabilityScore < 80;

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {/* 1. Target Training Centre */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Focus Centre</span>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            PMKVY 4.0
          </span>
        </div>
        <div>
          <div className="font-bold text-base text-slate-900 tracking-tight truncate">{centreId}</div>
          <div className="text-xs text-slate-500 truncate mt-0.5">{centreName}</div>
        </div>
      </div>

      {/* 2. Aadhaar AEBAS Biometric Punches */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">AEBAS Punches</span>
          <Users className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">{portalClaim}</span>
            <span className="text-xs text-slate-500 font-medium">registered</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Biometric Terminal 09:00</div>
        </div>
      </div>

      {/* 3. Physical CCTV Headcount */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Physical Presence</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-emerald-700">{detectedCount}</span>
            <span className="text-xs text-emerald-800 font-medium">present</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">YOLOv8 Headcount Verify</div>
        </div>
      </div>

      {/* 4. Unattended / Ghost Seats */}
      <div className="bg-white border border-amber-200 bg-amber-50/30 rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider">Unverified Gap</span>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
            -{discrepancyPercent}%
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-amber-900">
              {discrepancyCount > 0 ? `-${discrepancyCount}` : "0"}
            </span>
            <span className="text-xs text-amber-800 font-medium">unattended</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Physical Absence Detected</div>
        </div>
      </div>

      {/* 5. Practical Machinery Utilization */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Machinery Usage</span>
          <Activity className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold tracking-tight ${
              isOciSubThreshold ? "text-amber-800" : "text-emerald-700"
            }`}>
              {operabilityScore.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-500 font-medium">utilized</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {isOciSubThreshold ? "Below 80% Threshold" : "Meeting Standards"}
          </div>
        </div>
      </div>

      {/* 6. Section 12-A Withheld Grant */}
      <div className="bg-white border border-rose-200 bg-rose-50/20 rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-semibold text-rose-900 uppercase tracking-wider">Withheld Subsidy</span>
          <Lock className="w-3.5 h-3.5 text-rose-600" />
        </div>
        <div>
          <div className="text-2xl font-bold tracking-tight text-rose-700">
            ₹{frozenAmount.toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">PFMS Section 12-A Order</div>
        </div>
      </div>
    </section>
  );
};
