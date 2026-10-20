"use client";

import React from "react";

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
    <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5">
      {/* 1. Target Centre Card */}
      <div className="bg-surface-container border border-outline-variant p-2.5 relative hud-bracket">
        <div className="flex justify-between items-start mb-1">
          <span className="font-mono text-[9px] text-outline uppercase tracking-wider">TARGET CENTER</span>
          <span className="font-mono text-[9px] text-primary bg-primary/10 px-1 border border-primary/30">PMKVY-4.0</span>
        </div>
        <div className="font-bold text-sm text-on-surface tracking-tight truncate">{centreId}</div>
        <div className="font-mono text-[10px] text-on-surface-variant truncate">{centreName}</div>
      </div>

      {/* 2. Biometric Registered Claim */}
      <div className="bg-surface-container border border-outline-variant p-2.5 relative hud-bracket">
        <div className="flex justify-between items-start mb-1">
          <span className="font-mono text-[9px] text-outline uppercase tracking-wider">PORTAL CLAIM</span>
          <span className="material-symbols-outlined text-primary text-[16px]">fingerprint</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold text-primary">{portalClaim}</span>
          <span className="font-mono text-[10px] text-outline">CANDIDATES</span>
        </div>
        <div className="font-mono text-[10px] text-on-surface-variant">Aadhaar AEBAS Auth Log 09:00</div>
      </div>

      {/* 3. Actual Edge Vision Headcount */}
      <div className="bg-surface-container border border-outline-variant p-2.5 relative hud-bracket">
        <div className="flex justify-between items-start mb-1">
          <span className="font-mono text-[9px] text-outline uppercase tracking-wider">ACTUAL VISION COUNT</span>
          <span className="w-2 h-2 bg-tertiary inline-block animate-pulse"></span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold text-tertiary">{detectedCount}</span>
          <span className="font-mono text-[10px] text-outline">STATION ENGAGED</span>
        </div>
        <div className="font-mono text-[10px] text-tertiary">GhostNet IoU &gt; 0.88 Confirmed</div>
      </div>

      {/* 4. Disparity / Ghost Trainee Alert Badge */}
      <div className="bg-secondary-container/10 border border-secondary-container p-2.5 relative hud-bracket hud-bracket-amber">
        <div className="flex justify-between items-start mb-1">
          <span className="font-mono text-[9px] text-secondary uppercase tracking-wider font-bold">GHOST VARIANCE</span>
          <span className="w-2 h-2 bg-secondary inline-block animate-ping"></span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold text-secondary">
            {discrepancyCount > 0 ? `-${discrepancyCount}` : "0"}
          </span>
          <span className="font-mono text-[10px] text-secondary">PHANTOMS (-{discrepancyPercent}%)</span>
        </div>
        <div className="font-mono text-[10px] text-secondary-fixed-dim">Statutory Breach Threshold &gt; 15%</div>
      </div>

      {/* 5. Equipment Hands-on Operability (OCI) */}
      <div className="bg-surface-container border border-outline-variant p-2.5 relative hud-bracket">
        <div className="flex justify-between items-start mb-1">
          <span className="font-mono text-[9px] text-outline uppercase tracking-wider">OCI OPERABILITY</span>
          <span className={`font-mono text-[9px] px-1 border ${isOciSubThreshold ? "text-error bg-error/10 border-error/30" : "text-tertiary bg-tertiary/10 border-tertiary/30"}`}>
            {isOciSubThreshold ? "SUB-80%" : "COMPLIANT"}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className={`font-mono text-xl font-bold ${isOciSubThreshold ? "text-error" : "text-tertiary"}`}>
            {operabilityScore.toFixed(1)}%
          </span>
          <span className="font-mono text-[10px] text-outline">HANDS-ON UTIL</span>
        </div>
        <div className="font-mono text-[10px] text-on-surface-variant">Min. Required: 80.0% For DBT</div>
      </div>

      {/* 6. Section 12-A Statutory Withheld Sum */}
      <div className="bg-surface-container border border-error/70 p-2.5 relative hud-bracket hud-bracket-error bg-error-container/10">
        <div className="flex justify-between items-start mb-1">
          <span className="font-mono text-[9px] text-error uppercase tracking-wider font-bold">SEC 12-A WITHHOLD</span>
          <span className="material-symbols-outlined text-error text-[16px]">account_balance</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-xl font-bold text-error">
            ₹{frozenAmount.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="font-mono text-[10px] text-error">Tranche 2 Grant Frozen Pending Notice</div>
      </div>
    </section>
  );
};
