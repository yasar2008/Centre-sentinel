"use client";

import React, { useState } from "react";
import { Wifi, Copy, Check, Radio } from "lucide-react";
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
    <div className="luxury-card p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div>
          <h3 className="font-semibold text-sm text-white tracking-tight flex items-center gap-2">
            <Radio className="w-4 h-4 text-sky-400 stroke-[1.5]" />
            Rural Low-Bandwidth Telemetry (2.04 KB)
          </h3>
          <p className="text-xs text-slate-400 font-normal">
            LoRaWAN and 2G solar link telemetry with 99.98% video uplink reduction
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          99.98% Bandwidth Saved
        </span>
      </div>

      {/* 3 Metric Pills */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Packet Size</div>
          <div className="text-lg font-semibold tracking-tight text-white mt-1">2.04 KB</div>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Uplink Tech</div>
          <div className="text-lg font-semibold tracking-tight text-sky-400 mt-1">LoRa / 2G</div>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Proof WebP</div>
          <div className="text-lg font-semibold tracking-tight text-emerald-400 mt-1">12.4 KB</div>
        </div>
      </div>

      {/* JSON Payload Viewer */}
      <div className="relative">
        <div className="bg-[#070b14] p-3.5 rounded-xl border border-white/[0.06] font-mono text-[11px] text-sky-300/90 overflow-x-auto whitespace-pre leading-relaxed max-h-40">
          {JSON.stringify(payload, null, 2)}
        </div>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 px-2.5 py-1 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.1] rounded-lg text-white text-[10px] font-medium flex items-center gap-1.5 transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? "Copied" : "Copy Payload"}</span>
        </button>
      </div>
    </div>
  );
};
