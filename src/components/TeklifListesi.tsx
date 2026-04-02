import { useState } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  XCircle,
  FileEdit,
  Send,
  AlertCircle,
  ArrowUpRight,
  Bell,
  ClipboardList,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { AICopilot } from "./AICopilot";

// ─── Types ──────────────────────────────────────────────────────────────────

type TeklifDurum =
  | "kabul-edildi"
  | "degerlendirilmede"
  | "onay-bekliyor"
  | "taslak"
  | "reddedildi"
  | "gonderildi";

interface Teklif {
  id: string;
  proje: string;
  musteri: string;
  tutar: number | null;
  maliyet: number | null;
  kar: number | null;
  durum: TeklifDurum;
  revizyon: string | null;
  gonderim: string | null;
  sonGuncelleme: string;
  aksiyon: "takip-et" | "hatirla" | "boq-tamamla" | null;
}

// ─── Data ───────────────────────────────────────────────────────────────────

const teklifler: Teklif[] = [
  {
    id: "t1",
    proje: "MACFit Forum İstanbul",
    musteri: "MACFit",
    tutar: 21_401_217,
    maliyet: 12_970_435,
    kar: 65,
    durum: "kabul-edildi",
    revizyon: "R0",
    gonderim: "25 Mar",
    sonGuncelleme: "25 Mar",
    aksiyon: null,
  },
  {
    id: "t2",
    proje: "MACFit Ankara Çankaya",
    musteri: "MACFit",
    tutar: 4_200_000,
    maliyet: 2_545_455,
    kar: 65,
    durum: "degerlendirilmede",
    revizyon: "R2",
    gonderim: "24 Mar",
    sonGuncelleme: "Bugün",
    aksiyon: "takip-et",
  },
  {
    id: "t3",
    proje: "Yargıcı Nişantaşı",
    musteri: "Yargıcı",
    tutar: 2_550_000,
    maliyet: 1_545_455,
    kar: 65,
    durum: "onay-bekliyor",
    revizyon: "R0",
    gonderim: "20 Mar",
    sonGuncelleme: "20 Mar",
    aksiyon: "hatirla",
  },
  {
    id: "t4",
    proje: "Koton Kızılay",
    musteri: "Koton",
    tutar: null,
    maliyet: null,
    kar: null,
    durum: "taslak",
    revizyon: null,
    gonderim: null,
    sonGuncelleme: "22 Mar",
    aksiyon: "boq-tamamla",
  },
  {
    id: "t5",
    proje: "MACFit Bursa Nilüfer",
    musteri: "MACFit",
    tutar: 3_900_000,
    maliyet: 2_363_636,
    kar: 65,
    durum: "kabul-edildi",
    revizyon: "R0",
    gonderim: "05 Mar",
    sonGuncelleme: "08 Mar",
    aksiyon: null,
  },
  {
    id: "t6",
    proje: "LC Waikiki Bursa",
    musteri: "LC Waikiki",
    tutar: 4_680_000,
    maliyet: 2_836_364,
    kar: 65,
    durum: "gonderildi",
    revizyon: "R1",
    gonderim: "18 Mar",
    sonGuncelleme: "18 Mar",
    aksiyon: "takip-et",
  },
  {
    id: "t7",
    proje: "Defacto Kadıköy",
    musteri: "Defacto",
    tutar: 9_680_494,
    maliyet: 5_866_966,
    kar: 65,
    durum: "kabul-edildi",
    revizyon: "R3",
    gonderim: "01 Şub",
    sonGuncelleme: "10 Şub",
    aksiyon: null,
  },
];

// ─── Durum config ────────────────────────────────────────────────────────────

type DurumConfig = {
  label: string;
  icon: React.ReactNode;
  pillStyle: React.CSSProperties;
  rowBg: string;
  dim?: boolean;
};

