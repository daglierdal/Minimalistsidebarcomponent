import { useState } from "react";
import { ChevronRight, Check, X, Pencil } from "lucide-react";
import { useNavigate } from "react-router";
import { Sidebar } from "./Sidebar";
import { AICopilot } from "./AICopilot";

/* ─────────────────────────── DATA ──────────────────────────── */

const summaryCards = [
  { label: "Teklif Tutarı", value: "12.003.790 ₺", color: "text-white" },
  { label: "Maliyet", value: "9.581.065 ₺", color: "text-zinc-200" },
  { label: "Kâr", value: "+2.422.725 ₺", color: "text-green-400" },
  { label: "Kâr Oranı", value: "%25", color: "text-green-400" },
];

interface DisciplineRow {
  disiplin: string;
  carpan: string;
  teklif: string;
  maliyet: string;
  kar: string;
  oran: string;
  negative?: boolean;
  empty?: boolean;
}

const disciplines: DisciplineRow[] = [
  { disiplin: "İnşaat", carpan: "1.27x", teklif: "7.59M ₺", maliyet: "5.99M ₺", kar: "+1.60M ₺", oran: "%27" },
  { disiplin: "Mobilya", carpan: "1.45x", teklif: "1.17M ₺", maliyet: "806K ₺", kar: "+363K ₺", oran: "%45" },
  { disiplin: "Aydınlatma", carpan: "%35", teklif: "—", maliyet: "—", kar: "—", oran: "—", empty: true },
  { disiplin: "Elektrik", carpan: "0.92x", teklif: "1.60M ₺", maliyet: "1.74M ₺", kar: "-139K ₺", oran: "-%8", negative: true },
  { disiplin: "Mekanik", carpan: "1.57x", teklif: "1.65M ₺", maliyet: "1.05M ₺", kar: "+600K ₺", oran: "%57" },
];

/* ─────────────────────────── COMPONENT ──────────────────────────── */

