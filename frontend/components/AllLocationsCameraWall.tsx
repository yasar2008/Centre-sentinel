"use client";

import React, { useState } from "react";
import {
  Video,
  Eye,
  EyeOff,
  Maximize2,
  Grid,
  LayoutGrid,
  Shield,
  Camera,
  Play,
  Pause,
  Download,
  Search,
  ExternalLink,
  Activity,
  Layers
} from "lucide-react";
import { playTacticalClick, playAlertChime } from "./SoundFx";
import { CameraFeedCanvas, CameraVisualProfile } from "./CameraFeedCanvas";

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
  profile: CameraVisualProfile;
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
      profile: {
        id: "CAM-UP-01",
        cameraModel: "HIKVISION DS-2CD2047G2-LU (4.0mm Lens)",
        tradeType: "sewing",
        filterStyle: "contrast(1.08) brightness(1.02) saturate(1.1)",
        hudColor: "rgba(56, 189, 248, 0.9)",
        ptzCoords: { pan: 142.4, tilt: -18.2, zoom: 1.0 },
        lensWatermark: "HIKVISION 4MP • 1080p25 • HIGH-CRI OPTICAL",
        metricReadout: { label: "SEWING SPEED", value: "3,200", unit: "SPM" },
        boundingBoxes: [
          { label: "Candidate #14 (98%)", type: "person", x: 0.16, y: 0.32, w: 48, h: 64 },
          { label: "Candidate #15 (95%)", type: "person", x: 0.48, y: 0.32, w: 48, h: 64 },
          { label: "Station 04: VACANT ALERT", type: "alert", x: 0.74, y: 0.35, w: 56, h: 56 },
          { label: "JUKI Carriage", type: "tool", x: 0.22, y: 0.48, w: 72, h: 42 },
        ],
      },
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
      profile: {
        id: "CAM-MH-01",
        cameraModel: "DAHUA IPC-HDBW5442R-ASE (PTZ 45X)",
        tradeType: "robotics",
        filterStyle: "hue-rotate(185deg) contrast(1.15) brightness(0.95)",
        hudColor: "rgba(34, 211, 238, 0.9)",
        ptzCoords: { pan: 88.1, tilt: -24.5, zoom: 2.4 },
        lensWatermark: "DAHUA PTZ • ROBOTICS CELL 02",
        metricReadout: { label: "ROBOTIC FEED", value: "12,400", unit: "RPM" },
        boundingBoxes: [
          { label: "Tech Lead (99%)", type: "person", x: 0.28, y: 0.38, w: 50, h: 70 },
          { label: "Robotic Arm Enclosure", type: "hazard", x: 0.42, y: 0.24, w: 90, h: 80 },
        ],
      },
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
      profile: {
        id: "CAM-BR-01",
        cameraModel: "CP PLUS CP-UNC-T41ZL6-VMD (Thermal/Heavy)",
        tradeType: "heavy_cnc",
        filterStyle: "sepia(0.2) contrast(1.22) brightness(0.92) saturate(1.3)",
        hudColor: "rgba(244, 63, 94, 0.9)",
        ptzCoords: { pan: 215.0, tilt: -12.0, zoom: 1.5 },
        lensWatermark: "CP PLUS 4K-e • HEAVY BAY CENTRAL",
        metricReadout: { label: "COOLANT", value: "4.8", unit: "BAR" },
        boundingBoxes: [
          { label: "CNC Lathe Spindle", type: "hazard", x: 0.44, y: 0.38, w: 80, h: 75 },
          { label: "Trainee #08 (92%)", type: "person", x: 0.18, y: 0.4, w: 46, h: 62 },
          { label: "Unattended Station", type: "alert", x: 0.72, y: 0.42, w: 54, h: 54 },
        ],
      },
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
      profile: {
        id: "CAM-JH-01",
        cameraModel: "BOSCH FLEXIDOME IP starlight 8000i",
        tradeType: "smt_soldering",
        filterStyle: "brightness(1.06) contrast(1.12) saturate(1.15)",
        hudColor: "rgba(16, 185, 129, 0.9)",
        ptzCoords: { pan: 112.5, tilt: -32.0, zoom: 3.0 },
        lensWatermark: "BOSCH STARLIGHT • SMT BENCH 1-6",
        metricReadout: { label: "IRON TEMP", value: "352", unit: "°C" },
        boundingBoxes: [
          { label: "Soldering Station 01 (97%)", type: "person", x: 0.24, y: 0.36, w: 48, h: 66 },
          { label: "ESD Wrist-Strap [OK]", type: "tool", x: 0.28, y: 0.58, w: 32, h: 22 },
          { label: "Soldering Station 02 (94%)", type: "person", x: 0.68, y: 0.36, w: 48, h: 66 },
        ],
      },
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
      profile: {
        id: "CAM-MP-01",
        cameraModel: "HONEYWELL Performance Series 5MP",
        tradeType: "automotive",
        filterStyle: "sepia(0.35) contrast(1.18) saturate(1.25) brightness(0.96)",
        hudColor: "rgba(249, 115, 22, 0.9)",
        ptzCoords: { pan: 174.2, tilt: -15.4, zoom: 1.2 },
        lensWatermark: "HONEYWELL 5MP • ENGINE ASSEMBLY RIG",
        metricReadout: { label: "TORQUE", value: "42.5", unit: "Nm" },
        boundingBoxes: [
          { label: "Powertrain Jig 01", type: "workpiece", x: 0.36, y: 0.32, w: 86, h: 72 },
          { label: "Trainee #03 (96%)", type: "person", x: 0.15, y: 0.38, w: 46, h: 64 },
          { label: "Trainee #04 (94%)", type: "person", x: 0.72, y: 0.38, w: 46, h: 64 },
        ],
      },
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
      profile: {
        id: "CAM-TN-01",
        cameraModel: "PANASONIC i-PRO Extreme 4K",
        tradeType: "cad_tailoring",
        filterStyle: "contrast(1.05) saturate(1.05) brightness(1.04)",
        hudColor: "rgba(236, 72, 153, 0.9)",
        ptzCoords: { pan: 45.6, tilt: -20.1, zoom: 1.0 },
        lensWatermark: "PANASONIC i-PRO • CAD CUTTING HALL",
        metricReadout: { label: "CUT SPEED", value: "1.2", unit: "m/s" },
        boundingBoxes: [
          { label: "CAD Operator #1 (99%)", type: "person", x: 0.2, y: 0.34, w: 46, h: 64 },
          { label: "CAD Operator #2 (98%)", type: "person", x: 0.54, y: 0.34, w: 46, h: 64 },
          { label: "Vacuum Cutting Bed", type: "tool", x: 0.28, y: 0.44, w: 88, h: 48 },
        ],
      },
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
      profile: {
        id: "CAM-AS-01",
        cameraModel: "AXIS P1455-LE (Agro-Grade)",
        tradeType: "agro_sorting",
        filterStyle: "hue-rotate(55deg) contrast(1.12) brightness(1.02) saturate(1.2)",
        hudColor: "rgba(132, 204, 22, 0.9)",
        ptzCoords: { pan: 310.4, tilt: -16.2, zoom: 1.4 },
        lensWatermark: "AXIS AGRO-LE • CONVEYOR QUALITY",
        metricReadout: { label: "THROUGHPUT", value: "142", unit: "u/min" },
        boundingBoxes: [
          { label: "Trainee #01 (91%)", type: "person", x: 0.22, y: 0.36, w: 46, h: 62 },
          { label: "Conveyor Lane #2", type: "workpiece", x: 0.34, y: 0.48, w: 78, h: 42 },
          { label: "Station 03: VACANT", type: "alert", x: 0.68, y: 0.38, w: 52, h: 52 },
        ],
      },
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
      profile: {
        id: "CAM-RJ-01",
        cameraModel: "MOBOTIX M16 AllroundDual",
        tradeType: "solar_grid",
        filterStyle: "contrast(1.15) brightness(1.12) saturate(1.3) sepia(0.18)",
        hudColor: "rgba(245, 158, 11, 0.95)",
        ptzCoords: { pan: 198.8, tilt: -9.5, zoom: 1.0 },
        lensWatermark: "MOBOTIX DUAL • SOLAR DEMO YARD",
        metricReadout: { label: "IRRADIANCE", value: "914", unit: "W/m²" },
        boundingBoxes: [
          { label: "Solar Tech (98%)", type: "person", x: 0.3, y: 0.38, w: 48, h: 66 },
          { label: "Inverter Box DC", type: "hazard", x: 0.58, y: 0.42, w: 60, h: 54 },
          { label: "Harness Secured", type: "tool", x: 0.32, y: 0.46, w: 30, h: 25 },
        ],
      },
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
      profile: {
        id: "CAM-OD-01",
        cameraModel: "HIKVISION DarkFighter DeepinView",
        tradeType: "civil_masonry",
        filterStyle: "sepia(0.25) contrast(1.16) brightness(0.98)",
        hudColor: "rgba(34, 197, 94, 0.9)",
        ptzCoords: { pan: 135.2, tilt: -14.0, zoom: 1.2 },
        lensWatermark: "HIKVISION DEEPINVIEW • CIVIL DEMO",
        metricReadout: { label: "REBAR SPACING", value: "150", unit: "mm" },
        boundingBoxes: [
          { label: "Masonry Trainee (95%)", type: "person", x: 0.22, y: 0.36, w: 46, h: 64 },
          { label: "Rebar Caliper Jig", type: "tool", x: 0.44, y: 0.48, w: 64, h: 40 },
          { label: "Station 02: UNATTENDED", type: "alert", x: 0.7, y: 0.36, w: 52, h: 52 },
        ],
      },
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
      profile: {
        id: "CAM-WB-01",
        cameraModel: "UNIVIEW Prime-I Series 4MP",
        tradeType: "leather_press",
        filterStyle: "sepia(0.4) contrast(1.2) brightness(0.94) saturate(1.2)",
        hudColor: "rgba(234, 179, 8, 0.9)",
        ptzCoords: { pan: 76.3, tilt: -22.5, zoom: 1.6 },
        lensWatermark: "UNIVIEW PRIME-I • TANNERY WORKSHOP",
        metricReadout: { label: "LEATHER GAUGE", value: "1.8", unit: "mm" },
        boundingBoxes: [
          { label: "Leather Craftsman #1 (97%)", type: "person", x: 0.25, y: 0.36, w: 48, h: 66 },
          { label: "Hydraulic Clicker Bed", type: "hazard", x: 0.46, y: 0.42, w: 76, h: 56 },
          { label: "Leather Craftsman #2 (96%)", type: "person", x: 0.74, y: 0.36, w: 48, h: 66 },
        ],
      },
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
      profile: {
        id: "CAM-KA-01",
        cameraModel: "SONY SNC-VB770",
        tradeType: "drone_avionics",
        filterStyle: "hue-rotate(200deg) contrast(1.2) brightness(1.04) saturate(1.1)",
        hudColor: "rgba(59, 130, 246, 0.95)",
        ptzCoords: { pan: 160.0, tilt: -28.0, zoom: 2.5 },
        lensWatermark: "SONY EXMOR-R • AVIONICS TESTING CELL",
        metricReadout: { label: "GYRO SENSITIVITY", value: "2000", unit: "dps" },
        boundingBoxes: [
          { label: "Avionics Tech (99%)", type: "person", x: 0.26, y: 0.34, w: 46, h: 64 },
          { label: "Quadcopter Frame", type: "workpiece", x: 0.44, y: 0.44, w: 72, h: 48 },
        ],
      },
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
      profile: {
        id: "CAM-GJ-01",
        cameraModel: "AVIGILON H5A Dome Ex-d",
        tradeType: "chemical_lab",
        filterStyle: "hue-rotate(140deg) contrast(1.18) brightness(1.0) saturate(1.2)",
        hudColor: "rgba(20, 184, 166, 0.95)",
        ptzCoords: { pan: 220.5, tilt: -17.8, zoom: 1.8 },
        lensWatermark: "AVIGILON Ex-d • TITRATION BENCH 01",
        metricReadout: { label: "FUME VELOCITY", value: "0.52", unit: "m/s" },
        boundingBoxes: [
          { label: "QC Analyst (96%)", type: "person", x: 0.22, y: 0.35, w: 46, h: 64 },
          { label: "Titration Burette", type: "tool", x: 0.48, y: 0.38, w: 40, h: 68 },
          { label: "Bench #4: UNATTENDED", type: "alert", x: 0.74, y: 0.38, w: 52, h: 52 },
        ],
      },
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
              National Live Camera Surveillance Wall (12 Unique Facility Feeds)
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Live edge optical feeds with individualized optical color grading, specialized trade telemetry, and DPDP Act 2023 facial privacy protection
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
              <Shield className="w-4 h-4 text-emerald-600" />
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

          {/* Large Video Screen with Unique Canvas Rendering */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-700 shadow-md">
            <CameraFeedCanvas
              videoSrc={focusedLocation.videoSrc}
              profile={focusedLocation.profile}
              showPrivacyBlur={showBlur}
              isPlaying={isPlaying}
            />

            {/* Privacy Blur Overlay Simulation Indicator */}
            {showBlur && (
              <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-lg bg-slate-900/85 backdrop-blur-md text-emerald-400 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/40">
                <Shield className="w-4 h-4 text-emerald-400" />
                DPDP Act 2023 Face Privacy Filter Active (k=51)
              </div>
            )}

            {/* Telemetry Badge in Top Left */}
            <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-slate-900/85 backdrop-blur-md text-amber-300 text-xs font-mono font-bold flex items-center gap-2 border border-slate-700">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>{focusedLocation.profile.metricReadout.label}: {focusedLocation.profile.metricReadout.value} {focusedLocation.profile.metricReadout.unit || ""}</span>
            </div>

            {/* Bottom Telemetry Overlay */}
            <div className="absolute bottom-7 left-3 right-3 z-20 px-4 py-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md text-white text-xs flex flex-wrap items-center justify-between gap-3 border border-slate-800">
              <div className="flex items-center gap-4">
                <span className="font-bold text-amber-400">{focusedLocation.profile.cameraModel}</span>
                <span className="text-slate-400">•</span>
                <span>RTSP Stream: {focusedLocation.ipAddress}</span>
                <span className="text-slate-400">•</span>
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

              {/* Live Unique Video Feed Preview */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden group">
                <CameraFeedCanvas
                  videoSrc={loc.videoSrc}
                  profile={loc.profile}
                  showPrivacyBlur={showBlur}
                  isPlaying={isPlaying}
                />

                {/* Overlaid Camera Tag */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/85 backdrop-blur-xs text-[9.5px] text-white font-medium z-10 border border-slate-700">
                  {loc.id} • {loc.fps} FPS
                </div>

                {/* Specialized Metric Pill */}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900/85 backdrop-blur-xs text-[9.5px] text-amber-300 font-mono z-10 border border-slate-700">
                  {loc.profile.metricReadout.value} {loc.profile.metricReadout.unit || ""}
                </div>

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
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
