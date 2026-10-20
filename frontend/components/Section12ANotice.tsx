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
      <div className="bg-white border border-rose-200 rounded-xl p-5 space-y-4 shadow-sm">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-rose-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900 tracking-tight flex items-center gap-2">
              <Gavel className="w-4 h-4 text-rose-600" />
              Section 12-A Statutory Withholding
            </h3>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              PFMS Direct Benefit Transfer subsidy compliance &amp; holding orders
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              isFrozen
                ? "bg-rose-100 border-rose-300 text-rose-800"
                : "bg-slate-100 border-slate-200 text-slate-700"
            }`}
          >
            {isFrozen ? "Grant Tranche Frozen" : "Compliance In Review"}
          </span>
        </div>

        {/* Calculation Breakdown */}
        <div className="space-y-2.5 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center text-slate-600 pb-1.5 border-b border-slate-200/60">
            <span>Ghost Trainee Discrepancy ({ghostCount} × ₹14,000/head):</span>
            <span className="text-slate-900 font-bold">₹{phantomFine.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between items-center text-slate-600 pb-1.5 border-b border-slate-200/60">
            <span>Sub-80% Machinery Operability Gap:</span>
            <span className="text-slate-900 font-bold">₹{ociPenalty.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between items-center text-slate-600 pb-1.5 border-b border-slate-200/60">
            <span>Statutory Administrative Surcharge:</span>
            <span className="text-slate-900 font-bold">₹{statutorySurcharge.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between items-center pt-1 text-sm font-semibold">
            <span className="text-slate-800">Total Recoverable Withholding:</span>
            <span className="text-rose-700 text-base font-bold">₹{calculatedTotal.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={handleDispatchNotice}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{noticeDispatched ? "Re-Inspect Notice Dossier" : "Issue Show-Cause Notice (Rule 12-A)"}</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                playNoticeFreezeSound();
                onToggleFreeze();
              }}
              className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
                isFrozen
                  ? "bg-rose-50 border-rose-300 text-rose-800 font-semibold"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {isFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{isFrozen ? "Resume Grant" : "Hold Grant"}</span>
            </button>

            <button
              onClick={() => {
                playTacticalClick();
                setModalOpen(true);
              }}
              className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center justify-center gap-2 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Official Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Government Statutory Notice Modal - Clean Institutional White Styling */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl text-slate-800 space-y-5">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Government of India • Ministry Order
                </span>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-1.5">
                  Section 12-A Grant Withholding Order
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ref: MSDE/SMU/26245/SEC12A-0492 • Date: {new Date().toLocaleDateString("en-IN")}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Content */}
            <div className="space-y-4 text-xs leading-relaxed p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium leading-relaxed">
                <strong>NOTICE DIRECTIVE:</strong> Immediate withholding of Training Provider Grant Tranche #2
                under Rule 12-A of the National Skill Development Guidelines (2023 Amendment) following
                continuous edge video analytics and AEBAS biometric reconciliation.
              </div>

              <div className="text-slate-700 space-y-1">
                <div><strong>Target Facility:</strong> {centreName} ({centreId})</div>
                <div><strong>Monitoring Directorate:</strong> Scheme Monitoring Unit (SMU), MSDE</div>
                <div><strong>Inspection Standard:</strong> Digital Personal Data Protection (DPDP) Act 2023 Compliant</div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="font-bold text-slate-900">Summary of Non-Compliance Findings:</div>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                  <li>
                    <strong>Ghost Trainee Discrepancy:</strong> 28 candidates registered on AEBAS biometric portal;
                    only 22 physically present under CCTV headcount verification (-6 unverified seats, -21.4% delta).
                  </li>
                  <li>
                    <strong>Sub-Standard Machine Operability:</strong> Equipment utilization measured at {ociScore.toFixed(1)}%,
                    falling below the statutory minimum of 80.0% required for DBT grant release.
                  </li>
                  <li>
                    <strong>Privacy Compliance:</strong> All CCTV frames processed locally on edge hardware with facial blurring ($k=51 \times 51$)
                    with zero raw biometric facial storage.
                  </li>
                </ul>
              </div>

              {/* Penalty Table */}
              <div className="pt-2 border-t border-slate-200">
                <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 text-[11px] font-bold">
                    <tr>
                      <th className="p-2.5">Statutory Clause</th>
                      <th className="p-2.5">Infraction Item</th>
                      <th className="p-2.5 text-right">Withheld Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    <tr>
                      <td className="p-2.5 text-slate-700">Sec 12-A(1)</td>
                      <td className="p-2.5 text-slate-700">6 Ghost Trainees @ ₹14,000/head</td>
                      <td className="p-2.5 text-right text-slate-900 font-bold">₹{phantomFine.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-700">Sec 12-A(2)</td>
                      <td className="p-2.5 text-slate-700">Sub-80% Machinery Operability Gap</td>
                      <td className="p-2.5 text-right text-slate-900 font-bold">₹{ociPenalty.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-700">Sec 12-A(4)</td>
                      <td className="p-2.5 text-slate-700">Administrative Non-Compliance Surcharge</td>
                      <td className="p-2.5 text-right text-slate-900 font-bold">₹{statutorySurcharge.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr className="bg-rose-50/50 font-bold text-slate-900">
                      <td colSpan={2} className="p-2.5 text-right text-slate-900">Total Statutory Withholding:</td>
                      <td className="p-2.5 text-right text-rose-700 font-bold text-sm">₹{calculatedTotal.toLocaleString("en-IN")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Official Order
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-sm"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