export function ApprovalPage() {
  const navigate = useNavigate();
  const [note, setNote] = useState("");
  const [decision, setDecision] = useState<"approved" | "rejected" | "revise" | null>(null);

  const handleDecision = (d: "approved" | "rejected" | "revise") => {
    setDecision(d);
  };

  return (
    <div className="flex h-screen bg-black">
      <Sidebar activePage="projects" user="erdal" />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex-1 overflow-y-auto p-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            <span
              className="text-zinc-400 hover:text-white cursor-pointer transition-colors"
              onClick={() => navigate("/")}
            >
              Projeler
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span
              className="text-zinc-400 hover:text-white cursor-pointer transition-colors"
              onClick={() => navigate("/projects/1")}
            >
              MACFit Forum İstanbul
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-white">Teklif Onayı</span>
          </div>

          {/* Title row */}
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-[26px] text-white flex-1">MACFit Forum İstanbul</h1>
            <span className="px-3 py-1 rounded-full text-xs border border-amber-500/50 text-amber-400 bg-amber-500/10">
              Onay Bekliyor
            </span>
          </div>

          {/* Subtitle */}
          <p className="text-sm text-zinc-500 mb-8">
            Asiye tarafından gönderildi — 22 Mart 2026, 14:30
          </p>

          {/* Decision banner */}
          {decision && (
            <div
              className={`mb-6 px-5 py-3 rounded-xl border text-sm flex items-center gap-3 ${
                decision === "approved"
                  ? "bg-green-500/10 border-green-500/40 text-green-400"
                  : decision === "rejected"
                  ? "bg-red-500/10 border-red-500/40 text-red-400"
                  : "bg-amber-500/10 border-amber-500/40 text-amber-400"
              }`}
            >
              {decision === "approved" && <Check className="w-4 h-4 shrink-0" />}
              {decision === "rejected" && <X className="w-4 h-4 shrink-0" />}
              {decision === "revise" && <Pencil className="w-4 h-4 shrink-0" />}
              {decision === "approved" && "Teklif onaylandı."}
              {decision === "rejected" && "Teklif reddedildi."}
              {decision === "revise" && "Revizyon talebi gönderildi."}
            </div>
          )}

          {/* 4 Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-7">
            {summaryCards.map((card) => (
              <div key={card.label} className="bg-[#111111] rounded-xl px-5 py-5">
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">{card.label}</div>
                <div className={`text-2xl ${card.color}`}>{card.value}</div>
              </div>
            ))}
          </div>

          {/* Discipline Breakdown Table */}
          <div className="rounded-xl overflow-hidden border border-zinc-800/80 mb-7">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr style={{ background: "#0A0A0A" }} className="border-b border-zinc-800">
                  {["Disiplin", "Çarpan", "Teklif", "Maliyet", "Kâr", "Oran"].map((col) => (
                    <th
                      key={col}
                      className={`py-3 text-zinc-500 font-normal ${
                        col === "Disiplin" || col === "Çarpan" ? "text-left px-4" : "text-right px-4"
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {disciplines.map((row) => (
                  <tr
                    key={row.disiplin}
                    className="border-b border-zinc-800/50"
                    style={row.negative ? { background: "rgba(239,68,68,0.067)" } : {}}
                  >
                    <td className="px-4 py-3 text-zinc-200">{row.disiplin}</td>
                    <td className="px-4 py-3">
                      <span className="text-zinc-400 text-[11px] bg-zinc-800/80 px-2 py-0.5 rounded-full">
                        {row.carpan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-300 whitespace-nowrap">{row.teklif}</td>
                    <td className="px-4 py-3 text-right text-zinc-400 whitespace-nowrap">{row.maliyet}</td>
                    <td className={`px-4 py-3 text-right whitespace-nowrap ${
                      row.negative ? "text-red-400" : row.empty ? "text-zinc-500" : "text-green-400"
                    }`}>
                      {row.kar}
                    </td>
                    <td className={`px-4 py-3 text-right whitespace-nowrap ${
                      row.negative ? "text-red-400" : row.empty ? "text-zinc-500" : "text-green-400"
                    }`}>
                      {row.oran}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Note section */}
          <div className="mb-8">
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-2 px-1">
              Not bırak <span className="normal-case text-zinc-700">(opsiyonel)</span>
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Elektrik marjı düşük, 1.10x yap..."
              rows={3}
              className="w-full bg-[#111111] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700 resize-none transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            {/* Onayla */}
            <button
              onClick={() => handleDecision("approved")}
              className={`flex items-center gap-2.5 px-8 py-3 rounded-xl text-sm transition-all ${
                decision === "approved"
                  ? "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                  : "bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30 hover:shadow-[0_0_12px_rgba(34,197,94,0.2)]"
              }`}
            >
              <Check className="w-4 h-4" />
              Onayla
            </button>

            {/* Reddet */}
            <button
              onClick={() => handleDecision("rejected")}
              className={`flex items-center gap-2.5 px-8 py-3 rounded-xl text-sm transition-all ${
                decision === "rejected"
                  ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                  : "bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 hover:shadow-[0_0_12px_rgba(239,68,68,0.2)]"
              }`}
            >
              <X className="w-4 h-4" />
              Reddet
            </button>

            {/* Revize İste */}
            <button
              onClick={() => handleDecision("revise")}
              className={`flex items-center gap-2.5 px-8 py-3 rounded-xl text-sm transition-all ${
                decision === "revise"
                  ? "bg-zinc-600 text-white"
                  : "border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
              }`}
            >
              <Pencil className="w-4 h-4" />
              Revize İste
            </button>
          </div>

        </div>
      </div>

      {/* AI Copilot */}
      <AICopilot
        context="Teklif Onayı"
        welcomeMessage={`Bu teklif hakkında özet hazırladım:\n• Genel kâr %25 — sağlıklı\n• Elektrik disiplini -139K ₺ zarar — Asiye'ye revize isteyin\n• MACFit son 3 projede ort. kâr %22 — bu teklif ortalamanın üzerinde\n• Mobilya %45 marj — müşteri pazarlık yapabilir`}
        shortcuts={["Risk analizi", "Müşteri geçmişi", "Revizyon özeti"]}
      />
    </div>
  );
}