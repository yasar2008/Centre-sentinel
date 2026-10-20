"use client";

import React, { useState, useMemo } from "react";
import { Download, Search, CheckCircle, AlertTriangle, UserX, Filter } from "lucide-react";
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
    { id: "TR-0841", name: "Aarav Sharma", bench: "Station 01", lastSeen: "13:41:55", confidence: 0.96, status: "ACTIVE", detail: "Hands-on Sewing" },
    { id: "TR-0842", name: "Pooja Verma", bench: "Station 02", lastSeen: "13:42:01", confidence: 0.93, status: "ACTIVE", detail: "Fabric Align" },
    { id: "TR-0843", name: "Rohan Gupta", bench: "Station 04", lastSeen: "09:12:00", confidence: 0.12, status: "GHOST", detail: "Idle 42m, biometric logged" },
    { id: "TR-0844", name: "Sunita Patel", bench: "Station 07", lastSeen: "09:14:22", confidence: 0.08, status: "GHOST", detail: "Idle 54m, biometric logged" },
    { id: "TR-0845", name: "Vikas Kumar", bench: "Station 09", lastSeen: "13:42:05", confidence: 0.97, status: "ACTIVE", detail: "Garment Hemming" },
    { id: "TR-0846", name: "Ananya Das", bench: "Station 11", lastSeen: "13:41:48", confidence: 0.92, status: "ACTIVE", detail: "Button Hole Stitch" },
    { id: "TR-0847", name: "Deepak Yadav", bench: "Station 12", lastSeen: "13:42:10", confidence: 0.95, status: "ACTIVE", detail: "Fabric Ironing" },
    { id: "TR-0848", name: "Meera Singh", bench: "Station 13", lastSeen: "09:08:14", confidence: 0.11, status: "GHOST", detail: "Unoccupied workbench" },
    { id: "TR-0849", name: "Kunal Mehra", bench: "Station 14", lastSeen: "09:05:10", confidence: 0.04, status: "PROXY_SPOOF", detail: "AEBAS duplicate auth" },
    { id: "TR-0850", name: "Priya Nair", bench: "Station 16", lastSeen: "13:41:40", confidence: 0.94, status: "ACTIVE", detail: "Pattern Drafting" },
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
    link.setAttribute("download", `MSDE_Attendance_Discrepancy_Audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant p-3 hud-bracket">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center border-b border-outline-variant pb-2 mb-2 gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
          <span className="font-bold text-sm text-on-surface uppercase tracking-wide">
            Attendance Discrepancy Matrix
          </span>
        </div>
        <span className="font-mono text-[10px] text-secondary bg-secondary/10 px-2 py-0.5 border border-secondary/40 font-bold">
          AUDIT DELTA: -6 CANDIDATES (-21.4%)
        </span>
      </div>

      {/* Side-by-Side Verification Banner */}
      <div className="grid grid-cols-2 gap-2 mb-2.5">
        <div className="p-2 bg-surface-container border border-outline-variant">
          <div className="font-mono text-[9px] text-outline uppercase">AEBAS BIOMETRIC PORTAL</div>
          <div className="font-mono text-xl font-bold text-primary">28 Claimed</div>
          <div className="font-mono text-[10px] text-on-surface-variant">Aadhaar Fingerprint/Iris Logs</div>
        </div>
        <div className="p-2 bg-surface-container border border-outline-variant">
          <div className="font-mono text-[9px] text-outline uppercase">AI VISION HEADCOUNT</div>
          <div className="font-mono text-xl font-bold text-tertiary">22 Active</div>
          <div className="font-mono text-[10px] text-tertiary">Continuous Bounding Box IoU</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1 font-mono text-[10px]">
          <button
            onClick={() => {
              playTacticalClick();
              setFilter("ALL");
            }}
            className={`px-2 py-0.5 border ${
              filter === "ALL"
                ? "bg-primary/20 text-primary border-primary font-bold"
                : "border-outline-variant text-outline hover:text-on-surface"
            }`}
          >
            All (28)
          </button>
          <button
            onClick={() => {
              playTacticalClick();
              setFilter("ACTIVE");
            }}
            className={`px-2 py-0.5 border ${
              filter === "ACTIVE"
                ? "bg-tertiary/20 text-tertiary border-tertiary font-bold"
                : "border-outline-variant text-outline hover:text-on-surface"
            }`}
          >
            Active (22)
          </button>
          <button
            onClick={() => {
              playTacticalClick();
              setFilter("DISCREPANT");
            }}
            className={`px-2 py-0.5 border ${
              filter === "DISCREPANT"
                ? "bg-secondary/20 text-secondary border-secondary font-bold"
                : "border-outline-variant text-outline hover:text-on-surface"
            }`}
          >
            Discrepant (6)
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-outline" />
          <input
            type="text"
            placeholder="Search Trainee or Station..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-7 pr-2 py-1 bg-surface-container-lowest border border-outline-variant font-mono text-[10px] text-on-surface placeholder:text-outline/60 focus:border-primary focus:outline-none w-44"
          />
        </div>
      </div>

      {/* Candidate Micro-Audit Table */}
      <div className="overflow-x-auto max-h-60 border border-outline-variant/60">
        <table className="w-full text-left font-mono text-[11px] border-collapse">
          <thead className="sticky top-0 bg-surface-container z-10">
            <tr className="border-b border-outline-variant text-outline text-[9px] uppercase">
              <th className="p-1.5">ID</th>
              <th className="p-1.5">BENCH</th>
              <th className="p-1.5">LAST SEEN</th>
              <th className="p-1.5">CONF</th>
              <th className="p-1.5">AUDIT STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40">
            {filteredCandidates.map((c) => {
              const isGhost = c.status === "GHOST";
              const isSpoof = c.status === "PROXY_SPOOF";
              const isDiscrepant = isGhost || isSpoof;

              return (
                <tr
                  key={c.id}
                  className={`transition-colors ${
                    isDiscrepant
                      ? "bg-secondary/10 hover:bg-secondary/20 text-secondary"
                      : "hover:bg-surface-container/60 text-on-surface"
                  }`}
                >
                  <td className="p-1.5 font-bold">
                    <span className={isDiscrepant ? "text-secondary" : "text-primary"}>
                      {c.id}
                    </span>
                    <div className="text-[9px] text-outline font-normal">{c.name}</div>
                  </td>
                  <td className="p-1.5">{c.bench}</td>
                  <td className="p-1.5">{c.lastSeen}</td>
                  <td className="p-1.5">
                    <span className={c.confidence > 0.8 ? "text-tertiary font-bold" : "text-error font-bold"}>
                      {c.confidence.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-1.5">
                    {c.status === "ACTIVE" && (
                      <span className="px-1.5 py-0.5 bg-tertiary/20 text-tertiary border border-tertiary/40 text-[9px] font-bold">
                        ACTIVE
                      </span>
                    )}
                    {c.status === "GHOST" && (
                      <span className="px-1.5 py-0.5 bg-secondary/20 text-secondary border border-secondary/60 text-[9px] font-bold flex items-center gap-1 w-fit">
                        <UserX className="w-2.5 h-2.5" />
                        GHOST (-42m)
                      </span>
                    )}
                    {c.status === "PROXY_SPOOF" && (
                      <span className="px-1.5 py-0.5 bg-error/20 text-error border border-error/60 text-[9px] font-bold flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        PROXY SPOOF
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Actions */}
      <div className="mt-2 pt-1.5 flex justify-between items-center text-[10px] text-outline font-mono border-t border-outline-variant/60">
        <span>Showing {filteredCandidates.length} of {candidates.length} Records</span>
        <button
          onClick={handleExportCsv}
          className="text-primary hover:underline flex items-center gap-1 font-bold"
        >
          <Download className="w-3.5 h-3.5" />
          Export Sealed CSV [SHA-256]
        </button>
      </div>
    </div>
  );
};
