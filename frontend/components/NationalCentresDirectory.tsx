"use client";

import React, { useState, useMemo } from "react";
import { Search, Building2, MapPin, CheckCircle, AlertTriangle, AlertOctagon, ChevronRight, Filter } from "lucide-react";
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
    <div className="bg-surface-container-low border border-outline-variant p-4 hud-bracket space-y-4">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center border-b border-outline-variant pb-2 gap-2">
        <div>
          <h3 className="font-bold text-base text-primary flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            National Training Centres Audit Directory
          </h3>
          <p className="font-mono text-xs text-on-surface-variant">
            Surveillance registry across 15,000+ PMKK, KVK, JSS, and NSDC empaneled facilities
          </p>
        </div>
        <div className="font-mono text-xs text-outline">
          {filteredCentres.length} of {centres.length} Centres Filtered
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-outline" />
          <input
            type="text"
            placeholder="Search Centre ID, City, or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-surface-container border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline/60 focus:border-primary focus:outline-none"
          />
        </div>

        {/* State Filter */}
        <select
          value={selectedState}
          onChange={(e) => {
            playTacticalClick();
            setSelectedState(e.target.value);
          }}
          className="bg-surface-container border border-outline-variant px-3 py-1.5 font-mono text-xs text-on-surface focus:border-primary focus:outline-none cursor-pointer"
        >
          {states.map((st) => (
            <option key={st} value={st} className="bg-surface-container-lowest">
              State: {st}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <div className="flex gap-1 font-mono text-[10px]">
          {["ALL", "COMPLIANT", "WARNING", "CRITICAL"].map((st) => (
            <button
              key={st}
              onClick={() => {
                playTacticalClick();
                setSelectedStatus(st);
              }}
              className={`flex-1 py-1 border transition-colors ${
                selectedStatus === st
                  ? "bg-primary/20 border-primary text-primary font-bold"
                  : "border-outline-variant text-outline hover:text-on-surface"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
              className={`p-3 border transition-all cursor-pointer relative hud-bracket ${
                isSelected
                  ? "bg-surface-container-high border-2 border-primary shadow-md"
                  : "bg-surface-container border-outline-variant hover:border-outline"
              }`}
            >
              <div className="flex justify-between items-start mb-1.5">
                <span className="font-mono text-xs font-bold text-primary">{c.id}</span>
                <span
                  className={`font-mono text-[9px] px-1.5 py-0.5 border font-bold ${
                    isCritical
                      ? "bg-error/20 border-error text-error"
                      : isWarning
                      ? "bg-secondary/20 border-secondary text-secondary"
                      : "bg-tertiary/20 border-tertiary text-tertiary"
                  }`}
                >
                  {c.status}
                </span>
              </div>

              <h4 className="font-sans font-semibold text-xs text-on-surface line-clamp-1 mb-1">
                {c.name}
              </h4>

              <div className="flex items-center gap-1.5 font-mono text-[10px] text-on-surface-variant mb-2">
                <MapPin className="w-3 h-3 text-outline" />
                <span>{c.district}, {c.state}</span>
                <span className="border border-outline-variant px-1 text-[8px]">{c.scheme}</span>
              </div>

              {/* Mini Stats Bar */}
              <div className="grid grid-cols-3 gap-1 pt-2 border-t border-outline-variant/60 font-mono text-[9px] text-center">
                <div className="p-1 bg-surface-container-low">
                  <div className="text-outline">CLAIM</div>
                  <div className="text-primary font-bold">{c.claimed}</div>
                </div>
                <div className="p-1 bg-surface-container-low">
                  <div className="text-outline">VISION</div>
                  <div className="text-tertiary font-bold">{c.detected}</div>
                </div>
                <div className="p-1 bg-surface-container-low">
                  <div className="text-outline">OCI</div>
                  <div className={c.oci >= 80 ? "text-tertiary font-bold" : "text-error font-bold"}>
                    {c.oci}%
                  </div>
                </div>
              </div>

              {isCritical && (
                <div className="mt-2 text-[9px] font-mono text-error font-bold flex justify-between items-center">
                  <span>Sec 12-A Frozen:</span>
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
