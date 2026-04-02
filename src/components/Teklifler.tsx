import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronRight,
  Home,
  Plus,
  Sparkles,
  Download,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  FileText,
  ChevronDown,
  Zap,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { AICopilot } from "./AICopilot";

// ─── Types ────────────────────────────────────────────────────────────────────

type RevizID = "rev0" | "rev1";

interface DisciplineRow {
  id: string;
  disiplin: string;
  maliyet: number;
  marj: number;
  teklif: number;
  durum: "onaylandi" | "beklemede" | "revize" | "eksik";
}

interface Revizyon {
  id: RevizID;
  label: string;
  tarih: string;
  rows: DisciplineRow[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const revisions: Revizyon[] = [
  {
    id: "rev0",
    label: "Rev.0",
    tarih: "12 Mar 2026",
    rows: [
      { id: "ins", disiplin: "İnşaat", maliyet: 2_340_000, marj: 68, teklif: 3_931_200, durum: "onaylandi" },
      { id: "elk", disiplin: "Elektrik", maliyet: 980_000, marj: 62, teklif: 1_587_600, durum: "onaylandi" },
      { id: "mek", disiplin: "Mekanik", maliyet: 760_000, marj: 65, teklif: 1_254_000, durum: "beklemede" },
      { id: "mob", disiplin: "Mobilya", maliyet: 520_000, marj: 72, teklif: 894_400, durum: "revize" },
      { id: "ayd", disiplin: "Aydınlatma", maliyet: 310_000, marj: 58, teklif: 489_800, durum: "eksik" },
    ],
  },
  {
    id: "rev1",
    label: "Rev.1",
    tarih: "24 Mar 2026",
    rows: [
      { id: "ins", disiplin: "İnşaat", maliyet: 2_210_513, marj: 65, teklif: 3_647_346, durum: "onaylandi" },
      { id: "elk", disiplin: "Elektrik", maliyet: 1_020_000, marj: 60, teklif: 1_632_000, durum: "onaylandi" },
      { id: "mek", disiplin: "Mekanik", maliyet: 890_000, marj: 58, teklif: 1_406_200, durum: "beklemede" },
      { id: "mob", disiplin: "Mobilya", maliyet: 498_000, marj: 62, teklif: 806_760, durum: "onaylandi" },
      { id: "ayd", disiplin: "Aydınlatma", maliyet: 370_000, marj: 56, teklif: 577_200, durum: "beklemede" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  return n.toLocaleString("tr-TR") + " ₺";
}

function DurumBadge({ durum }: { durum: DisciplineRow["durum"] }) {
  const map = {
    onaylandi: {
      label: "Onaylandı",
      icon: <CheckCircle2 className="w-3 h-3" />,
      style: { background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.25)", color: "#34d399" },
    },
    beklemede: {
      label: "Beklemede",
      icon: <Clock className="w-3 h-3" />,
      style: { background: "rgba(234,179,8,0.10)", border: "1px solid rgba(234,179,8,0.25)", color: "#fbbf24" },
    },
    revize: {
      label: "Revize",
      icon: <TrendingDown className="w-3 h-3" />,
      style: { background: "rgba(147,51,234,0.10)", border: "1px solid rgba(147,51,234,0.3)", color: "#c084fc" },
    },
    eksik: {
      label: "Eksik",
      icon: <AlertTriangle className="w-3 h-3" />,
      style: { background: "rgba(249,115,22,0.10)", border: "1px solid rgba(249,115,22,0.25)", color: "#fb923c" },
    },
  };
  const cfg = map[durum];
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full"
      style={cfg.style}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Teklifler() {
  const [activeRev, setActiveRev] = useState<RevizID>("rev1");
  const navigate = useNavigate();
  const rev = revisions.find((r) => r.id === activeRev)!;

  const totalMaliyet = rev.rows.reduce((s, r) => s + r.maliyet, 0);
  const totalTeklif = rev.rows.reduce((s, r) => s + r.teklif, 0);
  const karMarji = ((totalTeklif - totalMaliyet) / totalMaliyet) * 100;

  const summaryCards = [
    {
      label: "Toplam Maliyet",
      value: formatCurrency(totalMaliyet),
      sub: "Malzeme + İşçilik",
      icon: <TrendingDown className="w-4 h-4 text-zinc-500" />,
      accent: "text-zinc-200",
    },
    {
      label: "Toplam Teklif",
      value: formatCurrency(totalTeklif),
      sub: "KDV Hariç",
      icon: <FileText className="w-4 h-4 text-[#4F8CFF]" />,
      accent: "text-[#4F8CFF]",
    },
    {
      label: "Kâr Marjı",
      value: `%${karMarji.toFixed(1)}`,
      sub: "Hedef: %55+",
      icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
      accent: "text-emerald-400",
    },
    {
      label: "Müşteri Durumu",
      value: "Değerlendirmede",
      sub: "Son güncelleme: bugün",
      icon: <Clock className="w-4 h-4 text-amber-400" />,
      accent: "text-amber-400",
    },
  ];

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar activePage="teklifler" />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <div
          className="px-7 pt-5 pb-0 flex-shrink-0"
          style={{ background: "#000000", borderBottom: "1px solid #1a1a1a" }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 mb-3">
            <button
              onClick={() => navigate("/projects")}
              className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1"
            >
              <Home className="w-3 h-3" />
              Projeler
            </button>
            <ChevronRight className="w-3 h-3 text-zinc-700" />
            <button
              onClick={() => navigate("/projects/1")}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              MACFit Forum İstanbul
            </button>
            <ChevronRight className="w-3 h-3 text-zinc-700" />
            <span className="text-[11px] text-zinc-300">Teklif</span>
          </div>

          {/* Title + Actions */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg text-white">Teklif Yönetimi</h2>
              <p className="text-xs text-zinc-600 mt-0.5">
                MACFit Forum İstanbul · 5 disiplin · Son güncelleme {rev.tarih}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-300 hover:text-white transition-colors"
                style={{ border: "1px solid #2a2a2a", background: "#111111" }}
              >
                <Plus className="w-3.5 h-3.5" />
                Yeni Teklif Oluştur
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white transition-all hover:brightness-110"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                  border: "1px solid rgba(139,92,246,0.4)",
                  boxShadow: "0 0 18px rgba(124,58,237,0.25)",
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Akıllı Teklif Oluştur
              </button>
            </div>
          </div>

          {/* Revizyon Sekmeleri */}
          <div className="flex items-end gap-0">
            {revisions.map((r) => {
              const isActive = activeRev === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveRev(r.id)}
                  className={`px-5 py-2.5 text-sm transition-colors border-b-2 flex items-center gap-2 ${
                    isActive
                      ? "text-white border-[#4F8CFF]"
                      : "text-zinc-600 border-transparent hover:text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  {r.label}
                  <span className="text-[10px] text-zinc-700">{r.tarih}</span>
                  {r.id === "rev1" && (
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full leading-none"
                      style={{
                        background: "rgba(79,140,255,0.15)",
                        border: "1px solid rgba(79,140,255,0.3)",
                        color: "#4F8CFF",
                      }}
                    >
                      AKTİF
                    </span>
                  )}
                </button>
              );
            })}
            <button
              className="px-4 py-2.5 text-sm text-zinc-700 border-b-2 border-transparent hover:text-zinc-400 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Yeni Revizyon
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ background: "#080808" }}>
          {/* Özet Kartlar */}
          <div className="px-7 pt-5 pb-4 grid grid-cols-4 gap-3">
            {summaryCards.map((card, i) => (
              <div
                key={i}
                className="rounded-xl px-4 py-4 flex flex-col gap-2"
                style={{ background: "#111111", border: "1px solid #1f1f1f" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-600 uppercase tracking-widest">{card.label}</span>
                  {card.icon}
                </div>
                <div className={`text-xl ${card.accent}`}>{card.value}</div>
                <div className="text-[11px] text-zinc-700">{card.sub}</div>
                {card.label === "Kâr Marjı" && (
                  <div className="mt-0.5">
                    <div className="h-1 rounded-full" style={{ background: "#1f1f1f" }}>
                      <div
                        className="h-1 rounded-full"
                        style={{
                          width: `${Math.min(karMarji, 100)}%`,
                          background: "linear-gradient(90deg, #34d399, #10b981)",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Disiplin Tablosu */}
          <div className="px-7 pb-6">
            {/* Tablo başlığı */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-zinc-400">Disiplin Bazlı Dağılım</h3>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                <span>{rev.label}</span>
                <ChevronRight className="w-3 h-3" />
                <span>{rev.tarih}</span>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1f1f1f" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#0A0A0A", borderBottom: "1px solid #1f1f1f" }}>
                    <th className="text-left px-5 py-3.5 text-[11px] text-zinc-600 uppercase tracking-widest font-normal">
                      Disiplin
                    </th>
                    <th className="text-right px-5 py-3.5 text-[11px] text-zinc-600 uppercase tracking-widest font-normal">
                      Maliyet
                    </th>
                    <th className="text-center px-5 py-3.5 text-[11px] text-zinc-600 uppercase tracking-widest font-normal w-24">
                      Marj %
                    </th>
                    <th className="text-right px-5 py-3.5 text-[11px] text-zinc-600 uppercase tracking-widest font-normal">
                      Teklif Tutarı
                    </th>
                    <th className="text-center px-5 py-3.5 text-[11px] text-zinc-600 uppercase tracking-widest font-normal w-32">
                      Durum
                    </th>
                    <th className="text-center px-3 py-3.5 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {rev.rows.map((row, idx) => {
                    const isLast = idx === rev.rows.length - 1;
                    const marjColor =
                      row.marj >= 65
                        ? "text-emerald-400"
                        : row.marj >= 58
                        ? "text-amber-400"
                        : "text-orange-400";

                    return (
                      <tr
                        key={row.id}
                        className="transition-colors hover:bg-zinc-900/30"
                        style={{
                          background: "#111111",
                          borderBottom: isLast ? "none" : "1px solid #1a1a1a",
                        }}
                      >
                        {/* Disiplin */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] shrink-0"
                              style={{ background: "#1a1a1a", border: "1px solid #282828" }}
                            >
                              {row.disiplin[0]}
                            </div>
                            <span className="text-sm text-zinc-200">{row.disiplin}</span>
                          </div>
                        </td>

                        {/* Maliyet */}
                        <td className="px-5 py-4 text-right">
                          <span className="text-sm text-zinc-400">{formatCurrency(row.maliyet)}</span>
                        </td>

                        {/* Marj */}
                        <td className="px-5 py-4 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            <span className={`text-sm ${marjColor}`}>%{row.marj}</span>
                            <div className="w-16 h-1 rounded-full" style={{ background: "#1f1f1f" }}>
                              <div
                                className="h-1 rounded-full"
                                style={{
                                  width: `${Math.min(row.marj, 100)}%`,
                                  background:
                                    row.marj >= 65
                                      ? "#34d399"
                                      : row.marj >= 58
                                      ? "#fbbf24"
                                      : "#fb923c",
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Teklif Tutarı */}
                        <td className="px-5 py-4 text-right">
                          <span className="text-sm text-white">{formatCurrency(row.teklif)}</span>
                        </td>

                        {/* Durum */}
                        <td className="px-5 py-4 text-center">
                          <DurumBadge durum={row.durum} />
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-4 text-center">
                          <button className="w-6 h-6 flex items-center justify-center rounded text-zinc-700 hover:text-zinc-400 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Toplam footer */}
                <tfoot>
                  <tr style={{ background: "#0D0D0D", borderTop: "1px solid #1f1f1f" }}>
                    <td className="px-5 py-3.5">
                      <span className="text-[11px] text-zinc-600 uppercase tracking-widest">Toplam</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-sm text-zinc-400">{formatCurrency(totalMaliyet)}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="text-sm text-emerald-400">%{karMarji.toFixed(1)}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-sm text-white">{formatCurrency(totalTeklif)}</span>
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Revizyon karşılaştırma notu */}
            {activeRev === "rev1" && (
              <div
                className="mt-4 flex items-start gap-3 px-4 py-3 rounded-xl"
                style={{
                  background: "rgba(79,140,255,0.05)",
                  border: "1px solid rgba(79,140,255,0.15)",
                }}
              >
                <Zap className="w-4 h-4 text-[#4F8CFF] shrink-0 mt-0.5" />
                <div className="flex-1 text-xs text-zinc-500 leading-relaxed">
                  <span className="text-zinc-300">Rev.1</span> → Rev.0'a kıyasla toplam maliyet{" "}
                  <span className="text-orange-400">+130K ₺</span> arttı, teklif tutarı{" "}
                  <span className="text-[#4F8CFF]">optimize edildi</span>. Marj oranı %67.4 → %59.9 olarak güncellendi.{" "}
                  MACFit geçmişinde %55+ marjlı 3 teklifi onayladı.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Alt aksiyon barı */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-7 py-3.5"
          style={{ background: "#0D0D0D", borderTop: "1px solid #1f1f1f" }}
        >
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <span>
              <span className="text-zinc-400">
                {rev.rows.filter((r) => r.durum === "onaylandi").length}
              </span>{" "}
              / {rev.rows.length} disiplin onaylandı
            </span>
            {rev.rows.some((r) => r.durum === "eksik") && (
              <span className="flex items-center gap-1 text-orange-500">
                <AlertTriangle className="w-3 h-3" />
                Eksik kalemler var
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              style={{ border: "1px solid #2a2a2a", background: "#111111" }}
            >
              <Download className="w-3.5 h-3.5" />
              Excel Export
            </button>
            <button
              className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm text-white transition-all hover:brightness-110"
              style={{ background: "#4F8CFF" }}
            >
              <Send className="w-3.5 h-3.5" />
              Onaya Gönder
            </button>
          </div>
        </div>
      </div>

      {/* AI Copilot */}
      <AICopilot
        context="Teklif Yönetimi"
        welcomeMessage={`Rev.1 önceki versiyona göre %8 daha düşük marj.\n\nMACFit geçmişte %55+ marjı 3/3 kabul etmiş. Mevcut %${karMarji.toFixed(1)} güvenli bölgede.\n\n📊 Disiplin bazlı analiz:\n• İnşaat marjı %65 — hedefin üzerinde\n• Aydınlatma %56 — risk sınırında\n\nAydınlatma teklifini yeniden hesaplamamı ister misin?`}
        shortcuts={[
          "Marj risklerini göster",
          "Rev.0 ile karşılaştır",
          "Onaya hazır mı?",
          "Rakip fiyat tahmini",
        ]}
      />
    </div>
  );
}