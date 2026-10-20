import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center shadow-xs">
        <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
      <div className="space-y-1">
        <div className="text-sm font-bold text-slate-800 tracking-tight">
          CENTRE SENTINEL
        </div>
        <div className="text-xs text-slate-500">
          Loading National Surveillance Module...
        </div>
      </div>
    </div>
  );
}
