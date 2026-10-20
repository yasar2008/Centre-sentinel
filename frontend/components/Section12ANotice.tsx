"use client";

import React, { useState } from "react";
import {
  Gavel,
  Send,
  Lock,
  FileText,
  Printer,
  CheckCircle2,
  X,
  ShieldAlert,
  Download
} from "lucide-react";
import { playTacticalClick, playNoticeFreezeSound, playAlertChime } from "./SoundFx";

interface Section12ANoticeProps {
  frozenAmount: number;
  centreId: string;
  centreName: string;
  ghostCount: number;
  ociScore: number;
  isFrozen: boolean;
  onToggleFreeze: () => void;
}

export const Section12ANotice: React.FC<Section12ANoticeProps> = ({
  frozenAmount,
  centreId,
  centreName,
  ghostCount,
  ociScore,
  isFrozen,
  onToggleFreeze,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [noticeDispatched, setNoticeDispatched] = useState<boolean>(false);

  const phantomFine = ghostCount * 14000;
  const ociPenalty = ociScore < 80 ? 50000 : 0;
  const statutorySurcharge = 50000;
  const calculatedTotal = phantomFine + ociPenalty + statutorySurcharge;

  const handleDispatchNotice = () => {
    playNoticeFreezeSound();
    setNoticeDispatched(true);
    setModalOpen(true);
  };

  const handlePrint = () => {
    playTacticalClick();
    window.print();
  };

  return (
    <>
      <div className="bg-surface-container-low border border-error/60 p-3 hud-bracket hud-bracket-error relative">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start border-b border-outline-variant pb-2 mb-2 gap-2">
          <div>
            <div className="font-bold text-sm text-error uppercase flex items-center gap-1.5">
              <span className="material-symbols-outlined text-error text-[18px]">gavel</span>
              Section 12-A Statutory Withholding
            </div>
            <div className="font-mono text-[10px] text-on-surface-variant">
              Public Finance Management System (PFMS) Direct Benefit Transfer Freeze Engine
            </div>
          </div>
          <span
            className={`px-2 py-0.5 border font-mono text-[9px] font-bold ${
              isFrozen
                ? "bg-red-950/80 border-red-500 text-red-300 animate-pulse"
                : "bg-error-container/40 border-error text-error"
            }`}
          >
            {isFrozen ? "GRANT TRANCHE FROZEN" : "ENFORCEMENT READY"}
          </span>
        </div>

        {/* Calculation Breakdown */}
        <div className="space-y-1.5 text-[11px] mb-3">
          <div className="flex justify-between items-center font-mono border-b border-outline-variant/40 pb-1">
            <span className="text-on-surface-variant">
              Phantom Trainee Headcount ({ghostCount} × ₹14,000/Tranche):
            </span>
            <span className="text-on-surface font-semibold">₹{phantomFine.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between items-center font-mono border-b border-outline-variant/40 pb-1">
            <span className="text-on-surface-variant">
              Sub-threshold OCI Penalty (Util {ociScore.toFixed(1)}% &lt; 80%):
            </span>
            <span className="text-on-surface font-semibold">₹{ociPenalty.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between items-center font-mono border-b border-outline-variant/40 pb-1">
            <span className="text-on-surface-variant">
              Statutory Non-compliance Surcharge (Rule 12-A):
            </span>
            <span className="text-on-surface font-semibold">₹{statutorySurcharge.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between items-center font-mono text-base text-error font-bold pt-1">
            <span>TOTAL WITHHELD TRANCHE:</span>
            <span>₹{calculatedTotal.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="space-y-2">
          <button
            onClick={handleDispatchNotice}
            className="w-full py-2 bg-error-container/30 border border-error hover:bg-error-container/50 text-error font-mono text-[11px] uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{noticeDispatched ? "Re-Inspect Notice (Rule 12-A)" : "Dispatch Show-Cause Notice (Rule 12-A)"}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                playNoticeFreezeSound();
                onToggleFreeze();
              }}
              className={`py-1.5 px-2 font-mono text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 border transition-all ${
                isFrozen
                  ? "bg-red-950 border-red-500 text-red-300 font-bold"
                  : "bg-surface-container border-outline-variant hover:border-primary text-on-surface"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isFrozen ? "Unfreeze PFMS DBT" : "Freeze PFMS DBT"}</span>
            </button>

            <button
              onClick={() => {
                playTacticalClick();
                setModalOpen(true);
              }}
              className="py-1.5 px-2 bg-surface-container border border-outline-variant hover:border-tertiary text-on-surface font-mono text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Government Statutory Notice Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0b101c] border-2 border-red-500/80 max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto hud-bracket hud-bracket-error text-slate-100 shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-outline-variant">
              <div>
                <div className="text-red-400 font-mono text-[10px] tracking-widest font-bold uppercase">
                  GOVERNMENT OF INDIA // STATUTORY ENFORCEMENT ORDER
                </div>
                <h2 className="text-xl font-bold font-sans tracking-tight text-white mt-1">
                  Section 12-A Grant Withholding & Show-Cause Notice
                </h2>
                <p className="font-mono text-xs text-slate-400">
                  Ref No: MSDE/SMU/26245/2026/SEC12A-0492 • Date: {new Date().toLocaleDateString("en-IN")}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Body */}
            <div className="my-5 space-y-4 text-xs font-mono leading-relaxed bg-[#060912] p-4 border border-slate-800">
              <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-200">
                <strong>FORMAL DIRECTIVE:</strong> Immediate withholding of Training Provider Grant Tranche #2
                under Rule 12-A of the National Skill Development Guidelines (2023 Amendment) following
                continuous edge AI optical sensor audit.
              </div>

              <div>
                <strong>TO:</strong> Center Director, {centreName} ({centreId})<br />
                <strong>JURISDICTION:</strong> Scheme Monitoring Unit (SMU), Ministry of Skill Development & Entrepreneurship<br />
                <strong>ALGORITHMIC AUDIT ID:</strong> KAUSHAL-DRISHTI-SHA256-8F7E29
              </div>

              <div className="border-t border-slate-800 pt-3">
                <p className="font-sans text-sm text-slate-200 font-semibold mb-1">
                  FINDINGS OF NON-COMPLIANCE:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li>
                    <strong>Ghost Trainee Discrepancy:</strong> Biometric AEBAS claim logged <strong>28 candidates</strong>,
                    whereas continuous YOLOv8 INT8 edge video detection registered only <strong>22 physically active persons</strong>.
                    Variance: <strong>-6 candidates (-21.4%)</strong>, breaching the statutory 15% allowance.
                  </li>
                  <li>
                    <strong>Operability Compliance Index (OCI):</strong> Machine hands-on utilization measured at <strong>{ociScore.toFixed(1)}%</strong>,
                    falling below the statutory minimum threshold of <strong>80.0%</strong> required for direct benefit transfer release.
                  </li>
                  <li>
                    <strong>Privacy Verification:</strong> All candidate telemetry was ingested with dynamic Gaussian face-blurring ($k=51 \times 51$)
                    in full compliance with the Digital Personal Data Protection (DPDP) Act 2023.
                  </li>
                </ul>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <p className="font-sans text-sm text-slate-200 font-semibold mb-2">
                  FINANCIAL PENALTY & WITHHOLDING TABULATION:
                </p>
                <table className="w-full text-left border border-slate-700">
                  <thead className="bg-slate-900 text-slate-400">
                    <tr>
                      <th className="p-2 border border-slate-700">Clause</th>
                      <th className="p-2 border border-slate-700">Infraction Item</th>
                      <th className="p-2 border border-slate-700 text-right">Withheld Sum</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-slate-700">Sec 12-A(1)</td>
                      <td className="p-2 border border-slate-700">6 Phantom Trainees @ ₹14,000/head</td>
                      <td className="p-2 border border-slate-700 text-right">₹{phantomFine.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-slate-700">Sec 12-A(2)</td>
                      <td className="p-2 border border-slate-700">Sub-threshold Machinery Util (OCI {ociScore.toFixed(1)}% &lt; 80%)</td>
                      <td className="p-2 border border-slate-700 text-right">₹{ociPenalty.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-slate-700">Sec 12-A(4)</td>
                      <td className="p-2 border border-slate-700">Statutory Non-compliance Surcharge</td>
                      <td className="p-2 border border-slate-700 text-right">₹{statutorySurcharge.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr className="bg-red-950/60 font-bold text-red-300">
                      <td colSpan={2} className="p-2 border border-slate-700 text-right">
                        TOTAL RECOVERABLE WITHHOLDING:
                      </td>
                      <td className="p-2 border border-slate-700 text-right text-base">
                        ₹{calculatedTotal.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-400">
                You are hereby commanded to submit a formal written explanation with physical attendance registers
                within <strong>7 working days</strong>, failing which de-empanelment and blacklisting proceedings shall commence.
              </div>

              <div className="pt-4 flex justify-between items-end border-t border-slate-800 text-[10px]">
                <div>
                  <div className="font-bold text-slate-300">DIGITALLY SIGNED VIA e-GOV RAILS</div>
                  <div className="text-slate-500">Cert Hash: 0x9f4c3b2e1a7894d...</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-300">MISSION DIRECTOR (AUDIT)</div>
                  <div className="text-slate-500">Ministry of Skill Development & Entrepreneurship</div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 border border-primary bg-primary/10 hover:bg-primary/20 text-primary font-mono text-xs font-bold flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print / Save PDF
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs"
              >
                Dismiss Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
