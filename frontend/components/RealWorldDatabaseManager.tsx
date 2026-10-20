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
  HardDrive,
  Layers,
  Clock,
  AlertTriangle,
  FileCode,
  Users
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

  // Biometric Punch Form State
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("TR-0843");
  const [authMode, setAuthMode] = useState<string>("FINGERPRINT_MINUTIAE");
  const [geofenceStatus, setGeofenceStatus] = useState<string>("VALID_PREMISES");
  const [punchFeedback, setPunchFeedback] = useState<string | null>(null);

  // Candidate Enrollment Form State
  const [newCandId, setNewCandId] = useState<string>(`TR-${Math.floor(1000 + Math.random() * 9000)}`);
  const [newCandName, setNewCandName] = useState<string>("");
  const [newStation, setNewStation] = useState<string>("Station 21");
  const [newEquipment, setNewEquipment] = useState<string>("JUKI DDL-8700 #21");
  const [enrollFeedback, setEnrollFeedback] = useState<string | null>(null);

  // SQL Workbench State
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
        setPunchFeedback(`Punched successfully: Ingress recorded for ${data.candidate_name} at ${data.timestamp}`);
        fetchStats();
        fetchCandidates();
        if (onDatabaseUpdate) onDatabaseUpdate();
      } else {
        setPunchFeedback("Error: Failed to record attendance into database.");
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
        setEnrollFeedback(`Candidate ${newCandName} enrolled successfully into database!`);
        setNewCandName("");
        setNewCandId(`TR-${Math.floor(1000 + Math.random() * 9000)}`);
        fetchStats();
        fetchCandidates();
        if (onDatabaseUpdate) onDatabaseUpdate();
      } else {
        setEnrollFeedback("Error: Failed to enroll candidate into database.");
      }
    } catch (err: any) {
      setEnrollFeedback(`Error: ${err?.message || "Database transaction failure"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Execute Live SQL Query
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

  // Pre-configured government queries
  const presetQueries = [
    {
      title: "Active Trainees & Punches",
      sql: "SELECT c.candidate_id, c.full_name, c.assigned_station, a.punch_timestamp FROM candidates c LEFT JOIN aebas_attendance_logs a ON c.candidate_id = a.candidate_id GROUP BY c.candidate_id LIMIT 10;",
    },
    {
      title: "Empaneled Training Centres",
      sql: "SELECT centre_id, name, scheme, state, sanctioned_seats, status FROM centres;",
    },
    {
      title: "Section 12-A Violations Ledger",
      sql: "SELECT violation_id, centre_id, ghost_candidate_count, penalty_amount_inr, pfms_holding_order_id FROM discrepancy_violations;",
    },
    {
      title: "Recent Vision Headcount Ticks",
      sql: "SELECT inference_id, camera_id, timestamp, claimed_aebas_count, detected_headcount, discrepancy_delta FROM vision_inference_logs ORDER BY inference_id DESC LIMIT 5;",
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
      {/* 1. Database Header & Storage Specs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-700" />
            Central Relational Database (SQLite3 Engine)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Persistent SQL store recording authentic PMKVY centers, Aadhaar biometric attendance, and camera logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playTacticalClick();
              fetchStats();
              fetchCandidates();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>

          <a
            href="/api/database?action=backup"
            download="kaushal_drishti_real_db.db"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download Database File (.db)
          </a>
        </div>
      </div>

      {/* 2. Database Stats Ribbon */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              File Size
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">{stats.database_size_kb} KB</div>
            <div className="text-xs text-slate-500 mt-0.5">Persistent Storage</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Total Tables
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">6 Relational</div>
            <div className="text-xs text-slate-500 mt-0.5">With Foreign Keys</div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-emerald-600" />
              AEBAS Punches
            </div>
            <div className="text-lg font-bold text-emerald-800 mt-1">{stats.tables.aebas_attendance_logs || 0}</div>
            <div className="text-xs text-emerald-700 mt-0.5">Biometric Logs</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              Candidates
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">{stats.tables.candidates || 0} Enrolled</div>
            <div className="text-xs text-slate-500 mt-0.5">Active Center Roster</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Vision Headcounts
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">{stats.tables.vision_inference_logs || 0}</div>
            <div className="text-xs text-slate-500 mt-0.5">CCTV Records</div>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200">
            <div className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Violations
            </div>
            <div className="text-lg font-bold text-rose-800 mt-1">{stats.tables.discrepancy_violations || 0} Notices</div>
            <div className="text-xs text-rose-700 mt-0.5">Section 12-A</div>
          </div>
        </div>
      )}

      {/* 3. Action Mode Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl text-xs w-fit">
        <button
          onClick={() => {
            playTacticalClick();
            setActiveTab("PUNCH_INPUT");
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === "PUNCH_INPUT" ? "bg-white text-slate-900 font-semibold shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Fingerprint className="w-3.5 h-3.5 text-emerald-600" />
          Punch Biometric Attendance
        </button>

        <button
          onClick={() => {
            playTacticalClick();
            setActiveTab("ENROLL_INPUT");
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === "ENROLL_INPUT" ? "bg-white text-slate-900 font-semibold shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <UserPlus className="w-3.5 h-3.5 text-blue-600" />
          Enroll Trainee
        </button>

        <button
          onClick={() => {
            playTacticalClick();
            setActiveTab("SQL_WORKBENCH");
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === "SQL_WORKBENCH" ? "bg-white text-slate-900 font-semibold shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-amber-600" />
          SQL Data Explorer
        </button>
      </div>

      {/* Mode 1: Punch Attendance */}
      {activeTab === "PUNCH_INPUT" && (
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-emerald-600" />
                Live AEBAS Attendance Ingress Punch
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulate a real-time biometric terminal punch. The record is committed to SQLite and reconciles against CCTV headcount immediately.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-700 font-semibold">Select Enrolled Trainee:</label>
              <select
                value={selectedCandidateId}
                onChange={(e) => setSelectedCandidateId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-slate-500 font-medium"
              >
                {candidates.map((c) => (
                  <option key={c.candidate_id} value={c.candidate_id}>
                    {c.full_name} ({c.assigned_station})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 font-semibold">Biometric Modality:</label>
              <select
                value={authMode}
                onChange={(e) => setAuthMode(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-slate-500 font-medium"
              >
                <option value="FINGERPRINT_MINUTIAE">Fingerprint Scanner (UIDAI L0)</option>
                <option value="IRIS_SCAN">Dual Iris Scan (UIDAI L1)</option>
                <option value="FACIAL_AEBAS">Facial Biometric Terminal</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 font-semibold">Premises Geofence Validation:</label>
              <select
                value={geofenceStatus}
                onChange={(e) => setGeofenceStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-slate-500 font-medium"
              >
                <option value="VALID_PREMISES">Valid (Inside Training Center Premises)</option>
                <option value="OFF_CAMPUS_MISMATCH">Off-Campus Location Mismatch</option>
                <option value="GEO_SPOOF_SUSPECTED">Mock Location / Spoof Suspected</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleRecordPunch}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              {isLoading ? "Writing to Database..." : "Record Biometric Punch (SQL INSERT)"}
            </button>

            {punchFeedback && (
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                {punchFeedback}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Candidate Enrollment */}
      {activeTab === "ENROLL_INPUT" && (
        <form onSubmit={handleEnrollCandidate} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-700" />
                Enroll New Trainee to Batch
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Adds a new trainee to the center with assigned workstation and equipment rig.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-700 font-semibold">Trainee ID:</label>
              <input
                type="text"
                value={newCandId}
                onChange={(e) => setNewCandId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 font-semibold">Full Name:</label>
              <input
                type="text"
                placeholder="e.g. Neha Kumari"
                value={newCandName}
                onChange={(e) => setNewCandName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 font-semibold">Assigned Station:</label>
              <input
                type="text"
                value={newStation}
                onChange={(e) => setNewStation(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 font-semibold">Equipment Rig:</label>
              <input
                type="text"
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              {isLoading ? "Enrolling..." : "Enroll Trainee (SQL INSERT)"}
            </button>

            {enrollFeedback && (
              <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                {enrollFeedback}
              </span>
            )}
          </div>
        </form>
      )}

      {/* Mode 3: SQL Explorer */}
      {activeTab === "SQL_WORKBENCH" && (
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-700" />
                Live SQL Data Explorer
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Run SQL queries directly against the database file to inspect real attendance records.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-700">Quick Audit Queries:</div>
            <div className="flex flex-wrap gap-2">
              {presetQueries.map((pq, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCustomSql(pq.sql);
                    handleRunSql(pq.sql);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 hover:bg-slate-100 font-medium shadow-sm transition-colors"
                >
                  {pq.title}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="relative">
              <textarea
                value={customSql}
                onChange={(e) => setCustomSql(e.target.value)}
                rows={3}
                className="w-full p-3 font-mono text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-slate-500"
              />
              <button
                onClick={() => handleRunSql()}
                disabled={isQueryRunning}
                className="absolute right-3 bottom-3 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
              >
                {isQueryRunning ? "Running..." : "Run Query"}
              </button>
            </div>
          </div>

          {/* Results Table */}
          {queryResult && (
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-blue-700" />
                  Query Results
                </span>
                {queryResult.execution_time_ms !== undefined && (
                  <span className="text-xs text-slate-500">
                    {queryResult.execution_time_ms} ms • {queryResult.row_count} rows
                  </span>
                )}
              </div>

              {queryResult.status === "ERROR" ? (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-mono">
                  {queryResult.message}
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="max-h-56 overflow-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                        <tr>
                          {queryResult.columns?.map((col, idx) => (
                            <th key={idx} className="p-2.5 font-bold text-slate-800">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {queryResult.rows?.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50">
                            {row.map((val, cIdx) => (
                              <td key={cIdx} className="p-2.5 text-slate-700 whitespace-nowrap">
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
