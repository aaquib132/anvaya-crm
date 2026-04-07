import React from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function Toast({ message, type, onClose }) {
  const isError = type === "error";

  return (
    <div className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl animate-in slide-in-from-right-10 duration-300 min-w-[320px] max-w-md ${
      isError 
        ? "bg-red-50/90 border-red-200 text-red-800" 
        : "bg-white/90 border-brand-100 text-brand-900"
    }`}>
      {isError ? (
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
      )}
      
      <p className="text-sm font-bold flex-1">{message}</p>
      
      <button 
        onClick={onClose} 
        className={`p-1 rounded-lg transition-colors cursor-pointer ${
          isError ? "hover:bg-red-200/50 text-red-400" : "hover:bg-brand-100/50 text-brand-400"
        }`}
      >
        <X size={16} />
      </button>
    </div>
  );
}
