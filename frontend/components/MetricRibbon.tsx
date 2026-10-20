"use client";

import React from "react";
import { Building, Users, CheckCircle2, AlertTriangle, Gauge, ShieldAlert } from "lucide-react";

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
      {/* 1. Target Centre */}
      <div className="luxury-card p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider">Target Centre</span>
          <span className="text-[10px] font-medium text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
            PMKVY 4.0
          </span>
        </div>
        <div>
          <div className="font-semibold text-base text-white tracking-tight truncate">{centreId}</div>
          <div className="text-[11px] text-slate-400 truncate mt-0.5">{centreName}</div>
        </div>
      </div>

      {/* 2. Portal Registered Claim */}
      <div className="luxury-card p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider">Portal Claim</span>
          <Users className="w-3.5 h-3.5 text-slate-400 stroke-[1.5]" />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-white">{portalClaim}</span>
            <span className="text-xs text-slate-400 font-medium">candidates</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">AEBAS Biometric 09:00</div>
        </div>
      </div>

      {/* 3. Actual Vision Count */}
      <div className="luxury-card p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider">Vision Count</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-emerald-400">{detectedCount}</span>
            <span className="text-xs text-slate-400 font-medium">active</span>
          </div>
          <div className="text-[11px] text-emerald-500/80 mt-0.5">Continuous IoU &gt; 0.88</div>
        </div>
      </div>

      {/* 4. Ghost Variance */}
      <div className="luxury-card p-4 flex flex-col justify-between bg-gradient-to-b from-amber-500/[0.04] to-transparent">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider text-amber-300">Variance Delta</span>
          <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            -{discrepancyPercent}%
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-amber-300">
              {discrepancyCount > 0 ? `-${discrepancyCount}` : "0"}
            </span>
            <span className="text-xs text-amber-400/80 font-medium">phantoms</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Threshold Allowance 15%</div>
        </div>
      </div>

      {/* 5. Operability Index (OCI) */}
      <div className="luxury-card p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider">Operability Index</span>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
            isOciSubThreshold
              ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
              : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
          }`}>
            {isOciSubThreshold ? "Sub-80%" : "Optimal"}
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-semibold tracking-tight ${isOciSubThreshold ? "text-rose-400" : "text-emerald-400"}`}>
              {operabilityScore.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400 font-medium">OCI util</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Min Mandate 80.0%</div>
        </div>
      </div>

      {/* 6. Section 12-A Withhold */}
      <div className="luxury-card p-4 flex flex-col justify-between bg-gradient-to-b from-rose-500/[0.06] to-transparent">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider text-rose-300">Sec 12-A Withhold</span>
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400 stroke-[1.5]" />
        </div>
        <div>
          <div className="text-2xl font-semibold tracking-tight text-rose-400">
            ₹{frozenAmount.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-rose-300/80 mt-0.5">PFMS Grant Frozen</div>
        </div>
      </div>
    </section>
  );
};