const durumMap: Record<TeklifDurum, DurumConfig> = {
  "kabul-edildi": {
    label: "Kabul Edildi",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    pillStyle: {
      background: "rgba(52,211,153,0.10)",
      border: "1px solid rgba(52,211,153,0.25)",
      color: "#34d399",
    },
    rowBg: "transparent",
  },
  degerlendirilmede: {
    label: "Değerlendirmede",
    icon: <Clock className="w-3.5 h-3.5" />,
    pillStyle: {
      background: "rgba(251,191,36,0.10)",
      border: "1px solid rgba(251,191,36,0.25)",
      color: "#fbbf24",
    },
    rowBg: "rgba(251,191,36,0.03)",
  },
  "onay-bekliyor": {
    label: "Onay Bekliyor",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    pillStyle: {
      background: "rgba(251,191,36,0.10)",
      border: "1px solid rgba(251,191,36,0.22)",
      color: "#fbbf24",
    },
    rowBg: "rgba(251,191,36,0.03)",
  },
  taslak: {
    label: "Taslak",
    icon: <FileEdit className="w-3.5 h-3.5" />,
    pillStyle: {
      background: "rgba(82,82,91,0.15)",
      border: "1px solid #232323",
      color: "#52525b",
    },
    rowBg: "transparent",
    dim: true,
  },
  reddedildi: {
    label: "Reddedildi",
    icon: <XCircle className="w-3.5 h-3.5" />,
    pillStyle: {
      background: "rgba(239,68,68,0.10)",
      border: "1px solid rgba(239,68,68,0.22)",
      color: "#f87171",
    },
    rowBg: "transparent",
  },
  gonderildi: {
    label: "Gönderildi",
    icon: <Send className="w-3.5 h-3.5" />,
    pillStyle: {
      background: "rgba(79,140,255,0.10)",
      border: "1px solid rgba(79,140,255,0.25)",
      color: "#4F8CFF",
    },
    rowBg: "transparent",
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("tr-TR") + " ₺";
}

function fmtM(n: number) {
  if (n >= 1_000_000)
    return (
      (n / 1_000_000).toLocaleString("tr-TR", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }) + " M₺"
    );
  return fmt(n);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Dropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 transition-colors whitespace-nowrap"
        style={{ border: "1px solid #242424", background: "#111" }}
      >
        {value || label}
        <ChevronDown className="w-3.5 h-3.5 shrink-0" />
      </button>
      {open && (
        <div
          className="absolute top-full mt-1 left-0 z-50 rounded-xl overflow-hidden min-w-[180px]"
          style={{ background: "#161616", border: "1px solid #2a2a2a" }}
        >
          {[label, ...options].map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt === label ? "" : opt);
                setOpen(false);
              }}
              className="w-full text-left px-3.5 py-2.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AksiyonBtn({ aksiyon }: { aksiyon: Teklif["aksiyon"] }) {
  if (!aksiyon) return <span className="text-zinc-800 text-xs">—</span>;

  const map = {
    "takip-et": {
      label: "Takip Et",
      icon: <ArrowUpRight className="w-3 h-3" />,
      style: {
        background: "rgba(79,140,255,0.10)",
        border: "1px solid rgba(79,140,255,0.25)",
        color: "#4F8CFF",
      },
    },
    hatirla: {
      label: "Hatırlat",
      icon: <Bell className="w-3 h-3" />,
      style: {
        background: "rgba(251,191,36,0.10)",
        border: "1px solid rgba(251,191,36,0.25)",
        color: "#fbbf24",
      },
    },
    "boq-tamamla": {
      label: "BOQ Tamamla",
      icon: <ClipboardList className="w-3 h-3" />,
      style: {
        background: "rgba(249,115,22,0.10)",
        border: "1px solid rgba(249,115,22,0.25)",
        color: "#fb923c",
      },
    },
  };

  const cfg = map[aksiyon];
  return (
    <button
      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg hover:brightness-110 transition-all whitespace-nowrap"
      style={cfg.style}
    >
      {cfg.icon}
      {cfg.label}
    </button>
  );
}

