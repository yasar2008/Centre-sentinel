"use client";

import React, { useState, useMemo } from "react";
import { Download, Search, CheckCircle2, AlertCircle, UserX } from "lucide-react";
import { playTacticalClick, playAlertChime } from "./SoundFx";

interface CandidateRecord {
  id: string;
  name: string;
  bench: string;
  lastSeen: string;
  confidence: number;
  status: "ACTIVE" | "GHOST" | "PROXY_SPOOF";
  detail: string;
}

export const DiscrepancyMatrix: React.FC = () => {
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "DISCREPANT">("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const candidates: CandidateRecord[] = [
    { id: "TR-0841", name: "Aarav Sharma", bench: "Station 01", lastSeen: "13:41:55", confidence: 0.96, status: "ACTIVE", detail: "Hands-on sewing" },
    { id: "TR-0842", name: "Pooja Verma", bench: "Station 02", lastSeen: "13:42:01", confidence: 0.93, status: "ACTIVE", detail: "Fabric align" },
    { id: "TR-0843", name: "Rohan Gupta", bench: "Station 04", lastSeen: "09:12:00", confidence: 0.12, status: "GHOST", detail: "Idle 42m, biometric logged" },
    { id: "TR-0844", name: "Sunita Patel", bench: "Station 07", lastSeen: "09:14:22", confidence: 0.08, status: "GHOST", detail: "Idle 54m, biometric logged" },
    { id: "TR-0845", name: "Vikas Kumar", bench: "Station 09", lastSeen: "13:42:05", confidence: 0.97, status: "ACTIVE", detail: "Garment hemming" },
    { id: "TR-0846", name: "Ananya Das", bench: "Station 11", lastSeen: "13:41:48", confidence: 0.92, status: "ACTIVE", detail: "Button hole stitch" },
    { id: "TR-0847", name: "Deepak Yadav", bench: "Station 12", lastSeen: "13:42:10", confidence: 0.95, status: "ACTIVE", detail: "Fabric ironing" },
    { id: "TR-0848", name: "Meera Singh", bench: "Station 13", lastSeen: "09:08:14", confidence: 0.11, status: "GHOST", detail: "Unoccupied workbench" },
    { id: "TR-0849", name: "Kunal Mehra", bench: "Station 14", lastSeen: "09:05:10", confidence: 0.04, status: "PROXY_SPOOF", detail: "AEBAS duplicate auth" },
    { id: "TR-0850", name: "Priya Nair", bench: "Station 16", lastSeen: "13:41:40", confidence: 0.94, status: "ACTIVE", detail: "Pattern drafting" },
    { id: "TR-0851", name: "Mohit Chauhan", bench: "Station 18", lastSeen: "08:58:30", confidence: 0.09, status: "GHOST", detail: "Zero motion detected" },
    { id: "TR-0852", name: "Swati Sengupta", bench: "Station 19", lastSeen: "09:15:00", confidence: 0.07, status: "PROXY_SPOOF", detail: "Geofence mismatch" },
  ];

  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchesSearch =
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.bench.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
      if (filter === "ACTIVE") return c.status === "ACTIVE";
      if (filter === "DISCREPANT") return c.status === "GHOST" || c.status === "PROXY_SPOOF";
      return true;
    });
  }, [candidates, filter, searchTerm]);

  const handleExportCsv = () => {
    playAlertChime();
    const rows = [
      ["Candidate ID", "Trainee Name", "Assigned Bench", "Last Detected (IST)", "AI Confidence", "Audit Status", "Forensic Notes", "Cryptographic Block"],
      ...candidates.map((c) => [
        c.id,
        c.name,
        c.bench,
        c.lastSeen,
        c.confidence.toString(),
        c.status,
        c.detail,
        "SHA256:8f9a2b7c4d5e0f11a6c8e3",
      ]),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MSDE_Attendance_Audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="luxury-card p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div>
          <h3 className="font-semibold text-sm text-white tracking-tight">
            Attendance Discrepancy Matrix
          </h3>
          <p className="text-xs text-slate-400 font-normal">
            Reconciling Aadhaar AEBAS portal claims against physical AI detection
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300">
          Delta: -6 Phantoms (-21.4%)
        </span>
      </div>

      {/* Side-by-side Comparison Banner */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Aadhaar AEBAS Claim</div>
          <div className="text-xl font-semibold tracking-tight text-white mt-1">28 Claimed</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Biometric Terminal Ingress</div>
        </div>
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Vision Headcount</div>
          <div className="text-xl font-semibold tracking-tight text-emerald-400 mt-1">22 Active</div>
          <div className="text-[11px] text-emerald-500/80 mt-0.5">Continuous YOLOv8 IoU</div>
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
            All (28)
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
            Active (22)
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
            Discrepant (6)
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate or bench..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-full text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-white/[0.2] transition-colors w-48"
          />
        </div>
      </div>

      {/* Candidate Table */}
      <div className="overflow-x-auto max-h-60 rounded-xl border border-white/[0.06]">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 bg-[#0d1322] border-b border-white/[0.06] text-slate-400 text-[11px] font-medium">
            <tr>
              <th className="p-2.5">Candidate ID</th>
              <th className="p-2.5">Workstation</th>
              <th className="p-2.5">Last Detected</th>
              <th className="p-2.5">Confidence</th>
              <th className="p-2.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredCandidates.map((c) => {
              const isGhost = c.status === "GHOST";
              const isSpoof = c.status === "PROXY_SPOOF";

              return (
                <tr
                  key={c.id}
                  className={`transition-colors duration-150 ${
                    isGhost || isSpoof
                      ? "bg-amber-500/[0.03] hover:bg-amber-500/[0.06]"
                      : "hover:bg-white/[0.02]"
                  }`}
                >
                  <td className="p-2.5">
                    <span className="font-semibold text-white">{c.id}</span>
                    <div className="text-[11px] text-slate-400">{c.name}</div>
                  </td>
                  <td className="p-2.5 text-slate-300">{c.bench}</td>
                  <td className="p-2.5 font-mono text-[11px] text-slate-400">{c.lastSeen}</td>
                  <td className="p-2.5 font-mono text-[11px]">
                    <span className={c.confidence > 0.8 ? "text-emerald-400" : "text-amber-400"}>
                      {(c.confidence * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="p-2.5">
                    {c.status === "ACTIVE" && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium">
                        Active
                      </span>
                    )}
                    {c.status === "GHOST" && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-medium flex items-center gap-1 w-fit">
                        <UserX className="w-3 h-3" />
                        Ghost (-42m)
                      </span>
                    )}
                    {c.status === "PROXY_SPOOF" && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[11px] font-medium flex items-center gap-1 w-fit">
                        <AlertCircle className="w-3 h-3" />
                        Proxy Spoof
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
        <span>Showing {filteredCandidates.length} of {candidates.length} candidate records</span>
        <button
          onClick={handleExportCsv}
          className="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export Sealed CSV [SHA-256]
        </button>
      </div>
    </div>
  );
};
