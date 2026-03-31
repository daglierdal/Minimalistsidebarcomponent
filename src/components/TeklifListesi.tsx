import { useState } from "react";
import {
  ChevronDown,
  Calendar,
  Search,
  Plus,
  MoreHorizontal,
  Bell,
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  FileEdit,
  TrendingUp,
  ArrowUpRight,
  Send,
  AlertCircle,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { AICopilot } from "./AICopilot";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  revizyon: string | null;
  tutar: number | null;
  durum: TeklifDurum;
  gonderimTarihi: string | null;
  sonGuncelleme: string;
  aksiyon: "takip-et" | "hatirla" | "boq-tamamla" | null;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const teklifler: Teklif[] = [
  {
    id: "t1",
    proje: "MACFit Ankara",
    musteri: "MACFit",
    revizyon: "Rev.2",
    tutar: 4_200_000,
    durum: "kabul-edildi",
    gonderimTarihi: "10 Mar",
    sonGuncelleme: "15 Mar",
    aksiyon: null,
  },
  {
    id: "t2",
    proje: "MACFit Forum İstanbul",
    musteri: "MACFit",
    revizyon: "Rev.1",
    tutar: 8_069_506,
    durum: "degerlendirilmede",
    gonderimTarihi: "24 Mar",
    sonGuncelleme: "Bugün",
    aksiyon: "takip-et",
  },
  {
    id: "t3",
    proje: "Yargıcı Nişantaşı",
    musteri: "Yargıcı",
    revizyon: "Rev.0",
    tutar: 2_550_000,
    durum: "onay-bekliyor",
    gonderimTarihi: "20 Mar",
    sonGuncelleme: "20 Mar",
    aksiyon: "hatirla",
  },
  {
    id: "t4",
    proje: "Koton Kızılay",
    musteri: "Koton",
    revizyon: null,
    tutar: null,
    durum: "taslak",
    gonderimTarihi: null,
    sonGuncelleme: "22 Mar",
    aksiyon: "boq-tamamla",
  },
  {
    id: "t5",
    proje: "MACFit Bursa Nilüfer",
    musteri: "MACFit",
    revizyon: "Rev.0",
    tutar: 3_900_000,
    durum: "kabul-edildi",
    gonderimTarihi: "05 Mar",
    sonGuncelleme: "08 Mar",
    aksiyon: null,
  },
  {
    id: "t6",
    proje: "LC Waikiki Bursa",
    musteri: "LC Waikiki",
    revizyon: "Rev.1",
    tutar: 4_680_000,
    durum: "gonderildi",
    gonderimTarihi: "18 Mar",
    sonGuncelleme: "18 Mar",
    aksiyon: "takip-et",
  },
  {
    id: "t7",
    proje: "Defacto Kadıköy",
    musteri: "Defacto",
    revizyon: "Rev.3",
    tutar: 9_680_494,
    durum: "kabul-edildi",
    gonderimTarihi: "01 Feb",
    sonGuncelleme: "10 Feb",
    aksiyon: null,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  if (n >= 1_000_000) {
    return (
      (n / 1_000_000).toLocaleString("tr-TR", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }) + " ₺"
    );
  }
  return n.toLocaleString("tr-TR") + " ₺";
}

type DurumConfig = {
  label: string;
  icon: React.ReactNode;
  pill: React.CSSProperties;
  rowBg: string;
  rowOpacity?: number;
};

const durumMap: Record<TeklifDurum, DurumConfig> = {
  "kabul-edildi": {
    label: "Kabul Edildi",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    pill: {
      background: "rgba(52,211,153,0.10)",
      border: "1px solid rgba(52,211,153,0.25)",
      color: "#34d399",
    },
    rowBg: "#111111",
  },
  degerlendirilmede: {
    label: "Değerlendirmede",
    icon: <Clock className="w-3.5 h-3.5" />,
    pill: {
      background: "rgba(234,179,8,0.10)",
      border: "1px solid rgba(234,179,8,0.25)",
      color: "#fbbf24",
    },
    rowBg: "rgba(234,179,8,0.035)",
  },
  "onay-bekliyor": {
    label: "Onay Bekliyor",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    pill: {
      background: "rgba(234,179,8,0.10)",
      border: "1px solid rgba(234,179,8,0.25)",
      color: "#fbbf24",
    },
    rowBg: "rgba(234,179,8,0.035)",
  },
  taslak: {
    label: "Taslak",
    icon: <FileEdit className="w-3.5 h-3.5" />,
    pill: {
      background: "rgba(113,113,122,0.12)",
      border: "1px solid #2a2a2a",
      color: "#52525b",
    },
    rowBg: "#111111",
    rowOpacity: 0.6,
  },
  reddedildi: {
    label: "Reddedildi",
    icon: <XCircle className="w-3.5 h-3.5" />,
    pill: {
      background: "rgba(239,68,68,0.10)",
      border: "1px solid rgba(239,68,68,0.22)",
      color: "#f87171",
    },
    rowBg: "#111111",
  },
  gonderildi: {
    label: "Gönderildi",
    icon: <Send className="w-3.5 h-3.5" />,
    pill: {
      background: "rgba(79,140,255,0.10)",
      border: "1px solid rgba(79,140,255,0.25)",
      color: "#4F8CFF",
    },
    rowBg: "#111111",
  },
};

function AksiyonButton({ aksiyon }: { aksiyon: Teklif["aksiyon"] }) {
  if (!aksiyon) return <span className="text-zinc-800 text-xs">—</span>;

  const configs = {
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
        background: "rgba(234,179,8,0.10)",
        border: "1px solid rgba(234,179,8,0.25)",
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

  const cfg = configs[aksiyon];
  return (
    <button
      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-all hover:brightness-110 whitespace-nowrap"
      style={cfg.style}
    >
      {cfg.icon}
      {cfg.label}
    </button>
  );
}

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
        style={{ border: "1px solid #2a2a2a", background: "#111111" }}
      >
        {value || label}
        <ChevronDown className="w-3.5 h-3.5 shrink-0" />
      </button>
      {open && (
        <div
          className="absolute top-full mt-1 left-0 z-50 rounded-lg overflow-hidden min-w-[170px]"
          style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
        >
          {[label, ...options].map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt === label ? "" : opt);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TeklifListesi() {
  const [musteriFilter, setMusteriFilter] = useState("");
  const [durumFilter, setDurumFilter] = useState("");

  const musteriler = [...new Set(teklifler.map((t) => t.musteri))];
  const durumlar = ["Taslak", "Gönderildi", "Onay Bekliyor", "Değerlendirmede", "Kabul Edildi", "Reddedildi"];

  const filtered = teklifler.filter((t) => {
    const musteriOk = !musteriFilter || t.musteri === musteriFilter;
    const durumOk =
      !durumFilter || durumMap[t.durum].label === durumFilter;
    return musteriOk && durumOk;
  });

  // Stats
  const toplamTeklif = teklifler.length;
  const onayBekleyen = teklifler.filter(
    (t) => t.durum === "onay-bekliyor" || t.durum === "degerlendirilmede"
  ).length;
  const kabulEdilen = teklifler.filter((t) => t.durum === "kabul-edildi").length;
  const toplamHacim = teklifler
    .filter((t) => t.tutar)
    .reduce((s, t) => s + (t.tutar ?? 0), 0);

  const summaryCards = [
    {
      label: "Toplam Teklif",
      value: toplamTeklif,
      display: String(toplamTeklif),
      sub: "Tüm projeler",
      color: "text-zinc-200",
      borderColor: "1px solid #1f1f1f",
      icon: <FileEdit className="w-4 h-4 text-zinc-600" />,
    },
    {
      label: "Onay Bekleyen",
      value: onayBekleyen,
      display: String(onayBekleyen),
      sub: "Yanıt bekleniyor",
      color: "text-amber-400",
      borderColor: "1px solid rgba(234,179,8,0.18)",
      icon: <Clock className="w-4 h-4 text-amber-400" />,
    },
    {
      label: "Kabul Edilen",
      value: kabulEdilen,
      display: String(kabulEdilen),
      sub: "Proje onaylandı",
      color: "text-emerald-400",
      borderColor: "1px solid rgba(52,211,153,0.15)",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    },
    {
      label: "Toplam Hacim",
      value: toplamHacim,
      display: formatCurrency(toplamHacim),
      sub: "Onaylı + bekleyen",
      color: "text-[#4F8CFF]",
      borderColor: "1px solid rgba(79,140,255,0.15)",
      icon: <TrendingUp className="w-4 h-4 text-[#4F8CFF]" />,
    },
  ];

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar activePage="teklif-listesi" />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <div
          className="px-7 pt-5 pb-0 flex-shrink-0"
          style={{ background: "#000000", borderBottom: "1px solid #1a1a1a" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg text-white">Teklif Takip</h2>
              <p className="text-xs text-zinc-600 mt-0.5">
                Tüm projeler · {toplamTeklif} teklif · Son güncelleme: Bugün
              </p>
            </div>
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm text-white transition-all hover:brightness-110"
              style={{ background: "#4F8CFF" }}
            >
              <Plus className="w-4 h-4" />
              Yeni Teklif
            </button>
          </div>

          {/* Filter bar */}
          <div className="flex items-center gap-2.5 pb-4 flex-wrap">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{
                border: "1px solid #2a2a2a",
                background: "#111111",
                minWidth: 220,
              }}
            >
              <Search className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
              <input
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
              options={durumlar}
              value={durumFilter}
              onChange={setDurumFilter}
            />
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-500 hover:text-zinc-300 transition-colors ml-auto"
              style={{ border: "1px solid #2a2a2a", background: "#111111" }}
            >
              <Calendar className="w-3.5 h-3.5" />
              Şub 2026 – Mar 2026
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ background: "#080808" }}>
          {/* Summary Cards */}
          <div className="px-7 pt-5 pb-4 grid grid-cols-4 gap-3">
            {summaryCards.map((card, i) => (
              <div
                key={i}
                className="rounded-xl px-4 py-4 flex flex-col gap-2"
                style={{
                  background: "#111111",
                  border: card.borderColor,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-600 uppercase tracking-widest leading-tight">
                    {card.label}
                  </span>
                  {card.icon}
                </div>
                <div className={`text-2xl ${card.color}`}>{card.display}</div>
                <div className="text-[11px] text-zinc-700">{card.sub}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="px-7 pb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-zinc-400">
                Tüm Teklifler
                <span className="ml-2 text-[11px] text-zinc-700">
                  {filtered.length} kayıt
                </span>
              </h3>
              {(musteriFilter || durumFilter) && (
                <button
                  className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors"
                  onClick={() => {
                    setMusteriFilter("");
                    setDurumFilter("");
                  }}
                >
                  Filtreleri temizle
                </button>
              )}
            </div>

            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid #1f1f1f" }}
            >
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#0A0A0A", borderBottom: "1px solid #1f1f1f" }}>
                    {[
                      { label: "Proje Adı", cls: "px-5 text-left" },
                      { label: "Müşteri", cls: "px-4 text-left" },
                      { label: "Revizyon", cls: "px-4 text-center w-24" },
                      { label: "Tutar", cls: "px-5 text-right" },
                      { label: "Durum", cls: "px-4 text-left" },
                      { label: "Gönderim", cls: "px-4 text-center w-28" },
                      { label: "Son Güncelleme", cls: "px-4 text-center w-32" },
                      { label: "İşlemler", cls: "px-4 text-center w-36" },
                      { label: "", cls: "px-3 w-10" },
                    ].map((col, ci) => (
                      <th
                        key={ci}
                        className={`${col.cls} py-3.5 text-[11px] text-zinc-600 uppercase tracking-widest font-normal`}
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
                    const isDraft = row.durum === "taslak";
                    const isUrgent =
                      row.durum === "onay-bekliyor" ||
                      row.durum === "degerlendirilmede";

                    return (
                      <tr
                        key={row.id}
                        className="transition-colors hover:brightness-110 cursor-pointer"
                        style={{
                          background: cfg.rowBg,
                          opacity: isDraft ? 0.65 : 1,
                          borderBottom: isLast ? "none" : "1px solid #1a1a1a",
                        }}
                      >
                        {/* Proje Adı */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] shrink-0"
                              style={{
                                background: isDraft ? "#181818" : "#1a1a1a",
                                border: `1px solid ${isDraft ? "#232323" : "#282828"}`,
                                color: isDraft ? "#3f3f46" : "#71717a",
                              }}
                            >
                              {row.proje[0]}
                            </div>
                            <span
                              className={`text-sm whitespace-nowrap ${
                                isDraft ? "text-zinc-600" : "text-zinc-200"
                              }`}
                            >
                              {row.proje}
                            </span>
                          </div>
                        </td>

                        {/* Müşteri */}
                        <td className="px-4 py-4">
                          <span className={`text-sm ${isDraft ? "text-zinc-700" : "text-zinc-500"}`}>
                            {row.musteri}
                          </span>
                        </td>

                        {/* Revizyon */}
                        <td className="px-4 py-4 text-center">
                          {row.revizyon ? (
                            <span
                              className="inline-flex items-center justify-center text-[11px] px-2 py-0.5 rounded"
                              style={{
                                background: "#1a1a1a",
                                border: "1px solid #282828",
                                color: "#71717a",
                              }}
                            >
                              {row.revizyon}
                            </span>
                          ) : (
                            <span className="text-zinc-800 text-sm">—</span>
                          )}
                        </td>

                        {/* Tutar */}
                        <td className="px-5 py-4 text-right">
                          {row.tutar ? (
                            <span className={`text-sm tabular-nums ${isDraft ? "text-zinc-700" : "text-zinc-200"}`}>
                              {formatCurrency(row.tutar)}
                            </span>
                          ) : (
                            <span className="text-sm text-zinc-800">—</span>
                          )}
                        </td>

                        {/* Durum */}
                        <td className="px-4 py-4">
                          <span
                            className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap"
                            style={cfg.pill}
                          >
                            {cfg.icon}
                            {cfg.label}
                          </span>
                        </td>

                        {/* Gönderim */}
                        <td className="px-4 py-4 text-center">
                          <span className={`text-xs ${row.gonderimTarihi ? "text-zinc-600" : "text-zinc-800"}`}>
                            {row.gonderimTarihi ?? "—"}
                          </span>
                        </td>

                        {/* Son Güncelleme */}
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`text-xs ${
                              row.sonGuncelleme === "Bugün"
                                ? "text-[#4F8CFF]"
                                : "text-zinc-600"
                            }`}
                          >
                            {row.sonGuncelleme}
                          </span>
                        </td>

                        {/* İşlemler */}
                        <td className="px-4 py-4 text-center">
                          <AksiyonButton aksiyon={row.aksiyon} />
                        </td>

                        {/* 3-dot */}
                        <td className="px-3 py-4 text-center">
                          <button className="w-6 h-6 flex items-center justify-center rounded text-zinc-800 hover:text-zinc-500 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Footer */}
                <tfoot>
                  <tr
                    style={{
                      background: "#0D0D0D",
                      borderTop: "1px solid #1f1f1f",
                    }}
                  >
                    <td className="px-5 py-3.5" colSpan={3}>
                      <span className="text-[11px] text-zinc-600 uppercase tracking-widest">
                        Toplam ({filtered.length} teklif)
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-sm text-zinc-200 tabular-nums">
                        {formatCurrency(
                          filtered
                            .filter((t) => t.tutar)
                            .reduce((s, t) => s + (t.tutar ?? 0), 0)
                        )}
                      </span>
                    </td>
                    <td colSpan={5} />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Uyarı banner — onay bekleyenler */}
            {onayBekleyen > 0 && (
              <div
                className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{
                  background: "rgba(234,179,8,0.04)",
                  border: "1px solid rgba(234,179,8,0.16)",
                }}
              >
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-xs text-zinc-500 flex-1">
                  <span className="text-amber-400">{onayBekleyen} teklif</span> yanıt bekliyor.
                  En uzun bekleyen:{" "}
                  <span className="text-zinc-300">Yargıcı Nişantaşı (10 gün)</span>. Takip mesajı için AI Copilot'u kullanın.
                </div>
                <button className="shrink-0 flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors">
                  <Bell className="w-3.5 h-3.5" />
                  Toplu Hatırlat
                </button>
              </div>
            )}

            {/* Yeni Teklif CTA */}
            <div className="mt-4 flex items-center justify-end">
              <button
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm text-white transition-all hover:brightness-110"
                style={{ background: "#4F8CFF" }}
              >
                <Plus className="w-4 h-4" />
                Yeni Teklif Oluştur
              </button>
            </div>
          </div>
        </div>

        {/* Alt bar */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-7 py-3.5"
          style={{ background: "#0D0D0D", borderTop: "1px solid #1f1f1f" }}
        >
          <div className="flex items-center gap-5 text-xs text-zinc-600">
            <span>
              <span className="text-zinc-400">{toplamTeklif}</span> toplam teklif
            </span>
            <span className="flex items-center gap-1 text-amber-500">
              <Clock className="w-3 h-3" />
              {onayBekleyen} yanıt bekliyor
            </span>
            <span className="flex items-center gap-1 text-emerald-500">
              <CheckCircle2 className="w-3 h-3" />
              {kabulEdilen} kabul edildi
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              style={{ border: "1px solid #2a2a2a", background: "#111111" }}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Excel Export
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm text-white transition-all hover:brightness-110"
              style={{ background: "#4F8CFF" }}
            >
              <Plus className="w-3.5 h-3.5" />
              Yeni Teklif
            </button>
          </div>
        </div>
      </div>

      {/* AI Copilot */}
      <AICopilot
        context="Teklif Listesi"
        welcomeMessage={`Yargıcı Nişantaşı teklifi 10 gündür cevaplanmadı.\n\nTakip mesajı göndermemi ister misin?\n\n📊 Geçmişte bu müşteri ortalama 7 günde yanıt verdi — bu limit aşıldı.\n\n⏳ Bekleyen teklifler:\n• MACFit Forum İstanbul — 6 gün\n• Yargıcı Nişantaşı — 10 gün ⚠️\n\nİki projeye birden toplu takip mesajı hazırlayayım mı?`}
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