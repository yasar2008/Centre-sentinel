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
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-sm text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            Equipment Hands-On Operability (OCI)
          </h3>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Verifying physical student machinery interaction during vocational practical hours
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-slate-500 font-medium">Statutory Benchmark: 80.0%</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              isSubThreshold
                ? "bg-amber-50 border-amber-200 text-amber-800"
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}
          >
            Aggregate OCI: {aggregateOci.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* 3 Equipment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* 1. JUKI Sewing Line */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-900 font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              JUKI Sewing Rigs
            </span>
            <span className="text-slate-600 font-medium text-[11px]">
              {sewingActive} / {totalSewing} in use
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${sewingUtil}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Apparel Practical</span>
            <span className="text-blue-700 font-semibold">{sewingUtil.toFixed(1)}%</span>
          </div>
          <div className="pt-2 border-t border-slate-200/60 flex flex-col gap-1">
            <label className="text-[10px] text-slate-500 font-medium">Adjust Active Trainees</label>
            <input
              type="range"
              min={0}
              max={totalSewing}
              value={sewingActive}
              onChange={(e) => handleUpdate("sewing", parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 rounded-full cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        {/* 2. CNC Lathe Bed */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-900 font-semibold flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-amber-600" />
              CNC Lathe Bed 02
            </span>
            <span className="text-slate-600 font-medium text-[11px]">
              {cncActive} / {totalCnc} in use
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${cncUtil}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Precision Machining</span>
            <span className="text-amber-700 font-semibold">{cncUtil.toFixed(0)}%</span>
          </div>
          <div className="pt-2 border-t border-slate-200/60 flex flex-col gap-1">
            <label className="text-[10px] text-slate-500 font-medium">Adjust Active Machines</label>
            <input
              type="range"
              min={0}
              max={totalCnc}
              value={cncActive}
              onChange={(e) => handleUpdate("cnc", parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 rounded-full cursor-pointer accent-amber-500"
            />
          </div>
        </div>

        {/* 3. SMT Soldering Stations */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-900 font-semibold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-emerald-600" />
              SMT Soldering Benches
            </span>
            <span className="text-slate-600 font-medium text-[11px]">
              {solderingActive} / {totalSoldering} in use
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${solderingUtil}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Electronics Bench</span>
            <span className="text-emerald-700 font-semibold">{solderingUtil.toFixed(0)}%</span>
          </div>
          <div className="pt-2 border-t border-slate-200/60 flex flex-col gap-1">
            <label className="text-[10px] text-slate-500 font-medium">Adjust Active Benches</label>
            <input
              type="range"
              min={0}
              max={totalSoldering}
              value={solderingActive}
              onChange={(e) => handleUpdate("soldering", parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 rounded-full cursor-pointer accent-emerald-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
