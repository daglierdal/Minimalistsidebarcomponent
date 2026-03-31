import { useState } from "react";
import {
  ChevronRight,
  Home,
  TrendingUp,
  Package,
  Truck,
  AlertTriangle,
  BarChart2,
  FileText,
  Info,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Sidebar } from "./Sidebar";
import { AICopilot } from "./AICopilot";

// ─── Types & Data ─────────────────────────────────────────────────────────────

type TabKey = "analiz" | "vs-teklif" | "icmal";

interface Disiplin {
  id: string;
  name: string;
  emoji: string;
  anaMaliyet: number;
  sarfMalzeme: number;
  lojistik: number;
  teklif: number;
  accentColor: string;
}

const disiplinler: Disiplin[] = [
  {
    id: "insaat",
    name: "İnşaat",
    emoji: "🏗️",
    anaMaliyet: 4_920_000,
    sarfMalzeme: 848_513,
    lojistik: 220_000,
    teklif: 9_800_000,
    accentColor: "#4F8CFF",
  },
  {
    id: "elektrik",
    name: "Elektrik",
    emoji: "⚡",
    anaMaliyet: 720_000,
    sarfMalzeme: 240_000,
    lojistik: 60_000,
    teklif: 1_650_000,
    accentColor: "#fbbf24",
  },
  {
    id: "mekanik",
    name: "Mekanik",
    emoji: "🔧",
    anaMaliyet: 710_000,
    sarfMalzeme: 140_000,
    lojistik: 40_000,
    teklif: 1_430_000,
    accentColor: "#34d399",
  },
  {
    id: "mobilya",
    name: "Mobilya",
    emoji: "🪑",
    anaMaliyet: 430_000,
    sarfMalzeme: 48_000,
    lojistik: 20_000,
    teklif: 800_000,
    accentColor: "#c084fc",
  },
  {
    id: "aydinlatma",
    name: "Aydınlatma",
    emoji: "💡",
    anaMaliyet: 310_000,
    sarfMalzeme: 45_000,
    lojistik: 15_000,
    teklif: 589_506,
    accentColor: "#fb923c",
  },
];

