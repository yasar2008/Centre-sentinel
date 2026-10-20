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

  // 4 Pre-bundled Real-world Vocational Training Channels (SIH Problem Statement 26245)
  const cameras: CameraFeedConfig[] = [
    {
      id: "CAM-01",
      name: "Stitching Bay Alpha",
      centre: "Varanasi Textile PMKK",
      location: "Garment Lab - Row 2",
      tradeCode: "AMH/Q0102",
      tradeName: "Sewing Machine Operator",
      videoSrc: "/videos/cam01_sewing.webm",
      activePersons: 22,
      claimedPersons: 28,
      oci: 88.8,
      alert: "Station 04: Biometric logged at 09:12, physical seat unoccupied for 42 mins",
      resolution: "1080p Full HD",
      bitrate: "2.4 Mbps",
      fps: 25.0,
    },
    {
      id: "CAM-02",
      name: "CNC Precision Lathe",
      centre: "Pune Industrial PMKK",
      location: "Machining Bay - Cell 1",
      tradeCode: "ASC/Q1001",
      tradeName: "CNC Operator Machining",
      videoSrc: "/videos/cam02_cnc.webm",
      activePersons: 2,
      claimedPersons: 4,
      oci: 50.0,
      alert: "Safety perimeter check: Spindle active, technician in protective gear",
      resolution: "1080p Full HD",
      bitrate: "2.1 Mbps",
      fps: 25.0,
    },
    {
      id: "CAM-03",
      name: "SMT Assembly Line",
      centre: "Alwar Electronics Hub",
      location: "Electronics Lab - Bench 4",
      tradeCode: "ELE/Q3104",
      tradeName: "Field Tech Computing",
      videoSrc: "/videos/cam03_electronics.webm",
      activePersons: 6,
      claimedPersons: 6,
      oci: 100.0,
      alert: null,
      resolution: "720p HD",
      bitrate: "1.8 Mbps",
      fps: 25.0,
    },
    {
      id: "CAM-04",
      name: "IT-ITeS Training Room",
      centre: "Patna Regional PMKK",
      location: "Software Wing - Lab B",
      tradeCode: "SSC/Q0508",
      tradeName: "Junior Software Associate",
      videoSrc: "/videos/cam04_classroom.webm",
      activePersons: 18,
      claimedPersons: 24,
      oci: 75.0,
      alert: "Biometric attendance logged without active terminal login",
      resolution: "720p HD",
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
          setWebcamError("Camera unavailable. Switched to pre-recorded training video.");
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

  // Human-Centered Canvas Overlays (Clean, Legible, No Sci-Fi Clutter)
  useEffect(() => {
    let animId: number;

    const renderOverlay = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cw = canvas.clientWidth || 720;
      const ch = canvas.clientHeight || 405;
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }

      ctx.clearRect(0, 0, cw, ch);

      // Draw Soft Natural DPDP Act Privacy Blur on candidate faces
      if (showBlur && sourceMode !== "EDGE_WEBP") {
        let faceCoords: Array<{ x: number; y: number; w: number; h: number }> = [];

        if (sourceMode === "CHANNELS") {
          if (selectedCamId === "CAM-01") {
            faceCoords = [
              { x: cw * 0.18 - 18, y: ch * 0.38 - 18, w: 36, h: 36 },
              { x: cw * 0.50 - 18, y: ch * 0.38 - 18, w: 36, h: 36 },
            ];
          } else if (selectedCamId === "CAM-02") {
            faceCoords = [
              { x: cw * 0.32 - 18, y: ch * 0.44 - 18, w: 36, h: 36 },
            ];
          } else if (selectedCamId === "CAM-03") {
            faceCoords = [
              { x: cw * 0.25 - 16, y: ch * 0.42 - 16, w: 34, h: 34 },
              { x: cw * 0.75 - 16, y: ch * 0.42 - 16, w: 34, h: 34 },
            ];
          } else if (selectedCamId === "CAM-04") {
            faceCoords = [
              { x: cw * 0.22 - 15, y: ch * 0.46 - 15, w: 32, h: 32 },
              { x: cw * 0.50 - 15, y: ch * 0.46 - 15, w: 32, h: 32 },
            ];
          }
        } else if (sourceMode === "WEBCAM") {
          faceCoords = [
            { x: cw * 0.5 - 50, y: ch * 0.35 - 50, w: 100, h: 100 },
          ];
        } else if (sourceMode === "UPLOAD") {
          faceCoords = [
            { x: cw * 0.42 - 25, y: ch * 0.35 - 25, w: 50, h: 50 },
          ];
        }

        faceCoords.forEach((fc) => {
          ctx.save();
          // Soft circular privacy mask
          ctx.beginPath();
          ctx.arc(fc.x + fc.w / 2, fc.y + fc.h / 2, fc.w / 2 + 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
          ctx.stroke();
          ctx.restore();

          // Subtle Privacy Shield Tag
          ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
          roundRect(ctx, fc.x - 20, fc.y - 18, 92, 16, 4);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.font = "600 8.5px 'Plus Jakarta Sans', sans-serif";
          ctx.fillText("Privacy Anonymized", fc.x - 14, fc.y - 7);
        });
      }

      // Draw Clean Human Detection Boxes (No Military Target Brackets)
      if (showOverlays && sourceMode !== "EDGE_WEBP") {
        ctx.save();

        if (sourceMode === "CHANNELS" && selectedCamId === "CAM-01") {
          drawCleanPersonBox(ctx, cw * 0.18 - 40, ch * 0.34, 80, 130, "Pooja Verma", "Station 01", "#2563eb");
          drawCleanPersonBox(ctx, cw * 0.50 - 40, ch * 0.34, 80, 130, "Aarav Sharma", "Station 02", "#2563eb");
          drawCleanMachineBox(ctx, cw * 0.18 - 50, ch * 0.48, 100, 75, "Juki Lockstitch #01", "#059669");
          drawCleanMachineBox(ctx, cw * 0.50 - 50, ch * 0.48, 100, 75, "Juki Lockstitch #02", "#059669");
          drawUnattendedBox(ctx, cw * 0.82 - 50, ch * 0.44, 100, 115, "Station 04 (Unattended)", "Biometric logged at 09:12", "#d97706");
        } else if (sourceMode === "CHANNELS" && selectedCamId === "CAM-02") {
          drawCleanPersonBox(ctx, cw * 0.32 - 45, ch * 0.36, 90, 150, "Vikas Kumar (Operator)", "CNC Cell", "#2563eb");
          drawCleanMachineBox(ctx, cw * 0.48 - 120, ch * 0.46, 240, 120, "CNC Precision Lathe", "#059669");
        } else if (sourceMode === "CHANNELS" && selectedCamId === "CAM-03") {
          drawCleanPersonBox(ctx, cw * 0.25 - 38, ch * 0.38, 76, 120, "Ananya Das", "Bench 01", "#2563eb");
          drawCleanPersonBox(ctx, cw * 0.75 - 38, ch * 0.38, 76, 120, "Deepak Yadav", "Bench 02", "#2563eb");
          drawCleanMachineBox(ctx, cw * 0.38 - 30, ch * 0.44, 60, 45, "Oscilloscope", "#059669");
        } else if (sourceMode === "CHANNELS" && selectedCamId === "CAM-04") {
          drawCleanPersonBox(ctx, cw * 0.22 - 35, ch * 0.42, 70, 110, "Terminal 01", "Active", "#2563eb");
          drawCleanPersonBox(ctx, cw * 0.50 - 35, ch * 0.42, 70, 110, "Terminal 02", "Active", "#2563eb");
          drawUnattendedBox(ctx, cw * 0.78 - 40, ch * 0.42, 80, 100, "Terminal 03 (Empty)", "Punch present in log", "#d97706");
        } else if (sourceMode === "WEBCAM") {
          drawCleanPersonBox(ctx, cw * 0.5 - 75, ch * 0.28, 150, 210, "You (Present in Session)", "Local Ingestion", "#059669");
        } else if (sourceMode === "UPLOAD") {
          drawCleanPersonBox(ctx, cw * 0.42 - 50, ch * 0.30, 100, 150, "Trainee Detected", "Recorded Video", "#2563eb");
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(renderOverlay);
    };

    animId = requestAnimationFrame(renderOverlay);
    return () => cancelAnimationFrame(animId);
  }, [showBlur, showOverlays, sourceMode, selectedCamId]);

  // Clean Human Person Bounding Box (No corner targeting brackets)
  function drawCleanPersonBox(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    name: string,
    station: string,
    color: string
  ) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.75;
    roundRect(ctx, x, y, w, h, 8);
    ctx.stroke();

    // Soft name tag
    ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
    roundRect(ctx, x, y + h + 4, Math.max(w + 30, 125), 22, 6);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "600 9px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(name, x + 8, y + h + 18);
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "500 8px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(station, x + Math.max(w + 30, 125) - 45, y + h + 18);
  }

  // Clean Machinery Box
  function drawCleanMachineBox(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    title: string,
    color: string
  ) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.25;
    ctx.setLineDash([4, 4]);
    roundRect(ctx, x, y, w, h, 6);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    roundRect(ctx, x, y - 16, 120, 16, 4);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 8px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(title, x + 6, y - 5);
  }

  // Clean Unattended Discrepancy Box
  function drawUnattendedBox(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    title: string,
    reason: string,
    color: string
  ) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, w, h, 8);
    ctx.stroke();

    ctx.fillStyle = "rgba(217, 119, 6, 0.12)";
    roundRect(ctx, x, y, w, h, 8);
    ctx.fill();

    ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
    roundRect(ctx, x, y - 20, w + 30, 18, 4);
    ctx.fill();

    ctx.fillStyle = "#fef3c7";
    ctx.font = "700 8.5px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(title, x + 6, y - 7);

    ctx.fillStyle = "#ffffff";
    ctx.font = "500 7.5px 'Plus Jakarta Sans', sans-serif";
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

  // Snapshot Downloader
  const handleCaptureSnapshot = useCallback(() => {
    playAlertChime();
    const video = videoRef.current;
    if (!video) return;

    const snapCanvas = document.createElement("canvas");
    snapCanvas.width = video.videoWidth || 1280;
    snapCanvas.height = video.videoHeight || 720;
    const snapCtx = snapCanvas.getContext("2d");
    if (!snapCtx) return;

    snapCtx.drawImage(video, 0, 0, snapCanvas.width, snapCanvas.height);
    if (canvasRef.current) {
      snapCtx.drawImage(canvasRef.current, 0, 0, snapCanvas.width, snapCanvas.height);
    }

    const ts = new Date().toLocaleString("en-IN");
    snapCtx.fillStyle = "rgba(15, 23, 42, 0.85)";
    snapCtx.fillRect(0, snapCanvas.height - 28, snapCanvas.width, 28);
    snapCtx.fillStyle = "#ffffff";
    snapCtx.font = "12px 'Plus Jakarta Sans', sans-serif";
    snapCtx.fillText(`MSDE Official Attendance Verification // ${currentCam.id} // ${ts}`, 14, snapCanvas.height - 10);

    const dataUrl = snapCanvas.toDataURL("image/webp", 0.92);
    const link = document.createElement("a");
    link.download = `MSDE_Attendance_Verification_${currentCam.id}_${Date.now()}.webp`;
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
      className={`bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none p-6" : ""
      }`}
    >
      {/* 1. Header Bar: Channel Name & Natural Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <h3 className="font-bold text-sm text-slate-900 tracking-tight">
              {sourceMode === "CHANNELS" && `${currentCam.centre} — ${currentCam.name}`}
              {sourceMode === "WEBCAM" && "Live Laptop Camera (Presence Test)"}
              {sourceMode === "UPLOAD" && `Video Analysis: ${uploadedVideoName || "Active Footage"}`}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {sourceMode === "CHANNELS" && (
              <>
                Qualification Pack: <strong className="text-slate-700">{currentCam.tradeCode}</strong> ({currentCam.tradeName})
              </>
            )}
            {sourceMode === "WEBCAM" && "Testing real-time face privacy blur and attendance presence on your webcam"}
            {sourceMode === "UPLOAD" && "Forensic analysis of uploaded classroom video recording"}
          </p>
        </div>

        {/* Human Source Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs border border-slate-200">
          <button
            onClick={() => {
              playTacticalClick();
              setSourceMode("CHANNELS");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              sourceMode === "CHANNELS" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-blue-600" />
            PMKVY Labs (4)
          </button>

          <button
            onClick={() => {
              playTacticalClick();
              setSourceMode("WEBCAM");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              sourceMode === "WEBCAM" ? "bg-white text-emerald-700 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-emerald-600" />
            Test with Webcam
          </button>

          <button
            onClick={() => {
              playTacticalClick();
              fileInputRef.current?.click();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              sourceMode === "UPLOAD" ? "bg-white text-amber-800 shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-amber-600" />
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

      {/* Error Banner */}
      {webcamError && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            {webcamError}
          </span>
          <button onClick={() => setWebcamError(null)} className="text-amber-700 font-semibold underline ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Main Real-Life Video Container */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-300 shadow-md">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover select-none pointer-events-none"
        />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
        />

        {/* Top Info Strip */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-[11px] text-white font-medium shadow-sm">
              {currentCam.name} • {currentCam.resolution}
            </span>
          </div>

          {showBlur && (
            <span className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-[11px] text-emerald-400 font-medium flex items-center gap-1.5 shadow-sm">
              <Shield className="w-3.5 h-3.5" />
              DPDP Act Face Privacy Active
            </span>
          )}
        </div>

        {/* Alert Banner for Discrepancy */}
        {currentCam.alert && sourceMode === "CHANNELS" && (
          <div className="absolute bottom-14 left-3 right-3 z-20 pointer-events-none">
            <div className="px-3.5 py-2 rounded-lg bg-amber-900/85 backdrop-blur-md border border-amber-500/40 text-xs text-amber-100 flex items-center gap-2 shadow-lg">
              <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="font-medium">{currentCam.alert}</span>
            </div>
          </div>
        )}

        {/* Bottom Clean Video Controls */}
        <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/85 backdrop-blur-md text-xs text-slate-200 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePlay}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <span className="text-xs text-slate-300">
              {sourceMode === "CHANNELS" ? currentCam.centre : sourceMode}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playTacticalClick();
                setShowOverlays((p) => !p);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                showOverlays
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white/10 border-white/20 text-slate-300 hover:text-white"
              }`}
            >
              <Layers className="w-3 h-3 inline mr-1" />
              Boxes
            </button>

            <button
              onClick={() => {
                playTacticalClick();
                setShowBlur((p) => !p);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                showBlur
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white/10 border-white/20 text-slate-300 hover:text-white"
              }`}
            >
              {showBlur ? <EyeOff className="w-3 h-3 inline mr-1" /> : <Eye className="w-3 h-3 inline mr-1" />}
              Privacy Blur
            </button>

            <button
              onClick={handleCaptureSnapshot}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium transition-all"
            >
              Snapshot
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Human Vocational Center Channel Cards */}
      {sourceMode === "CHANNELS" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
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
                    ? "bg-blue-50/80 border-blue-500 shadow-sm"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-blue-700">{c.id}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.alert ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {c.alert ? "Review" : "Normal"}
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-900 truncate">{c.name}</div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">{c.centre}</div>
                <div className="flex justify-between items-center text-[11px] text-slate-600 mt-2 pt-1.5 border-t border-slate-200">
                  <span className="font-medium">{c.tradeCode}</span>
                  <span className="font-semibold text-slate-800">{c.activePersons} present</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
