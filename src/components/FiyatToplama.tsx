import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronRight,
  Home,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Send,
  Truck,
  Star,
  TrendingDown,
  Plus,
  Download,
  MoreHorizontal,
  TriangleAlert,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { AICopilot } from "./AICopilot";

// ─── Types ────────────────────────────────────────────────────────────────────

type SeçimDurum = "secildi" | "sec" | "eksik";

interface TedarikciTeklif {
  fiyat: number | null; // null = fiyat yok
  enUcuz: boolean;
}

interface BOQSatir {
  id: string;
  kalem: string;
  birim: string;
  miktar: number;
  teklifler: {
    kartal: TedarikciTeklif;
    aydin: TedarikciTeklif;
    guven: TedarikciTeklif;
  };
  secim: SeçimDurum;
  secilenTedarikci: "kartal" | "aydin" | "guven" | null;
  tip?: "normal" | "sarf" | "lojistik";
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const initialData: BOQSatir[] = [
  {
    id: "1",
    kalem: "Kablo NYY 3×4",
    birim: "mt",
    miktar: 450,
    teklifler: {
      kartal: { fiyat: 38, enUcuz: true },
      aydin: { fiyat: 42, enUcuz: false },
      guven: { fiyat: 45, enUcuz: false },
    },
    secim: "secildi",
    secilenTedarikci: "kartal",
  },
  {
    id: "2",
    kalem: "Pano DB-1",
    birim: "adet",
    miktar: 2,
    teklifler: {
      kartal: { fiyat: null, enUcuz: false },
      aydin: { fiyat: 8500, enUcuz: true },
      guven: { fiyat: 9200, enUcuz: false },
    },
    secim: "sec",
    secilenTedarikci: null,
  },
  {
    id: "3",
    kalem: "Topraklama hattı",
    birim: "mt",
    miktar: 120,
    teklifler: {
      kartal: { fiyat: 12, enUcuz: false },
      aydin: { fiyat: 14, enUcuz: false },
      guven: { fiyat: 11, enUcuz: true },
    },
    secim: "sec",
    secilenTedarikci: null,
  },
  {
    id: "4",
    kalem: "Aydınlatma Priz (schuko)",
    birim: "adet",
    miktar: 85,
    teklifler: {
      kartal: { fiyat: 28, enUcuz: false },
      aydin: { fiyat: null, enUcuz: false },
      guven: { fiyat: 31, enUcuz: false },
    },
    secim: "eksik",
    secilenTedarikci: null,
  },
  {
    id: "5",
    kalem: "Kablo NYM 3×2.5",
    birim: "mt",
    miktar: 780,
    teklifler: {
      kartal: { fiyat: 22, enUcuz: true },
      aydin: { fiyat: 25, enUcuz: false },
      guven: { fiyat: 24, enUcuz: false },
    },
    secim: "sec",
    secilenTedarikci: null,
  },
  {
    id: "6",
    kalem: "Sigorta kutusu (12 modül)",
    birim: "adet",
    miktar: 8,
    teklifler: {
      kartal: { fiyat: 420, enUcuz: false },
      aydin: { fiyat: 395, enUcuz: true },
      guven: { fiyat: 440, enUcuz: false },
    },
    secim: "sec",
    secilenTedarikci: null,
  },
  {
    id: "7",
    kalem: "LED Armatür 60×60 36W",
    birim: "adet",
    miktar: 64,
    teklifler: {
      kartal: { fiyat: null, enUcuz: false },
      aydin: { fiyat: null, enUcuz: false },
      guven: { fiyat: null, enUcuz: false },
    },
    secim: "eksik",
    secilenTedarikci: null,
  },
  {
    id: "8",
    kalem: "Kablo kanalı (40×25)",
    birim: "mt",
    miktar: 320,
    teklifler: {
      kartal: { fiyat: 18, enUcuz: true },
      aydin: { fiyat: 21, enUcuz: false },
      guven: { fiyat: 20, enUcuz: false },
    },
    secim: "sec",
    secilenTedarikci: null,
  },
  {
    id: "9",
    kalem: "Yapıştırıcı",
    birim: "torba",
    miktar: 170,
    teklifler: {
      kartal: { fiyat: 45, enUcuz: true },
      aydin: { fiyat: 52, enUcuz: false },
      guven: { fiyat: 48, enUcuz: false },
    },
    secim: "secildi",
    secilenTedarikci: "kartal",
    tip: "sarf",
  },
  {
    id: "10",
    kalem: "Derz Dolgu",
    birim: "torba",
    miktar: 85,
    teklifler: {
      kartal: { fiyat: 38, enUcuz: true },
      aydin: { fiyat: null, enUcuz: false },
      guven: { fiyat: 42, enUcuz: false },
    },
    secim: "sec",
    secilenTedarikci: null,
    tip: "sarf",
  },
  {
    id: "11",
    kalem: "Nakliye ve Teslimat",
    birim: "sefer",
    miktar: 1,
    teklifler: {
      kartal: { fiyat: 850, enUcuz: true },
      aydin: { fiyat: 950, enUcuz: false },
      guven: { fiyat: null, enUcuz: false },
    },
    secim: "sec",
    secilenTedarikci: null,
    tip: "lojistik",
  },
];

const tedarikciInfo = {
  kartal: {
    label: "Kartal Elektrik",
    skor: 72,
    skorRenk: "text-amber-400",
    uyari: "Geç teslimat geçmişi",
    avatar: "bg-blue-500/20 text-blue-400",
    avatarLetter: "K",
  },
  aydin: {
    label: "Aydın Teknik",
    skor: 88,
    skorRenk: "text-emerald-400",
    uyari: null,
    avatar: "bg-emerald-500/20 text-emerald-400",
    avatarLetter: "A",
  },
  guven: {
    label: "Güven Elektrik",
    skor: 81,
    skorRenk: "text-zinc-300",
    uyari: null,
    avatar: "bg-purple-500/20 text-purple-400",
    avatarLetter: "G",
  },
};

type TedarikciKey = "kartal" | "aydin" | "guven";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatFiyat(f: number | null, birim: string) {
  if (f === null) return null;
  if (f >= 1000) return f.toLocaleString("tr-TR") + " ₺";
  return f.toLocaleString("tr-TR") + " ₺";
}

function TeklifHucre({
  teklif,
  selected,
  onSec,
  disabled,
}: {
  teklif: TedarikciTeklif;
  selected: boolean;
  onSec: () => void;
  disabled?: boolean;
}) {
  if (teklif.fiyat === null) {
    return (
      <td className="px-3 py-3 text-center">
        <span className="text-[11px] text-zinc-700">—</span>
      </td>
    );
  }

  return (
    <td className="px-3 py-3 text-center">
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1.5">
          <span className={`text-sm ${selected ? "text-[#4F8CFF]" : "text-zinc-200"}`}>
            {formatFiyat(teklif.fiyat, "")}
          </span>
          {teklif.enUcuz && (
            <span
              className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full leading-none"
              style={{
                background: "rgba(52,211,153,0.12)",
                border: "1px solid rgba(52,211,153,0.3)",
                color: "#34d399",
              }}
            >
              <TrendingDown className="w-2 h-2" />
              EN UCUZ
            </span>
          )}
        </div>
      </div>
    </td>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function FiyatToplama() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"tedarikci" | "taseron">("tedarikci");
  const [rows, setRows] = useState<BOQSatir[]>(initialData);

  const handleSec = (rowId: string, tedarikci: TedarikciKey) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        const zatenSecili = r.secilenTedarikci === tedarikci;
        return {
          ...r,
          secilenTedarikci: zatenSecili ? null : tedarikci,
          secim: zatenSecili ? "sec" : "secildi",
        };
      })
    );
  };

  const seciliSayisi = rows.filter((r) => r.secim === "secildi").length;
  const eksikSayisi = rows.filter((r) => r.secim === "eksik").length;

  // Tedarikçi bazında seçim sayısı
  const kartalSecim = rows.filter((r) => r.secilenTedarikci === "kartal").length;
  const aydinSecim = rows.filter((r) => r.secilenTedarikci === "aydin").length;
  const guvenSecim = rows.filter((r) => r.secilenTedarikci === "guven").length;

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar activePage="fiyat-toplama" />

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
            <span className="text-[11px] text-zinc-300">Fiyat Toplama</span>
          </div>

          {/* Title + Actions */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg text-white">Fiyat Toplama</h2>
              <p className="text-xs text-zinc-600 mt-0.5">
                MACFit Forum İstanbul · Elektrik & Mekanik Grubu
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                style={{ border: "1px solid #2a2a2a" }}
              >
                <Download className="w-3.5 h-3.5" />
                Excel Aktar
              </button>
              <button
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                style={{ border: "1px solid #2a2a2a" }}
              >
                <Plus className="w-3.5 h-3.5" />
                Tedarikçi Ekle
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-400" style={{ border: "1px solid #2a2a2a" }}>
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Kampanya uyarı bandı */}
          <div
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl mb-4"
            style={{
              background: "rgba(234,179,8,0.07)",
              border: "1px solid rgba(234,179,8,0.22)",
            }}
          >
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex-1 text-xs text-amber-300/90 flex items-center gap-3 flex-wrap">
              <span>
                <span className="text-amber-400">MACFit Forum İstanbul</span> — Elektrik & Mekanik Grubu
              </span>
              <span className="w-px h-3 bg-amber-700/50" />
              <span>8 kalem</span>
              <span className="w-px h-3 bg-amber-700/50" />
              <span>3 tedarikçi</span>
              <span className="w-px h-3 bg-amber-700/50" />
              <span className="flex items-center gap-1 text-amber-400">
                <Clock className="w-3 h-3" />
                Son yanıt: <strong>2 gün kaldı</strong>
              </span>
            </div>
            {eksikSayisi > 0 && (
              <div className="flex items-center gap-1.5 text-[11px] text-orange-400">
                <TriangleAlert className="w-3.5 h-3.5" />
                {eksikSayisi} fiyat eksik
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-end gap-0">
            {[
              { id: "tedarikci", label: "Tedarikçi Teklifleri" },
              { id: "taseron", label: "Taeron Teklifleri" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-3 text-sm transition-colors border-b-2 ${
                    isActive
                      ? "text-white border-[#4F8CFF]"
                      : "text-zinc-600 border-transparent hover:text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ background: "#080808" }}>
          {activeTab === "tedarikci" ? (
            <>
              {/* Tedarikçi özet kartları */}
              <div className="px-7 pt-5 pb-3 grid grid-cols-3 gap-3">
                {(Object.entries(tedarikciInfo) as [TedarikciKey, typeof tedarikciInfo.kartal][]).map(
                  ([key, info]) => {
                    const secimSayisi = rows.filter((r) => r.secilenTedarikci === key).length;
                    const enUcuzSayisi = rows.filter(
                      (r) => r.teklifler[key].enUcuz
                    ).length;
                    return (
                      <div
                        key={key}
                        className="rounded-xl px-4 py-3.5 flex items-center gap-3"
                        style={{
                          background: "#111111",
                          border: secimSayisi > 0 ? "1px solid rgba(79,140,255,0.25)" : "1px solid #1f1f1f",
                        }}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 ${info.avatar}`}
                        >
                          {info.avatarLetter}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-white truncate">{info.label}</span>
                            {info.uyari && (
                              <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 text-zinc-600" />
                              <span className={`text-[11px] ${info.skorRenk}`}>
                                {info.skor}/100
                              </span>
                            </div>
                            <span className="w-px h-2.5 bg-zinc-800" />
                            <span className="text-[11px] text-zinc-600">
                              {enUcuzSayisi} kalemde en ucuz
                            </span>
                          </div>
                          {info.uyari && (
                            <div className="text-[10px] text-amber-500/80 mt-0.5">{info.uyari}</div>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          {secimSayisi > 0 ? (
                            <div className="text-[11px] text-[#4F8CFF]">
                              {secimSayisi} kalem seçili
                            </div>
                          ) : (
                            <div className="text-[11px] text-zinc-700">—</div>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* Karşılaştırma tablosu */}
              <div className="px-7 pb-6">
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1f1f1f" }}>
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: "#0A0A0A", borderBottom: "1px solid #1f1f1f" }}>
                        <th className="text-left px-4 py-3 text-[11px] text-zinc-600 uppercase tracking-widest font-normal">
                          BOQ Kalemi
                        </th>
                        <th className="text-center px-3 py-3 text-[11px] text-zinc-600 uppercase tracking-widest font-normal w-14">
                          Birim
                        </th>
                        <th className="text-center px-3 py-3 text-[11px] text-zinc-600 uppercase tracking-widest font-normal w-16">
                          Miktar
                        </th>
                        {/* Tedarikçi sütunları */}
                        {(["kartal", "aydin", "guven"] as TedarikciKey[]).map((k) => (
                          <th
                            key={k}
                            className="text-center px-3 py-3 text-[11px] font-normal uppercase tracking-widest w-32"
                          >
                            <div className="flex items-center justify-center gap-1.5">
                              <div
                                className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] ${tedarikciInfo[k].avatar}`}
                              >
                                {tedarikciInfo[k].avatarLetter}
                              </div>
                              <span className="text-zinc-500">{tedarikciInfo[k].label}</span>
                            </div>
                          </th>
                        ))}
                        <th className="text-center px-3 py-3 text-[11px] text-zinc-600 uppercase tracking-widest font-normal w-28">
                          Seçim
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => {
                        const tumFiyatsiz = Object.values(row.teklifler).every((t) => t.fiyat === null);
                        const baziFiyatsiz = Object.values(row.teklifler).some((t) => t.fiyat === null);

                        const isSarf = row.tip === "sarf";
                        const isLojistik = row.tip === "lojistik";
                        const isSpecialRow = isSarf || isLojistik;

                        let rowBg = "#111111";
                        if (isSpecialRow) {
                          rowBg = row.secim === "secildi"
                            ? (isSarf ? "rgba(147,51,234,0.12)" : "rgba(234,88,12,0.10)")
                            : (isSarf ? "rgba(147,51,234,0.06)" : "rgba(234,88,12,0.05)");
                        } else {
                          rowBg = row.secim === "secildi"
                            ? "rgba(79,140,255,0.04)"
                            : row.secim === "eksik"
                            ? "rgba(249,115,22,0.025)"
                            : "#111111";
                        }

                        return (
                          <tr
                            key={row.id}
                            className="border-b border-zinc-900 transition-colors hover:bg-zinc-900/20"
                            style={{ background: rowBg }}
                          >
                            {/* Kalem */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {row.secim === "secildi" ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4F8CFF] shrink-0" />
                                ) : row.secim === "eksik" ? (
                                  <TriangleAlert className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                                ) : (
                                  <Circle className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                                )}
                                {isSarf && (
                                  <span
                                    className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full leading-none shrink-0"
                                    style={{
                                      background: "rgba(147,51,234,0.18)",
                                      border: "1px solid rgba(147,51,234,0.35)",
                                      color: "#c084fc",
                                    }}
                                  >
                                    📦 SARF
                                  </span>
                                )}
                                {isLojistik && (
                                  <span
                                    className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full leading-none shrink-0"
                                    style={{
                                      background: "rgba(234,88,12,0.18)",
                                      border: "1px solid rgba(234,88,12,0.35)",
                                      color: "#fb923c",
                                    }}
                                  >
                                    🚚 LOJİSTİK
                                  </span>
                                )}
                                <span className="text-sm text-zinc-200">{row.kalem}</span>
                              </div>
                            </td>

                            {/* Birim */}
                            <td className="px-3 py-3 text-center">
                              <span className="text-[11px] text-zinc-600">{row.birim}</span>
                            </td>

                            {/* Miktar */}
                            <td className="px-3 py-3 text-center">
                              <span className="text-[11px] text-zinc-500">
                                {row.miktar.toLocaleString("tr-TR")}
                              </span>
                            </td>

                            {/* Tedarikçi fiyatları */}
                            {(["kartal", "aydin", "guven"] as TedarikciKey[]).map((k) => {
                              const t = row.teklifler[k];
                              const isSelected = row.secilenTedarikci === k;
                              return (
                                <td key={k} className="px-3 py-3 text-center">
                                  {t.fiyat === null ? (
                                    <span className="text-[11px] text-zinc-700">—</span>
                                  ) : (
                                    <div
                                      className="inline-flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer transition-all"
                                      style={
                                        isSelected
                                          ? { background: "rgba(79,140,255,0.12)", border: "1px solid rgba(79,140,255,0.35)" }
                                          : { border: "1px solid transparent" }
                                      }
                                      onClick={() => handleSec(row.id, k)}
                                    >
                                      <span className={`text-sm ${isSelected ? "text-[#4F8CFF]" : "text-zinc-200"}`}>
                                        {formatFiyat(t.fiyat, row.birim)}
                                      </span>
                                      {t.enUcuz && (
                                        <span
                                          className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full leading-none"
                                          style={{
                                            background: "rgba(52,211,153,0.12)",
                                            border: "1px solid rgba(52,211,153,0.3)",
                                            color: "#34d399",
                                          }}
                                        >
                                          <TrendingDown className="w-2 h-2" />
                                          EN UCUZ
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </td>
                              );
                            })}

                            {/* Seçim */}
                            <td className="px-3 py-3 text-center">
                              {row.secim === "secildi" ? (
                                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full text-[#4F8CFF] border border-[#4F8CFF]/30 bg-[#4F8CFF]/10">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Seçildi
                                </span>
                              ) : row.secim === "eksik" ? (
                                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full text-orange-400 border border-orange-500/30 bg-orange-500/10">
                                  <TriangleAlert className="w-3 h-3" />
                                  Fiyat Eksik
                                </span>
                              ) : (
                                <span className="text-[11px] text-zinc-600">
                                  Fiyata tıkla
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            /* Taşeron Teklifleri — placeholder */
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
              >
                <Truck className="w-5 h-5 text-zinc-600" />
              </div>
              <p className="text-sm text-zinc-600">Taşeron teklifleri yakında...</p>
            </div>
          )}
        </div>

        {/* Alt aksiyon barı */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-7 py-3.5"
          style={{ background: "#0D0D0D", borderTop: "1px solid #1f1f1f" }}
        >
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <span>
              <span className="text-zinc-400">{seciliSayisi}</span> / {rows.length} kalem seçildi
            </span>
            {eksikSayisi > 0 && (
              <span className="flex items-center gap-1 text-orange-500">
                <TriangleAlert className="w-3 h-3" />
                {eksikSayisi} fiyat henüz gelmedi
              </span>
            )}
          </div>

          <div className="flex items-center justify-center flex-1">
            <button
              className="flex items-center gap-2 px-8 py-2.5 rounded-lg text-sm text-white transition-all hover:brightness-110 disabled:opacity-40"
              style={{ background: "#4F8CFF" }}
              disabled={seciliSayisi === 0}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Seçilenleri Onayla ve BOQ'ya Aktar
            </button>
          </div>
        </div>
      </div>

      {/* AI Copilot */}
      <AICopilot
        context="Fiyat Toplama"
        welcomeMessage={
          `Kartal Elektrik 3/4 kalemde en ucuz.\n\nPerformans skoru: 72/100\n⚠️ Geç teslimat geçmişi var — dikkat.\n\nAydın Teknik daha güvenilir (88/100) ancak bazı kalemlerde fiyat vermemiş.\n\nTümünü Kartal'a vermemi ister misin?`
        }
        shortcuts={[
          "Tümünü Kartal'a ver",
          "En iyi kombinasyonu hesapla",
          "Tedarikçi geçmişi",
          "Eksik fiyatları hatırlat",
        ]}
      />
    </div>
  );
}