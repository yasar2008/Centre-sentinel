"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Database,
  Terminal,
  Fingerprint,
  UserPlus,
  Play,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Layers,
  HardDrive,
  Cpu,
  Clock
} from "lucide-react";
import { playTacticalClick, playAlertChime } from "./SoundFx";

interface DbStats {
  status: string;
  database_type: string;
  database_path: string;
  database_size_kb: number;
  tables: Record<string, number>;
  total_records: number;
}

interface CandidateItem {
  candidate_id: string;
  full_name: string;
  aadhaar_vid_masked: string;
  assigned_station: string;
  assigned_equipment: string;
  trade_code: string;
  trade_name: string;
  latest_aebas_punch: string;
  auth_mode: string;
  geofence_status: string;
  audit_status: string;
  forensic_note: string;
}

interface QueryResult {
  status: string;
  query?: string;
  execution_time_ms?: number;
  columns?: string[];
  rows?: string[][];
  row_count?: number;
  message?: string;
}

interface RealWorldDatabaseManagerProps {
  onDatabaseUpdate?: () => void;
}

export const RealWorldDatabaseManager: React.FC<RealWorldDatabaseManagerProps> = ({
  onDatabaseUpdate,
}) => {
  const [stats, setStats] = useState<DbStats | null>(null);
  const [candidates, setCandidates] = useState<CandidateItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"PUNCH_INPUT" | "ENROLL_INPUT" | "SQL_WORKBENCH">("PUNCH_INPUT");

  // Biometric Punch Form State (Real Input 1)
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("TR-0843");
  const [authMode, setAuthMode] = useState<string>("FINGERPRINT_MINUTIAE");
  const [geofenceStatus, setGeofenceStatus] = useState<string>("VALID_PREMISES");
  const [punchFeedback, setPunchFeedback] = useState<string | null>(null);

  // Candidate Enrollment Form State (Real Input 2)
  const [newCandId, setNewCandId] = useState<string>(`TR-${Math.floor(1000 + Math.random() * 9000)}`);
  const [newCandName, setNewCandName] = useState<string>("");
  const [newStation, setNewStation] = useState<string>("Station 21");
  const [newEquipment, setNewEquipment] = useState<string>("JUKI DDL-8700 #21");
  const [enrollFeedback, setEnrollFeedback] = useState<string | null>(null);

  // SQL Workbench State (Real Input 3 & Output)
  const [customSql, setCustomSql] = useState<string>(
    "SELECT candidate_id, full_name, assigned_station, status FROM candidates LIMIT 8;"
  );
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isQueryRunning, setIsQueryRunning] = useState<boolean>(false);

  // Fetch Database Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/database?action=stats", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (_err) {
      // Ignored
    }
  }, []);

  // Fetch Candidates from SQLite
  const fetchCandidates = useCallback(async () => {
    try {
      const res = await fetch("/api/database?action=candidates", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCandidates(data);
          if (data.length > 0 && !selectedCandidateId) {
            setSelectedCandidateId(data[0].candidate_id);
          }
        }
      }
    } catch (_err) {
      // Ignored
    }
  }, [selectedCandidateId]);

  useEffect(() => {
    fetchStats();
    fetchCandidates();
  }, [fetchStats, fetchCandidates]);

  // Execute Real Biometric Attendance Punch (SQL INSERT)
  const handleRecordPunch = async () => {
    playTacticalClick();
    setIsLoading(true);
    setPunchFeedback(null);

    try {
      const res = await fetch("/api/database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "punch",
          candidate_id: selectedCandidateId,
          batch_id: "BATCH-VNS-2026-01",
          auth_mode: authMode,
          terminal_device_id: "UIDAI-LIVE-TERM-01",
          geofence_status: geofenceStatus,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        playAlertChime();
        setPunchFeedback(`Success: Logged AEBAS biometric punch #${data.punch_id} for ${data.candidate_name} at ${data.timestamp}`);
        fetchStats();
        fetchCandidates();
        if (onDatabaseUpdate) onDatabaseUpdate();
      } else {
        setPunchFeedback("Error: Failed to record punch into database.");
      }
    } catch (err: any) {
      setPunchFeedback(`Error: ${err?.message || "Failed to communicate with DB"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Execute Candidate Enrollment (SQL INSERT)
  const handleEnrollCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandName.trim()) return;

    playTacticalClick();
    setIsLoading(true);
    setEnrollFeedback(null);

    try {
      const res = await fetch("/api/database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "enroll",
          candidate_id: newCandId,
          batch_id: "BATCH-VNS-2026-01",
          full_name: newCandName,
          aadhaar_vid_masked: `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`,
          assigned_station: newStation,
          assigned_equipment: newEquipment,
          gender: "M",
        }),
      });

      if (res.ok) {
        playAlertChime();
        setEnrollFeedback(`Candidate ${newCandName} enrolled successfully into SQLite!`);
        setNewCandName("");
        setNewCandId(`TR-${Math.floor(1000 + Math.random() * 9000)}`);
        fetchStats();
        fetchCandidates();
        if (onDatabaseUpdate) onDatabaseUpdate();
      } else {
        setEnrollFeedback("Error: Failed to enroll candidate into database.");
      }
    } catch (err: any) {
      setEnrollFeedback(`Error: ${err?.message || "DB transaction failure"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Execute Live SQL Query (Real Input & Output)
  const handleRunSql = async (queryToRun?: string) => {
    const q = queryToRun || customSql;
    playTacticalClick();
    setIsQueryRunning(true);

    try {
      const res = await fetch("/api/database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "query",
          query: q,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setQueryResult(data);
      } else {
        const err = await res.json().catch(() => ({}));
        setQueryResult({
          status: "ERROR",
          message: err?.message || "SQL execution error",
        });
      }
    } catch (err: any) {
      setQueryResult({
        status: "ERROR",
        message: err?.message || "Failed to execute SQL query",
      });
    } finally {
      setIsQueryRunning(false);
    }
  };

  // Pre-configured 1-click government queries
  const presetQueries = [
    {
      title: "Active Trainees & Biometric Punches",
      sql: "SELECT c.candidate_id, c.full_name, c.assigned_station, a.punch_timestamp, a.auth_mode FROM candidates c LEFT JOIN aebas_attendance_logs a ON c.candidate_id = a.candidate_id GROUP BY c.candidate_id LIMIT 10;",
    },
    {
      title: "All Empaneled PMKK Training Centres",
      sql: "SELECT centre_id, name, scheme, state, sanctioned_seats, status FROM centres;",
    },
    {
      title: "Section 12-A Violations & Penalty Ledger",
      sql: "SELECT violation_id, centre_id, ghost_candidate_count, penalty_amount_inr, notice_status, pfms_holding_order_id FROM discrepancy_violations;",
    },
    {
      title: "Recent Computer Vision Telemetry Ticks",
      sql: "SELECT inference_id, camera_id, timestamp, claimed_aebas_count, detected_headcount, discrepancy_delta, discrepancy_severity FROM vision_inference_logs ORDER BY inference_id DESC LIMIT 5;",
    },
  ];

  return (
    <div className="luxury-card p-6 space-y-6">
      {/* 1. Database Header & Storage Specs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-sky-400 stroke-[1.5]" />
            Real-World Relational Database Engine (SQLite3)
          </h2>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            ACID-compliant persistent SQL store managing real PMKVY 4.0 centers, AEBAS biometric logs, and vision telemetry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playTacticalClick();
              fetchStats();
              fetchCandidates();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-slate-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh DB
          </button>

          <a
            href="/api/database?action=backup"
            download="kaushal_drishti_real_db.db"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-xs font-medium text-sky-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export SQLite (.db)
          </a>
        </div>
      </div>

      {/* 2. Database Stats Ribbon */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              File Size
            </div>
            <div className="text-lg font-semibold text-white mt-1">{stats.database_size_kb} KB</div>
            <div className="text-[10px] text-slate-500 mt-0.5">WAL Write-Ahead</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              Total Tables
            </div>
            <div className="text-lg font-semibold text-white mt-1">6 Relational</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Strict Foreign Keys</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
              AEBAS Punches
            </div>
            <div className="text-lg font-semibold text-emerald-400 mt-1">{stats.tables.aebas_attendance_logs || 0}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Biometric Events</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              Candidates
            </div>
            <div className="text-lg font-semibold text-white mt-1">{stats.tables.candidates || 0} Enrolled</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Varanasi Center</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Vision Logs
            </div>
            <div className="text-lg font-semibold text-white mt-1">{stats.tables.vision_inference_logs || 0}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Telemetry Ticks</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              Violations
            </div>
            <div className="text-lg font-semibold text-rose-400 mt-1">{stats.tables.discrepancy_violations || 0} Active</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Section 12-A</div>
          </div>
        </div>
      )}

      {/* 3. Real Input Mode Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white/[0.02] border border-white/[0.06] rounded-full text-xs w-fit">
        <button
          onClick={() => {
            playTacticalClick();
            setActiveTab("PUNCH_INPUT");
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium transition-all ${
            activeTab === "PUNCH_INPUT" ? "bg-white/[0.1] text-white shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
          Real Input: Punch Biometric Attendance
        </button>

        <button
          onClick={() => {
            playTacticalClick();
            setActiveTab("ENROLL_INPUT");
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium transition-all ${
            activeTab === "ENROLL_INPUT" ? "bg-white/[0.1] text-white shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          <UserPlus className="w-3.5 h-3.5 text-sky-400" />
          Real Input: Enroll Trainee
        </button>

        <button
          onClick={() => {
            playTacticalClick();
            setActiveTab("SQL_WORKBENCH");
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium transition-all ${
            activeTab === "SQL_WORKBENCH" ? "bg-white/[0.1] text-amber-300 shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-amber-400" />
          Real Input/Output: Live SQL Workbench
        </button>
      </div>

      {/* ==================================================================== */}
      {/* REAL INPUT 1: AEBAS Biometric Punch Terminal                         */}
      {/* ==================================================================== */}
      {activeTab === "PUNCH_INPUT" && (
        <div className="p-5 rounded-2xl bg-white/[0.015] border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.04]">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-emerald-400" />
                Live AEBAS Biometric Attendance Terminal Ingress
              </h3>
              <p className="text-xs text-slate-400">
                Trigger a genuine UIDAI-compliant biometric punch event directly into the SQLite database.
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              Terminal: UIDAI-LIVE-TERM-01
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Candidate Selector */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Select Enrolled Candidate:</label>
              <select
                value={selectedCandidateId}
                onChange={(e) => setSelectedCandidateId(e.target.value)}
                className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-white/20"
              >
                {candidates.map((c) => (
                  <option key={c.candidate_id} value={c.candidate_id} className="bg-slate-900 text-white">
                    {c.candidate_id} — {c.full_name} ({c.assigned_station})
                  </option>
                ))}
              </select>
            </div>

            {/* Auth Mode */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Biometric Auth Modality:</label>
              <select
                value={authMode}
                onChange={(e) => setAuthMode(e.target.value)}
                className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-white/20"
              >
                <option value="FINGERPRINT_MINUTIAE" className="bg-slate-900 text-white">Fingerprint Minutiae (UIDAI L0)</option>
                <option value="IRIS_SCAN" className="bg-slate-900 text-white">Dual Iris Scan (UIDAI L1)</option>
                <option value="FACIAL_AEBAS" className="bg-slate-900 text-white">Facial AEBAS (Contactless)</option>
              </select>
            </div>

            {/* Geofence Status */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Premises Geofence Check:</label>
              <select
                value={geofenceStatus}
                onChange={(e) => setGeofenceStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-white/20"
              >
                <option value="VALID_PREMISES" className="bg-slate-900 text-white">Valid (Within 10m Center Perimeter)</option>
                <option value="OFF_CAMPUS_MISMATCH" className="bg-slate-900 text-white">Off-Campus Mismatch (&gt;50m Away)</option>
                <option value="GEO_SPOOF_SUSPECTED" className="bg-slate-900 text-white">Geo-Spoofing Suspected (Mock Location)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleRecordPunch}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <Fingerprint className="w-4 h-4" />
              {isLoading ? "Writing to SQLite..." : "Record Biometric Ingress (SQL INSERT)"}
            </button>

            {punchFeedback && (
              <span className={`text-xs font-medium px-3 py-1 rounded-lg ${
                punchFeedback.startsWith("Success")
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-300 border border-rose-500/20"
              }`}>
                {punchFeedback}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* REAL INPUT 2: Candidate Enrollment Form                              */}
      {/* ==================================================================== */}
      {activeTab === "ENROLL_INPUT" && (
        <form onSubmit={handleEnrollCandidate} className="p-5 rounded-2xl bg-white/[0.015] border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.04]">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-sky-400" />
                Enroll New Trainee into Persistent Database
              </h3>
              <p className="text-xs text-slate-400">
                Adds a new candidate record to <code className="text-slate-300 font-mono">candidates</code> table under Batch BATCH-VNS-2026-01.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Candidate ID:</label>
              <input
                type="text"
                value={newCandId}
                onChange={(e) => setNewCandId(e.target.value)}
                className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white font-mono focus:outline-none focus:border-white/20"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Full Name:</label>
              <input
                type="text"
                placeholder="e.g. Neha Kumari"
                value={newCandName}
                onChange={(e) => setNewCandName(e.target.value)}
                className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-white/20"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Assigned Workbench:</label>
              <input
                type="text"
                value={newStation}
                onChange={(e) => setNewStation(e.target.value)}
                className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-white/20"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Assigned Machine / Rig:</label>
              <input
                type="text"
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-white/20"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-500 text-black font-semibold text-xs hover:bg-sky-400 active:scale-95 transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              {isLoading ? "Writing to SQLite..." : "Enroll Trainee (SQL INSERT)"}
            </button>

            {enrollFeedback && (
              <span className={`text-xs font-medium px-3 py-1 rounded-lg ${
                enrollFeedback.startsWith("Candidate")
                  ? "bg-sky-500/10 text-sky-300 border border-sky-500/20"
                  : "bg-rose-500/10 text-rose-300 border border-rose-500/20"
              }`}>
                {enrollFeedback}
              </span>
            )}
          </div>
        </form>
      )}

      {/* ==================================================================== */}
      {/* REAL INPUT & OUTPUT 3: Live SQL Workbench                            */}
      {/* ==================================================================== */}
      {activeTab === "SQL_WORKBENCH" && (
        <div className="p-5 rounded-2xl bg-white/[0.015] border border-white/[0.06] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.04]">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                Live SQL Query Workbench (Direct SQLite Execution)
              </h3>
              <p className="text-xs text-slate-400">
                Execute real SQL queries against <code className="text-slate-300 font-mono">kaushal_drishti.db</code> and inspect raw tabular outputs.
              </p>
            </div>
            <span className="text-[10px] font-mono text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              Read-Only Sandboxed Runner
            </span>
          </div>

          {/* Quick Preset Queries */}
          <div className="space-y-1.5">
            <div className="text-[11px] text-slate-400 font-medium">Quick 1-Click Government Audit Queries:</div>
            <div className="flex flex-wrap gap-2">
              {presetQueries.map((pq, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCustomSql(pq.sql);
                    handleRunSql(pq.sql);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-[11px] text-slate-300 transition-colors"
                >
                  {pq.title}
                </button>
              ))}
            </div>
          </div>

          {/* SQL Input Textarea (Real Input) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span>SQL Query:</span>
              <span className="font-mono text-slate-500">Ctrl + Enter to run</span>
            </div>
            <div className="relative">
              <textarea
                value={customSql}
                onChange={(e) => setCustomSql(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    handleRunSql();
                  }
                }}
                rows={3}
                className="w-full p-3 font-mono text-xs bg-[#05080f] border border-white/[0.1] rounded-xl text-sky-300 placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50"
              />
              <button
                onClick={() => handleRunSql()}
                disabled={isQueryRunning}
                className="absolute right-3 bottom-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-black font-semibold text-xs hover:bg-amber-400 active:scale-95 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                {isQueryRunning ? "Running..." : "Execute SQL"}
              </button>
            </div>
          </div>

          {/* Real Query Output Results Table */}
          {queryResult && (
            <div className="space-y-2 pt-2 border-t border-white/[0.04]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-sky-400" />
                  Query Output Results
                </span>
                {queryResult.execution_time_ms !== undefined && (
                  <span className="font-mono text-[10px] text-slate-500">
                    Executed in {queryResult.execution_time_ms} ms • {queryResult.row_count} rows returned
                  </span>
                )}
              </div>

              {queryResult.status === "ERROR" ? (
                <div className="p-3 rounded-xl bg-rose-500/[0.08] border border-rose-500/20 text-xs text-rose-300 font-mono">
                  {queryResult.message}
                </div>
              ) : (
                <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-[#05080f]">
                  <div className="max-h-56 overflow-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-white/[0.04] text-slate-300 border-b border-white/[0.06]">
                        <tr>
                          {queryResult.columns?.map((col, idx) => (
                            <th key={idx} className="p-2.5 font-semibold text-[11px] text-sky-400">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {queryResult.rows?.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-white/[0.02]">
                            {row.map((val, cIdx) => (
                              <td key={cIdx} className="p-2.5 text-slate-300 text-[11px] whitespace-nowrap">
                                {val}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
