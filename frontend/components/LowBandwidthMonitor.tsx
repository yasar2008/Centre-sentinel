"use client";

import React, { useState } from "react";
import { Copy, Check, Radio } from "lucide-react";
import { playTacticalClick } from "./SoundFx";

interface LowBandwidthMonitorProps {
  centreId: string;
  detectedCount: number;
  portalClaim: number;
  discrepancyDelta: number;
  ociScore: number;
}

export const LowBandwidthMonitor: React.FC<LowBandwidthMonitorProps> = ({
  centreId,
  detectedCount,
  portalClaim,
  discrepancyDelta,
  ociScore,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const payload = {
    node_id: centreId,
    timestamp: Math.floor(Date.now() / 1000),
    headcount_detected: detectedCount,
    portal_claimed: portalClaim,
    discrepancy_delta: discrepancyDelta,
    oci_index: parseFloat((ociScore / 100).toFixed(3)),
    bandwidth_saved_pct: 99.987,
    packet_size_bytes: 2048,
    privacy_protocol: "GAUSSIAN_BLUR_K51_ZERO_BIOMETRIC",
    proof_hash: "sha256:d8a9f4c3b2e1774883920194882103fca91e84",
    sig: "secp256k1:3045022100e4b84019a823b4918237192a83b1",
  };

  const handleCopy = () => {
    playTacticalClick();
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-sm text-slate-900 tracking-tight flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-600" />
            Rural Low-Bandwidth Telemetry (2.04 KB)
          </h3>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Optimized for 2G rural mobile data links with 99.98% bandwidth reduction vs raw video streaming
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
          99.98% Bandwidth Saved
        </span>
      </div>

      {/* 3 Metric Pills */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Packet Size</div>
          <div className="text-lg font-bold tracking-tight text-slate-900 mt-1">2.04 KB</div>
          <div className="text-[10px] text-slate-400">JSON Telemetry</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Uplink Tech</div>
          <div className="text-lg font-bold tracking-tight text-blue-700 mt-1">LoRa / 2G</div>
          <div className="text-[10px] text-slate-400">Solar Supported</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Audit Proof</div>
          <div className="text-lg font-bold tracking-tight text-emerald-700 mt-1">12.4 KB</div>
          <div className="text-[10px] text-slate-400">WebP Compressed</div>
        </div>
      </div>

      {/* JSON Payload Viewer */}
      <div className="relative">
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px] text-slate-800 font-mono overflow-x-auto whitespace-pre leading-relaxed max-h-40">
          {JSON.stringify(payload, null, 2)}
        </div>
        <button
          onClick={handleCopy}
          className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 text-[11px] font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? "Copied" : "Copy Payload"}</span>
        </button>
      </div>
    </div>
  );
};
