"use client";

import React, { useState, useMemo } from "react";
import { Search, Building2, MapPin } from "lucide-react";
import { playTacticalClick } from "./SoundFx";

export interface CentreItem {
  id: string;
  name: string;
  district: string;
  state: string;
  scheme: "PMKK" | "KVK" | "JSS" | "NSDC";
  claimed: number;
  detected: number;
  oci: number;
  status: "COMPLIANT" | "WARNING" | "CRITICAL";
  penalty: number;
}

interface NationalCentresDirectoryProps {
  selectedCentreId: string;
  onSelectCentre: (centre: CentreItem) => void;
}

export const NationalCentresDirectory: React.FC<NationalCentresDirectoryProps> = ({
  selectedCentreId,
  onSelectCentre,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const centres: CentreItem[] = [
    { id: "TC-UP-VNS-0492", name: "Varanasi Textile & Apparel Centre", district: "Varanasi", state: "Uttar Pradesh", scheme: "PMKK", claimed: 28, detected: 22, oci: 74.2, status: "CRITICAL", penalty: 184000 },
    { id: "TC-JH-RNC-081", name: "Ranchi Advanced Electrical Skill Hub", district: "Ranchi", state: "Jharkhand", scheme: "PMKK", claimed: 24, detected: 22, oci: 84.5, status: "COMPLIANT", penalty: 0 },
    { id: "TC-BR-PAT-0331", name: "Patna CNC & Heavy Machining Academy", district: "Patna", state: "Bihar", scheme: "NSDC", claimed: 30, detected: 24, oci: 68.0, status: "CRITICAL", penalty: 194000 },
    { id: "TC-MP-BPL-0118", name: "Bhopal Automotive Technology Lab", district: "Bhopal", state: "Madhya Pradesh", scheme: "PMKK", claimed: 20, detected: 19, oci: 82.1, status: "COMPLIANT", penalty: 0 },
    { id: "TC-MH-PUN-0914", name: "Pune Precision Robotics & SMT Lab", district: "Pune", state: "Maharashtra", scheme: "NSDC", claimed: 25, detected: 21, oci: 76.5, status: "WARNING", penalty: 76000 },
    { id: "TC-TN-CHE-0552", name: "Chennai Garment & Industrial Tailoring", district: "Chennai", state: "Tamil Nadu", scheme: "JSS", claimed: 32, detected: 32, oci: 94.0, status: "COMPLIANT", penalty: 0 },
    { id: "TC-AS-GUW-0210", name: "Guwahati Agro-Processing Unit", district: "Kamrup", state: "Assam", scheme: "KVK", claimed: 18, detected: 14, oci: 71.0, status: "CRITICAL", penalty: 156000 },
    { id: "TC-RJ-JAI-0774", name: "Jaipur Solar PV Installation & Grid", district: "Jaipur", state: "Rajasthan", scheme: "PMKK", claimed: 22, detected: 21, oci: 86.4, status: "COMPLIANT", penalty: 0 },
    { id: "TC-OD-BBI-0401", name: "Bhubaneswar Civil Masonry Yard", district: "Khordha", state: "Odisha", scheme: "JSS", claimed: 26, detected: 23, oci: 78.2, status: "WARNING", penalty: 62000 },
    { id: "TC-WB-KOL-0639", name: "Kolkata Leather Goods & Footwear Hub", district: "Kolkata", state: "West Bengal", scheme: "NSDC", claimed: 28, detected: 28, oci: 91.5, status: "COMPLIANT", penalty: 0 },
    { id: "TC-KA-BLR-0822", name: "Bengaluru Micro-Electronics & Drone Lab", district: "Bengaluru Urban", state: "Karnataka", scheme: "PMKK", claimed: 30, detected: 29, oci: 96.2, status: "COMPLIANT", penalty: 0 },
    { id: "TC-GJ-AHM-0193", name: "Ahmedabad Chemical Lab & QC Center", district: "Ahmedabad", state: "Gujarat", scheme: "NSDC", claimed: 20, detected: 15, oci: 73.0, status: "CRITICAL", penalty: 170000 },
  ];

  const states = ["ALL", "Uttar Pradesh", "Jharkhand", "Bihar", "Madhya Pradesh", "Maharashtra", "Tamil Nadu", "Assam"];

  const filteredCentres = useMemo(() => {
    return centres.filter((c) => {
      const matchesSearch =
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.district.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
      if (selectedState !== "ALL" && c.state !== selectedState) return false;
      if (selectedStatus !== "ALL" && c.status !== selectedStatus) return false;
      return true;
    });
  }, [centres, searchTerm, selectedState, selectedStatus]);

  return (
    <div className="luxury-card p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div>
          <h3 className="font-semibold text-base text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-4 h-4 text-sky-400 stroke-[1.5]" />
            National Training Centres Audit Registry
          </h3>
          <p className="text-xs text-slate-400 font-normal">
            Surveillance registry across 15,000+ PMKK, KVK, JSS, and NSDC empaneled facilities
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          {filteredCentres.length} of {centres.length} facilities active
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search facility by ID, city, or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/[0.02] border border-white/[0.08] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-white/[0.2] transition-colors"
          />
        </div>

        {/* State select */}
        <select
          value={selectedState}
          onChange={(e) => {
            playTacticalClick();
            setSelectedState(e.target.value);
          }}
          className="bg-[#0c1220] border border-white/[0.08] px-3.5 py-2 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-white/[0.2] cursor-pointer"
        >
          {states.map((st) => (
            <option key={st} value={st}>
              State: {st}
            </option>
          ))}
        </select>

        {/* Status buttons */}
        <div className="flex gap-1.5 p-1 bg-white/[0.02] border border-white/[0.06] rounded-xl text-xs">
          {["ALL", "COMPLIANT", "WARNING", "CRITICAL"].map((st) => (
            <button
              key={st}
              onClick={() => {
                playTacticalClick();
                setSelectedStatus(st);
              }}
              className={`flex-1 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedStatus === st
                  ? "bg-white/[0.1] text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Centres Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredCentres.map((c) => {
          const isSelected = selectedCentreId === c.id;
          const isCritical = c.status === "CRITICAL";
          const isWarning = c.status === "WARNING";

          return (
            <div
              key={c.id}
              onClick={() => {
                playTacticalClick();
                onSelectCentre(c);
              }}
              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-white/[0.08] border-white/[0.2] shadow-md"
                  : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-xs text-white">{c.id}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    isCritical
                      ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                      : isWarning
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  }`}
                >
                  {c.status}
                </span>
              </div>

              <h4 className="font-medium text-xs text-slate-200 line-clamp-1 mb-1">
                {c.name}
              </h4>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-3">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>{c.district}, {c.state}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">{c.scheme}</span>
              </div>

              {/* Minimal Metrics Strip */}
              <div className="grid grid-cols-3 gap-1.5 pt-2.5 border-t border-white/[0.06] text-center text-xs">
                <div className="p-1.5 rounded-lg bg-white/[0.02]">
                  <div className="text-[10px] text-slate-500">Claim</div>
                  <div className="text-white font-medium">{c.claimed}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-white/[0.02]">
                  <div className="text-[10px] text-slate-500">Vision</div>
                  <div className="text-emerald-400 font-medium">{c.detected}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-white/[0.02]">
                  <div className="text-[10px] text-slate-500">OCI</div>
                  <div className={c.oci >= 80 ? "text-emerald-400 font-medium" : "text-rose-400 font-medium"}>
                    {c.oci}%
                  </div>
                </div>
              </div>

              {isCritical && (
                <div className="mt-2 text-[11px] font-medium text-rose-400 flex justify-between items-center">
                  <span>Sec 12-A Withhold:</span>
                  <span>₹{c.penalty.toLocaleString("en-IN")}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
