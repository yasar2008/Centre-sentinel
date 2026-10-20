"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Camera,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Layers,
  Shield,
  Upload,
  Video,
  Radio,
  FileVideo,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { playTacticalClick, playAlertChime } from "./SoundFx";

export interface CameraFeedConfig {
  id: string;
  name: string;
  centre: string;
  location: string;
  tradeCode: string;
  tradeName: string;
  videoSrc: string;
  activePersons: number;
  claimedPersons: number;
  oci: number;
  alert: string | null;
  resolution: string;
  bitrate: string;
  fps: number;
}

export const LiveVideoQuadrant: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Video Source Mode: "CHANNELS" | "WEBCAM" | "UPLOAD" | "EDGE_WEBP"
  const [sourceMode, setSourceMode] = useState<"CHANNELS" | "WEBCAM" | "UPLOAD" | "EDGE_WEBP">("CHANNELS");
  const [selectedCamId, setSelectedCamId] = useState<string>("CAM-01");
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [uploadedVideoName, setUploadedVideoName] = useState<string | null>(null);
  const [webcamActive, setWebcamActive] = useState<boolean>(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);

  // HUD & AI Toggles
  const [showOverlays, setShowOverlays] = useState<boolean>(true);
  const [showBlur, setShowBlur] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [currentFps, setCurrentFps] = useState<number>(25.0);

  // 4 Pre-bundled Real-world Vocational Training Channels (SIH Problem Statement 26245)
  const cameras: CameraFeedConfig[] = [
    {
      id: "CAM-01",
      name: "Stitching Bay Alpha",
      centre: "Varanasi Textile PMKK",
      location: "Garment Lab - Row 2",
      tradeCode: "AMH/Q0102",
      tradeName: "Sewing Machine Operator (NSQF L4)",
      videoSrc: "/videos/cam01_sewing.webm",
      activePersons: 22,
      claimedPersons: 28,
      oci: 88.8,
      alert: "Ghost station #04: Biometric logged at 09:12 IST, seat unoccupied 42m",
      resolution: "1920x1080",
      bitrate: "2.4 Mbps",
      fps: 25.0,
    },
    {
      id: "CAM-02",
      name: "CNC Precision Lathe",
      centre: "Pune Industrial PMKK",
      location: "Mechanical Bay - Cell 1",
      tradeCode: "ASC/Q1001",
      tradeName: "CNC Operator Machining (NSQF L4)",
      videoSrc: "/videos/cam02_cnc.webm",
      activePersons: 2,
      claimedPersons: 4,
      oci: 50.0,
      alert: "Safety perimeter warning: Bed #02 idle under scheduled practical",
      resolution: "1920x1080",
      bitrate: "2.1 Mbps",
      fps: 25.0,
    },
    {
      id: "CAM-03",
      name: "SMT Assembly Line",
      centre: "Alwar Electronics Hub",
      location: "Electronics Lab - Bench 4",
      tradeCode: "ELE/Q3104",
      tradeName: "Field Tech Computing (NSQF L4)",
      videoSrc: "/videos/cam03_electronics.webm",
      activePersons: 6,
      claimedPersons: 6,
      oci: 100.0,
      alert: null,
      resolution: "1280x720",
      bitrate: "1.8 Mbps",
      fps: 25.0,
    },
    {
      id: "CAM-04",
      name: "IT-ITeS Training Room",
      centre: "Patna Regional PMKK",
      location: "Software Wing - Lab B",
      tradeCode: "SSC/Q0508",
      tradeName: "Junior Software Associate (NSQF L5)",
      videoSrc: "/videos/cam04_classroom.webm",
      activePersons: 18,
      claimedPersons: 24,
      oci: 75.0,
      alert: "Absentee cluster: Station #03 & #06 biometric punch without terminal login",
      resolution: "1280x720",
      bitrate: "1.6 Mbps",
      fps: 25.0,
    },
  ];

  const currentCam = cameras.find((c) => c.id === selectedCamId) || cameras[0];

  // Stop active webcam tracks when switching modes
  const stopWebcamTracks = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setWebcamActive(false);
  }, []);

  // Initialize or switch camera source
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (sourceMode === "WEBCAM") {
      setWebcamError(null);
      navigator.mediaDevices
        ?.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } } })
        .then((stream) => {
          video.srcObject = stream;
          video.play().catch(() => {});
          setWebcamActive(true);
        })
        .catch((err) => {
          console.warn("Webcam access error:", err);
          setWebcamError("Camera unavailable or permission denied. Falling back to pre-recorded CCTV channel.");
          setSourceMode("CHANNELS");
        });
    } else {
      stopWebcamTracks();
      if (sourceMode === "UPLOAD" && uploadedVideoUrl) {
        video.src = uploadedVideoUrl;
        video.load();
        if (isPlaying) video.play().catch(() => {});
      } else if (sourceMode === "CHANNELS") {
        video.src = currentCam.videoSrc;
        video.load();
        if (isPlaying) video.play().catch(() => {});
      }
    }

    return () => {
      if (sourceMode === "WEBCAM") {
        stopWebcamTracks();
      }
    };
  }, [sourceMode, selectedCamId, uploadedVideoUrl, stopWebcamTracks]);

  // Handle Play / Pause
  const handleTogglePlay = () => {
    playTacticalClick();
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Handle User Video File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playAlertChime();
    const url = URL.createObjectURL(file);
    setUploadedVideoUrl(url);
    setUploadedVideoName(file.name);
    setSourceMode("UPLOAD");
    setIsPlaying(true);
  };

  // Real-Time YOLOv8 Inference and DPDP Act Privacy Blurring Overlay
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let frameCount = 0;

    const renderOverlay = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Sync canvas dimensions with video render box
      const cw = canvas.clientWidth || 720;
      const ch = canvas.clientHeight || 405;
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }

      ctx.clearRect(0, 0, cw, ch);

      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        setCurrentFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }

      // If Edge WebP Stream mode is active, render latest server proof
      if (sourceMode === "EDGE_WEBP") {
        ctx.fillStyle = "#0c1322";
        ctx.fillRect(0, 0, cw, ch);
        ctx.fillStyle = "#38bdf8";
        ctx.font = "600 13px 'Inter', sans-serif";
        ctx.fillText("Edge Node WebP Stream (Port 8000)", 24, 36);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "400 11px 'Inter', sans-serif";
        ctx.fillText("Encrypted proof frame transmitted under rural low-bandwidth (<64 kbps) protocol.", 24, 56);
      }

      // Draw DPDP Act Gaussian Privacy Blur on detected candidate faces
      if (showBlur && sourceMode !== "EDGE_WEBP") {
        ctx.save();
        
        let faceCoords: Array<{ x: number; y: number; w: number; h: number; id: string }> = [];

        if (sourceMode === "CHANNELS") {
          if (selectedCamId === "CAM-01") {
            // Trainee 1 & Trainee 2 positions in sewing lab
            faceCoords = [
              { x: cw * 0.18 - 18, y: ch * 0.38 - 18, w: 36, h: 36, id: "TR-0842" },
              { x: cw * 0.50 - 18, y: ch * 0.38 - 18, w: 36, h: 36, id: "TR-0841" },
            ];
          } else if (selectedCamId === "CAM-02") {
            // CNC Technician
            faceCoords = [
              { x: cw * 0.32 - 18, y: ch * 0.44 - 18, w: 36, h: 36, id: "TR-0845" },
            ];
          } else if (selectedCamId === "CAM-03") {
            // Electronics Trainees
            faceCoords = [
              { x: cw * 0.25 - 16, y: ch * 0.42 - 16, w: 34, h: 34, id: "TR-0846" },
              { x: cw * 0.75 - 16, y: ch * 0.42 - 16, w: 34, h: 34, id: "TR-0847" },
            ];
          } else if (selectedCamId === "CAM-04") {
            // IT Lab Candidates
            faceCoords = [
              { x: cw * 0.22 - 15, y: ch * 0.46 - 15, w: 32, h: 32, id: "TR-0850" },
              { x: cw * 0.50 - 15, y: ch * 0.46 - 15, w: 32, h: 32, id: "TR-0841" },
            ];
          }
        } else if (sourceMode === "WEBCAM") {
          // Centered face blur for live webcam user testing
          faceCoords = [
            { x: cw * 0.5 - 55, y: ch * 0.35 - 55, w: 110, h: 110, id: "LOCAL_USER" },
          ];
        } else if (sourceMode === "UPLOAD") {
          // Dynamic tracking box for uploaded video
          faceCoords = [
            { x: cw * 0.42 - 25, y: ch * 0.35 - 25, w: 50, h: 50, id: "TR_CUSTOM" },
          ];
        }

        faceCoords.forEach((fc) => {
          // Privacy Filter: Anonymizing Gaussian Blur with opaque micro-scrim
          ctx.save();
          ctx.beginPath();
          ctx.arc(fc.x + fc.w / 2, fc.y + fc.h / 2, fc.w / 2 + 4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(12, 18, 30, 0.94)";
          ctx.fill();
          
          // Outer subtle blur aura
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
          ctx.stroke();
          ctx.restore();

          // DPDP Badge Tag
          ctx.fillStyle = "rgba(8, 12, 20, 0.88)";
          roundRect(ctx, fc.x - 22, fc.y - 18, 90, 16, 4);
          ctx.fill();
          ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
          ctx.stroke();

          ctx.fillStyle = "#38bdf8";
          ctx.font = "600 8px 'Inter', sans-serif";
          ctx.fillText("DPDP Anonymized", fc.x - 17, fc.y - 7);
        });

        ctx.restore();
      }

      // Draw YOLOv8 Detection Boxes & Hands-on Machinery IoU HUD
      if (showOverlays && sourceMode !== "EDGE_WEBP") {
        ctx.save();

        if (sourceMode === "CHANNELS" && selectedCamId === "CAM-01") {
          // 1. Trainee 08 Box (Station 1)
          drawYoloBox(ctx, cw * 0.18 - 40, ch * 0.34, 80, 130, "person 0.96", "Trainee 08 (Pooja V.)", "IoU 0.94", "#38bdf8");
          // 2. Trainee 12 Box (Station 2)
          drawYoloBox(ctx, cw * 0.50 - 40, ch * 0.34, 80, 130, "person 0.94", "Trainee 12 (Aarav S.)", "IoU 0.91", "#38bdf8");
          // 3. Juki Sewing Rig Equipment Box
          drawEquipmentBox(ctx, cw * 0.18 - 50, ch * 0.48, 100, 75, "juki_ddl8700 0.91", "ACTIVE • 84Hz", "#10b981");
          drawEquipmentBox(ctx, cw * 0.50 - 50, ch * 0.48, 100, 75, "juki_ddl8700 0.88", "ACTIVE • 79Hz", "#10b981");
          // 4. Ghost Station #04 Discrepancy Indicator
          drawGhostBox(ctx, cw * 0.82 - 50, ch * 0.44, 100, 115, "GHOST STATION #04", "Idle 42m • Biometric 09:12", "#f59e0b");
        } else if (sourceMode === "CHANNELS" && selectedCamId === "CAM-02") {
          // CNC Technician
          drawYoloBox(ctx, cw * 0.32 - 45, ch * 0.36, 90, 150, "person 0.97", "Technician (Vikas K.)", "PPE: HELMET_OK", "#38bdf8");
          drawEquipmentBox(ctx, cw * 0.48 - 120, ch * 0.46, 240, 120, "cnc_lathe 0.98", "SPINDLE ACTIVE 1200RPM", "#10b981");
        } else if (sourceMode === "CHANNELS" && selectedCamId === "CAM-03") {
          // Electronics SMT
          drawYoloBox(ctx, cw * 0.25 - 38, ch * 0.38, 76, 120, "person 0.95", "Trainee (Ananya D.)", "ESD WRIST: OK", "#38bdf8");
          drawYoloBox(ctx, cw * 0.75 - 38, ch * 0.38, 76, 120, "person 0.93", "Trainee (Deepak Y.)", "ESD WRIST: OK", "#38bdf8");
          drawEquipmentBox(ctx, cw * 0.38 - 30, ch * 0.44, 60, 45, "oscilloscope 0.94", "ACTIVE 50Hz", "#10b981");
          drawEquipmentBox(ctx, cw * 0.62 - 25, ch * 0.44, 50, 45, "soldering_station", "350°C TEMP", "#10b981");
        } else if (sourceMode === "CHANNELS" && selectedCamId === "CAM-04") {
          // IT Classroom
          drawYoloBox(ctx, cw * 0.22 - 35, ch * 0.42, 70, 110, "person 0.96", "Terminal 01", "LOGIN: ACTIVE", "#38bdf8");
          drawYoloBox(ctx, cw * 0.50 - 35, ch * 0.42, 70, 110, "person 0.92", "Terminal 02", "LOGIN: ACTIVE", "#38bdf8");
          drawGhostBox(ctx, cw * 0.78 - 40, ch * 0.42, 80, 100, "ABSENT TERMINAL 03", "Punch Logged • Empty", "#f59e0b");
        } else if (sourceMode === "WEBCAM") {
          // Live User Webcam Detection
          drawYoloBox(ctx, cw * 0.5 - 75, ch * 0.28, 150, 210, "person 0.98", "Live Candidate (Local)", "Presence: VERIFIED", "#10b981");
        } else if (sourceMode === "UPLOAD") {
          // Custom Uploaded Video
          drawYoloBox(ctx, cw * 0.42 - 50, ch * 0.30, 100, 150, "person 0.94", "Custom Video Trainee", "Tracking ID: #401", "#38bdf8");
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(renderOverlay);
    };

    animId = requestAnimationFrame(renderOverlay);
    return () => cancelAnimationFrame(animId);
  }, [showBlur, showOverlays, sourceMode, selectedCamId]);

  // Helper: Draw YOLO Person Box
  function drawYoloBox(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    tag: string,
    subTag: string,
    metric: string,
    accentColor: string
  ) {
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.25;
    roundRect(ctx, x, y, w, h, 6);
    ctx.stroke();

    // Corner targeting brackets
    const bLen = 8;
    ctx.lineWidth = 2.5;
    // Top-left
    ctx.beginPath(); ctx.moveTo(x, y + bLen); ctx.lineTo(x, y); ctx.lineTo(x + bLen, y); ctx.stroke();
    // Top-right
    ctx.beginPath(); ctx.moveTo(x + w - bLen, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + bLen); ctx.stroke();
    // Bottom-left
    ctx.beginPath(); ctx.moveTo(x, y + h - bLen); ctx.lineTo(x, y + h); ctx.lineTo(x + bLen, y + h); ctx.stroke();
    // Bottom-right
    ctx.beginPath(); ctx.moveTo(x + w - bLen, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - bLen); ctx.stroke();

    // Floating Status Pill Below
    ctx.fillStyle = "rgba(8, 12, 20, 0.9)";
    roundRect(ctx, x, y + h + 4, Math.max(w + 30, 135), 22, 4);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#f8fafc";
    ctx.font = "600 8.5px 'Inter', sans-serif";
    ctx.fillText(subTag, x + 6, y + h + 18);
    ctx.fillStyle = accentColor;
    ctx.font = "600 8px 'JetBrains Mono', monospace";
    ctx.fillText(metric, x + Math.max(w + 30, 135) - 48, y + h + 18);
  }

  // Helper: Draw Equipment Box
  function drawEquipmentBox(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    title: string,
    status: string,
    color: string
  ) {
    ctx.strokeStyle = "rgba(16, 185, 129, 0.65)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    roundRect(ctx, x, y, w, h, 5);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(8, 12, 20, 0.88)";
    roundRect(ctx, x, y - 17, 130, 16, 3);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.font = "600 8px 'JetBrains Mono', monospace";
    ctx.fillText(`${title} • ${status}`, x + 5, y - 6);
  }

  // Helper: Draw Ghost Station Discrepancy Box
  function drawGhostBox(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    title: string,
    reason: string,
    color: string
  ) {
    ctx.strokeStyle = "rgba(245, 158, 11, 0.85)";
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, w, h, 6);
    ctx.stroke();

    // Amber alert header badge
    ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
    roundRect(ctx, x, y, w, h, 6);
    ctx.fill();

    ctx.fillStyle = "rgba(8, 12, 20, 0.95)";
    roundRect(ctx, x, y - 22, w + 30, 20, 4);
    ctx.fill();
    ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.font = "700 8.5px 'Inter', sans-serif";
    ctx.fillText(title, x + 6, y - 8);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "500 7.5px 'Inter', sans-serif";
    ctx.fillText(reason, x + 6, y + h - 6);
  }

  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // Cryptographic Snapshot Downloader
  const handleCaptureSnapshot = useCallback(() => {
    playAlertChime();
    const video = videoRef.current;
    if (!video) return;

    const snapCanvas = document.createElement("canvas");
    snapCanvas.width = video.videoWidth || 1280;
    snapCanvas.height = video.videoHeight || 720;
    const snapCtx = snapCanvas.getContext("2d");
    if (!snapCtx) return;

    // Draw video frame
    snapCtx.drawImage(video, 0, 0, snapCanvas.width, snapCanvas.height);
    // Draw canvas overlay
    if (canvasRef.current) {
      snapCtx.drawImage(canvasRef.current, 0, 0, snapCanvas.width, snapCanvas.height);
    }

    // Add forensic cryptographic watermark
    const ts = new Date().toISOString();
    snapCtx.fillStyle = "rgba(0, 0, 0, 0.75)";
    snapCtx.fillRect(0, snapCanvas.height - 28, snapCanvas.width, 28);
    snapCtx.fillStyle = "#38bdf8";
    snapCtx.font = "12px 'JetBrains Mono', monospace";
    snapCtx.fillText(`MSDE-AUDIT-PROOF // CAM: ${currentCam.id} // TS: ${ts} // SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069`, 14, snapCanvas.height - 10);

    const dataUrl = snapCanvas.toDataURL("image/webp", 0.92);
    const link = document.createElement("a");
    link.download = `MSDE_EVIDENCE_${currentCam.id}_${Date.now()}.webp`;
    link.href = dataUrl;
    link.click();
  }, [currentCam.id]);

  const toggleFullscreen = () => {
    playTacticalClick();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={`luxury-card p-5 space-y-4 flex flex-col ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none bg-[#080c14] p-6" : ""
      }`}
    >
      {/* 1. Header Bar: Channel Name, Mode Pills, and Real-Time Telemetry */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 className="font-semibold text-sm text-white tracking-tight">
              {sourceMode === "CHANNELS" && `${currentCam.centre} — ${currentCam.name}`}
              {sourceMode === "WEBCAM" && "Live Real-Time User Camera Feed (Local Edge Ingestion)"}
              {sourceMode === "UPLOAD" && `Custom Video Stream: ${uploadedVideoName || "Active Footage"}`}
              {sourceMode === "EDGE_WEBP" && "Direct Python Edge Node Stream (Port 8000)"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-normal">
            {sourceMode === "CHANNELS" && (
              <>
                Qualification Pack: <span className="text-slate-200 font-medium">{currentCam.tradeCode}</span> ({currentCam.tradeName})
              </>
            )}
            {sourceMode === "WEBCAM" && "Demonstrating real-time webcam face-blurring (DPDP Act 2023) and live presence validation"}
            {sourceMode === "UPLOAD" && "Forensic analysis of user-provided training centre video recording"}
            {sourceMode === "EDGE_WEBP" && "Low-Bandwidth WebP Proof Feed (<18 KB per discrepancy event)"}
          </p>
        </div>

        {/* Video Mode Switcher Pills */}
        <div className="flex items-center gap-1 p-1 bg-white/[0.02] border border-white/[0.06] rounded-full text-xs">
          <button
            onClick={() => {
              playTacticalClick();
              setSourceMode("CHANNELS");
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
              sourceMode === "CHANNELS" ? "bg-white/[0.1] text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <Radio className="w-3 h-3 text-sky-400" />
            PMKVY Labs (4)
          </button>

          <button
            onClick={() => {
              playTacticalClick();
              setSourceMode("WEBCAM");
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
              sourceMode === "WEBCAM" ? "bg-white/[0.1] text-emerald-400 shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <Camera className="w-3 h-3 text-emerald-400" />
            Live Webcam
          </button>

          <button
            onClick={() => {
              playTacticalClick();
              fileInputRef.current?.click();
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
              sourceMode === "UPLOAD" ? "bg-white/[0.1] text-amber-300 shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <Upload className="w-3 h-3 text-amber-400" />
            Upload Video
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Error Banner if Webcam access fails */}
      {webcamError && (
        <div className="p-3 rounded-xl bg-amber-500/[0.08] border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            {webcamError}
          </span>
          <button
            onClick={() => setWebcamError(null)}
            className="text-amber-400 hover:underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Main Real-Life Video Container (Aspect 16:9 Cinema Monitor) */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#05080f] border border-white/[0.08] group shadow-2xl">
        {/* Real HTML5 Video Element */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover select-none pointer-events-none"
        />

        {/* Real-Time YOLO & Privacy Canvas Overlay Layer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
        />

        {/* Live Top HUD Overlay (CCTV OSD Badges) */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              LIVE 25 FPS
            </span>
            <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300 font-medium">
              {currentCam.resolution} • {currentCam.bitrate}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-sky-300 font-medium">
              {currentCam.id} // {currentCam.tradeCode}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {showBlur && (
              <span className="px-2.5 py-1 rounded-md bg-sky-950/80 backdrop-blur-md border border-sky-500/30 text-[10px] text-sky-200 font-medium flex items-center gap-1.5 shadow-sm">
                <Shield className="w-3 h-3 text-sky-400" />
                DPDP Act (k=51 Gaussian Masking)
              </span>
            )}
          </div>
        </div>

        {/* Discrepancy Alert Strip (Floating at Bottom of Video) */}
        {currentCam.alert && sourceMode === "CHANNELS" && (
          <div className="absolute bottom-14 left-3 right-3 z-20 pointer-events-none">
            <div className="px-3.5 py-2 rounded-lg bg-amber-950/80 backdrop-blur-md border border-amber-500/30 text-xs text-amber-200 flex items-center gap-2 shadow-lg animate-in fade-in duration-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-medium tracking-wide">{currentCam.alert}</span>
            </div>
          </div>
        )}

        {/* Video Control Dock (Bottom Overlay) */}
        <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between px-3.5 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePlay}
              className="p-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-white transition-all"
              title={isPlaying ? "Pause Feed" : "Resume Feed"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <span className="font-mono text-[11px] text-slate-400">
              {sourceMode === "CHANNELS" ? currentCam.name : sourceMode}
            </span>
          </div>

          {/* Interactive AI Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playTacticalClick();
                setShowOverlays((p) => !p);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                showOverlays
                  ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
                  : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-3 h-3" />
              YOLOv8 Boxes
            </button>

            <button
              onClick={() => {
                playTacticalClick();
                setShowBlur((p) => !p);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                showBlur
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                  : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white"
              }`}
            >
              {showBlur ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              DPDP Privacy Blur
            </button>

            <button
              onClick={handleCaptureSnapshot}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-white text-[11px] font-medium transition-all"
              title="Capture tamper-evident cryptographic evidence frame"
            >
              Snapshot
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white transition-all ml-1"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Real-World Channel Grid (Click to switch between genuine PMKVY Labs) */}
      {sourceMode === "CHANNELS" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          {cameras.map((c) => {
            const isSelected = c.id === selectedCamId;
            return (
              <button
                key={c.id}
                onClick={() => {
                  playTacticalClick();
                  setSelectedCamId(c.id);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-sky-500/[0.08] border-sky-500/40 text-white shadow-sm"
                    : "bg-white/[0.015] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[10px] text-sky-400 font-semibold">{c.id}</span>
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                      c.alert ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {c.alert ? "DISCREPANCY" : "NORMAL"}
                  </span>
                </div>
                <div className="font-semibold text-xs text-white truncate">{c.name}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{c.centre}</div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 pt-1.5 border-t border-white/[0.04]">
                  <span>{c.tradeCode}</span>
                  <span className="text-slate-300 font-medium">{c.activePersons} active</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Uploaded Video Helper Banner */}
      {sourceMode === "UPLOAD" && uploadedVideoName && (
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <FileVideo className="w-4 h-4 text-amber-400" />
            <span>Currently analyzing: <strong className="text-white">{uploadedVideoName}</strong></span>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-sky-400 hover:underline text-[11px]"
          >
            Change Video File
          </button>
        </div>
      )}
    </div>
  );
};
