"use client";

import React, { useState } from "react";
import { Sliders, AlertTriangle, CheckCircle, Wrench, Flame, Activity } from "lucide-react";
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

  // Calculate dynamic aggregate OCI
  const sewingUtil = (sewingActive / totalSewing) * 100;
  const cncUtil = (cncActive / totalCnc) * 100;
  const solderingUtil = (solderingActive / totalSoldering) * 100;

  const aggregateOci = (sewingUtil * 0.5 + cncUtil * 0.3 + solderingUtil * 0.2);
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

    const newAgg = ((newSewing / totalSewing) * 100 * 0.5 + (newCnc / totalCnc) * 100 * 0.3 + (newSoldering / totalSoldering) * 100 * 0.2);
    if (onOciChange) onOciChange(newAgg);
  };

  return (
    <div className="bg-surface-container border border-outline-variant p-3 hud-bracket">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-2 border-b border-outline-variant/60 pb-1.5 gap-2">
        <span className="font-bold text-sm text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">
            precision_manufacturing
          </span>
          Equipment Hands-on Operability Index (OCI Gauge Breakdown)
        </span>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-outline uppercase text-[10px]">MIN REQUIRED: 80%</span>
          <span
            className={`px-1.5 py-0.5 border font-bold ${
              isSubThreshold
                ? "text-error border-error/50 bg-error/10"
                : "text-tertiary border-tertiary/50 bg-tertiary/10"
            }`}
          >
            AGGREGATE OCI: {aggregateOci.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* 3 Equipment Quadrants */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
        {/* 1. JUKI Sewing Line */}
        <div className="p-2 bg-surface-container-low border border-outline-variant">
          <div className="flex justify-between items-center text-[11px] mb-1">
            <span className="font-mono text-on-surface font-semibold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-primary" />
              JUKI SEWING RIGS
            </span>
            <span className="font-mono text-tertiary font-bold text-[10px]">
              {sewingActive} / {totalSewing} ONLINE
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-surface-container-highest h-2 border border-outline-variant/40 mb-1.5 overflow-hidden">
            <div
              className="bg-tertiary h-full transition-all duration-300"
              style={{ width: `${sewingUtil}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[9px] font-mono text-outline mb-2">
            <span>Vibration Avg: 78.4 Hz</span>
            <span className="text-tertiary font-semibold">Utilization {sewingUtil.toFixed(1)}%</span>
          </div>
          {/* Slider */}
          <div className="flex items-center gap-2 pt-1 border-t border-outline-variant/40">
            <span className="font-mono text-[9px] text-outline">Rigs:</span>
            <input
              type="range"
              min={0}
              max={totalSewing}
              value={sewingActive}
              onChange={(e) => handleUpdate("sewing", parseInt(e.target.value, 10))}
              className="w-full h-1 bg-surface-container-highest rounded cursor-pointer accent-[#0EA5E9]"
            />
            <span className="font-mono text-[9px] text-primary w-4">{sewingActive}</span>
          </div>
        </div>

        {/* 2. CNC Lathe Bed */}
        <div className="p-2 bg-surface-container-low border border-outline-variant">
          <div className="flex justify-between items-center text-[11px] mb-1">
            <span className="font-mono text-on-surface font-semibold flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5 text-secondary" />
              CNC LATHE BED 02
            </span>
            <span className="font-mono text-secondary font-bold text-[10px]">
              {cncActive} / {totalCnc} ACTIVE
            </span>
          </div>
          <div className="w-full bg-surface-container-highest h-2 border border-outline-variant/40 mb-1.5 overflow-hidden">
            <div
              className="bg-secondary h-full transition-all duration-300"
              style={{ width: `${cncUtil}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[9px] font-mono text-outline mb-2">
            <span>Spindle: {cncActive === 2 ? "1200 RPM" : "0 RPM [HOLD]"}</span>
            <span className="text-secondary font-semibold">
              {cncActive < totalCnc ? "Maintenance Flag" : "Optimal"}
            </span>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-outline-variant/40">
            <span className="font-mono text-[9px] text-outline">Beds:</span>
            <input
              type="range"
              min={0}
              max={totalCnc}
              value={cncActive}
              onChange={(e) => handleUpdate("cnc", parseInt(e.target.value, 10))}
              className="w-full h-1 bg-surface-container-highest rounded cursor-pointer accent-[#FF9933]"
            />
            <span className="font-mono text-[9px] text-secondary w-4">{cncActive}</span>
          </div>
        </div>

        {/* 3. SMT Soldering Thermocouples */}
        <div className="p-2 bg-surface-container-low border border-outline-variant">
          <div className="flex justify-between items-center text-[11px] mb-1">
            <span className="font-mono text-on-surface font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-tertiary" />
              SMT SOLDERING
            </span>
            <span className="font-mono text-tertiary font-bold text-[10px]">
              {solderingActive} / {totalSoldering} ACTIVE
            </span>
          </div>
          <div className="w-full bg-surface-container-highest h-2 border border-outline-variant/40 mb-1.5 overflow-hidden">
            <div
              className="bg-tertiary h-full transition-all duration-300"
              style={{ width: `${solderingUtil}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[9px] font-mono text-outline mb-2">
            <span>Temp Sensor: 350.2°C</span>
            <span className="text-tertiary font-semibold">
              {solderingActive === totalSoldering ? "100% Thermal Lock" : `${solderingUtil.toFixed(0)}% Util`}
            </span>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-outline-variant/40">
            <span className="font-mono text-[9px] text-outline">Irons:</span>
            <input
              type="range"
              min={0}
              max={totalSoldering}
              value={solderingActive}
              onChange={(e) => handleUpdate("soldering", parseInt(e.target.value, 10))}
              className="w-full h-1 bg-surface-container-highest rounded cursor-pointer accent-[#10B981]"
            />
            <span className="font-mono text-[9px] text-tertiary w-4">{solderingActive}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
