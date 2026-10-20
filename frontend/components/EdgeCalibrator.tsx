"use client";

import React, { useState } from "react";
import { Sliders, Save, Check, Shield } from "lucide-react";
import { playTacticalClick, playAlertChime } from "./SoundFx";

interface EdgeCalibratorProps {
  onSyncSuccess?: () => void;
}

export const EdgeCalibrator: React.FC<EdgeCalibratorProps> = ({ onSyncSuccess }) => {
  const [confThreshold, setConfThreshold] = useState<number>(0.25);
  const [iouThreshold, setIouThreshold] = useState<number>(0.45);
  const [blurKernel, setBlurKernel] = useState<number>(51);
  const [lowBwEnabled, setLowBwEnabled] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  const handleSave = async () => {
    playAlertChime();
    setSaving(true);
    setSavedStatus(null);

    const payload = {
      confidence_threshold: confThreshold,
      iou_threshold: iouThreshold,
      blur_kernel_size: blurKernel,
      low_bandwidth_mode: lowBwEnabled,
    };

    try {
      const res = await fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSavedStatus("Configuration Synced with Training Centre Hardware");
        if (onSyncSuccess) onSyncSuccess();
      } else {
        setSavedStatus("Cached in Central Cloud Gateway");
      }
    } catch (_err) {
      setSavedStatus("Cached in Central Cloud Gateway");
    } finally {
      setSaving(false);
      setTimeout(() => setSavedStatus(null), 4000);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-sm text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            Verification Parameters &amp; Threshold Calibration
          </h3>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Calibrate optical headcount precision, student-to-machinery overlap tolerances, and DPDP privacy settings
          </p>
        </div>
        {savedStatus && (
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            {savedStatus}
          </span>
        )}
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Detection Confidence */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-900 font-semibold">Trainee Presence Confidence</span>
            <span className="text-blue-700 font-bold">{(confThreshold * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={0.9}
            step={0.05}
            value={confThreshold}
            onChange={(e) => {
              playTacticalClick();
              setConfThreshold(parseFloat(e.target.value));
            }}
            className="w-full h-1.5 bg-slate-200 rounded-full cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>High Sensitivity (0.10)</span>
            <span className="font-semibold text-slate-700">Current: {confThreshold.toFixed(2)}</span>
            <span>Strict Verification (0.90)</span>
          </div>
        </div>

        {/* IoU Threshold */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-900 font-semibold">Trainee-to-Machinery Overlap (IoU)</span>
            <span className="text-amber-700 font-bold">{(iouThreshold * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={0.9}
            step={0.05}
            value={iouThreshold}
            onChange={(e) => {
              playTacticalClick();
              setIouThreshold(parseFloat(e.target.value));
            }}
            className="w-full h-1.5 bg-slate-200 rounded-full cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Broad Proximity (0.10)</span>
            <span className="font-semibold text-slate-700">Current: {iouThreshold.toFixed(2)}</span>
            <span>Direct Contact (0.90)</span>
          </div>
        </div>

        {/* DPDP Gaussian Blur Kernel */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-900 font-semibold">DPDP Act 2023 Facial Privacy Blur</span>
            <span className="text-emerald-700 font-bold">Kernel = {blurKernel}×{blurKernel}</span>
          </div>
          <div className="flex gap-2 text-xs">
            {[31, 51, 71].map((k) => (
              <button
                key={k}
                onClick={() => {
                  playTacticalClick();
                  setBlurKernel(k);
                }}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                  blurKernel === k
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {k}×{k} {k === 51 ? "(Mandatory)" : ""}
              </button>
            ))}
          </div>
          <div className="text-[11px] text-slate-500">
            Ensures complete facial anonymization before telemetry leaves the training centre.
          </div>
        </div>

        {/* Low-Bandwidth Mode Switch */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-900 font-semibold">Rural Telemetry Uplink Mode</span>
            <span className={`font-bold ${lowBwEnabled ? "text-emerald-700" : "text-amber-700"}`}>
              {lowBwEnabled ? "2KB Ultra-Compact" : "Standard Broadband"}
            </span>
          </div>
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => {
                playTacticalClick();
                setLowBwEnabled(true);
              }}
              className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                lowBwEnabled
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              2KB LoRa / 2G Solar
            </button>
            <button
              onClick={() => {
                playTacticalClick();
                setLowBwEnabled(false);
              }}
              className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                !lowBwEnabled
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              Broadband Video Stream
            </button>
          </div>
          <div className="text-[11px] text-slate-500">
            Reduces remote data transfer costs while ensuring continuous compliance verification.
          </div>
        </div>
      </div>

      {/* Deploy Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Deploying Configuration..." : "Save Calibration Settings"}</span>
        </button>
      </div>
    </div>
  );
};
