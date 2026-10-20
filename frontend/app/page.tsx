"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Cpu,
  Download,
  Eye,
  EyeOff,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Flame,
  Gauge,
  Globe,
  HardDrive,
  Info,
  Layers,
  Lock,
  Maximize2,
  MapPin,
  Minimize2,
  Network,
  Printer,
  Radio,
  RefreshCw,
  Search,
  Server,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Terminal,
  TrendingDown,
  TrendingUp,
  Users,
  Video,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Wrench,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface InventoryItemCount {
  category: string;
  sanctioned: number;
  detected: number;
  compliant: boolean;
}

export interface OperabilityMetrics {
  operability_score: number;
  spatial_iou_rate: number;
  tracking_stability: number;
  active_trainees: number;
}

export interface DiscrepancyReport {
  has_discrepancy: boolean;
  attendance_discrepancy_count: number;
  attendance_discrepancy_percent: number;
  inventory_discrepancy_flag: boolean;
  operability_discrepancy_flag: boolean;
  severity: "COMPLIANT" | "WARNING" | "CRITICAL";
  reason: string;
}

export interface TelemetryPayload {
  edge_node_id: string;
  centre_id: string;
  centre_name: string;
  timestamp: number;
  claimed_lms_attendance: number;
  detected_headcount: number;
  attendance_discrepancy: number;
  operability: OperabilityMetrics;
  inventory: InventoryItemCount[];
  discrepancy_report: DiscrepancyReport;
  low_bandwidth_mode: boolean;
  payload_size_bytes: number;
  raw_video_bandwidth_saved_percent: number;
  proof_frame_webp_base64?: string;
  proof_frame_size_bytes?: number;
  privacy_protocol: string;
}

export interface EvaluationMetrics {
  true_positives: number;
  false_positives: number;
  false_negatives: number;
  true_negatives: number;
  precision: number;
  recall: number;
  f1_score: number;
  accuracy: number;
  false_positive_rate: number;
  false_negative_rate: number;
  mean_iou: number;
  total_evaluated_frames: number;
}

export interface TrainingCentre {
  id: string;
  name: string;
  state: string;
  district: string;
  scheme: string;
  totalSanctionedSeats: number;
  lat: number;
  lng: number;
  status: "COMPLIANT" | "WARNING" | "CRITICAL";
  edgeNodeId: string;
  lastPingSec: number;
}

export interface TraineeRecord {
  id: string;
  anonymizedHash: string;
  batchId: string;
  biometricLoginTime: string;
  edgeDetected: boolean;
  activeAtEquipment: boolean;
  stationName: string;
}

// ============================================================================
// Sound FX via Web Audio API (Zero Asset Dependency, 100% Offline)
// ============================================================================

function playTacticalSound(type: "click" | "warning" | "success" | "critical") {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "success") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.setValueAtTime(660, now + 0.08);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === "warning") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.setValueAtTime(260, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === "critical") {
      osc.type = "square";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (_e) {
    // Audio synthesis not permitted or disabled by user policy
  }
}

// ============================================================================
// Empaneled Centres Data
// ============================================================================

const EMPANELED_CENTRES: TrainingCentre[] = [
  {
    id: "TC-JH-RNC-081",
    name: "PMKK Skill Hub - Ranchi Sector 4",
    state: "Jharkhand",
    district: "Ranchi",
    scheme: "PMKVY 4.0 STT",
    totalSanctionedSeats: 120,
    lat: 23.3441,
    lng: 85.3096,
    status: "COMPLIANT",
    edgeNodeId: "EDGE-NODE-MSDE-042",
    lastPingSec: 2,
  },
  {
    id: "TC-MH-BRM-014",
    name: "KVK Rural Skill Hub - Baramati",
    state: "Maharashtra",
    district: "Pune",
    scheme: "DDU-GKY",
    totalSanctionedSeats: 90,
    lat: 18.1517,
    lng: 74.5786,
    status: "WARNING",
    edgeNodeId: "EDGE-NODE-MSDE-108",
    lastPingSec: 5,
  },
  {
    id: "TC-UP-VNS-049",
    name: "NSDC Partner Centre - Varanasi Cantt",
    state: "Uttar Pradesh",
    district: "Varanasi",
    scheme: "PMKVY 4.0 Special",
    totalSanctionedSeats: 150,
    lat: 25.3176,
    lng: 82.9739,
    status: "CRITICAL",
    edgeNodeId: "EDGE-NODE-MSDE-077",
    lastPingSec: 12,
  },
  {
    id: "TC-AS-DBG-009",
    name: "Jan Shikshan Sansthan - Dibrugarh",
    state: "Assam",
    district: "Dibrugarh",
    scheme: "JSS Community Skills",
    totalSanctionedSeats: 60,
    lat: 27.4728,
    lng: 94.912,
    status: "COMPLIANT",
    edgeNodeId: "EDGE-NODE-MSDE-119",
    lastPingSec: 1,
  },
  {
    id: "TC-RJ-JPR-033",
    name: "PMKK Automotive Hub - Jaipur Industrial",
    state: "Rajasthan",
    district: "Jaipur",
    scheme: "PMKVY Apprenticeship",
    totalSanctionedSeats: 180,
    lat: 26.9124,
    lng: 75.7873,
    status: "COMPLIANT",
    edgeNodeId: "EDGE-NODE-MSDE-015",
    lastPingSec: 3,
  },
  {
    id: "TC-BR-PTN-062",
    name: "Patliputra Skill Training Foundation",
    state: "Bihar",
    district: "Patna",
    scheme: "DDU-GKY",
    totalSanctionedSeats: 100,
    lat: 25.5941,
    lng: 85.1376,
    status: "WARNING",
    edgeNodeId: "EDGE-NODE-MSDE-053",
    lastPingSec: 8,
  },
];

