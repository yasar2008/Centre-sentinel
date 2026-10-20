"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Video,
  Eye,
  EyeOff,
  Maximize2,
  Grid,
  LayoutGrid,
  Filter,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Building,
  Camera,
  Play,
  Pause,
  Download,
  Search,
  ExternalLink
} from "lucide-react";
import { playTacticalClick, playAlertChime, playNoticeFreezeSound } from "./SoundFx";

export interface CameraLocation {
  id: string;
  centreId: string;
  name: string;
  district: string;
  state: string;
  scheme: "PMKK" | "NSDC" | "JSS" | "KVK";
  tradeCode: string;
  tradeName: string;
  videoSrc: string;
  claimed: number;
  detected: number;
  oci: number;
  status: "COMPLIANT" | "WARNING" | "CRITICAL";
  penalty: number;
  cameraName: string;
  ipAddress: string;
  fps: number;
}

interface AllLocationsCameraWallProps {
  onSelectInspect?: (centreId: string) => void;
}

export const AllLocationsCameraWall: React.FC<AllLocationsCameraWallProps> = ({ onSelectInspect }) => {
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"WALL" | "QUAD" | "FOCUS">("WALL");
  const [focusedCamId, setFocusedCamId] = useState<string>("CAM-UP-01");
  const [showBlur, setShowBlur] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [snapshotNotification, setSnapshotNotification] = useState<string | null>(null);

  const locations: CameraLocation[] = [
    {
      id: "CAM-UP-01",
      centreId: "TC-UP-VNS-0492",
      name: "Varanasi Textile & Apparel Center",
      district: "Varanasi",
      state: "Uttar Pradesh",
      scheme: "PMKK",
      tradeCode: "AMH/Q0102",
      tradeName: "Industrial Sewing Machine Operator (JUKI Line)",
      videoSrc: "/videos/cam01_sewing.webm",
      claimed: 28,
      detected: 22,
      oci: 74.2,
      status: "CRITICAL",
      penalty: 184000,
      cameraName: "Lab-A North Dome (Hikvision 4MP)",
      ipAddress: "10.42.18.201",
      fps: 25,
    },
    {
      id: "CAM-MH-01",
      centreId: "TC-MH-PUN-0914",
      name: "Pune Precision Robotics & SMT Lab",
      district: "Pune",
      state: "Maharashtra",
      scheme: "NSDC",
      tradeCode: "ELE/Q0504",
      tradeName: "CNC Machining & SMT Robotic Placement",
      videoSrc: "/videos/cam02_cnc.webm",
      claimed: 25,
      detected: 21,
      oci: 76.5,
      status: "WARNING",
      penalty: 76000,
      cameraName: "Cell-02 Overhead PTZ",
      ipAddress: "10.42.34.112",
      fps: 30,
    },
    {
      id: "CAM-BR-01",
      centreId: "TC-BR-PAT-0331",
      name: "Patna CNC & Heavy Machining Academy",
      district: "Patna",
      state: "Bihar",
      scheme: "NSDC",
      tradeCode: "CSC/Q0115",
      tradeName: "Precision Lathe, Milling & CNC Turning",
      videoSrc: "/videos/cam02_cnc.webm",
      claimed: 30,
      detected: 24,
      oci: 68.0,
      status: "CRITICAL",
      penalty: 194000,
      cameraName: "Heavy Bay Central Feed",
      ipAddress: "10.42.45.105",
      fps: 25,
    },
    {
      id: "CAM-JH-01",
      centreId: "TC-JH-RNC-081",
      name: "Ranchi Advanced Electrical Skill Hub",
      district: "Ranchi",
      state: "Jharkhand",
      scheme: "PMKK",
      tradeCode: "ELE/Q3102",
      tradeName: "SMT Circuit Soldering & Board Diagnostics",
      videoSrc: "/videos/cam03_electronics.webm",
      claimed: 24,
      detected: 22,
      oci: 84.5,
      status: "COMPLIANT",
      penalty: 0,
      cameraName: "Electronics Bay Station 1-6",
      ipAddress: "10.42.67.140",
      fps: 25,
    },
    {
      id: "CAM-MP-01",
      centreId: "TC-MP-BPL-0118",
      name: "Bhopal Automotive Technology Lab",
      district: "Bhopal",
      state: "Madhya Pradesh",
      scheme: "PMKK",
      tradeCode: "ASC/Q1402",
      tradeName: "Automotive Powertrain & Engine Assembly",
      videoSrc: "/videos/cam02_cnc.webm",
      claimed: 20,
      detected: 19,
      oci: 82.1,
      status: "COMPLIANT",
      penalty: 0,
      cameraName: "Automotive Bay Camera 01",
      ipAddress: "10.42.78.204",
      fps: 30,
    },
    {
      id: "CAM-TN-01",
      centreId: "TC-TN-CHE-0552",
      name: "Chennai Garment & Industrial Tailoring",
      district: "Chennai",
      state: "Tamil Nadu",
      scheme: "JSS",
      tradeCode: "AMH/Q0104",
      tradeName: "Automated Apparel Cutting & CAD Tailoring",
      videoSrc: "/videos/cam01_sewing.webm",
      claimed: 32,
      detected: 32,
      oci: 94.0,
      status: "COMPLIANT",
      penalty: 0,
      cameraName: "Production Hall Main PTZ",
      ipAddress: "10.42.89.155",
      fps: 30,
    },
    {
      id: "CAM-AS-01",
      centreId: "TC-AS-GUW-0210",
      name: "Guwahati Agro-Processing Unit",
      district: "Kamrup",
      state: "Assam",
      scheme: "KVK",
      tradeCode: "AGR/Q0301",
      tradeName: "Food Packaging & Quality Inspection",
      videoSrc: "/videos/cam04_classroom.webm",
      claimed: 18,
      detected: 14,
      oci: 71.0,
      status: "CRITICAL",
      penalty: 156000,
      cameraName: "Agro Classroom & Lab",
      ipAddress: "10.42.92.110",
      fps: 20,
    },
    {
      id: "CAM-RJ-01",
      centreId: "TC-RJ-JAI-0774",
      name: "Jaipur Solar PV Installation & Grid",
      district: "Jaipur",
      state: "Rajasthan",
      scheme: "PMKK",
      tradeCode: "SGJ/Q0101",
      tradeName: "Solar Photovoltaic Rooftop Setup & Inverters",
      videoSrc: "/videos/cam03_electronics.webm",
      claimed: 22,
      detected: 21,
      oci: 86.4,
      status: "COMPLIANT",
      penalty: 0,
      cameraName: "Solar Demonstration Yard",
      ipAddress: "10.42.105.180",
      fps: 25,
    },
    {
      id: "CAM-OD-01",
      centreId: "TC-OD-BBI-0401",
      name: "Bhubaneswar Civil Masonry Yard",
      district: "Khordha",
      state: "Odisha",
      scheme: "JSS",
      tradeCode: "CON/Q0103",
      tradeName: "Structural Masonry & Bar Bending Practicals",
      videoSrc: "/videos/cam04_classroom.webm",
      claimed: 26,
      detected: 23,
      oci: 78.2,
      status: "WARNING",
      penalty: 62000,
      cameraName: "Practical Demonstration Hall",
      ipAddress: "10.42.118.220",
      fps: 25,
    },
    {
      id: "CAM-WB-01",
      centreId: "TC-WB-KOL-0639",
      name: "Kolkata Leather Goods & Footwear Hub",
      district: "Kolkata",
      state: "West Bengal",
      scheme: "NSDC",
      tradeCode: "LSS/Q2301",
      tradeName: "Industrial Leather Stitching & Footwear Assembly",
      videoSrc: "/videos/cam01_sewing.webm",
      claimed: 28,
      detected: 28,
      oci: 91.5,
      status: "COMPLIANT",
      penalty: 0,
      cameraName: "Assembly Workshop Floor",
      ipAddress: "10.42.132.190",
      fps: 30,
    },
    {
      id: "CAM-KA-01",
      centreId: "TC-KA-BLR-0822",
      name: "Bengaluru Micro-Electronics & Drone Lab",
      district: "Bengaluru Urban",
      state: "Karnataka",
      scheme: "PMKK",
      tradeCode: "AER/Q1101",
      tradeName: "Drone Assembly, Avionics Testing & Solder",
      videoSrc: "/videos/cam03_electronics.webm",
      claimed: 30,
      detected: 29,
      oci: 96.2,
      status: "COMPLIANT",
      penalty: 0,
      cameraName: "Avionics Testing Cell",
      ipAddress: "10.42.148.165",
      fps: 30,
    },
    {
      id: "CAM-GJ-01",
      centreId: "TC-GJ-AHM-0193",
      name: "Ahmedabad Chemical Lab & QC Center",
      district: "Ahmedabad",
      state: "Gujarat",
      scheme: "NSDC",
      tradeCode: "CHE/Q0102",
      tradeName: "Analytical Chemical Testing & Batch Quality",
      videoSrc: "/videos/cam04_classroom.webm",
      claimed: 20,
      detected: 15,
      oci: 73.0,
      status: "CRITICAL",
      penalty: 170000,
      cameraName: "Chemical Analysis Bench 01",
      ipAddress: "10.42.160.145",
      fps: 25,
    },
  ];

  const states = [
    "ALL",
    "Uttar Pradesh",
    "Maharashtra",
    "Bihar",
    "Jharkhand",
    "Madhya Pradesh",
    "Tamil Nadu",
    "Assam",
    "Rajasthan",
    "Odisha",
    "West Bengal",
    "Karnataka",
    "Gujarat",
  ];

  const filteredLocations = locations.filter((loc) => {
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.centreId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.tradeName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedState !== "ALL" && loc.state !== selectedState) return false;
    if (selectedStatus !== "ALL" && loc.status !== selectedStatus) return false;
    return true;
  });

  const focusedLocation = locations.find((l) => l.id === focusedCamId) || locations[0];

  const handleCaptureSnapshot = (cam: CameraLocation) => {
    playAlertChime();
    setSnapshotNotification(`Forensic Snapshot captured for ${cam.centreId} (${cam.name})`);
    setTimeout(() => setSnapshotNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Surveillance Mode Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-600" />
              National Live Camera Surveillance Wall (12 Locations Across India)
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Live edge optical feeds monitoring 12 empaneled PMKK, KVK, JSS &amp; NSDC facilities with real-time biometric reconciliation
            </p>
          </div>

          {/* Quick Layout Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs border border-slate-200">
            <button
              onClick={() => {
                playTacticalClick();
                setViewMode("WALL");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === "WALL" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
              All 12 Feeds
            </button>
            <button
              onClick={() => {
                playTacticalClick();
                setViewMode("QUAD");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === "QUAD" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-blue-600" />
              4x Quad Priority
            </button>
            <button
              onClick={() => {
                playTacticalClick();
                setViewMode("FOCUS");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === "FOCUS" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
              Inspection Focus
            </button>
          </div>
        </div>

        {/* Global Controls & Privacy Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search location, trade, or centre ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white w-64 transition-all"
              />
            </div>

            {/* State Select */}
            <select
              value={selectedState}
              onChange={(e) => {
                playTacticalClick();
                setSelectedState(e.target.value);
              }}
              className="bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  {st === "ALL" ? "All States (12)" : st}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                playTacticalClick();
                setSelectedStatus(e.target.value);
              }}
              className="bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLIANT">Compliant Only</option>
              <option value="WARNING">Review Needed</option>
              <option value="CRITICAL">Discrepancy / Critical</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {/* DPDP Facial Privacy Toggle */}
            <button
              onClick={() => {
                playTacticalClick();
                setShowBlur((p) => !p);
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                showBlur
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "bg-slate-100 border-slate-300 text-slate-700"
              }`}
            >
              {showBlur ? <EyeOff className="w-3.5 h-3.5 text-emerald-600" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showBlur ? "DPDP Face Privacy (Active)" : "Privacy Mask Off"}</span>
            </button>

            {/* Play/Pause Global Toggle */}
            <button
              onClick={() => {
                playTacticalClick();
                setIsPlaying((p) => !p);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-200 transition-colors shadow-xs"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? "Pause Feeds" : "Resume Feeds"}</span>
            </button>
          </div>
        </div>

        {/* Snapshot Notification Banner */}
        {snapshotNotification && (
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {snapshotNotification}
            </span>
            <span className="text-[11px] text-emerald-600">Saved to Audit Log</span>
          </div>
        )}
      </div>

      {/* 2. Focused Single Inspection Monitor (When in FOCUS view) */}
      {viewMode === "FOCUS" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <h3 className="font-bold text-sm text-slate-900 tracking-tight">
                  High-Resolution Live Inspection: {focusedLocation.name} ({focusedLocation.centreId})
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {focusedLocation.district}, {focusedLocation.state} • Qualification Pack: <strong>{focusedLocation.tradeCode}</strong> ({focusedLocation.tradeName})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCaptureSnapshot(focusedLocation)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Capture Frame
              </button>
              {onSelectInspect && (
                <button
                  onClick={() => onSelectInspect(focusedLocation.centreId)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in Main Cockpit
                </button>
              )}
            </div>
          </div>

          {/* Large Video Screen with Overlays */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-300 shadow-md">
            <video
              src={focusedLocation.videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Privacy Blur Overlay Simulation */}
            {showBlur && (
              <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-emerald-400 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/30">
                <Shield className="w-4 h-4 text-emerald-400" />
                DPDP Act 2023 Face Privacy Filter Active (k=51)
              </div>
            )}

            {/* Bottom Telemetry Overlay */}
            <div className="absolute bottom-3 left-3 right-3 z-20 px-4 py-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md text-white text-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <span className="font-bold text-amber-400">{focusedLocation.cameraName}</span>
                <span className="text-slate-300">•</span>
                <span>RTSP Stream: {focusedLocation.ipAddress}</span>
                <span className="text-slate-300">•</span>
                <span>{focusedLocation.fps} FPS</span>
              </div>
              <div className="flex items-center gap-4 font-semibold">
                <span>AEBAS Punches: {focusedLocation.claimed}</span>
                <span className="text-emerald-400">Physical Presence: {focusedLocation.detected}</span>
                <span className={focusedLocation.oci >= 80 ? "text-emerald-400" : "text-amber-400"}>
                  OCI: {focusedLocation.oci}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. National Multi-Camera Grid (All 12 or 4 Quad) */}
      <div className={`grid gap-4 ${
        viewMode === "QUAD" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      }`}>
        {filteredLocations.slice(0, viewMode === "QUAD" ? 4 : 12).map((loc) => {
          const isFocused = loc.id === focusedCamId;
          const ghostCount = Math.max(0, loc.claimed - loc.detected);

          return (
            <div
              key={loc.id}
              className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all duration-200 flex flex-col justify-between ${
                isFocused
                  ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* Card Header */}
              <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span className="truncate">{loc.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {loc.district}, {loc.state} • <span className="font-semibold text-blue-700">{loc.scheme}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    loc.status === "CRITICAL"
                      ? "bg-rose-50 border-rose-200 text-rose-800"
                      : loc.status === "WARNING"
                      ? "bg-amber-50 border-amber-200 text-amber-800"
                      : "bg-emerald-50 border-emerald-200 text-emerald-800"
                  }`}
                >
                  {loc.status === "CRITICAL" ? "Unattended" : loc.status === "WARNING" ? "OCI Low" : "Compliant"}
                </span>
              </div>

              {/* Live Video Feed Preview */}
              <div className="relative aspect-video bg-slate-900 overflow-hidden group">
                <video
                  src={loc.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover select-none pointer-events-none"
                />

                {/* Overlaid Camera Tag */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-[10px] text-white font-medium">
                  {loc.id} • {loc.fps} FPS
                </div>

                {/* Privacy Shield Pill */}
                {showBlur && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5" />
                    DPDP
                  </div>
                )}

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      playTacticalClick();
                      setFocusedCamId(loc.id);
                      setViewMode("FOCUS");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-semibold shadow-md hover:bg-slate-100 transition-colors"
                  >
                    Inspect Camera
                  </button>
                  <button
                    onClick={() => handleCaptureSnapshot(loc)}
                    className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition-colors"
                    title="Capture Snapshot"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Feed Telemetry Ribbon */}
              <div className="p-3 bg-white space-y-2 text-xs">
                <div className="flex justify-between items-center text-[11px] text-slate-500">
                  <span className="truncate">{loc.tradeName}</span>
                </div>

                {/* Real Metrics Strip */}
                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-100 text-center">
                  <div className="p-1.5 rounded bg-slate-50">
                    <div className="text-[10px] text-slate-500 font-medium">AEBAS</div>
                    <div className="font-bold text-slate-900">{loc.claimed}</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-50">
                    <div className="text-[10px] text-slate-500 font-medium">CCTV</div>
                    <div className="font-bold text-emerald-700">{loc.detected}</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-50">
                    <div className="text-[10px] text-slate-500 font-medium">Operability</div>
                    <div className={`font-bold ${loc.oci >= 80 ? "text-emerald-700" : "text-amber-700"}`}>
                      {loc.oci}%
                    </div>
                  </div>
                </div>

                {/* Discrepancy & Section 12-A Tag */}
                {ghostCount > 0 ? (
                  <div className="flex items-center justify-between text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-100">
                    <span>-{ghostCount} Unattended Seats</span>
                    <span>₹{loc.penalty.toLocaleString("en-IN")} Withheld</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                    <span>100% Attendance Match</span>
                    <span>Grant Released</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
