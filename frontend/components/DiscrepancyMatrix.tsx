"use client";

import React, { useState, useMemo } from "react";
import { Download, Search, CheckCircle2, AlertCircle, UserX, ShieldCheck, Fingerprint } from "lucide-react";
import { playTacticalClick, playAlertChime } from "./SoundFx";

export interface CandidateRecord {
  id: string;
  name: string;
  aadhaarMasked: string;
  bench: string;
  tradePack: string;
  aebasTime: string;
  lastSeenVision: string;
  confidence: number;
  status: "ACTIVE" | "GHOST" | "PROXY_SPOOF";
  detail: string;
}

export const DiscrepancyMatrix: React.FC = () => {
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "DISCREPANT">("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const candidates: CandidateRecord[] = [
    {
      id: "TR-0841",
      name: "Aarav Sharma",
      aadhaarMasked: "XXXX-XXXX-4819",
      bench: "Station 01",
      tradePack: "AMH/Q0102 (Sewing)",
      aebasTime: "09:08:12 IST",
      lastSeenVision: "13:42:15 IST",
      confidence: 0.96,
      status: "ACTIVE",
      detail: "Continuous JUKI DDL-8700 lockstitch operation",
    },
    {
      id: "TR-0842",
      name: "Pooja Verma",
      aadhaarMasked: "XXXX-XXXX-9142",
      bench: "Station 02",
      tradePack: "AMH/Q0102 (Sewing)",
      aebasTime: "09:10:04 IST",
      lastSeenVision: "13:42:20 IST",
      confidence: 0.94,
      status: "ACTIVE",
      detail: "Hemming fabric roll, hands-on IoU 0.91",
    },
    {
      id: "TR-0843",
      name: "Rohan Gupta",
      aadhaarMasked: "XXXX-XXXX-2190",
      bench: "Station 04",
      tradePack: "AMH/Q0102 (Sewing)",
      aebasTime: "09:12:44 IST",
      lastSeenVision: "Unoccupied",
      confidence: 0.08,
      status: "GHOST",
      detail: "AEBAS punch verified at terminal; zero visual presence (Ghost Beneficiary)",
    },
    {
      id: "TR-0844",
      name: "Sunita Patel",
      aadhaarMasked: "XXXX-XXXX-6731",
      bench: "Station 07",
      tradePack: "AMH/Q0102 (Sewing)",
      aebasTime: "09:14:22 IST",
      lastSeenVision: "Unoccupied",
      confidence: 0.05,
      status: "GHOST",
      detail: "Station idle 54m; PFMS DBT stipend tranche flag",
    },
    {
      id: "TR-0845",
      name: "Vikas Kumar",
      aadhaarMasked: "XXXX-XXXX-5510",
      bench: "Station 09",
      tradePack: "AMH/Q0102 (Sewing)",
      aebasTime: "09:05:30 IST",
      lastSeenVision: "13:42:18 IST",
      confidence: 0.97,
      status: "ACTIVE",
      detail: "Overlock machine trimming, IoU 0.95",
    },
    {
      id: "TR-0846",
      name: "Ananya Das",
      aadhaarMasked: "XXXX-XXXX-3891",
      bench: "Station 11",
      tradePack: "AMH/Q0102 (Sewing)",
      aebasTime: "09:15:18 IST",
      lastSeenVision: "13:41:50 IST",
      confidence: 0.92,
      status: "ACTIVE",
      detail: "Buttonhole stitching, IoU 0.89",
    },
    {
      id: "TR-0847",
      name: "Deepak Yadav",
      aadhaarMasked: "XXXX-XXXX-7724",
      bench: "Station 12",
      tradePack: "AMH/Q0102 (Sewing)",
      aebasTime: "09:11:02 IST",
      lastSeenVision: "13:42:05 IST",
      confidence: 0.95,
      status: "ACTIVE",
      detail: "Industrial steam pressing, IoU 0.93",
    },
    {
      id: "TR-0848",
      name: "Meera Singh",
      aadhaarMasked: "XXXX-XXXX-1140",
      bench: "Station 13",
      tradePack: "AMH/Q0102 (Sewing)",
      aebasTime: "09:08:14 IST",
      lastSeenVision: "Unoccupied",
      confidence: 0.09,
      status: "GHOST",
      detail: "Unoccupied workbench during scheduled practical batch",
    },
    {
      id: "TR-0849",
      name: "Kunal Mehra",
      aadhaarMasked: "XXXX-XXXX-8205",
      bench: "Station 14",
      tradePack: "AMH/Q0102 (Sewing)",
      aebasTime: "09:05:10 IST",
      lastSeenVision: "Discrepant",
      confidence: 0.04,
      status: "PROXY_SPOOF",
      detail: "AEBAS duplicate authentication; single person punching 2 IDs",
    },
    {
      id: "TR-0850",
      name: "Priya Nair",
      aadhaarMasked: "XXXX-XXXX-6398",
      bench: "Station 16",
      tradePack: "AMH/Q0102 (Sewing)",
      aebasTime: "09:13:40 IST",
      lastSeenVision: "13:41:40 IST",
      confidence: 0.94,
      status: "ACTIVE",
      detail: "Pattern drafting on cutting table",
    },
    {
      id: "TR-0851",
      name: "Mohit Chauhan",
      aadhaarMasked: "XXXX-XXXX-9901",
      bench: "Station 18",
      tradePack: "AMH/Q0102 (Sewing)",
      aebasTime: "08:58:30 IST",
      lastSeenVision: "Unoccupied",
      confidence: 0.07,
      status: "GHOST",
      detail: "Zero presence in lab across entire 4-hour morning session",
    },
    {
      id: "TR-0852",
      name: "Swati Sengupta",
      aadhaarMasked: "XXXX-XXXX-4432",
      bench: "Station 19",
      tradePack: "AMH/Q0102 (Sewing)",
      aebasTime: "09:15:00 IST",
      lastSeenVision: "Discrepant",
      confidence: 0.06,
      status: "PROXY_SPOOF",
      detail: "Mobile AEBAS device geofence mismatch (>50m off centre premises)",
    },
  ];

  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchesSearch =
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.bench.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.aadhaarMasked.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
      if (filter === "ACTIVE") return c.status === "ACTIVE";
      if (filter === "DISCREPANT") return c.status === "GHOST" || c.status === "PROXY_SPOOF";
      return true;
    });
  }, [candidates, filter, searchTerm]);

  const handleExportCsv = () => {
    playAlertChime();
    const rows = [
      [
        "Candidate ID",
        "Trainee Full Name",
        "Masked Aadhaar VID",
        "Qualification Pack",
        "Assigned Workbench",
        "AEBAS Biometric Punch (IST)",
        "Vision Last Verified",
        "YOLO Confidence",
        "Audit Status",
        "Forensic Investigation Notes",
        "SHA-256 Watermark Hash",
      ],
      ...candidates.map((c) => [
        c.id,
        c.name,
        c.aadhaarMasked,
        c.tradePack,
        c.bench,
        c.aebasTime,
        c.lastSeenVision,
        c.confidence.toString(),
        c.status,
        `"${c.detail}"`,
        "SHA256:8f9a2b7c4d5e0f11a6c8e3b4a2e5d8",
      ]),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MSDE_PMKVY_Attendance_Audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="luxury-card p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div>
          <h3 className="font-semibold text-sm text-white tracking-tight flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-sky-400 stroke-[1.5]" />
            Aadhaar AEBAS vs Vision Discrepancy Matrix
          </h3>
          <p className="text-xs text-slate-400 font-normal">
            Automated reconciliation: Biometric Portal Records vs Computer Vision Headcount
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300">
          Delta: -6 Phantom Beneficiaries (-21.4%)
        </span>
      </div>

      {/* Side-by-side Comparison Banner */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Fingerprint className="w-3.5 h-3.5 text-slate-400" />
            AEBAS Biometric Claim
          </div>
          <div className="text-xl font-semibold tracking-tight text-white mt-1">28 Punched In</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Terminal ID: UIDAI-VNS-0492</div>
        </div>
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Physical Vision Headcount
          </div>
          <div className="text-xl font-semibold tracking-tight text-emerald-400 mt-1">22 Present</div>
          <div className="text-[11px] text-emerald-500/80 mt-0.5">Continuous YOLOv8 Tracking</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/[0.06] rounded-full text-xs">
          <button
            onClick={() => {
              playTacticalClick();
              setFilter("ALL");
            }}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              filter === "ALL" ? "bg-white/[0.1] text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            All Candidates (28)
          </button>
          <button
            onClick={() => {
              playTacticalClick();
              setFilter("ACTIVE");
            }}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              filter === "ACTIVE" ? "bg-white/[0.1] text-emerald-400 shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Physically Active (22)
          </button>
          <button
            onClick={() => {
              playTacticalClick();
              setFilter("DISCREPANT");
            }}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              filter === "DISCREPANT" ? "bg-white/[0.1] text-amber-400 shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Discrepant / Ghost (6)
          </button>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-slate-200 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          Export Audit CSV
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3.5 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Filter candidate by Name, ID, or Aadhaar VID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-1.5 bg-white/[0.02] border border-white/[0.08] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-white/[0.2] transition-colors"
        />
      </div>

      {/* Candidates Audit Table */}
      <div className="border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.01]">
        <div className="max-h-64 overflow-y-auto divide-y divide-white/[0.04]">
          {filteredCandidates.map((c) => {
            const isDiscrepant = c.status === "GHOST" || c.status === "PROXY_SPOOF";
            return (
              <div
                key={c.id}
                className={`p-3 transition-colors text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  isDiscrepant ? "bg-amber-500/[0.03] hover:bg-amber-500/[0.06]" : "hover:bg-white/[0.02]"
                }`}
              >
                {/* Candidate Info */}
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center font-mono text-[10px] text-slate-300 font-semibold">
                    {c.id.split("-")[1]}
                  </div>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      {c.name}
                      <span className="font-mono text-[10px] text-slate-500 font-normal">
                        {c.aadhaarMasked}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{c.bench}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-500">{c.tradePack}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Timestamps */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right text-[11px]">
                    <div className="text-slate-300 font-mono">AEBAS: {c.aebasTime}</div>
                    <div className="text-slate-500 font-mono text-[10px]">Vision: {c.lastSeenVision}</div>
                  </div>

                  {c.status === "ACTIVE" && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-[10px]">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  )}

                  {c.status === "GHOST" && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-medium text-[10px]">
                      <UserX className="w-3 h-3" /> Ghost
                    </span>
                  )}

                  {c.status === "PROXY_SPOOF" && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-medium text-[10px]">
                      <AlertCircle className="w-3 h-3" /> Proxy
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