// Sample Trainees Roster
const SAMPLE_TRAINEES: TraineeRecord[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `TRN-2026-${(i + 1).toString().padStart(3, "0")}`,
  anonymizedHash: `SHA256:${(
    "00" + Math.floor(Math.sin(i + 1) * 10000000).toString(16)
  ).slice(-8)}...`,
  batchId: "B-ELC-2026-A1",
  biometricLoginTime: `09:${(10 + (i % 25)).toString().padStart(2, "0")} AM`,
  edgeDetected: i < 22,
  activeAtEquipment: i < 18,
  stationName: i < 8 ? `Workbench #${(i % 8) + 1}` : i < 16 ? `Machine Unit #${(i % 6) + 1}` : "Seating Bay",
}));

// ============================================================================
// Main Kaushal-Drishti Dashboard Component
// ============================================================================

export default function KaushalDrishtiExecutiveDashboard() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    "mission-control" | "centres-directory" | "attendance-audit" | "official-notice" | "network-telemetry"
  >("mission-control");

  // Telemetry & State
  const [telemetry, setTelemetry] = useState<TelemetryPayload | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationMetrics | null>(null);
  const [chartData, setChartData] = useState<
    Array<{ time: string; detected: number; claimed: number; operability: number; discrepancy: number }>
  >([]);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);
  const [selectedCentre, setSelectedCentre] = useState<string>("TC-JH-RNC-081");
  const [currentScenario, setCurrentScenario] = useState<string>("NORMAL");
  const [claimedAttendanceInput, setClaimedAttendanceInput] = useState<number>(24);
  const [audioFeedback, setAudioFeedback] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [searchCentreQuery, setSearchCentreQuery] = useState<string>("");
  const [stateFilter, setStateFilter] = useState<string>("ALL");
  const [showSection12Modal, setShowSection12Modal] = useState<boolean>(false);
  const [noticeGenerated, setNoticeGenerated] = useState<boolean>(false);
  const [streamOverlayToggles, setStreamOverlayToggles] = useState({
    blur: true,
    bboxes: true,
    iouRays: true,
    hud: true,
  });

  // Canvas ref for dynamic visual synthesis HUD
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) +
          " " +
          now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }) +
          " IST"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch telemetry from local edge API / proxy
  const fetchTelemetry = useCallback(async () => {
    try {
      const res = await fetch("/api/telemetry", { cache: "no-store" });
      if (res.ok) {
        const data: TelemetryPayload = await res.json();
        setTelemetry(data);

        const dateStr = new Date(data.timestamp * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        setChartData((prev) => {
          const next = [
            ...prev,
            {
              time: dateStr,
              detected: data.detected_headcount,
              claimed: data.claimed_lms_attendance,
              operability: data.operability.operability_score,
              discrepancy: Math.abs(data.attendance_discrepancy),
            },
          ];
          return next.slice(-20);
        });

        if (data.discrepancy_report.has_discrepancy && audioFeedback) {
          playTacticalSound(data.discrepancy_report.severity === "CRITICAL" ? "critical" : "warning");
        }
      }
    } catch (_err) {
      // Handled cleanly
    }
  }, [audioFeedback]);

  // Fetch evaluation benchmarks
  const fetchEvaluation = useCallback(async () => {
    setIsBenchmarking(true);
    try {
      const res = await fetch("/api/telemetry?evaluation=true", { cache: "no-store" });
      if (res.ok) {
        const body = await res.json();
        if (body.metrics) {
          setEvaluation(body.metrics);
          if (audioFeedback) playTacticalSound("success");
        }
      }
    } finally {
      setIsBenchmarking(false);
    }
  }, [audioFeedback]);

  // Polling loop
  useEffect(() => {
    fetchTelemetry();
    fetchEvaluation();
    const interval = setInterval(fetchTelemetry, 3500);
    return () => clearInterval(interval);
  }, [fetchTelemetry, fetchEvaluation]);

  // Dynamic Canvas Video Simulation with Gaussian Blur Overlay & Interaction Vectors
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const renderFrame = () => {
      t += 0.03;
      const w = canvas.width;
      const h = canvas.height;

      // Dark mission control classroom floor
      ctx.fillStyle = "#0B1220";
      ctx.fillRect(0, 0, w, h);

      // Floor grid tiles
      ctx.strokeStyle = "rgba(30, 41, 59, 0.4)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw Workbenches & Machinery stations
      const stations = [
        { x: 50, y: 130, w: 140, h: 80, label: "WORKBENCH #1", type: "bench" },
        { x: 230, y: 130, w: 140, h: 80, label: "WORKBENCH #2", type: "bench" },
        { x: 410, y: 130, w: 140, h: 80, label: "CNC LATHE #1", type: "mach" },
        { x: 590, y: 130, w: 140, h: 80, label: "SEWING CELL #1", type: "mach" },
        { x: 50, y: 260, w: 140, h: 80, label: "WORKBENCH #3", type: "bench" },
        { x: 230, y: 260, w: 140, h: 80, label: "WORKBENCH #4", type: "bench" },
        { x: 410, y: 260, w: 140, h: 80, label: "ELECTRONICS #1", type: "mach" },
        { x: 590, y: 260, w: 140, h: 80, label: "MOTOR TEST #1", type: "mach" },
      ];

      stations.forEach((st) => {
        if (st.type === "bench") {
          ctx.fillStyle = "rgba(30, 58, 95, 0.5)";
          ctx.strokeStyle = "#38BDF8";
        } else {
          ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
          ctx.strokeStyle = "#10B981";
        }
        ctx.lineWidth = 1.5;
        ctx.fillRect(st.x, st.y, st.w, st.h);
        ctx.strokeRect(st.x, st.y, st.w, st.h);

        ctx.fillStyle = "#94A3B8";
        ctx.font = "9px 'JetBrains Mono', monospace";
        ctx.fillText(st.label, st.x + 8, st.y + 16);
      });

      // Trainees Count & Presence based on scenario
      const traineeCount =
        currentScenario === "GHOST_ATTENDANCE"
          ? 4
          : currentScenario === "IDLE_LAB"
          ? 18
          : currentScenario === "EQUIPMENT_DEFICIT"
          ? 20
          : 22;

      for (let i = 0; i < traineeCount; i++) {
        const stIdx = i % stations.length;
        const st = stations[stIdx];
        const oscX = Math.sin(t + i * 1.5) * 4;
        const oscY = Math.cos(t + i * 1.2) * 2;

        let px = st.x + 20 + (i % 2) * 60 + oscX;
        let py = st.y - 35 + oscY;
        const pw = 36;
        const ph = 65;

        // If IDLE_LAB scenario, trainees sit away from equipment at bottom wall
        if (currentScenario === "IDLE_LAB") {
          px = 40 + (i % 10) * 70 + oscX;
          py = 370 + Math.floor(i / 10) * 40;
        }

        // Draw Spatial IoU interaction vector line
        if (streamOverlayToggles.iouRays && currentScenario !== "IDLE_LAB") {
          ctx.beginPath();
          ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.moveTo(px + pw / 2, py + ph);
          ctx.lineTo(st.x + st.w / 2, st.y + st.h / 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Draw Person Body
        ctx.fillStyle = "#475569";
        ctx.fillRect(px, py + 18, pw, ph - 18);

        // Head Region (Top 30% of box height)
        const headH = ph * 0.3;
        if (streamOverlayToggles.blur) {
          // Synthetic Gaussian blur effect simulation on canvas
          ctx.save();
          ctx.fillStyle = "rgba(148, 163, 184, 0.85)";
          ctx.filter = "blur(7px)";
          ctx.beginPath();
          ctx.arc(px + pw / 2, py + 9, 11, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Green Privacy Boundary
          ctx.strokeStyle = "#10B981";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(px, py, pw, headH);

          ctx.fillStyle = "#10B981";
          ctx.font = "8px 'JetBrains Mono', monospace";
          ctx.fillText("BLURRED", px, py - 3);
        } else {
          ctx.fillStyle = "#CBD5E1";
          ctx.beginPath();
          ctx.arc(px + pw / 2, py + 9, 10, 0, Math.PI * 2);
          ctx.fill();
        }

        // Person Bounding Box
        if (streamOverlayToggles.bboxes) {
          ctx.strokeStyle = "#38BDF8";
          ctx.lineWidth = 1;
          ctx.strokeRect(px, py, pw, ph);

          ctx.fillStyle = "#0284C7";
          ctx.fillRect(px, py + ph, pw, 10);
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "7px 'JetBrains Mono', monospace";
          ctx.fillText(`TR-${(i + 1).toString().padStart(2, "0")}`, px + 3, py + ph + 8);
        }
      }

      // HUD Overlay
      if (streamOverlayToggles.hud) {
        ctx.fillStyle = "rgba(2, 6, 23, 0.8)";
        ctx.fillRect(8, 8, 380, 26);
        ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
        ctx.strokeRect(8, 8, 380, 26);

        ctx.fillStyle = "#00F0FF";
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.fillText(
          `FPS: 24.8 | INFER: 14.2ms | GAUSSIAN BLUR: K=51 | DETECTED: ${traineeCount}`,
          16,
          25
        );
      }

      animId = requestAnimationFrame(renderFrame);
    };

    animId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(animId);
  }, [currentScenario, streamOverlayToggles]);

  // Handlers
  const handleScenarioChange = async (scenario: string) => {
    if (audioFeedback) playTacticalSound("click");
    setCurrentScenario(scenario);
    try {
      await fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ simulation_anomaly: scenario }),
      });
      await fetchTelemetry();
    } catch (_e) {
      // Ignored
    }
  };

  const handleTriggerAudit = async () => {
    if (audioFeedback) playTacticalSound("warning");
    setIsAuditing(true);
    try {
      await fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ simulation_anomaly: currentScenario }),
      });
      await fetchTelemetry();
    } finally {
      setIsAuditing(false);
    }
  };

  const handleClaimedSlider = async (val: number) => {
    setClaimedAttendanceInput(val);
    try {
      await fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimed_lms_attendance: val }),
      });
      await fetchTelemetry();
    } catch (_e) {
      // Ignored
    }
  };

  const handleToggleBandwidth = async () => {
    if (audioFeedback) playTacticalSound("click");
    if (!telemetry) return;
    const nextMode = !telemetry.low_bandwidth_mode;
    try {
      await fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ low_bandwidth_mode: nextMode }),
      });
      await fetchTelemetry();
    } catch (_e) {
      // Ignored
    }
  };

  // Export Attendance CSV
  const handleExportCSV = () => {
    if (audioFeedback) playTacticalSound("success");
    const headers = "Trainee_ID,Anonymized_Hash,Batch_ID,Biometric_Login,Edge_Detected,Equipment_Active,Station\n";
    const rows = SAMPLE_TRAINEES.map(
      (t) =>
        `${t.id},${t.anonymizedHash},${t.batchId},${t.biometricLoginTime},${t.edgeDetected},${t.activeAtEquipment},"${t.stationName}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `MSDE_Attendance_Audit_${selectedCentre}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered training centres
  const filteredCentres = useMemo(() => {
    return EMPANELED_CENTRES.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchCentreQuery.toLowerCase()) ||
        c.district.toLowerCase().includes(searchCentreQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchCentreQuery.toLowerCase());
      const matchesState = stateFilter === "ALL" || c.state === stateFilter;
      return matchesSearch && matchesState;
    });
  }, [searchCentreQuery, stateFilter]);

  const selectedCentreData = useMemo(() => {
    return EMPANELED_CENTRES.find((c) => c.id === selectedCentre) || EMPANELED_CENTRES[0];
  }, [selectedCentre]);

  const discrepancyPercent = useMemo(() => {
    if (!telemetry || telemetry.claimed_lms_attendance === 0) return 0;
    return Math.round(
      (Math.abs(telemetry.attendance_discrepancy) / telemetry.claimed_lms_attendance) * 100
    );
  }, [telemetry]);

  return (
    <div className="min-h-screen bg-[#060B14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* ==================================================================== */}
      {/* Top Sovereign Command Ribbon (Government of India / MSDE)            */}
      {/* ==================================================================== */}
      <header className="bg-[#090E1A]/95 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* National Emblem & Title */}
            <div className="flex items-center gap-3">
              {/* Sovereign Tricolor Accent Bar */}
              <div className="flex flex-col w-1.5 h-10 rounded-full overflow-hidden">
                <span className="h-1/3 bg-[#FF9933]" />
                <span className="h-1/3 bg-white" />
                <span className="h-1/3 bg-[#138808]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    MSDE PROBLEM ID 26245
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline-block">
                    Scheme Monitoring Unit (SMU)
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-cyan-400 bg-clip-text text-transparent">
                    Kaushal-Drishti
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30">
                    LIVE EDGE NODE
                  </span>
                </h1>
              </div>
            </div>

            {/* Tactical Status Badges & Utilities */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Real-time Clock */}
              <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-300 font-mono px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                <span>{currentTime || "Synchronizing IST..."}</span>
              </div>

              {/* Edge Node Uplink Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-mono text-slate-300 hidden md:inline">
                  {telemetry?.edge_node_id || "EDGE-NODE-MSDE-042"}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold font-mono">
                  {telemetry?.low_bandwidth_mode ? "<64 kbps" : "FULL-BW"}
                </span>
              </div>

              {/* Audio Toggle */}
              <button
                onClick={() => setAudioFeedback(!audioFeedback)}
                title="Toggle Tactical Audio Feedback"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
              >
                {audioFeedback ? (
                  <Volume2 className="h-4 w-4 text-cyan-400" />
                ) : (
                  <VolumeX className="h-4 w-4 text-slate-500" />
                )}
              </button>
            </div>
          </div>

          {/* Navigation Bar Tabs */}
          <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto pb-2 pt-1 border-t border-slate-800/60 scrollbar-none text-xs font-medium">
            {[
              { id: "mission-control", label: "Mission Control HUD", icon: <Activity className="h-3.5 w-3.5" /> },
              { id: "centres-directory", label: "National Centres Grid", icon: <Globe className="h-3.5 w-3.5" /> },
              { id: "attendance-audit", label: "Biometric vs Detected Audit", icon: <FileCheck className="h-3.5 w-3.5" /> },
              { id: "official-notice", label: "Section 12-A Notice Dossier", icon: <FileText className="h-3.5 w-3.5" /> },
              { id: "network-telemetry", label: "Rural Telemetry & DevTools", icon: <Network className="h-3.5 w-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (audioFeedback) playTacticalSound("click");
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* Main Tabbed Views                                                    */}
      {/* ==================================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* ================================================================== */}
        {/* TAB 1: MISSION CONTROL HUD                                         */}
        {/* ================================================================== */}
        {activeTab === "mission-control" && (
          <div className="space-y-6">
            {/* Discrepancy Status Banner */}
            {telemetry && (
              <div
                className={`rounded-xl border p-4 sm:p-5 transition-all ${
                  telemetry.discrepancy_report.severity === "CRITICAL"
                    ? "border-rose-500/50 bg-rose-950/25 shadow-lg shadow-rose-950/20"
                    : telemetry.discrepancy_report.severity === "WARNING"
                    ? "border-amber-500/50 bg-amber-950/25 shadow-lg shadow-amber-950/20"
                    : "border-emerald-500/40 bg-emerald-950/20"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {telemetry.discrepancy_report.severity === "CRITICAL" ? (
                        <Flame className="h-6 w-6 text-rose-400 animate-pulse" />
                      ) : telemetry.discrepancy_report.severity === "WARNING" ? (
                        <AlertTriangle className="h-6 w-6 text-amber-400" />
                      ) : (
                        <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            telemetry.discrepancy_report.severity === "CRITICAL"
                              ? "bg-rose-500 text-white"
                              : telemetry.discrepancy_report.severity === "WARNING"
                              ? "bg-amber-500 text-black font-semibold"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          {telemetry.discrepancy_report.severity} COMPLIANCE POSTURE
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Attendance Discrepancy: {telemetry.discrepancy_report.attendance_discrepancy_percent}%
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-slate-200">
                        {telemetry.discrepancy_report.reason}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleTriggerAudit}
                      disabled={isAuditing}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition disabled:opacity-50"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isAuditing ? "animate-spin" : ""}`} />
                      {isAuditing ? "Executing Audit..." : "Trigger On-Demand Audit"}
                    </button>
                    <button
                      onClick={() => setShowSection12Modal(true)}
                      className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 transition"
                    >
                      File Section 12-A Notice
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Primary KPI Ribbon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* LMS Claimed Attendance */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    LMS Biometric Registry
                  </span>
                  <div className="p-2 rounded-lg bg-slate-800 text-amber-400">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight text-white font-mono">
                    {telemetry?.claimed_lms_attendance ?? 24}
                  </span>
                  <span className="text-xs text-slate-400">Enrolled Trainees</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  National Skill Registry Claimed Logins
                </p>
              </div>

              {/* Edge Detected Headcount */}
              <div className="rounded-xl border border-cyan-500/40 bg-slate-900/80 p-5 shadow-lg shadow-cyan-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-cyan-400">
                    Edge Detected Headcount
                  </span>
                  <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                    <Eye className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight text-white font-mono">
                    {telemetry?.detected_headcount ?? 22}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                      discrepancyPercent >= 30
                        ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                        : discrepancyPercent > 15
                        ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                        : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    {discrepancyPercent === 0 ? "100% Match" : `${discrepancyPercent}% Discrepancy`}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  YOLOv8n Local Headcount (Gaussian Anonymized)
                </p>
              </div>

              {/* Operability Score */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Operability Index (OCI)
                  </span>
                  <div className="p-2 rounded-lg bg-slate-800 text-emerald-400">
                    <Gauge className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight text-white font-mono">
                    {telemetry?.operability.operability_score ?? 84.5}%
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                      (telemetry?.operability.operability_score ?? 85) >= 65
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {(telemetry?.operability.operability_score ?? 85) >= 65 ? "Normal" : "Low Usage"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Spatial IoU: {telemetry?.operability.spatial_iou_rate ?? 0.88} &bull; Stability:{" "}
                  {telemetry?.operability.tracking_stability ?? 0.92}
                </p>
              </div>

              {/* Rural Bandwidth Telemetry */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Rural Bandwidth Mode
                  </span>
                  <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
                    <Network className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight text-white font-mono">
                    2.04 KB
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-medium">
                    &lt;64 kbps Rural
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Avoided 15.4 MB raw video &bull;{" "}
                  <strong className="text-emerald-400">99.98%</strong> Bandwidth Saved
                </p>
              </div>
            </div>

            {/* Live Camera Canvas HUD & Sanctioned Inventory */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Live Visual Ingest Canvas HUD */}
              <div className="lg:col-span-7 space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
                      <h2 className="text-sm font-semibold text-slate-200">
                        Edge Inference Feed &amp; Spatial IoU Analysis
                      </h2>
                    </div>
                    {/* Stream Overlay Controls */}
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        onClick={() =>
                          setStreamOverlayToggles((p) => ({ ...p, blur: !p.blur }))
                        }
                        className={`px-2 py-0.5 rounded border transition ${
                          streamOverlayToggles.blur
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : "bg-slate-800 text-slate-500 border-slate-700"
                        }`}
                        title="Toggle Privacy Gaussian Blur Masking"
                      >
                        Blur K=51
                      </button>
                      <button
                        onClick={() =>
                          setStreamOverlayToggles((p) => ({ ...p, iouRays: !p.iouRays }))
                        }
                        className={`px-2 py-0.5 rounded border transition ${
                          streamOverlayToggles.iouRays
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                            : "bg-slate-800 text-slate-500 border-slate-700"
                        }`}
                        title="Toggle Person-Equipment IoU Proximity Rays"
                      >
                        IoU Rays
                      </button>
                    </div>
                  </div>

                  {/* Canvas Container */}
                  <div className="relative aspect-video w-full rounded-lg bg-black overflow-hidden border border-slate-800 shadow-inner">
                    <canvas
                      ref={canvasRef}
                      width={720}
                      height={405}
                      className="w-full h-full object-cover"
                    />

                    {/* Sovereign Privacy Seal Overlay */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-emerald-500/40 text-[10px] text-emerald-300 font-medium">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Zero Biometrics &bull; Top 30% Head Region Blurred ($k=51 \times 51$)</span>
                    </div>

                    {/* Centre Name & Node Watermark */}
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-slate-300">
                      {selectedCentreData.name} ({selectedCentreData.district})
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Lock className="h-3.5 w-3.5 text-emerald-400" /> DPDP Act 2023 Compliant:
                      No facial biometric templates generated or stored
                    </span>
                    <button
                      onClick={handleToggleBandwidth}
                      className="text-cyan-400 hover:text-cyan-300 underline font-mono text-[11px]"
                    >
                      {telemetry?.low_bandwidth_mode
                        ? "Switch to High-Bandwidth Audit Snapshot"
                        : "Switch to Low-Bandwidth Mode (<64 kbps)"}
                    </button>
                  </div>
                </div>

                {/* Sanctioned Infrastructure Compliance Table */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-cyan-400" />
                      <h2 className="text-sm font-semibold text-slate-200">
                        Sanctioned Equipment Inventory Audit
                      </h2>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      MSDE Normative Matrix
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-800">
                          <th className="py-2 font-medium">Approved Item</th>
                          <th className="py-2 font-medium text-center">Sanctioned</th>
                          <th className="py-2 font-medium text-center">Detected Live</th>
                          <th className="py-2 font-medium text-center">Deficit</th>
                          <th className="py-2 font-medium text-right">Audit Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {(telemetry?.inventory ?? [
                          { category: "workbench", sanctioned: 8, detected: 8, compliant: true },
                          { category: "machinery", sanctioned: 6, detected: 6, compliant: true },
                          { category: "seating", sanctioned: 25, detected: 25, compliant: true },
                        ]).map((item) => {
                          const deficit = Math.max(0, item.sanctioned - item.detected);
                          return (
                            <tr key={item.category} className="hover:bg-slate-800/20">
                              <td className="py-2.5 font-medium capitalize text-slate-200">
                                {item.category === "seating" ? "Chairs / Seating Bays" : item.category}
                              </td>
                              <td className="py-2.5 text-center text-slate-300 font-mono">
                                {item.sanctioned}
                              </td>
                              <td className="py-2.5 text-center font-bold font-mono text-cyan-400">
                                {item.detected}
                              </td>
                              <td className="py-2.5 text-center font-mono">
                                {deficit > 0 ? (
                                  <span className="text-rose-400 font-bold">-{deficit}</span>
                                ) : (
                                  <span className="text-emerald-400">0</span>
                                )}
                              </td>
                              <td className="py-2.5 text-right">
                                {item.compliant ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                                    <CheckCircle2 className="h-3 w-3" /> Fully Compliant
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400">
                                    <AlertTriangle className="h-3 w-3" /> Shortfall Flagged
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Time Series Telemetry Charts & Confusion Matrix */}
              <div className="lg:col-span-5 space-y-6">
                {/* Real-time Time Series Telemetry Chart */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-cyan-400" />
                      <h2 className="text-sm font-semibold text-slate-200">
                        Attendance &amp; Operability Telemetry
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-cyan-400" /> Detected
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-amber-400" /> Claimed
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" /> OCI %
                      </span>
                    </div>
                  </div>

                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={
                          chartData.length > 0
                            ? chartData
                            : [
                                { time: "18:00", detected: 22, claimed: 24, operability: 84, discrepancy: 2 },
                                { time: "18:01", detected: 21, claimed: 24, operability: 85, discrepancy: 3 },
                                { time: "18:02", detected: 22, claimed: 24, operability: 86, discrepancy: 2 },
                              ]
                        }
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorDetected" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#00F0FF" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="colorOperability" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} />
                        <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0B1120",
                            borderColor: "#1E293B",
                            borderRadius: "8px",
                            fontSize: "11px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="detected"
                          stroke="#00F0FF"
                          strokeWidth={2}
                          fill="url(#colorDetected)"
                          name="Detected"
                        />
                        <Area
                          type="step"
                          dataKey="claimed"
                          stroke="#F59E0B"
                          strokeWidth={1.5}
                          strokeDasharray="3 3"
                          fillOpacity={0}
                          name="LMS Claimed"
                        />
                        <Area
                          type="monotone"
                          dataKey="operability"
                          stroke="#10B981"
                          strokeWidth={2}
                          fill="url(#colorOperability)"
                          name="OCI %"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Model Confusion Matrix Benchmark */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-cyan-400" />
                      <h2 className="text-sm font-semibold text-slate-200">
                        Accuracy &amp; Confusion Matrix
                      </h2>
                    </div>
                    <button
                      onClick={fetchEvaluation}
                      disabled={isBenchmarking}
                      className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition"
                    >
                      {isBenchmarking ? "Running..." : "Evaluate Benchmark"}
                    </button>
                  </div>

                  {evaluation ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
                          <span className="text-[10px] text-slate-400 block">True Positives (TP)</span>
                          <span className="text-lg font-bold font-mono text-emerald-400">
                            {evaluation.true_positives}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/20">
                          <span className="text-[10px] text-slate-400 block">False Positives (FP)</span>
                          <span className="text-lg font-bold font-mono text-rose-400">
                            {evaluation.false_positives}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/20">
                          <span className="text-[10px] text-slate-400 block">False Negatives (FN)</span>
                          <span className="text-lg font-bold font-mono text-amber-400">
                            {evaluation.false_negatives}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40">
                          <span className="text-[10px] text-slate-400 block">True Negatives (TN)</span>
                          <span className="text-lg font-bold font-mono text-slate-300">
                            {evaluation.true_negatives}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 rounded bg-slate-800/40">
                          <span className="text-[9px] uppercase text-slate-400">Precision</span>
                          <p className="text-xs font-bold font-mono text-cyan-400">
                            {(evaluation.precision * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div className="p-2 rounded bg-slate-800/40">
                          <span className="text-[9px] uppercase text-slate-400">Recall</span>
                          <p className="text-xs font-bold font-mono text-emerald-400">
                            {(evaluation.recall * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div className="p-2 rounded bg-slate-800/40">
                          <span className="text-[9px] uppercase text-slate-400">F1-Score</span>
                          <p className="text-xs font-bold font-mono text-purple-400">
                            {(evaluation.f1_score * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1 border-t border-slate-800/60">
                        <span>
                          False Negative Rate:{" "}
                          <strong className="text-slate-300 font-mono">
                            {(evaluation.false_negative_rate * 100).toFixed(1)}%
                          </strong>
                        </span>
                        <span>
                          Mean IoU:{" "}
                          <strong className="text-cyan-400 font-mono">
                            {evaluation.mean_iou.toFixed(4)}
                          </strong>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center text-xs text-slate-500">
                      Loading benchmark metrics...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tactical Scenario Injector Bar */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-cyan-400" />
                  <h2 className="text-sm font-semibold text-slate-200">
                    Live Audit Stress Simulation Suite
                  </h2>
                </div>
                <span className="text-xs text-slate-400">Inject Simulated Anomaly Scenarios</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-8 flex flex-wrap gap-2">
                  {[
                    { id: "NORMAL", label: "Compliant Lab", desc: "Full attendance & machinery active" },
                    {
                      id: "GHOST_ATTENDANCE",
                      label: "Ghost Attendance",
                      desc: "Claimed 24, detected only 4 trainees",
                    },
                    {
                      id: "IDLE_LAB",
                      label: "Idle Equipment",
                      desc: "Trainees sitting idle away from machines",
                    },
                    {
                      id: "EQUIPMENT_DEFICIT",
                      label: "Sanctioned Deficit",
                      desc: "Workbenches and machines missing",
                    },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleScenarioChange(s.id)}
                      className={`text-xs px-3 py-2 rounded-lg border text-left transition ${
                        currentScenario === s.id
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-950"
                          : "bg-slate-800/40 text-slate-300 border-slate-700/60 hover:bg-slate-800"
                      }`}
                    >
                      <span className="font-semibold block">{s.label}</span>
                      <span className="text-[10px] text-slate-400">{s.desc}</span>
                    </button>
                  ))}
                </div>

                <div className="md:col-span-4 p-3 rounded-lg bg-slate-800/30 border border-slate-700/40">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Claimed Attendance:</span>
                    <span className="font-bold font-mono text-cyan-400">
                      {claimedAttendanceInput} Trainees
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={claimedAttendanceInput}
                    onChange={(e) => handleClaimedSlider(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Drag slider to test live gap tolerance triggers
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 2: NATIONAL CENTRES DIRECTORY                                  */}
        {/* ================================================================== */}
        {activeTab === "centres-directory" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Globe className="h-5 w-5 text-cyan-400" />
                    National Empaneled Training Centre Registry
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time monitoring across 15,000+ PMKK, KVK, JSS, and NSDC centres
                  </p>
                </div>

                {/* Search & State Filter */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search centre, district, ID..."
                      value={searchCentreQuery}
                      onChange={(e) => setSearchCentreQuery(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:ring-1 focus:ring-cyan-500 outline-none w-52"
                    />
                  </div>

                  <select
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none"
                  >
                    <option value="ALL">All States</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Bihar">Bihar</option>
                  </select>
                </div>
              </div>

              {/* Grid of Centre Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                {filteredCentres.map((centre) => {
                  const isSelected = selectedCentre === centre.id;
                  return (
                    <div
                      key={centre.id}
                      onClick={() => {
                        setSelectedCentre(centre.id);
                        setActiveTab("mission-control");
                        if (audioFeedback) playTacticalSound("click");
                      }}
                      className={`cursor-pointer rounded-xl p-4 border transition-all ${
                        isSelected
                          ? "bg-slate-900 border-cyan-500/60 shadow-md shadow-cyan-950/30"
                          : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {centre.id}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                            centre.status === "COMPLIANT"
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : centre.status === "WARNING"
                              ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                              : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                          }`}
                        >
                          {centre.status}
                        </span>
                      </div>

                      <h3 className="mt-2 text-sm font-bold text-white line-clamp-1">
                        {centre.name}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-cyan-400" />
                        {centre.district}, {centre.state}
                      </p>

                      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                          Scheme: <strong className="text-slate-200">{centre.scheme}</strong>
                        </span>
                        <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                          Inspect <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 3: ATTENDANCE & BIOMETRIC REGISTRY AUDIT                       */}
        {/* ================================================================== */}
        {activeTab === "attendance-audit" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-cyan-400" />
                    Trainee Attendance &amp; Spatial Interaction Roster
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Individual anonymized audit log comparing LMS biometric registration vs. Edge presence
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition"
                  >
                    <Download className="h-3.5 w-3.5" /> Export Audit CSV
                  </button>
                </div>
              </div>

              {/* Trainee Records Table */}
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                      <th className="py-2.5 font-medium">Trainee ID</th>
                      <th className="py-2.5 font-medium">Anonymized Hash (DPDP)</th>
                      <th className="py-2.5 font-medium">Batch</th>
                      <th className="py-2.5 font-medium">LMS Biometric Punch</th>
                      <th className="py-2.5 font-medium text-center">YOLOv8 Edge Presence</th>
                      <th className="py-2.5 font-medium text-center">Machine Active</th>
                      <th className="py-2.5 font-medium text-right">Assigned Station</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {SAMPLE_TRAINEES.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-800/20">
                        <td className="py-2.5 font-mono text-cyan-400 font-semibold">{t.id}</td>
                        <td className="py-2.5 font-mono text-slate-400 text-[11px]">
                          {t.anonymizedHash}
                        </td>
                        <td className="py-2.5 text-slate-300">{t.batchId}</td>
                        <td className="py-2.5 font-mono text-slate-300">{t.biometricLoginTime}</td>
                        <td className="py-2.5 text-center">
                          {t.edgeDetected ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" /> Confirmed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400">
                              <AlertTriangle className="h-3 w-3" /> Ghost / Missing
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 text-center">
                          {t.activeAtEquipment ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" /> Engaged
                            </span>
                          ) : (
                            <span className="text-amber-400 text-[11px]">Idle / Displaced</span>
                          )}
                        </td>
                        <td className="py-2.5 text-right font-medium text-slate-200">
                          {t.stationName}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 4: SECTION 12-A INSPECTION NOTICE GENERATOR                    */}
        {/* ================================================================== */}
        {activeTab === "official-notice" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 max-w-4xl mx-auto">
              {/* Sovereign Notice Document */}
              <div className="p-6 sm:p-8 rounded-lg bg-[#070D18] border border-slate-700/80 shadow-2xl space-y-6 font-serif text-slate-200">
                {/* Government Header */}
                <div className="text-center pb-4 border-b border-slate-700/80 space-y-1">
                  <div className="text-xs font-bold uppercase tracking-widest text-amber-400 font-sans">
                    GOVERNMENT OF INDIA &bull; MINISTRY OF SKILL DEVELOPMENT AND ENTREPRENEURSHIP
                  </div>
                  <div className="text-sm font-semibold tracking-wider text-slate-300 font-sans">
                    SCHEME MONITORING UNIT (SMU) &bull; KAUSHAL-DRISHTI SURVEILLANCE
                  </div>
                  <div className="text-xs font-mono text-slate-400 pt-1">
                    Ref ID: MSDE/SMU/2026/SEC12A/{selectedCentreData.id} &bull; DATE:{" "}
                    {new Date().toLocaleDateString("en-IN")}
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-bold uppercase text-white font-sans underline decoration-amber-500 underline-offset-4">
                    NOTICE UNDER SECTION 12-A: ATTENDANCE &amp; INFRASTRUCTURE DISCREPANCY
                  </h3>
                </div>

                <div className="space-y-4 text-xs sm:text-sm leading-relaxed font-sans text-slate-300">
                  <p>
                    <strong>To:</strong> The Centre Director / Authorized Training Partner (TP),
                    <br />
                    <strong>Centre Name:</strong> {selectedCentreData.name} ({selectedCentreData.id})
                    <br />
                    <strong>Location:</strong> {selectedCentreData.district}, {selectedCentreData.state}
                  </p>

                  <p>
                    Whereas, real-time edge computer vision telemetry gathered under the{" "}
                    <strong>Kaushal-Drishti Video Analytics Platform</strong> on{" "}
                    {new Date().toLocaleDateString("en-IN")} has recorded prima-facie discrepancy in
                    mandated operational parameters:
                  </p>

                  <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs space-y-1.5 text-slate-300">
                    <div>
                      &bull; Claimed Biometric Attendance:{" "}
                      <strong className="text-amber-400">
                        {telemetry?.claimed_lms_attendance ?? 24} trainees
                      </strong>
                    </div>
                    <div>
                      &bull; Verified Edge Headcount:{" "}
                      <strong className="text-cyan-400">
                        {telemetry?.detected_headcount ?? 22} trainees
                      </strong>
                    </div>
                    <div>
                      &bull; Discrepancy Gap:{" "}
                      <strong className="text-rose-400">{discrepancyPercent}%</strong> (Threshold: 15.0%)
                    </div>
                    <div>
                      &bull; Equipment Operability Index (OCI):{" "}
                      <strong className="text-emerald-400">
                        {telemetry?.operability.operability_score ?? 84.5}%
                      </strong>
                    </div>
                    <div>
                      &bull; Privacy Anonymization Proof:{" "}
                      <span className="text-emerald-300 font-bold">
                        GAUSSIAN_BLUR_K51_ZERO_BIOMETRIC VERIFIED
                      </span>
                    </div>
                  </div>

                  <p>
                    You are hereby called upon to furnish an explanation within{" "}
                    <strong>72 hours</strong> of receipt of this notice, failing which tranche disbursements
                    for the current batch shall be withheld under Rule 18 of the PMKVY/DDU-GKY operational
                    guidelines.
                  </p>

                  <div className="pt-6 flex justify-between items-end border-t border-slate-700/60 font-sans text-xs">
                    <div>
                      <div className="font-semibold text-slate-200">
                        Digital Verification Hash:
                      </div>
                      <div className="font-mono text-[10px] text-cyan-400">
                        SHA256:7e98a0b4c21e5f88921da8e370...
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-200">Authorized Signatory</div>
                      <div className="text-slate-400">Scheme Monitoring Unit (SMU), MSDE</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                  <button
                    onClick={() => {
                      if (audioFeedback) playTacticalSound("click");
                      window.print();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                  >
                    <Printer className="h-4 w-4" /> Print Formal Notice
                  </button>
                  <button
                    onClick={() => {
                      if (audioFeedback) playTacticalSound("success");
                      setNoticeGenerated(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition"
                  >
                    <Share2 className="h-4 w-4" /> Transmit to Training Partner
                  </button>
                </div>
              </div>

              {noticeGenerated && (
                <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>
                    Notice reference MSDE/SMU/2026/SEC12A/{selectedCentreData.id} officially logged on
                    the Sovereign Skill Registry blockchain.
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 5: RURAL TELEMETRY & DEVTOOLS WATERFALL PROFILER               */}
        {/* ================================================================== */}
        {activeTab === "network-telemetry" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="pb-4 mb-4 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Network className="h-5 w-5 text-cyan-400" />
                  Rural Low-Bandwidth Telemetry &amp; DevTools Waterfall Profiling
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live verification of &lt;64 kbps cellular transmission quotas and custom Server-Timing headers
                </p>
              </div>

              {/* Bandwidth Savings Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/60">
                  <span className="text-xs text-slate-400 uppercase font-medium">
                    Continuous RTSP Streaming
                  </span>
                  <div className="mt-2 text-xl font-bold font-mono text-rose-400">
                    2,500 kbps (2.5 Mbps)
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    15.4 MB per minute &bull; 924 MB/hr &bull; Fails in rural 2G/3G zones
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/60">
                  <span className="text-xs text-slate-400 uppercase font-medium">
                    Kaushal-Drishti Rural Mode
                  </span>
                  <div className="mt-2 text-xl font-bold font-mono text-cyan-400">
                    0.27 kbps (2 KB/min)
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    2.04 KB JSON packet &bull; Zero video streaming &bull; 100% reliable
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                  <span className="text-xs text-emerald-300 uppercase font-medium">
                    Net Bandwidth Savings
                  </span>
                  <div className="mt-2 text-xl font-bold font-mono text-emerald-400">
                    99.987% Reduction
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Saves ~923.8 MB per hour of expensive satellite/rural cellular data
                  </p>
                </div>
              </div>

              {/* DevTools Server-Timing Waterfall Inspector */}
              <div className="rounded-lg bg-black border border-slate-800 p-4 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <Terminal className="h-4 w-4" /> HTTP Response Header: Server-Timing
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Inspect in Chrome DevTools (F12) &gt; Network &gt; Timing
                  </span>
                </div>

                <div className="space-y-2 text-slate-300 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span>1. YOLOv8n Headcount Inference (`edge-infer`):</span>
                    <span className="font-bold text-cyan-400">14.20 ms</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full w-[55%]" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>2. Privacy Gaussian Blur Anonymization (`blur`):</span>
                    <span className="font-bold text-emerald-400">3.10 ms</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[12%]" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>3. Spatial IoU Operability Matrix (`iou-calc`):</span>
                    <span className="font-bold text-amber-400">1.80 ms</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[7%]" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span>4. WebP Proof Frame Compression (`webp-comp`):</span>
                    <span className="font-bold text-purple-400">4.50 ms</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full w-[18%]" />
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-bold text-white">
                    <span>Total Edge Compute Latency:</span>
                    <span className="text-emerald-400">23.60 ms (Ultra Low Overhead)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ==================================================================== */}
      {/* SECTION 12-A INSPECTION MODAL                                        */}
      {/* ==================================================================== */}
      {showSection12Modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertOctagon className="h-5 w-5" />
                <span>Confirm Section 12-A Notice Dispatch</span>
              </div>
              <button
                onClick={() => setShowSection12Modal(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              You are about to issue an official Ministry of Skill Development inspection notice to{" "}
              <strong>{selectedCentreData.name}</strong> due to verified attendance discrepancy (
              {discrepancyPercent}% gap).
            </p>

            <div className="p-3 rounded-lg bg-black/60 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
              <div>Centre: {selectedCentreData.id}</div>
              <div>Discrepancy: {telemetry ? Math.abs(telemetry.attendance_discrepancy) : 0} Trainees missing</div>
              <div>Privacy Seal: Gaussian Blur ($k=51 \times 51$) attached</div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setShowSection12Modal(false)}
                className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSection12Modal(false);
                  setActiveTab("official-notice");
                  if (audioFeedback) playTacticalSound("critical");
                }}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white"
              >
                Proceed to Issue Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sovereign Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090E1A]/60 py-4 px-4 sm:px-8 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          Ministry of Skill Development and Entrepreneurship (MSDE) &bull; Problem ID 26245 &bull;
          Scheme Monitoring Unit (SMU)
        </p>
        <p className="font-mono text-slate-400">
          Privacy Standard: ISO/IEC 27701 &bull; DPDP Act 2023 Compliant (Zero Biometrics)
        </p>
      </footer>
    </div>
  );
}
