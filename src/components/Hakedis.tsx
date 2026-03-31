import { useState } from "react";
import {
  ChevronRight,
  Home,
  Plus,
  Download,
  CheckCircle2,
  Clock,
  Lock,
  TrendingUp,
  FileText,
  Wallet,
  MoreHorizontal,
  Send,
  AlertTriangle,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { AICopilot } from "./AICopilot";

// ─── Types ────────────────────────────────────────────────────────────────────

type HakedisStatus = "onaylandi" | "tahsil" | "bekliyor" | "kilitli";

interface HakedisDonemi {
  id: string;
  donem: string;
  tarih: string;
  tutar: number | null;
  yuzde: number | null;
  durum: HakedisStatus;
  aciklama: string | null;
}

interface DisciplineProgress {
  label: string;
  yuzde: number;
  color: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const donemler: HakedisDonemi[] = [
  {
    id: "h1",
    donem: "H1",
    tarih: "Mart 2026",
    tutar: 1_260_000,
    yuzde: 30,
    durum: "onaylandi",
    aciklama: "Müşteriye Gönderildi",
  },
  {
    id: "h2",
    donem: "H2",
    tarih: "Nisan 2026",
    tutar: 840_000,
    yuzde: 20,
    durum: "tahsil",
    aciklama: "Tahsil Edildi",
  },
  {
    id: "h3",
    donem: "H3",
    tarih: "Mayıs 2026",
    tutar: 840_000,
    yuzde: 20,
    durum: "bekliyor",
    aciklama: null,
  },
  {
    id: "h4",
    donem: "H4",
    tarih: "Haziran 2026",
    tutar: null,
    yuzde: null,
    durum: "kilitli",
    aciklama: null,
  },
];

const disciplineProgress: DisciplineProgress[] = [
  { label: "İnşaat", yuzde: 85, color: "#4F8CFF" },
  { label: "Elektrik", yuzde: 60, color: "#34d399" },
  { label: "Mekanik", yuzde: 70, color: "#c084fc" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  return n.toLocaleString("tr-TR") + " ₺";
}

function StatusBadge({ durum }: { durum: HakedisStatus }) {
  const map: Record<HakedisStatus, { label: string; icon: React.ReactNode; style: React.CSSProperties }> = {
    onaylandi: {
      label: "Onaylandı",
      icon: <CheckCircle2 className="w-3 h-3" />,
      style: {
        background: "rgba(52,211,153,0.10)",
        border: "1px solid rgba(52,211,153,0.25)",
        color: "#34d399",
      },
    },
    tahsil: {
      label: "Tahsil Edildi",
      icon: <CheckCircle2 className="w-3 h-3" />,
      style: {
        background: "rgba(79,140,255,0.10)",
        border: "1px solid rgba(79,140,255,0.3)",
        color: "#4F8CFF",
      },
    },
    bekliyor: {
      label: "Onay Bekliyor",
      icon: <Clock className="w-3 h-3" />,
      style: {
        background: "rgba(234,179,8,0.10)",
        border: "1px solid rgba(234,179,8,0.28)",
        color: "#fbbf24",
      },
    },
    kilitli: {
      label: "Kilitli",
      icon: <Lock className="w-3 h-3" />,
      style: {
        background: "rgba(63,63,70,0.3)",
        border: "1px solid #2a2a2a",
        color: "#52525b",
      },
    },
  };
  const cfg = map[durum];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap"
      style={cfg.style}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Hakedis() {
  const [selectedRow, setSelectedRow] = useState<string | null>("h3");

  const sozlesmeBedeli = 4_200_000;
  const kumHakedis = 2_940_000;
  const buDonem = 840_000;
  const kalan = sozlesmeBedeli - kumHakedis;
  const tamamlanmaYuzdesi = (kumHakedis / sozlesmeBedeli) * 100;

  const summaryCards = [
    {
      label: "Sözleşme Bedeli",
      value: formatCurrency(sozlesmeBedeli),
      sub: "KDV Hariç",
      icon: <FileText className="w-4 h-4 text-zinc-500" />,
      accent: "text-zinc-200",
    },
    {
      label: "Kümülatif Hakediş",
      value: formatCurrency(kumHakedis),
      sub: `%${tamamlanmaYuzdesi.toFixed(0)} tamamlandı`,
      icon: <TrendingUp className="w-4 h-4 text-[#4F8CFF]" />,
      accent: "text-[#4F8CFF]",
    },
    {
      label: "Bu Dönem",
      value: formatCurrency(buDonem),
      sub: "H3 · Mayıs 2026",
      icon: <Clock className="w-4 h-4 text-amber-400" />,
      accent: "text-amber-400",
    },
    {
      label: "Kalan",
      value: formatCurrency(kalan),
      sub: "%30 tamamlanacak",
      icon: <Wallet className="w-4 h-4 text-zinc-500" />,
      accent: "text-zinc-300",
    },
  ];

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar activePage="hakedis" />

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
              MACFit Ankara
            </button>
            <ChevronRight className="w-3 h-3 text-zinc-700" />
            <span className="text-[11px] text-zinc-300">Hakediş</span>
          </div>

          {/* Title + Actions */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg text-white">Hakediş Yönetimi</h2>
              <p className="text-xs text-zinc-600 mt-0.5">
                MACFit Ankara · 4 dönem · H3 onay bekliyor
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-300 hover:text-white transition-colors"
                style={{ border: "1px solid #2a2a2a", background: "#111111" }}
              >
                <Download className="w-3.5 h-3.5" />
                PDF Export
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white transition-all hover:brightness-110"
                style={{ background: "#4F8CFF" }}
              >
                <Plus className="w-3.5 h-3.5" />
                Yeni Hakediş Dönemi
              </button>
            </div>
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
                  <span className="text-[11px] text-zinc-600 uppercase tracking-widest leading-tight">
                    {card.label}
                  </span>
                  {card.icon}
                </div>
                <div className={`text-xl ${card.accent}`}>{card.value}</div>
                <div className="text-[11px] text-zinc-700">{card.sub}</div>
              </div>
            ))}
          </div>

          {/* Genel İlerleme Barı */}
          <div className="px-7 pb-5">
            <div
              className="rounded-xl px-5 py-4"
              style={{ background: "#111111", border: "1px solid #1f1f1f" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-zinc-400">Proje İlerlemesi</span>
                <div className="flex items-center gap-3 text-xs text-zinc-600">
                  <span>
                    <span className="text-[#4F8CFF]">{formatCurrency(kumHakedis)}</span>
                    {" / "}
                    {formatCurrency(sozlesmeBedeli)}
                  </span>
                  <span
                    className="text-sm px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(79,140,255,0.12)",
                      border: "1px solid rgba(79,140,255,0.3)",
                      color: "#4F8CFF",
                    }}
                  >
                    %{tamamlanmaYuzdesi.toFixed(0)}
                  </span>
                </div>
              </div>
              <div className="relative h-3 rounded-full overflow-hidden" style={{ background: "#1f1f1f" }}>
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${tamamlanmaYuzdesi}%`,
                    background: "linear-gradient(90deg, #3b72d9 0%, #4F8CFF 100%)",
                    boxShadow: "0 0 10px rgba(79,140,255,0.4)",
                  }}
                />
                {/* Milestone markers */}
                {[25, 50, 75].map((m) => (
                  <div
                    key={m}
                    className="absolute top-0 h-full w-px"
                    style={{ left: `${m}%`, background: "rgba(0,0,0,0.4)" }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1.5 text-[10px] text-zinc-700">
                <span>%0</span>
                <span>%25</span>
                <span>%50</span>
                <span>%75</span>
                <span>%100</span>
              </div>
            </div>
          </div>

          {/* Hakediş Dönemleri Tablosu */}
          <div className="px-7 pb-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-zinc-400">Hakediş Dönemleri</h3>
              <span className="text-[11px] text-zinc-700">
                {donemler.filter((d) => d.durum !== "kilitli").length} / {donemler.length} dönem aktif
              </span>
            </div>

            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1f1f1f" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#0A0A0A", borderBottom: "1px solid #1f1f1f" }}>
                    <th className="text-left px-5 py-3.5 text-[11px] text-zinc-600 uppercase tracking-widest font-normal w-16">
                      Dönem
                    </th>
                    <th className="text-left px-5 py-3.5 text-[11px] text-zinc-600 uppercase tracking-widest font-normal">
                      Tarih
                    </th>
                    <th className="text-right px-5 py-3.5 text-[11px] text-zinc-600 uppercase tracking-widest font-normal">
                      Tutar
                    </th>
                    <th className="text-center px-5 py-3.5 text-[11px] text-zinc-600 uppercase tracking-widest font-normal w-20">
                      Pay %
                    </th>
                    <th className="text-center px-5 py-3.5 text-[11px] text-zinc-600 uppercase tracking-widest font-normal w-40">
                      Durum
                    </th>
                    <th className="text-left px-5 py-3.5 text-[11px] text-zinc-600 uppercase tracking-widest font-normal">
                      Açıklama
                    </th>
                    <th className="text-center px-3 py-3.5 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {donemler.map((row, idx) => {
                    const isLast = idx === donemler.length - 1;
                    const isSelected = selectedRow === row.id;
                    const isLocked = row.durum === "kilitli";

                    return (
                      <tr
                        key={row.id}
                        onClick={() => !isLocked && setSelectedRow(isSelected ? null : row.id)}
                        className="transition-colors"
                        style={{
                          background: isSelected
                            ? "rgba(79,140,255,0.06)"
                            : row.durum === "bekliyor"
                            ? "rgba(234,179,8,0.03)"
                            : "#111111",
                          borderBottom: isLast ? "none" : "1px solid #1a1a1a",
                          cursor: isLocked ? "default" : "pointer",
                        }}
                      >
                        {/* Dönem */}
                        <td className="px-5 py-4">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-xs"
                            style={{
                              background: isSelected
                                ? "rgba(79,140,255,0.15)"
                                : isLocked
                                ? "#1a1a1a"
                                : "#1a1a1a",
                              border: isSelected
                                ? "1px solid rgba(79,140,255,0.35)"
                                : "1px solid #282828",
                              color: isSelected ? "#4F8CFF" : isLocked ? "#3f3f46" : "#a1a1aa",
                            }}
                          >
                            {row.donem}
                          </div>
                        </td>

                        {/* Tarih */}
                        <td className="px-5 py-4">
                          <span className={`text-sm ${isLocked ? "text-zinc-700" : "text-zinc-300"}`}>
                            {row.tarih}
                          </span>
                        </td>

                        {/* Tutar */}
                        <td className="px-5 py-4 text-right">
                          {row.tutar !== null ? (
                            <span className={`text-sm ${isSelected ? "text-[#4F8CFF]" : "text-zinc-200"}`}>
                              {formatCurrency(row.tutar)}
                            </span>
                          ) : (
                            <span className="text-sm text-zinc-700">—</span>
                          )}
                        </td>

                        {/* Yüzde */}
                        <td className="px-5 py-4 text-center">
                          {row.yuzde !== null ? (
                            <span className="text-sm text-zinc-400">%{row.yuzde}</span>
                          ) : (
                            <span className="text-sm text-zinc-700">—</span>
                          )}
                        </td>

                        {/* Durum */}
                        <td className="px-5 py-4 text-center">
                          <StatusBadge durum={row.durum} />
                        </td>

                        {/* Açıklama */}
                        <td className="px-5 py-4">
                          {row.aciklama ? (
                            <span className="text-xs text-zinc-600">{row.aciklama}</span>
                          ) : row.durum === "bekliyor" ? (
                            <span className="flex items-center gap-1.5 text-xs text-amber-500/70">
                              <AlertTriangle className="w-3 h-3" />
                              Müşteri onayı bekleniyor
                            </span>
                          ) : (
                            <span className="text-xs text-zinc-800">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-4 text-center">
                          {!isLocked && (
                            <button
                              className="w-6 h-6 flex items-center justify-center rounded text-zinc-700 hover:text-zinc-400 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Disiplin Bazlı İlerleme */}
          <div className="px-7 pb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-zinc-400">Disiplin Bazlı İlerleme</h3>
              <span className="text-[11px] text-zinc-700">Kümülatif tamamlanma</span>
            </div>

            <div
              className="rounded-xl px-5 py-5 grid grid-cols-3 gap-6"
              style={{ background: "#111111", border: "1px solid #1f1f1f" }}
            >
              {disciplineProgress.map((d) => (
                <div key={d.label} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-300">{d.label}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: `${d.color}18`,
                        border: `1px solid ${d.color}35`,
                        color: d.color,
                      }}
                    >
                      %{d.yuzde}
                    </span>
                  </div>
                  <div className="relative h-2 rounded-full" style={{ background: "#1f1f1f" }}>
                    <div
                      className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${d.yuzde}%`,
                        background: d.color,
                        boxShadow: `0 0 8px ${d.color}50`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-700">
                    <span>%0</span>
                    <span>%100</span>
                  </div>
                </div>
              ))}
            </div>
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
                {donemler.filter((d) => d.durum === "tahsil").length}
              </span>{" "}
              dönem tahsil edildi
            </span>
            <span className="flex items-center gap-1 text-amber-500">
              <Clock className="w-3 h-3" />
              H3 onay bekliyor
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              style={{ border: "1px solid #2a2a2a", background: "#111111" }}
            >
              <Download className="w-3.5 h-3.5" />
              PDF Export
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm text-white transition-all hover:brightness-110"
              style={{ background: "#4F8CFF" }}
            >
              <Plus className="w-3.5 h-3.5" />
              Yeni Hakediş Dönemi
            </button>
          </div>
        </div>
      </div>

      {/* AI Copilot */}
      <AICopilot
        context="Hakediş"
        welcomeMessage={`H3 onay bekliyor.\n\nMüşteri son 2 hakedişi ortalama 8 günde onayladı. Bugün gönderdiyseniz 15 Haziran'a kadar tahsilat beklenir.\n\n📊 Durum özeti:\n• H1 → Müşteriye gönderildi ✓\n• H2 → Tahsil edildi ✓\n• H3 → ⏳ Onay bekliyor\n• H4 → Henüz açılmadı 🔒\n\nH3 için hatırlatıcı e-posta göndermemi ister misin?`}
        shortcuts={[
          "H3 takip e-postası",
          "Tahsilat tahmini",
          "Disiplin analizi",
          "H4 planla",
        ]}
      />
    </div>
  );
}
