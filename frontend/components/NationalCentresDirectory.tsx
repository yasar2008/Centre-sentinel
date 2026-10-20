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
  const [searchTerm, setSearchTerm] = useState<string>("" );
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
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-sm text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            National Empaneled Training Centres Directory
          </h3>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Real-time compliance directory across 15,000+ PMKK, KVK, JSS, and NSDC skill facilities
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing {filteredCentres.length} of {centres.length} accredited facilities
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search centre ID, city, or trade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
        </div>

        {/* State select */}
        <select
          value={selectedState}
          onChange={(e) => {
            playTacticalClick();
            setSelectedState(e.target.value);
          }}
          className="bg-slate-50 border border-slate-300 px-3.5 py-2 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer font-medium"
        >
          {states.map((st) => (
            <option key={st} value={st}>
              State: {st}
            </option>
          ))}
        </select>

        {/* Status buttons */}
        <div className="flex gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl text-xs">
          {["ALL", "COMPLIANT", "WARNING", "CRITICAL"].map((st) => (
            <button
              key={st}
              onClick={() => {
                playTacticalClick();
                setSelectedStatus(st);
              }}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedStatus === st
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
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
                  ? "bg-blue-50/40 border-blue-500 ring-2 ring-blue-500/20 shadow-md"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <div className="flex justify-between items-start mb-1.5">
                <span className="font-bold text-xs text-slate-900">{c.id}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isCritical
                      ? "bg-rose-50 border-rose-200 text-rose-800"
                      : isWarning
                      ? "bg-amber-50 border-amber-200 text-amber-800"
                      : "bg-emerald-50 border-emerald-200 text-emerald-800"
                  }`}
                >
                  {c.status}
                </span>
              </div>

              <h4 className="font-semibold text-xs text-slate-800 line-clamp-1 mb-1">
                {c.name}
              </h4>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-3">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{c.district}, {c.state}</span>
                <span className="text-slate-300">•</span>
                <span className="font-semibold text-blue-700">{c.scheme}</span>
              </div>

              {/* Minimal Metrics Strip */}
              <div className="grid grid-cols-3 gap-1.5 pt-2.5 border-t border-slate-100 text-center text-xs">
                <div className="p-1.5 rounded-lg bg-slate-50">
                  <div className="text-[10px] text-slate-500 font-medium">Claimed</div>
                  <div className="text-slate-900 font-bold">{c.claimed}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-50">
                  <div className="text-[10px] text-slate-500 font-medium">Physical</div>
                  <div className="text-emerald-700 font-bold">{c.detected}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-50">
                  <div className="text-[10px] text-slate-500 font-medium">Operability</div>
                  <div className={c.oci >= 80 ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>
                    {c.oci}%
                  </div>
                </div>
              </div>

              {isCritical && (
                <div className="mt-2 text-[11px] font-semibold text-rose-700 flex justify-between items-center bg-rose-50/60 px-2 py-1 rounded-md border border-rose-100">
                  <span>Withheld Subsidy:</span>
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
