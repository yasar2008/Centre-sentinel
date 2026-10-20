"use client";

import React, { useState, useMemo } from "react";
import { Download, Search, CheckCircle2, AlertTriangle, UserX, Fingerprint, ShieldCheck } from "lucide-react";
import { playTacticalClick, playAlertChime } from "./SoundFx";

export interface CandidateRecord {
  id: string;
  name: string;
  aadhaarMasked: string;
  bench: string;
  tradePack: string;
  aebasTime: string;
  lastSeenVision: string;
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
      tradePack: "Sewing Machine Operator",
      aebasTime: "09:08 IST",
      lastSeenVision: "Present in Session",
      status: "ACTIVE",
      detail: "Active sewing machine operation",
    },
    {
      id: "TR-0842",
      name: "Pooja Verma",
      aadhaarMasked: "XXXX-XXXX-9142",
      bench: "Station 02",
      tradePack: "Sewing Machine Operator",
      aebasTime: "09:10 IST",
      lastSeenVision: "Present in Session",
      status: "ACTIVE",
      detail: "Fabric alignment and hem stitching",
    },
    {
      id: "TR-0843",
      name: "Rohan Gupta",
      aadhaarMasked: "XXXX-XXXX-2190",
      bench: "Station 04",
      tradePack: "Sewing Machine Operator",
      aebasTime: "09:12 IST",
      lastSeenVision: "Unoccupied",
      status: "GHOST",
      detail: "Biometric punch logged at 09:12; seat unoccupied for 42 mins",
    },
    {
      id: "TR-0844",
      name: "Sunita Patel",
      aadhaarMasked: "XXXX-XXXX-6731",
      bench: "Station 07",
      tradePack: "Sewing Machine Operator",
      aebasTime: "09:14 IST",
      lastSeenVision: "Unoccupied",
      status: "GHOST",
      detail: "Workstation idle during scheduled morning practicals",
    },
    {
      id: "TR-0845",
      name: "Vikas Kumar",
      aadhaarMasked: "XXXX-XXXX-5510",
      bench: "Station 09",
      tradePack: "Sewing Machine Operator",
      aebasTime: "09:05 IST",
      lastSeenVision: "Present in Session",
      status: "ACTIVE",
      detail: "Garment hemming and finishing",
    },
    {
      id: "TR-0846",
      name: "Ananya Das",
      aadhaarMasked: "XXXX-XXXX-3891",
      bench: "Station 11",
      tradePack: "Sewing Machine Operator",
      aebasTime: "09:15 IST",
      lastSeenVision: "Present in Session",
      status: "ACTIVE",
      detail: "Buttonhole stitching",
    },
    {
      id: "TR-0847",
      name: "Deepak Yadav",
      aadhaarMasked: "XXXX-XXXX-7724",
      bench: "Station 12",
      tradePack: "Sewing Machine Operator",
      aebasTime: "09:11 IST",
      lastSeenVision: "Present in Session",
      status: "ACTIVE",
      detail: "Fabric pressing and iron station",
    },
    {
      id: "TR-0848",
      name: "Meera Singh",
      aadhaarMasked: "XXXX-XXXX-1140",
      bench: "Station 13",
      tradePack: "Sewing Machine Operator",
      aebasTime: "09:08 IST",
      lastSeenVision: "Unoccupied",
      status: "GHOST",
      detail: "Zero physical presence recorded by camera",
    },
    {
      id: "TR-0849",
      name: "Kunal Mehra",
      aadhaarMasked: "XXXX-XXXX-8205",
      bench: "Station 14",
      tradePack: "Sewing Machine Operator",
      aebasTime: "09:05 IST",
      lastSeenVision: "Discrepancy",
      status: "PROXY_SPOOF",
      detail: "Duplicate authentication detected at biometric terminal",
    },
    {
      id: "TR-0850",
      name: "Priya Nair",
      aadhaarMasked: "XXXX-XXXX-6398",
      bench: "Station 16",
      tradePack: "Sewing Machine Operator",
      aebasTime: "09:13 IST",
      lastSeenVision: "Present in Session",
      status: "ACTIVE",
      detail: "Pattern drafting on cutting bench",
    },
    {
      id: "TR-0851",
      name: "Mohit Chauhan",
      aadhaarMasked: "XXXX-XXXX-9901",
      bench: "Station 18",
      tradePack: "Sewing Machine Operator",
      aebasTime: "08:58 IST",
      lastSeenVision: "Unoccupied",
      status: "GHOST",
      detail: "Punch logged before gate opening; zero camera presence",
    },
    {
      id: "TR-0852",
      name: "Swati Sengupta",
      aadhaarMasked: "XXXX-XXXX-4432",
      bench: "Station 19",
      tradePack: "Sewing Machine Operator",
      aebasTime: "09:15 IST",
      lastSeenVision: "Discrepancy",
      status: "PROXY_SPOOF",
      detail: "Mobile biometric device location outside center premises",
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
        "Trade",
        "Assigned Workbench",
        "AEBAS Biometric Punch",
        "CCTV Vision Presence",
        "Audit Status",
        "Verification Notes",
      ],
      ...candidates.map((c) => [
        c.id,
        c.name,
        c.aadhaarMasked,
        c.tradePack,
        c.bench,
        c.aebasTime,
        c.lastSeenVision,
        c.status,
        `"${c.detail}"`,
      ]),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MSDE_Attendance_Audit_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-sm text-slate-900 tracking-tight flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-blue-700" />
            Biometric Ingress vs Physical Presence Verification
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated reconciliation between Aadhaar AEBAS portal records and real-time CCTV headcount
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800">
          6 Unattended Workstations (-21.4%)
        </span>
      </div>

      {/* Side-by-side Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Fingerprint className="w-3.5 h-3.5 text-slate-500" />
            Biometric Punches (AEBAS)
          </div>
          <div className="text-xl font-bold tracking-tight text-slate-900 mt-1">28 Registered</div>
          <div className="text-xs text-slate-500 mt-0.5">Varanasi Center Terminal</div>
        </div>
        <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200">
          <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Physical Camera Headcount
          </div>
          <div className="text-xl font-bold tracking-tight text-emerald-800 mt-1">22 Present</div>
          <div className="text-xs text-emerald-700 mt-0.5">Verified at Workstations</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl text-xs">
          <button
            onClick={() => {
              playTacticalClick();
              setFilter("ALL");
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === "ALL" ? "bg-white text-slate-900 font-semibold shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Trainees (28)
          </button>
          <button
            onClick={() => {
              playTacticalClick();
              setFilter("ACTIVE");
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === "ACTIVE" ? "bg-white text-emerald-800 font-semibold shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Verified Present (22)
          </button>
          <button
            onClick={() => {
              playTacticalClick();
              setFilter("DISCREPANT");
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === "DISCREPANT" ? "bg-white text-amber-800 font-semibold shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Unattended / Discrepancy (6)
          </button>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 shadow-sm transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          Export Audit Report (CSV)
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search trainee by name, ID, or station..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-colors"
        />
      </div>

      {/* Trainees List Table with Human Avatars */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
          {filteredCandidates.map((c) => {
            const isDiscrepant = c.status === "GHOST" || c.status === "PROXY_SPOOF";
            const initials = c.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2);

            return (
              <div
                key={c.id}
                className={`p-3 transition-colors text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDiscrepant ? "bg-amber-50/40 hover:bg-amber-50/70" : "hover:bg-slate-50"
                }`}
              >
                {/* Trainee Info with Human Initials Avatar */}
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    c.status === "ACTIVE"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-amber-100 text-amber-900"
                  }`}>
                    {initials}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      {c.name}
                      <span className="text-slate-400 font-normal text-[11px]">
                        {c.aadhaarMasked}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-medium text-slate-700">{c.bench}</span>
                      <span className="text-slate-300">•</span>
                      <span>{c.tradePack}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Timing */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right text-[11px]">
                    <div className="text-slate-700 font-medium">Punch: {c.aebasTime}</div>
                    <div className="text-slate-500">{c.lastSeenVision}</div>
                  </div>

                  {c.status === "ACTIVE" && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Present
                    </span>
                  )}

                  {c.status === "GHOST" && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-semibold text-[11px]">
                      <UserX className="w-3.5 h-3.5 text-amber-700" /> Unattended
                    </span>
                  )}

                  {c.status === "PROXY_SPOOF" && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-semibold text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Mismatch
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