function KarCell({ kar }: { kar: number | null }) {
  if (kar === null) return <span className="text-zinc-700 text-sm">—</span>;
  return (
    <span
      className="inline-flex items-center gap-1 text-sm tabular-nums"
      style={{ color: "#34d399" }}
    >
      +{kar}%
    </span>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export function TeklifListesi() {
  const [musteriFilter, setMusteriFilter] = useState("");
  const [durumFilter, setDurumFilter] = useState("");
  const [search, setSearch] = useState("");

  const musteriler = [...new Set(teklifler.map((t) => t.musteri))];
  const durumSecenekleri = [
    "Taslak",
    "Gönderildi",
    "Onay Bekliyor",
    "Değerlendirmede",
    "Kabul Edildi",
    "Reddedildi",
  ];

  const filtered = teklifler.filter((t) => {
    const mOk = !musteriFilter || t.musteri === musteriFilter;
    const dOk = !durumFilter || durumMap[t.durum].label === durumFilter;
    const sOk =
      !search ||
      t.proje.toLowerCase().includes(search.toLowerCase()) ||
      t.musteri.toLowerCase().includes(search.toLowerCase());
    return mOk && dOk && sOk;
  });

  // Summary stats (hardcoded as per spec)
  const summaryCards = [
    {
      label: "Toplam Teklif",
      value: "7",
      sub: "Tüm projeler",
      icon: <FileEdit className="w-4.5 h-4.5" style={{ color: "#4F8CFF" }} />,
      pillColor: "rgba(79,140,255,0.12)",
      textColor: "#4F8CFF",
      borderColor: "rgba(79,140,255,0.15)",
    },
    {
      label: "Onay Bekleyen",
      value: "2",
      sub: "Yanıt bekleniyor",
      icon: <Clock className="w-4.5 h-4.5" style={{ color: "#fbbf24" }} />,
      pillColor: "rgba(251,191,36,0.08)",
      textColor: "#fbbf24",
      borderColor: "rgba(251,191,36,0.18)",
    },
    {
      label: "Kabul Edilen",
      value: "3",
      sub: "Proje onaylandı",
      icon: <CheckCircle2 className="w-4.5 h-4.5" style={{ color: "#34d399" }} />,
      pillColor: "rgba(52,211,153,0.08)",
      textColor: "#34d399",
      borderColor: "rgba(52,211,153,0.15)",
    },
    {
      label: "Toplam Hacim",
      value: "29.180.000 ₺",
      sub: "Onaylı + bekleyen",
      icon: <TrendingUp className="w-4.5 h-4.5" style={{ color: "#e4e4e7" }} />,
      pillColor: "rgba(228,228,231,0.05)",
      textColor: "#e4e4e7",
      borderColor: "rgba(228,228,231,0.10)",
    },
  ];

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Page header */}
        <div
          className="px-7 pt-5 pb-0 flex-shrink-0"
          style={{ background: "#000", borderBottom: "1px solid #1a1a1a" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg text-white">Teklif Takip</h2>
              <p className="text-xs text-zinc-600 mt-0.5">
                Tüm projeler · {teklifler.length} teklif · Son güncelleme: Bugün
              </p>
            </div>
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm text-white hover:brightness-110 transition-all"
              style={{ background: "#4F8CFF" }}
            >
              <Plus className="w-4 h-4" />
              Yeni Teklif
            </button>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {summaryCards.map((c, i) => (
              <div
                key={i}
                className="rounded-xl px-4 py-3.5 flex items-center gap-3"
                style={{
                  background: c.pillColor,
                  border: `1px solid ${c.borderColor}`,
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(0,0,0,0.35)",
                    border: `1px solid ${c.borderColor}`,
                  }}
                >
                  {c.icon}
                </div>
                <div className="min-w-0">
                  <div
                    className="text-xl leading-tight tabular-nums"
                    style={{ color: c.textColor }}
                  >
                    {c.value}
                  </div>
                  <div className="text-[11px] text-zinc-600 mt-0.5 leading-tight">
                    {c.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="flex items-center gap-2.5 pb-4 flex-wrap">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ border: "1px solid #242424", background: "#111", minWidth: 210 }}
            >
              <Search className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-xs text-zinc-300 placeholder-zinc-700 outline-none w-full"
                placeholder="Proje veya müşteri ara..."
              />
            </div>
            <Dropdown
              label="Tüm Müşteriler"
              options={musteriler}
              value={musteriFilter}
              onChange={setMusteriFilter}
            />
            <Dropdown
              label="Tüm Durumlar"
              options={durumSecenekleri}
              value={durumFilter}
              onChange={setDurumFilter}
            />
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-500 hover:text-zinc-300 transition-colors ml-auto"
              style={{ border: "1px solid #242424", background: "#111" }}
            >
              <Calendar className="w-3.5 h-3.5" />
              Şub 2026 – Mar 2026
              <ChevronDown className="w-3 h-3" />
            </button>
            {(musteriFilter || durumFilter || search) && (
              <button
                className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors px-2"
                onClick={() => {
                  setMusteriFilter("");
                  setDurumFilter("");
                  setSearch("");
                }}
              >
                Temizle
              </button>
            )}
          </div>
        </div>

        {/* Table area */}
        <div className="flex-1 overflow-y-auto px-7 py-5" style={{ background: "#060606" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm text-zinc-500">
              Tüm Teklifler
              <span className="ml-2 text-[11px] text-zinc-700">
                {filtered.length} kayıt
              </span>
            </h3>
            <button
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              style={{ border: "1px solid #1f1f1f", background: "#111" }}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Excel Export
            </button>
          </div>

          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1f1f1f" }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: "#0c0c0c", borderBottom: "1px solid #1f1f1f" }}>
                  {[
                    { label: "Proje Adı", cls: "text-left px-5" },
                    { label: "Müşteri", cls: "text-left px-4" },
                    { label: "Teklif Tutarı", cls: "text-right px-5" },
                    { label: "Maliyet", cls: "text-right px-4" },
                    { label: "Kâr %", cls: "text-center px-3 w-20" },
                    { label: "Durum", cls: "text-left px-4" },
                    { label: "Rev", cls: "text-center px-3 w-16" },
                    { label: "Gönderim", cls: "text-center px-4 w-24" },
                    { label: "Son Güncelleme", cls: "text-center px-4 w-32" },
                    { label: "İşlemler", cls: "text-center px-4 w-36" },
                    { label: "", cls: "px-3 w-10" },
                  ].map((col, i) => (
                    <th
                      key={i}
                      className={`${col.cls} py-3.5 text-[10px] text-zinc-600 uppercase tracking-widest font-normal`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.map((row, idx) => {
                  const cfg = durumMap[row.durum];
                  const isLast = idx === filtered.length - 1;
                  return (
                    <tr
                      key={row.id}
                      className="transition-all cursor-pointer"
                      style={{
                        background: cfg.rowBg,
                        opacity: cfg.dim ? 0.55 : 1,
                        borderBottom: isLast ? "none" : "1px solid #171717",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.filter = "brightness(1.12)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.filter = "";
                      }}
                    >
                      {/* Proje Adı */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] shrink-0"
                            style={{
                              background: "#181818",
                              border: "1px solid #252525",
                              color: "#71717a",
                            }}
                          >
                            {row.proje[0]}
                          </div>
                          <span className="text-sm text-zinc-200 whitespace-nowrap">
                            {row.proje}
                          </span>
                        </div>
                      </td>

                      {/* Müşteri */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-zinc-500">{row.musteri}</span>
                      </td>

                      {/* Teklif Tutarı */}
                      <td className="px-5 py-3.5 text-right">
                        {row.tutar ? (
                          <span className="text-sm text-zinc-200 tabular-nums">
                            {fmt(row.tutar)}
                          </span>
                        ) : (
                          <span className="text-zinc-700 text-sm">—</span>
                        )}
                      </td>

                      {/* Maliyet */}
                      <td className="px-4 py-3.5 text-right">
                        {row.maliyet ? (
                          <span className="text-sm text-zinc-500 tabular-nums">
                            {fmt(row.maliyet)}
                          </span>
                        ) : (
                          <span className="text-zinc-700 text-sm">—</span>
                        )}
                      </td>

                      {/* Kâr % */}
                      <td className="px-3 py-3.5 text-center">
                        <KarCell kar={row.kar} />
                      </td>

                      {/* Durum */}
                      <td className="px-4 py-3.5">
                        <span
                          className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap"
                          style={cfg.pillStyle}
                        >
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </td>

                      {/* Rev */}
                      <td className="px-3 py-3.5 text-center">
                        {row.revizyon ? (
                          <span
                            className="inline-flex items-center justify-center text-[11px] px-2 py-0.5 rounded"
                            style={{
                              background: "#1a1a1a",
                              border: "1px solid #2a2a2a",
                              color: "#52525b",
                            }}
                          >
                            {row.revizyon}
                          </span>
                        ) : (
                          <span className="text-zinc-800 text-sm">—</span>
                        )}
                      </td>

                      {/* Gönderim */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-xs text-zinc-600">
                          {row.gonderim ?? "—"}
                        </span>
                      </td>

                      {/* Son Güncelleme */}
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className="text-xs"
                          style={{
                            color: row.sonGuncelleme === "Bugün" ? "#4F8CFF" : "#52525b",
                          }}
                        >
                          {row.sonGuncelleme}
                        </span>
                      </td>

                      {/* İşlemler */}
                      <td className="px-4 py-3.5 text-center">
                        <AksiyonBtn aksiyon={row.aksiyon} />
                      </td>

                      {/* 3-dot */}
                      <td className="px-3 py-3.5 text-center">
                        <button className="w-6 h-6 flex items-center justify-center mx-auto rounded text-zinc-800 hover:text-zinc-500 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Footer row */}
              <tfoot>
                <tr style={{ background: "#0D0D0D", borderTop: "1px solid #1f1f1f" }}>
                  <td className="px-5 py-3.5" colSpan={2}>
                    <span className="text-[11px] text-zinc-700 uppercase tracking-widest">
                      Toplam ({filtered.length} teklif)
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-sm text-zinc-300 tabular-nums">
                      {fmt(
                        filtered
                          .filter((t) => t.tutar)
                          .reduce((s, t) => s + (t.tutar ?? 0), 0)
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-sm text-zinc-600 tabular-nums">
                      {fmt(
                        filtered
                          .filter((t) => t.maliyet)
                          .reduce((s, t) => s + (t.maliyet ?? 0), 0)
                      )}
                    </span>
                  </td>
                  <td colSpan={7} />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Uyarı banner */}
          <div
            className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{
              background: "rgba(251,191,36,0.04)",
              border: "1px solid rgba(251,191,36,0.14)",
            }}
          >
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-xs text-zinc-500 flex-1">
              <span className="text-amber-400">2 teklif</span> yanıt bekliyor. En uzun bekleyen:{" "}
              <span className="text-zinc-300">Yargıcı Nişantaşı (10 gün)</span>. Toplu takip
              mesajı için AI Copilot'u kullanın.
            </p>
            <button className="shrink-0 flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap">
              <Bell className="w-3.5 h-3.5" />
              Toplu Hatırlat
            </button>
          </div>
        </div>
      </div>

      {/* AI Copilot */}
      <AICopilot
        context="Teklif Takip"
        welcomeMessage={`Yargıcı Nişantaşı teklifi 10 gündür cevaplanmadı.\n\nTakip mesajı göndermemi ister misin?\n\n📊 Geçmişte bu müşteri ortalama 7 günde yanıt verdi — limit aşıldı.\n\n⏳ Bekleyen teklifler:\n• MACFit Ankara Çankaya — 6 gün\n• Yargıcı Nişantaşı — 10 gün ⚠️\n\nİki projeye birden toplu takip mesajı hazırlayayım mı?`}
        shortcuts={[
          "Yargıcı'ya takip gönder",
          "Toplu hatırlatma",
          "Kabul oranı analizi",
          "Teklif özet raporu",
        ]}
      />
    </div>
  );
}
