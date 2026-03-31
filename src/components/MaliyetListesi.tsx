import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  FileText,
  ChevronDown,
  Calendar,
  Search,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { AICopilot } from "./AICopilot";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProjectStatus = "aktif" | "ihale" | "teklif-gonderildi" | "tamamlandi" | "beklemede";

interface ProjectRow {
  id: string;
  proje: string;
  musteri: string;
  durum: ProjectStatus;
  maliyet: number;
  teklif: number | null;
  fiyatsizKalem: number;
  sonGuncelleme: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const projects: ProjectRow[] = [
  {
    id: "p1",
    proje: "MACFit Ankara",
    musteri: "MACFit",
    durum: "aktif",
    maliyet: 3_240_000,
    teklif: 4_200_000,
    fiyatsizKalem: 0,
    sonGuncelleme: "28 Mar",
  },
  {
    id: "p2",
    proje: "MACFit Forum İstanbul",
    musteri: "MACFit",
    durum: "ihale",
    maliyet: 4_988_513,
    teklif: 8_069_506,
    fiyatsizKalem: 3,
    sonGuncelleme: "Bugün",
  },
  {
    id: "p3",
    proje: "Yargıcı Nişantaşı",
    musteri: "Yargıcı",
    durum: "teklif-gonderildi",
    maliyet: 1_820_000,
    teklif: 2_550_000,
    fiyatsizKalem: 0,
    sonGuncelleme: "25 Mar",
  },
  {
    id: "p4",
    proje: "Koton Kızılay",
    musteri: "Koton",
    durum: "ihale",
    maliyet: 1_960_000,
    teklif: null,
    fiyatsizKalem: 12,
    sonGuncelleme: "22 Mar",
  },
  {
    id: "p5",
    proje: "LC Waikiki Bursa",
    musteri: "LC Waikiki",
    durum: "beklemede",
    maliyet: 2_840_000,
    teklif: 4_680_000,
    fiyatsizKalem: 0,
    sonGuncelleme: "20 Mar",
  },
  {
    id: "p6",
    proje: "Defacto Kadıköy",
    musteri: "Defacto",
    durum: "tamamlandi",
    maliyet: 3_391_487,
    teklif: 9_680_494,
    fiyatsizKalem: 0,
    sonGuncelleme: "15 Mar",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  if (n >= 1_000_000) {
    return (n / 1_000_000).toFixed(3).replace(".", ",") + " ₺";
  }
  return n.toLocaleString("tr-TR") + " ₺";
}

function calcMarj(maliyet: number, teklif: number | null): number | null {
  if (!teklif) return null;
  return ((teklif - maliyet) / maliyet) * 100;
}

function MarjCell({ maliyet, teklif }: { maliyet: number; teklif: number | null }) {
  const marj = calcMarj(maliyet, teklif);
  if (marj === null) return <span className="text-zinc-700 text-sm">—</span>;

  const color = marj >= 50 ? "#34d399" : marj >= 35 ? "#fbbf24" : "#fb923c";
  const bg =
    marj >= 50
      ? "rgba(52,211,153,0.08)"
      : marj >= 35
      ? "rgba(234,179,8,0.08)"
      : "rgba(249,115,22,0.08)";
  const border =
    marj >= 50
      ? "rgba(52,211,153,0.22)"
      : marj >= 35
      ? "rgba(234,179,8,0.22)"
      : "rgba(249,115,22,0.22)";

  return (
    <span
      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full tabular-nums"
      style={{ background: bg, border: `1px solid ${border}`, color }}
    >
      {marj >= 50 ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      %{marj.toFixed(1)}
    </span>
  );
}

const statusConfig: Record<
  ProjectStatus,
  { label: string; style: React.CSSProperties }
> = {
  aktif: {
    label: "Aktif",
    style: {
      background: "rgba(79,140,255,0.10)",
      border: "1px solid rgba(79,140,255,0.28)",
      color: "#4F8CFF",
    },
  },
  ihale: {
    label: "İhale Aşaması",
    style: {
      background: "rgba(234,179,8,0.10)",
      border: "1px solid rgba(234,179,8,0.28)",
      color: "#fbbf24",
    },
  },
  "teklif-gonderildi": {
    label: "Teklif Gönderildi",
    style: {
      background: "rgba(147,51,234,0.10)",
      border: "1px solid rgba(147,51,234,0.28)",
      color: "#c084fc",
    },
  },
  tamamlandi: {
    label: "Tamamlandı",
    style: {
      background: "rgba(52,211,153,0.10)",
      border: "1px solid rgba(52,211,153,0.25)",
      color: "#34d399",
    },
  },
  beklemede: {
    label: "Beklemede",
    style: {
      background: "rgba(113,113,122,0.15)",
      border: "1px solid #2a2a2a",
      color: "#71717a",
    },
  },
};

function StatusBadge({ durum }: { durum: ProjectStatus }) {
  const cfg = statusConfig[durum];
  return (
    <span
      className="inline-flex items-center text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap"
      style={cfg.style}
    >
      {cfg.label}
    </span>
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
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        style={{ border: "1px solid #2a2a2a", background: "#111111" }}
      >
        {value || label}
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div
          className="absolute top-full mt-1 left-0 z-50 rounded-lg overflow-hidden min-w-[160px]"
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

export function MaliyetListesi() {
  const [musteriFilter, setMusteriFilter] = useState("");
  const [durumFilter, setDurumFilter] = useState("");

  const musteriler = [...new Set(projects.map((p) => p.musteri))];
  const durumlar = ["Aktif", "İhale Aşaması", "Teklif Gönderildi", "Beklemede", "Tamamlandı"];

  const filtered = projects.filter((p) => {
    const musteriOk = !musteriFilter || p.musteri === musteriFilter;
    const durumOk =
      !durumFilter ||
      statusConfig[p.durum].label === durumFilter;
    return musteriOk && durumOk;
  });

  // Summary stats
  const totalMaliyet = projects.reduce((s, p) => s + p.maliyet, 0);
  const totalTeklif = projects.filter((p) => p.teklif).reduce((s, p) => s + (p.teklif ?? 0), 0);
  const marjValues = projects
    .filter((p) => p.teklif)
    .map((p) => calcMarj(p.maliyet, p.teklif)!);
  const avgMarj = marjValues.reduce((s, m) => s + m, 0) / marjValues.length;
  const totalFiyatsiz = projects.reduce((s, p) => s + p.fiyatsizKalem, 0);

  const summaryCards = [
    {
      label: "Toplam Aktif Maliyet",
      value: formatCurrency(totalMaliyet),
      sub: `${projects.length} proje`,
      icon: <FileText className="w-4 h-4 text-zinc-500" />,
      accent: "text-zinc-200",
    },
    {
      label: "Toplam Teklif",
      value: formatCurrency(totalTeklif),
      sub: "KDV Hariç",
      icon: <TrendingUp className="w-4 h-4 text-[#4F8CFF]" />,
      accent: "text-[#4F8CFF]",
    },
    {
      label: "Ortalama Marj",
      value: `%${avgMarj.toFixed(1)}`,
      sub: "Tüm projeler",
      icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
      accent: "text-emerald-400",
    },
    {
      label: "Fiyatsız Kalem",
      value: String(totalFiyatsiz),
      sub: "Acil güncelleme gerekli",
      icon: <AlertTriangle className="w-4 h-4 text-orange-400" />,
      accent: "text-orange-400",
    },
  ];

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar activePage="maliyet-listesi" />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <div
          className="px-7 pt-5 pb-0 flex-shrink-0"
          style={{ background: "#000000", borderBottom: "1px solid #1a1a1a" }}
        >
          {/* Title */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg text-white">Maliyet Özeti</h2>
              <p className="text-xs text-zinc-600 mt-0.5">
                Tüm projeler · {projects.length} proje · Son güncelleme: Bugün
              </p>
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex items-center gap-2.5 pb-4">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 max-w-xs"
              style={{ border: "1px solid #2a2a2a", background: "#111111" }}
            >
              <Search className="w-3.5 h-3.5 text-zinc-600" />
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
              Oca 2026 – Mar 2026
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
                  border:
                    card.label === "Fiyatsız Kalem" && totalFiyatsiz > 0
                      ? "1px solid rgba(249,115,22,0.2)"
                      : "1px solid #1f1f1f",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-600 uppercase tracking-widest leading-tight">
                    {card.label}
                  </span>
                  {card.icon}
                </div>
                <div className={`text-xl ${card.accent}`}>{card.value}</div>
                <div className="text-[11px] text-zinc-700">{card.sub}</div>
                {card.label === "Ortalama Marj" && (
                  <div className="h-1 rounded-full mt-0.5" style={{ background: "#1f1f1f" }}>
                    <div
                      className="h-1 rounded-full"
                      style={{
                        width: `${Math.min(avgMarj, 100)}%`,
                        background: "linear-gradient(90deg,#34d399,#10b981)",
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Project Table */}
          <div className="px-7 pb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-zinc-400">
                Proje Bazlı Maliyet Özeti
                <span className="ml-2 text-[11px] text-zinc-700">
                  {filtered.length} proje gösteriliyor
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
                  <tr
                    style={{
                      background: "#0A0A0A",
                      borderBottom: "1px solid #1f1f1f",
                    }}
                  >
                    {[
                      { label: "Proje Adı", align: "left", cls: "px-5" },
                      { label: "Müşteri", align: "left", cls: "px-4" },
                      { label: "Durum", align: "left", cls: "px-4" },
                      { label: "Toplam Maliyet", align: "right", cls: "px-5" },
                      { label: "Toplam Teklif", align: "right", cls: "px-5" },
                      { label: "Marj %", align: "center", cls: "px-4 w-28" },
                      { label: "Fiyatsız Kalem", align: "center", cls: "px-4 w-32" },
                      { label: "Son Güncelleme", align: "center", cls: "px-4 w-32" },
                      { label: "", align: "center", cls: "px-3 w-10" },
                    ].map((col, ci) => (
                      <th
                        key={ci}
                        className={`${col.cls} py-3.5 text-[11px] text-zinc-600 uppercase tracking-widest font-normal text-${col.align}`}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, idx) => {
                    const isLast = idx === filtered.length - 1;
                    const hasWarning = row.fiyatsizKalem > 0;

                    return (
                      <tr
                        key={row.id}
                        className="transition-colors hover:bg-zinc-900/25 cursor-pointer"
                        style={{
                          background: hasWarning
                            ? "rgba(249,115,22,0.025)"
                            : "#111111",
                          borderBottom: isLast ? "none" : "1px solid #1a1a1a",
                        }}
                      >
                        {/* Proje Adı */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] shrink-0"
                              style={{
                                background: "#1a1a1a",
                                border: "1px solid #282828",
                                color: "#71717a",
                              }}
                            >
                              {row.proje[0]}
                            </div>
                            <div>
                              <div className="text-sm text-zinc-200 whitespace-nowrap">
                                {row.proje}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Müşteri */}
                        <td className="px-4 py-4">
                          <span className="text-sm text-zinc-500">{row.musteri}</span>
                        </td>

                        {/* Durum */}
                        <td className="px-4 py-4">
                          <StatusBadge durum={row.durum} />
                        </td>

                        {/* Toplam Maliyet */}
                        <td className="px-5 py-4 text-right">
                          <span className="text-sm text-zinc-300 tabular-nums">
                            {formatCurrency(row.maliyet)}
                          </span>
                        </td>

                        {/* Toplam Teklif */}
                        <td className="px-5 py-4 text-right">
                          {row.teklif ? (
                            <span className="text-sm text-zinc-200 tabular-nums">
                              {formatCurrency(row.teklif)}
                            </span>
                          ) : (
                            <span className="text-sm text-zinc-700">—</span>
                          )}
                        </td>

                        {/* Marj */}
                        <td className="px-4 py-4 text-center">
                          <MarjCell maliyet={row.maliyet} teklif={row.teklif} />
                        </td>

                        {/* Fiyatsız Kalem */}
                        <td className="px-4 py-4 text-center">
                          {row.fiyatsizKalem > 0 ? (
                            <span
                              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                              style={{
                                background: "rgba(249,115,22,0.12)",
                                border: "1px solid rgba(249,115,22,0.28)",
                                color: "#fb923c",
                              }}
                            >
                              <AlertTriangle className="w-3 h-3" />
                              {row.fiyatsizKalem} kalem
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full"
                              style={{
                                background: "rgba(52,211,153,0.08)",
                                border: "1px solid rgba(52,211,153,0.18)",
                                color: "#34d399",
                              }}
                            >
                              ✓ Tam
                            </span>
                          )}
                        </td>

                        {/* Son Güncelleme */}
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`text-xs ${row.sonGuncelleme === "Bugün" ? "text-[#4F8CFF]" : "text-zinc-600"}`}
                          >
                            {row.sonGuncelleme}
                          </span>
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

                {/* Footer totals */}
                <tfoot>
                  <tr
                    style={{
                      background: "#0D0D0D",
                      borderTop: "1px solid #1f1f1f",
                    }}
                  >
                    <td className="px-5 py-3.5" colSpan={3}>
                      <span className="text-[11px] text-zinc-600 uppercase tracking-widest">
                        Toplam ({filtered.length} proje)
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-sm text-zinc-300 tabular-nums">
                        {formatCurrency(
                          filtered.reduce((s, p) => s + p.maliyet, 0)
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-sm text-zinc-200 tabular-nums">
                        {formatCurrency(
                          filtered
                            .filter((p) => p.teklif)
                            .reduce((s, p) => s + (p.teklif ?? 0), 0)
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-sm text-emerald-400">
                        %{avgMarj.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {totalFiyatsiz > 0 ? (
                        <span
                          className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: "rgba(249,115,22,0.12)",
                            border: "1px solid rgba(249,115,22,0.28)",
                            color: "#fb923c",
                          }}
                        >
                          <AlertTriangle className="w-3 h-3" />
                          {totalFiyatsiz}
                        </span>
                      ) : (
                        <span className="text-sm text-zinc-700">0</span>
                      )}
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Bottom tip */}
            {totalFiyatsiz > 0 && (
              <div
                className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{
                  background: "rgba(249,115,22,0.05)",
                  border: "1px solid rgba(249,115,22,0.18)",
                }}
              >
                <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" />
                <div className="text-xs text-zinc-500 flex-1">
                  <span className="text-orange-400">{totalFiyatsiz} fiyatsız kalem</span> bulunuyor.
                  En kritik:{" "}
                  <span className="text-zinc-300">Koton Kızılay (12 kalem)</span>.
                  Fiyat toplama kampanyası başlatmak için AI Copilot'u kullanın.
                </div>
                <button
                  className="shrink-0 flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 transition-colors"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  Fiyat Toplama
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Alt bar */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-7 py-3.5"
          style={{ background: "#0D0D0D", borderTop: "1px solid #1f1f1f" }}
        >
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <span>
              <span className="text-zinc-400">{projects.length}</span> aktif proje
            </span>
            {totalFiyatsiz > 0 && (
              <span className="flex items-center gap-1 text-orange-500">
                <AlertTriangle className="w-3 h-3" />
                {totalFiyatsiz} fiyatsız kalem — güncelleme gerekli
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              style={{ border: "1px solid #2a2a2a", background: "#111111" }}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Excel Export
            </button>
          </div>
        </div>
      </div>

      {/* AI Copilot */}
      <AICopilot
        context="Maliyet Listesi"
        welcomeMessage={`Koton Kızılay'da 12 fiyatsız kalem var.\n\nFiyat toplama kampanyası başlatmamı ister misin?\n\n📊 Genel durum:\n• Toplam aktif maliyet: 18.240.000 ₺\n• Ortalama marj: %60.1 — sağlıklı\n• 2 projede teklif tutarı eksik\n\n⚠️ Koton Kızılay için tedarikçilere RFQ gönderilebilir. Onaylıyor musun?`}
        shortcuts={[
          "Koton RFQ başlat",
          "Marj risklerini göster",
          "Fiyatsız kalemleri listele",
          "Genel maliyet raporu",
        ]}
      />
    </div>
  );
}