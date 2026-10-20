"use client";

import React, { useState } from "react";
import { Activity, Wrench, Flame } from "lucide-react";
import { playTacticalClick } from "./SoundFx";

interface OperabilityGaugeProps {
  initialOci?: number;
  onOciChange?: (newOci: number) => void;
}

export const OperabilityGauge: React.FC<OperabilityGaugeProps> = ({
  initialOci = 74.2,
  onOciChange,
}) => {
  const [sewingActive, setSewingActive] = useState<number>(16);
  const totalSewing = 18;

  const [cncActive, setCncActive] = useState<number>(1);
  const totalCnc = 2;

  const [solderingActive, setSolderingActive] = useState<number>(6);
  const totalSoldering = 6;

  const sewingUtil = (sewingActive / totalSewing) * 100;
  const cncUtil = (cncActive / totalCnc) * 100;
  const solderingUtil = (solderingActive / totalSoldering) * 100;

  const aggregateOci = sewingUtil * 0.5 + cncUtil * 0.3 + solderingUtil * 0.2;
  const isSubThreshold = aggregateOci < 80.0;

  const handleUpdate = (type: string, val: number) => {
    playTacticalClick();
    let newSewing = sewingActive;
    let newCnc = cncActive;
    let newSoldering = solderingActive;

    if (type === "sewing") {
      newSewing = val;
      setSewingActive(val);
    } else if (type === "cnc") {
      newCnc = val;
      setCncActive(val);
    } else if (type === "soldering") {
      newSoldering = val;
      setSolderingActive(val);
    }

    const newAgg = (newSewing / totalSewing) * 100 * 0.5 + (newCnc / totalCnc) * 100 * 0.3 + (newSoldering / totalSoldering) * 100 * 0.2;
    if (onOciChange) onOciChange(newAgg);
  };

  return (
    <div className="luxury-card p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div>
          <h3 className="font-semibold text-sm text-white tracking-tight">
            Equipment Hands-On Operability (OCI)
          </h3>
          <p className="text-xs text-slate-400 font-normal">
            Verifying physical student machinery interaction via spatial IoU tracking
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-slate-500 font-medium">Standard: &gt;= 80.0%</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              isSubThreshold
                ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}
          >
            Aggregate OCI: {aggregateOci.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* 3 Equipment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* 1. JUKI Sewing Line */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white font-medium flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              JUKI Sewing Rigs
            </span>
            <span className="text-slate-300 font-mono text-[11px]">
              {sewingActive} / {totalSewing} active
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-sky-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${sewingUtil}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Vibration: 78.4 Hz</span>
            <span className="text-sky-400 font-medium">{sewingUtil.toFixed(1)}%</span>
          </div>
          <div className="pt-2 border-t border-white/[0.04] flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={totalSewing}
              value={sewingActive}
              onChange={(e) => handleUpdate("sewing", parseInt(e.target.value, 10))}
              className="w-full h-1 bg-white/[0.08] rounded-full cursor-pointer accent-sky-400"
            />
          </div>
        </div>

        {/* 2. CNC Lathe Bed */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white font-medium flex items-center gap-2">
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              CNC Lathe Bed 02
            </span>
            <span className="text-slate-300 font-mono text-[11px]">
              {cncActive} / {totalCnc} active
            </span>
          </div>
          <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${cncUtil}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Spindle: {cncActive === 2 ? "1200 RPM" : "0 RPM [Hold]"}</span>
            <span className="text-amber-400 font-medium">{cncUtil.toFixed(0)}%</span>
          </div>
          <div className="pt-2 border-t border-white/[0.04] flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={totalCnc}
              value={cncActive}
              onChange={(e) => handleUpdate("cnc", parseInt(e.target.value, 10))}
              className="w-full h-1 bg-white/[0.08] rounded-full cursor-pointer accent-amber-400"
            />
          </div>
        </div>

        {/* 3. SMT Soldering Stations */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white font-medium flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-emerald-400" />
              SMT Soldering Stations
            </span>
            <span className="text-slate-300 font-mono text-[11px]">
              {solderingActive} / {totalSoldering} active
            </span>
          </div>
          <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${solderingUtil}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Thermal: 350.2°C</span>
            <span className="text-emerald-400 font-medium">{solderingUtil.toFixed(0)}%</span>
          </div>
          <div className="pt-2 border-t border-white/[0.04] flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={totalSoldering}
              value={solderingActive}
              onChange={(e) => handleUpdate("soldering", parseInt(e.target.value, 10))}
              className="w-full h-1 bg-white/[0.08] rounded-full cursor-pointer accent-emerald-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