const TOPLAM_MALIYET = 8_766_513;
const TOPLAM_TEKLIF = 14_269_506;
const KAR_MARJI = ((TOPLAM_TEKLIF - TOPLAM_MALIYET) / TOPLAM_MALIYET) * 100;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number, compact = false): string {
  if (compact && n >= 1_000_000) {
    return (n / 1_000_000).toFixed(2).replace(".", ",") + " M₺";
  }
  if (compact && n >= 1_000) {
    return (n / 1_000).toFixed(0) + " K₺";
  }
  return n.toLocaleString("tr-TR") + " ₺";
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function DisiplinKart({ d }: { d: Disiplin }) {
  const gercekMaliyet = d.anaMaliyet + d.sarfMalzeme + d.lojistik;
  const sarfOran = ((d.sarfMalzeme / gercekMaliyet) * 100).toFixed(1);
  const isHighSarf = d.sarfMalzeme / gercekMaliyet > 0.2;

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{
        background: "#111111",
        border: `1px solid #1f1f1f`,
        borderLeft: `3px solid ${d.accentColor}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{d.emoji}</span>
          <div>
            <div className="text-sm text-zinc-200">{d.name}</div>
            <div className="text-[11px] text-zinc-600 mt-0.5">Gerçek Maliyet</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-base tabular-nums" style={{ color: d.accentColor }}>
            {fmt(gercekMaliyet)}
          </div>
          {isHighSarf && (
            <div className="flex items-center justify-end gap-1 mt-0.5">
              <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
              <span className="text-[10px] text-amber-400">Sarf %{sarfOran} yüksek</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="h-1.5 rounded-full overflow-hidden flex" style={{ background: "#1a1a1a" }}>
          <div
            className="h-full rounded-l-full"
            style={{
              width: `${(d.anaMaliyet / gercekMaliyet) * 100}%`,
              background: d.accentColor,
              opacity: 0.85,
            }}
          />
          <div
            className="h-full"
            style={{
              width: `${(d.sarfMalzeme / gercekMaliyet) * 100}%`,
              background: d.accentColor,
              opacity: 0.45,
            }}
          />
          <div
            className="h-full rounded-r-full"
            style={{
              width: `${(d.lojistik / gercekMaliyet) * 100}%`,
              background: d.accentColor,
              opacity: 0.2,
            }}
          />
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            icon: <BarChart2 className="w-3 h-3" />,
            label: "Ana Maliyet",
            value: d.anaMaliyet,
            color: d.accentColor,
            opacity: "opacity-100",
          },
          {
            icon: <Package className="w-3 h-3" />,
            label: "Sarf Malzeme",
            value: d.sarfMalzeme,
            color: d.accentColor,
            opacity: "opacity-60",
            warn: isHighSarf,
          },
          {
            icon: <Truck className="w-3 h-3" />,
            label: "Lojistik",
            value: d.lojistik,
            color: d.accentColor,
            opacity: "opacity-30",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="rounded-lg px-2.5 py-2 flex flex-col gap-1"
            style={{
              background: "#0D0D0D",
              border: item.warn ? "1px solid rgba(251,191,36,0.2)" : "1px solid #1a1a1a",
            }}
          >
            <div className="flex items-center gap-1" style={{ color: item.color, opacity: 0.7 }}>
              {item.icon}
              <span className="text-[10px] text-zinc-600 truncate">{item.label}</span>
            </div>
            <div className="text-[11px] tabular-nums text-zinc-400">
              {fmt(item.value, true)}
            </div>
          </div>
        ))}
      </div>

      {/* Toplam satırı */}
      <div
        className="flex items-center justify-between pt-2"
        style={{ borderTop: "1px solid #1a1a1a" }}
      >
        <span className="text-[11px] text-zinc-700">Ana + Sarf + Lojistik</span>
        <span className="text-xs text-zinc-400 tabular-nums">= {fmt(gercekMaliyet)}</span>
      </div>
    </div>
  );
}

// Custom tooltip for chart
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 shadow-xl text-xs"
      style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
    >
      <div className="text-zinc-400 mb-2">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-zinc-400">{p.name}:</span>
          <span className="text-zinc-200 tabular-nums">{fmt(p.value)}</span>
        </div>
      ))}
      {payload.length === 2 && (
        <div
          className="flex items-center gap-2 mt-2 pt-2"
          style={{ borderTop: "1px solid #2a2a2a" }}
        >
          <TrendingUp className="w-3 h-3 text-emerald-400" />
          <span className="text-emerald-400">
            Marj:{" "}
            {(
              ((payload[1].value - payload[0].value) / payload[0].value) *
              100
            ).toFixed(1)}
            %
          </span>
        </div>
      )}
    </div>
  );
}

const chartData = disiplinler.map((d) => ({
  name: d.name,
  Maliyet: d.anaMaliyet + d.sarfMalzeme + d.lojistik,
  Teklif: d.teklif,
}));

// ─── Icmal Tab ────────────────────────────────────────────────────────────────

function IcmalTab() {
  const icmalRows = disiplinler.map((d) => {
    const maliyet = d.anaMaliyet + d.sarfMalzeme + d.lojistik;
    const marj = ((d.teklif - maliyet) / maliyet) * 100;
    return { ...d, maliyet, marj };
  });

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid #1f1f1f" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ background: "#0A0A0A", borderBottom: "1px solid #1f1f1f" }}>
              {["Disiplin", "Ana Maliyet", "Sarf", "Lojistik", "Gerçek Maliyet", "Teklif", "Marj %"].map(
                (col, i) => (
                  <th
                    key={i}
                    className={`py-3.5 px-5 text-[11px] text-zinc-600 uppercase tracking-widest font-normal ${i > 0 ? "text-right" : "text-left"}`}
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {icmalRows.map((row, idx) => (
              <tr
                key={row.id}
                className="transition-colors hover:bg-zinc-900/30"
                style={{
                  background: "#111111",
                  borderBottom: idx < icmalRows.length - 1 ? "1px solid #1a1a1a" : "none",
                }}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span>{row.emoji}</span>
                    <span className="text-sm text-zinc-300">{row.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right text-sm text-zinc-500 tabular-nums">
                  {fmt(row.anaMaliyet)}
                </td>
                <td className="px-5 py-3.5 text-right text-sm text-zinc-500 tabular-nums">
                  {fmt(row.sarfMalzeme)}
                </td>
                <td className="px-5 py-3.5 text-right text-sm text-zinc-500 tabular-nums">
                  {fmt(row.lojistik)}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className="text-sm text-zinc-200 tabular-nums">{fmt(row.maliyet)}</span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className="text-sm text-[#4F8CFF] tabular-nums">{fmt(row.teklif)}</span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span
                    className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full tabular-nums"
                    style={{
                      background:
                        row.marj >= 60
                          ? "rgba(52,211,153,0.10)"
                          : "rgba(79,140,255,0.10)",
                      border:
                        row.marj >= 60
                          ? "1px solid rgba(52,211,153,0.22)"
                          : "1px solid rgba(79,140,255,0.22)",
                      color: row.marj >= 60 ? "#34d399" : "#4F8CFF",
                    }}
                  >
                    <TrendingUp className="w-2.5 h-2.5" />
                    %{row.marj.toFixed(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "#0D0D0D", borderTop: "1px solid #1f1f1f" }}>
              <td className="px-5 py-3.5">
                <span className="text-[11px] text-zinc-600 uppercase tracking-widest">Toplam</span>
              </td>
              <td className="px-5 py-3.5 text-right text-sm text-zinc-400 tabular-nums">
                {fmt(disiplinler.reduce((s, d) => s + d.anaMaliyet, 0))}
              </td>
              <td className="px-5 py-3.5 text-right text-sm text-zinc-400 tabular-nums">
                {fmt(disiplinler.reduce((s, d) => s + d.sarfMalzeme, 0))}
              </td>
              <td className="px-5 py-3.5 text-right text-sm text-zinc-400 tabular-nums">
                {fmt(disiplinler.reduce((s, d) => s + d.lojistik, 0))}
              </td>
              <td className="px-5 py-3.5 text-right text-sm text-zinc-200 tabular-nums">
                {fmt(TOPLAM_MALIYET)}
              </td>
              <td className="px-5 py-3.5 text-right text-sm text-[#4F8CFF] tabular-nums">
                {fmt(TOPLAM_TEKLIF)}
              </td>
              <td className="px-5 py-3.5 text-right">
                <span className="text-sm text-emerald-400">%{KAR_MARJI.toFixed(1)}</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Maliyetler() {
  const [activeTab, setActiveTab] = useState<TabKey>("analiz");

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "analiz", label: "Maliyet Analizi", icon: <BarChart2 className="w-3.5 h-3.5" /> },
    { key: "vs-teklif", label: "Maliyet vs Teklif", icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { key: "icmal", label: "İcmal", icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar activePage="maliyetler" />

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
              onClick={() => (window.location.href = "/projects")}
              className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1"
            >
              <Home className="w-3 h-3" />
              Projeler
            </button>
            <ChevronRight className="w-3 h-3 text-zinc-700" />
            <button
              onClick={() => (window.location.href = "/projects/2")}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              MACFit Forum İstanbul
            </button>
            <ChevronRight className="w-3 h-3 text-zinc-700" />
            <span className="text-[11px] text-zinc-300">Maliyetler</span>
          </div>

          {/* Title */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg text-white">Maliyetler</h2>
              <p className="text-xs text-zinc-600 mt-0.5">
                MACFit Forum İstanbul · 5 disiplin · Toplam:{" "}
                <span className="text-zinc-400">{fmt(TOPLAM_MALIYET)}</span>
              </p>
            </div>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-500"
              style={{ background: "#111111", border: "1px solid #1f1f1f" }}
            >
              <Info className="w-3 h-3" />
              KDV Hariç · Nisan 2026
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm transition-all relative"
                  style={{
                    color: isActive ? "#fff" : "#71717a",
                    borderBottom: isActive ? "2px solid #4F8CFF" : "2px solid transparent",
                  }}
                >
                  <span style={{ color: isActive ? "#4F8CFF" : "#52525b" }}>{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ background: "#080808" }}>
          {/* ── Maliyet Analizi ── */}
          {activeTab === "analiz" && (
            <div className="px-7 pt-5 pb-8 space-y-5">
              {/* Toplam özet */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Toplam Gerçek Maliyet",
                    value: fmt(TOPLAM_MALIYET),
                    sub: "Ana + Sarf + Lojistik",
                    color: "text-zinc-200",
                    border: "1px solid #1f1f1f",
                  },
                  {
                    label: "Toplam Teklif",
                    value: fmt(TOPLAM_TEKLIF),
                    sub: "KDV Hariç",
                    color: "text-[#4F8CFF]",
                    border: "1px solid rgba(79,140,255,0.18)",
                  },
                  {
                    label: "Kar Marjı",
                    value: `%${KAR_MARJI.toFixed(1)}`,
                    sub: "Sağlıklı seviye",
                    color: "text-emerald-400",
                    border: "1px solid rgba(52,211,153,0.18)",
                  },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="rounded-xl px-5 py-4"
                    style={{ background: "#111111", border: c.border }}
                  >
                    <div className="text-[11px] text-zinc-600 uppercase tracking-widest mb-2">
                      {c.label}
                    </div>
                    <div className={`text-xl ${c.color} tabular-nums`}>{c.value}</div>
                    <div className="text-[11px] text-zinc-700 mt-1">{c.sub}</div>
                  </div>
                ))}
              </div>

              {/* Elektrik uyarısı */}
              <div
                className="flex items-start gap-3 px-4 py-3 rounded-xl"
                style={{
                  background: "rgba(251,191,36,0.04)",
                  border: "1px solid rgba(251,191,36,0.15)",
                }}
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-zinc-500">
                  <span className="text-amber-400">Elektrik</span> disiplininde sarf malzeme oranı{" "}
                  <span className="text-zinc-300">%{((120_000 / 720_000) * 100).toFixed(0)}</span>{" "}
                  — tipik oran %15 altında olmalı. Tedarikçi fiyatlarını gözden geçirin.
                </div>
              </div>

              {/* Disiplin Kartları */}
              <div className="grid grid-cols-1 gap-3">
                {disiplinler.map((d) => (
                  <DisiplinKart key={d.id} d={d} />
                ))}
              </div>
            </div>
          )}

          {/* ── Maliyet vs Teklif ── */}
          {activeTab === "vs-teklif" && (
            <div className="px-7 pt-5 pb-8 space-y-5">
              {/* Özet kartlar */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Toplam Maliyet",
                    value: fmt(TOPLAM_MALIYET),
                    color: "text-[#4F8CFF]",
                    border: "1px solid rgba(79,140,255,0.15)",
                  },
                  {
                    label: "Toplam Teklif",
                    value: fmt(TOPLAM_TEKLIF),
                    color: "text-emerald-400",
                    border: "1px solid rgba(52,211,153,0.15)",
                  },
                  {
                    label: "Toplam Kâr Marjı",
                    value: `%${KAR_MARJI.toFixed(1)}`,
                    color: "text-emerald-400",
                    border: "1px solid rgba(52,211,153,0.18)",
                    highlight: true,
                  },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="rounded-xl px-5 py-4"
                    style={{
                      background: c.highlight
                        ? "rgba(52,211,153,0.04)"
                        : "#111111",
                      border: c.border,
                    }}
                  >
                    <div className="text-[11px] text-zinc-600 uppercase tracking-widest mb-2">
                      {c.label}
                    </div>
                    <div className={`text-xl ${c.color} tabular-nums`}>{c.value}</div>
                  </div>
                ))}
              </div>

              {/* Bar Chart */}
              <div
                className="rounded-xl p-5"
                style={{ background: "#111111", border: "1px solid #1f1f1f" }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm text-zinc-300">Disiplin Bazlı Maliyet / Teklif Karşılaştırması</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-2 rounded-sm" style={{ background: "#4F8CFF" }} />
                      <span className="text-[11px] text-zinc-600">Maliyet</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-2 rounded-sm" style={{ background: "#34d399" }} />
                      <span className="text-[11px] text-zinc-600">Teklif</span>
                    </div>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                    barCategoryGap="30%"
                    barGap={4}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1f1f1f"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#52525b", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#52525b", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) =>
                        v >= 1_000_000
                          ? `${(v / 1_000_000).toFixed(1)}M`
                          : v >= 1_000
                          ? `${(v / 1_000).toFixed(0)}K`
                          : String(v)
                      }
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                    <Bar dataKey="Maliyet" fill="#4F8CFF" radius={[4, 4, 0, 0]} maxBarSize={48}>
                      {chartData.map((_, index) => (
                        <Cell key={index} fill="#4F8CFF" opacity={0.8} />
                      ))}
                    </Bar>
                    <Bar dataKey="Teklif" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={48}>
                      {chartData.map((_, index) => (
                        <Cell key={index} fill="#34d399" opacity={0.7} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Disiplin marj tablosu */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid #1f1f1f" }}
              >
                <div
                  className="px-5 py-3 flex items-center gap-2"
                  style={{ background: "#0A0A0A", borderBottom: "1px solid #1f1f1f" }}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-zinc-600" />
                  <span className="text-[11px] text-zinc-600 uppercase tracking-widest">
                    Disiplin Marj Özeti
                  </span>
                </div>
                <div className="divide-y divide-zinc-900">
                  {disiplinler.map((d) => {
                    const maliyet = d.anaMaliyet + d.sarfMalzeme + d.lojistik;
                    const marj = ((d.teklif - maliyet) / maliyet) * 100;
                    const pct = Math.min(marj, 100);
                    return (
                      <div
                        key={d.id}
                        className="px-5 py-3.5 flex items-center gap-4"
                        style={{ background: "#111111" }}
                      >
                        <span className="text-sm">{d.emoji}</span>
                        <span className="text-sm text-zinc-300 w-28 shrink-0">{d.name}</span>
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#1a1a1a" }}>
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              background: marj >= 60 ? "#34d399" : "#4F8CFF",
                            }}
                          />
                        </div>
                        <span
                          className="text-xs tabular-nums shrink-0"
                          style={{ color: marj >= 60 ? "#34d399" : "#4F8CFF", width: 42, textAlign: "right" }}
                        >
                          %{marj.toFixed(1)}
                        </span>
                        <span className="text-xs text-zinc-600 tabular-nums shrink-0 w-28 text-right">
                          {fmt(d.teklif)} teklif
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── İcmal ── */}
          {activeTab === "icmal" && (
            <div className="px-7 pt-5 pb-8">
              <IcmalTab />
            </div>
          )}
        </div>

        {/* Alt bar */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-7 py-3.5"
          style={{ background: "#0D0D0D", borderTop: "1px solid #1f1f1f" }}
        >
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <span>
              Son güncelleme:{" "}
              <span className="text-zinc-400">30 Mart 2026</span>
            </span>
            <span>
              5 disiplin ·{" "}
              <span className="text-zinc-400">{fmt(TOPLAM_MALIYET)}</span> gerçek maliyet
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              style={{ border: "1px solid #2a2a2a", background: "#111111" }}
            >
              <FileText className="w-3.5 h-3.5" />
              PDF Raporu
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm text-white transition-all hover:brightness-110"
              style={{ background: "#4F8CFF" }}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Teklife Aktar
            </button>
          </div>
        </div>
      </div>

      {/* AI Copilot */}
      <AICopilot
        context="Maliyetler"
        welcomeMessage={`Gerçek maliyet sarf ve lojistik dahil **8.766.513 ₺**. Teklif marjı **%61.8**.\n\n⚡ Elektrik disiplininde sarf malzeme oranı yüksek — dikkat.\n\nSarf oranı %23.5 iken hedef %15 altı olmalı. Tedarikçi alternatifleri araştırmamı ister misin?\n\n📊 En yüksek marjlı disiplin:\n• Mobilya: %60.9\n• Mekanik: %60.7\n• İnşaat: %63.0\n\nTeklif hazırlığı için maliyet raporu oluşturabilir misin?`}
        shortcuts={[
          "Elektrik sarf analizi",
          "PDF raporu oluştur",
          "Teklife aktar",
          "Disiplin bazlı karşılaştır",
        ]}
      />
    </div>
  );
}
