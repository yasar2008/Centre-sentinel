"use client";

import React, { useState } from "react";
import { Wifi, Copy, Check, ShieldCheck, Database, HardDrive } from "lucide-react";
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
    <div className="bg-surface-container-low border border-outline-variant p-3 hud-bracket">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center border-b border-outline-variant pb-2 mb-2 gap-2">
        <span className="font-bold text-sm text-on-surface flex items-center gap-1.5">
          <span className="material-symbols-outlined text-tertiary text-[18px]">wifi_tethering</span>
          Rural Low-BW Packet Monitor (2KB LoRaWAN)
        </span>
        <span className="font-mono text-[9px] text-tertiary bg-tertiary/10 border border-tertiary/40 px-2 py-0.5 font-bold">
          99.98% BW AVOIDED
        </span>
      </div>

      {/* 3 Metric Pills */}
      <div className="grid grid-cols-3 gap-2 text-center mb-2.5">
        <div className="p-1.5 bg-surface-container border border-outline-variant">
          <div className="font-mono text-[9px] text-outline">PACKET SIZE</div>
          <div className="font-mono text-sm text-primary font-bold">2.04 KB</div>
        </div>
        <div className="p-1.5 bg-surface-container border border-outline-variant">
          <div className="font-mono text-[9px] text-outline">TX UPLINK</div>
          <div className="font-mono text-sm text-tertiary font-bold">LoRaWAN / 2G</div>
        </div>
        <div className="p-1.5 bg-surface-container border border-outline-variant">
          <div className="font-mono text-[9px] text-outline">PROOF WEBP</div>
          <div className="font-mono text-sm text-on-surface font-bold">12.4 KB</div>
        </div>
      </div>

      {/* Raw JSON Payload Viewer */}
      <div className="relative">
        <div className="bg-surface-container-lowest p-2 border border-outline-variant/60 font-mono text-[10px] text-tertiary overflow-x-auto whitespace-pre leading-snug rounded-none max-h-40">
          {JSON.stringify(payload, null, 2)}
        </div>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1 bg-surface-container-high/80 border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-colors text-[9px] font-mono flex items-center gap-1"
          title="Copy Telemetry JSON Payload"
        >
          {copied ? <Check className="w-3 h-3 text-tertiary" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? "COPIED" : "COPY"}</span>
        </button>
      </div>
    </div>
  );
};
