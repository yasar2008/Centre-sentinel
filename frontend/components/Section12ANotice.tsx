"use client";

import React, { useState } from "react";
import {
  Gavel,
  Send,
  Lock,
  Unlock,
  FileText,
  Printer,
  X,
  ShieldCheck,
  Building
} from "lucide-react";
import { playTacticalClick, playNoticeFreezeSound } from "./SoundFx";

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
      <div className="luxury-card p-5 space-y-4 bg-gradient-to-b from-rose-500/[0.03] to-transparent">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="font-semibold text-sm text-white tracking-tight flex items-center gap-2">
              <Gavel className="w-4 h-4 text-rose-400 stroke-[1.5]" />
              Section 12-A Statutory Withholding
            </h3>
            <p className="text-xs text-slate-400 font-normal">
              Automated PFMS Direct Benefit Transfer subsidy freeze engine
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              isFrozen
                ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                : "bg-white/[0.03] border-white/[0.08] text-slate-300"
            }`}
          >
            {isFrozen ? "Grant Tranche Frozen" : "Enforcement Ready"}
          </span>
        </div>

        {/* Calculation Breakdown */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-400 pb-1.5 border-b border-white/[0.04]">
            <span>Phantom Trainee Headcount ({ghostCount} × ₹14,000/head):</span>
            <span className="text-white font-medium">₹{phantomFine.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between items-center text-slate-400 pb-1.5 border-b border-white/[0.04]">
            <span>Sub-80% Machinery Utilization Penalty:</span>
            <span className="text-white font-medium">₹{ociPenalty.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between items-center text-slate-400 pb-1.5 border-b border-white/[0.04]">
            <span>Rule 12-A Administrative Non-Compliance Surcharge:</span>
            <span className="text-white font-medium">₹{statutorySurcharge.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between items-center pt-1 text-sm font-semibold">
            <span className="text-slate-200">Total Recoverable Withholding:</span>
            <span className="text-rose-400 text-base">₹{calculatedTotal.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={handleDispatchNotice}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{noticeDispatched ? "Re-Inspect Notice Dossier" : "Dispatch Show-Cause Notice (Rule 12-A)"}</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                playNoticeFreezeSound();
                onToggleFreeze();
              }}
              className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
                isFrozen
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                  : "bg-white/[0.02] border-white/[0.08] text-slate-300 hover:bg-white/[0.05]"
              }`}
            >
              {isFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{isFrozen ? "Unfreeze PFMS" : "Freeze PFMS"}</span>
            </button>

            <button
              onClick={() => {
                playTacticalClick();
                setModalOpen(true);
              }}
              className="py-2 px-3 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Government Statutory Notice Modal - Luxury Executive Styling */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0b101c] border border-white/[0.1] rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl text-slate-200 space-y-5">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-medium tracking-wider uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  Government of India • Ministry Order
                </span>
                <h2 className="text-lg font-semibold text-white tracking-tight mt-1.5">
                  Section 12-A Grant Withholding Order
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Ref: MSDE/SMU/26245/SEC12A-0492 • {new Date().toLocaleDateString("en-IN")}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Content */}
            <div className="space-y-4 text-xs leading-relaxed p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="p-3 rounded-lg bg-rose-500/[0.08] border border-rose-500/20 text-rose-200 text-xs font-medium">
                NOTICE DIRECTIVE: Immediate withholding of Training Provider Grant Tranche #2
                under Rule 12-A of the National Skill Development Guidelines (2023 Amendment) following
                continuous edge AI optical sensor audit.
              </div>

              <div className="text-slate-300 space-y-1">
                <div><strong>Target Facility:</strong> {centreName} ({centreId})</div>
                <div><strong>Monitoring Directorate:</strong> Scheme Monitoring Unit (SMU), MSDE</div>
                <div><strong>Cryptographic Hash:</strong> SHA256:8F7E29..D8A9F4</div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <div className="font-semibold text-white">Summary of Infractions:</div>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li>
                    <strong>Ghost Trainee Discrepancy:</strong> 28 candidates claimed on AEBAS biometric portal;
                    only 22 physically present under YOLOv8 verification (-6 phantoms, -21.4% delta).
                  </li>
                  <li>
                    <strong>Sub-Standard Machine Operability:</strong> Equipment utilization measured at {ociScore.toFixed(1)}%,
                    falling below the statutory minimum of 80.0% required for DBT disbursement.
                  </li>
                  <li>
                    <strong>Privacy Compliance:</strong> All telemetry ingested with dynamic Gaussian face-blurring ($k=51 \times 51$)
                    in full adherence to the Digital Personal Data Protection (DPDP) Act 2023.
                  </li>
                </ul>
              </div>

              {/* Penalty Table */}
              <div className="pt-2 border-t border-white/[0.06]">
                <table className="w-full text-left border border-white/[0.06] rounded-lg overflow-hidden">
                  <thead className="bg-white/[0.03] text-slate-400 text-[11px]">
                    <tr>
                      <th className="p-2">Statutory Clause</th>
                      <th className="p-2">Infraction Item</th>
                      <th className="p-2 text-right">Withheld Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    <tr>
                      <td className="p-2">Sec 12-A(1)</td>
                      <td className="p-2">6 Ghost Trainees @ ₹14,000/head</td>
                      <td className="p-2 text-right text-white font-medium">₹{phantomFine.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr>
                      <td className="p-2">Sec 12-A(2)</td>
                      <td className="p-2">Sub-80% Machinery Operability</td>
                      <td className="p-2 text-right text-white font-medium">₹{ociPenalty.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr>
                      <td className="p-2">Sec 12-A(4)</td>
                      <td className="p-2">Administrative Surcharge</td>
                      <td className="p-2 text-right text-white font-medium">₹{statutorySurcharge.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr className="bg-white/[0.04] font-semibold text-white">
                      <td colSpan={2} className="p-2 text-right">Total Grant Withholding:</td>
                      <td className="p-2 text-right text-rose-400 font-bold">₹{calculatedTotal.toLocaleString("en-IN")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.08] text-white text-xs font-medium flex items-center gap-2 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Official Order
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/[0.1] hover:bg-white/[0.15] text-white text-xs font-medium transition-all"
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
