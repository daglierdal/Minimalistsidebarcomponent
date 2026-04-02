import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronRight,
  Edit2,
  Plus,
  CheckCircle2,
  Clock,
  FileEdit,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  User,
  FileSpreadsheet,
  StickyNote,
  TrendingUp,
  Building2,
  SquareArrowOutUpRight,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { AICopilot } from "./AICopilot";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProjeDurum = "kabul-edildi" | "degerlendirilmede" | "ihale" | "taslak" | "aktif";

interface Proje {
  id: string;
  ad: string;
  durum: ProjeDurum;
  tutar: number | null;
  m2: number;
  baslangic: string | null;
}

type TeklifDurum = "kabul" | "degerlendirilmede" | "bekliyor";

interface TeklifGecmis {
  id: string;
  tarih: string;
  proje: string;
  tutar: number;
  durum: TeklifDurum;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const projeler: Proje[] = [
  { id: "p1", ad: "MACFit Forum İstanbul",    durum: "kabul-edildi",      tutar: 21_401_217, m2: 1200, baslangic: "Mar 2026" },
  { id: "p2", ad: "MACFit Ankara Çankaya",    durum: "degerlendirilmede", tutar: 4_200_000,  m2: 850,  baslangic: "Mar 2026" },
  { id: "p3", ad: "MACFit Bursa Nilüfer",     durum: "kabul-edildi",      tutar: 3_900_000,  m2: 720,  baslangic: "Şub 2026" },
  { id: "p4", ad: "MACFit İstport Ankara",    durum: "ihale",             tutar: null,       m2: 547,  baslangic: null },
  { id: "p5", ad: "MACFit İstanbul Kadıköy",  durum: "taslak",            tutar: null,       m2: 450,  baslangic: null },
];

const teklifGecmisi: TeklifGecmis[] = [
  { id: "tg1", tarih: "Oca 2026", proje: "MACFit Bursa Nilüfer",  tutar: 3_900_000,  durum: "kabul" },
  { id: "tg2", tarih: "Mar 2026", proje: "MACFit Forum İstanbul", tutar: 21_401_217, durum: "kabul" },
  { id: "tg3", tarih: "Mar 2026", proje: "MACFit Ankara Çankaya R0", tutar: 4_200_000, durum: "degerlendirilmede" },
];

// ─── Configs ──────────────────────────────────────────────────────────────────

type DurumCfg = { label: string; icon: React.ReactNode; pill: React.CSSProperties; dim?: boolean };

const projeDurumMap: Record<ProjeDurum, DurumCfg> = {
  "kabul-edildi": {
    label: "Kabul Edildi",
    icon: <CheckCircle2 className="w-3 h-3" />,
    pill: { background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.22)", color: "#34d399" },
  },
  degerlendirilmede: {
    label: "Değerlendirmede",
    icon: <Clock className="w-3 h-3" />,
    pill: { background: "rgba(251,191,36,0.10)", border: "1px solid rgba(251,191,36,0.22)", color: "#fbbf24" },
  },
  ihale: {
    label: "İhale",
    icon: <AlertTriangle className="w-3 h-3" />,
    pill: { background: "rgba(249,115,22,0.10)", border: "1px solid rgba(249,115,22,0.22)", color: "#fb923c" },
  },
  taslak: {
    label: "Taslak",
    icon: <FileEdit className="w-3 h-3" />,
    pill: { background: "rgba(82,82,91,0.15)", border: "1px solid #232323", color: "#52525b" },
    dim: true,
  },
  aktif: {
    label: "Aktif",
    icon: <CheckCircle2 className="w-3 h-3" />,
    pill: { background: "rgba(79,140,255,0.10)", border: "1px solid rgba(79,140,255,0.22)", color: "#4F8CFF" },
  },
};

const teklifDurumMap: Record<TeklifDurum, { label: string; color: string; bg: string; icon: string }> = {
  kabul:             { label: "Kabul",           color: "#34d399", bg: "rgba(52,211,153,0.10)",  icon: "✅" },
  degerlendirilmede: { label: "Değerlendirmede", color: "#fbbf24", bg: "rgba(251,191,36,0.10)", icon: "🟡" },
  bekliyor:          { label: "Bekliyor",        color: "#71717a", bg: "rgba(82,82,91,0.12)",    icon: "⏳" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("tr-TR") + " ₺";
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function CustomerDetail() {
  const navigate = useNavigate();
  const [notlar, setNotlar] = useState(
    "MACFit genelde 60-90 gün vadeli ödeme tercih ediyor. Teklif revizyonlarında agresif pazarlık yapıyorlar. Termin hassasiyetleri yüksek — gecikme cezası uygulanıyor."
  );
  const [notDuzenle, setNotDuzenle] = useState(false);

  const summaryCards = [
    {
      label: "Toplam Proje",
      value: "5",
      sub: "proje",
      color: "#4F8CFF",
      bg: "rgba(79,140,255,0.08)",
      border: "rgba(79,140,255,0.15)",
      icon: <Building2 className="w-4 h-4" style={{ color: "#4F8CFF" }} />,
    },
    {
      label: "Aktif Proje",
      value: "3",
      sub: "devam ediyor",
      color: "#34d399",
      bg: "rgba(52,211,153,0.08)",
      border: "rgba(52,211,153,0.15)",
      icon: <CheckCircle2 className="w-4 h-4" style={{ color: "#34d399" }} />,
    },
    {
      label: "Toplam Ciro",
      value: "38.200.000 ₺",
      sub: "onaylı projeler",
      color: "#e4e4e7",
      bg: "rgba(228,228,231,0.04)",
      border: "rgba(228,228,231,0.10)",
      icon: <TrendingUp className="w-4 h-4" style={{ color: "#e4e4e7" }} />,
    },
    {
      label: "Toplam m²",
      value: "3.767",
      sub: "tüm projeler",
      color: "#71717a",
      bg: "rgba(82,82,91,0.08)",
      border: "rgba(82,82,91,0.15)",
      icon: <SquareArrowOutUpRight className="w-4 h-4" style={{ color: "#71717a" }} />,
    },
  ];

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex-1 overflow-y-auto" style={{ background: "#060606" }}>

          {/* Page header band */}
          <div style={{ background: "#000", borderBottom: "1px solid #1a1a1a" }} className="px-7 pt-5 pb-5">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 mb-4">
              <button
                onClick={() => navigate("/customers")}
                className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Müşteriler
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-800" />
              <span className="text-xs text-zinc-300">MACFit</span>
            </div>

            {/* Customer header card */}
            <div
              className="rounded-2xl px-6 py-5 flex items-center justify-between"
              style={{ background: "#111", border: "1px solid #222" }}
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(79,140,255,0.15)", border: "1px solid rgba(79,140,255,0.25)" }}
                >
                  <span className="text-2xl" style={{ color: "#4F8CFF" }}>M</span>
                </div>
                <div>
                  <h1 className="text-xl text-white leading-tight">MACFit</h1>
                  <p className="text-sm text-zinc-500 mt-0.5">Perakende / Spor Salonu</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.20)", color: "#34d399" }}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Aktif Müşteri
                    </span>
                    <span className="text-xs text-zinc-700">Müşteri No: #MCF-001</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2.5">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                  style={{ border: "1px solid #333" }}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Düzenle
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white hover:brightness-110 transition-all"
                  style={{ background: "#4F8CFF" }}
                  onClick={() => navigate("/yeni-proje")}
                >
                  <Plus className="w-4 h-4" />
                  Yeni Proje
                </button>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              {summaryCards.map((c, i) => (
                <div
                  key={i}
                  className="rounded-xl px-4 py-3.5 flex items-center gap-3"
                  style={{ background: c.bg, border: `1px solid ${c.border}` }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${c.border}` }}
                  >
                    {c.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg leading-tight tabular-nums" style={{ color: c.color }}>
                      {c.value}
                    </div>
                    <div className="text-[11px] text-zinc-600 mt-0.5">{c.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2-col content */}
          <div className="px-7 py-5 flex gap-5">

            {/* LEFT — 65% */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">

              {/* Projeler table */}
              <div className="rounded-xl overflow-hidden" style={{ background: "#111", border: "1px solid #1f1f1f" }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #1f1f1f" }}>
                  <h3 className="text-sm text-zinc-200">Projeler <span className="text-zinc-600 ml-1">(5)</span></h3>
                  <button className="text-xs text-[#4F8CFF] hover:text-blue-300 transition-colors">
                    Tümünü Gör →
                  </button>
                </div>
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                      {["Proje Adı", "Durum", "Teklif Tutarı", "m²", "Başlangıç"].map((h, i) => (
                        <th
                          key={i}
                          className={`py-3 text-[10px] text-zinc-600 uppercase tracking-widest font-normal ${i === 0 ? "text-left px-5" : i <= 1 ? "text-left px-4" : "text-right px-5"}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {projeler.map((p, idx) => {
                      const cfg = projeDurumMap[p.durum];
                      return (
                        <tr
                          key={p.id}
                          className="transition-all cursor-pointer"
                          style={{
                            borderBottom: idx < projeler.length - 1 ? "1px solid #171717" : "none",
                            opacity: cfg.dim ? 0.5 : 1,
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#161616"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                        >
                          <td className="px-5 py-3.5">
                            <span className="text-sm text-zinc-200">{p.ad}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap"
                              style={cfg.pill}
                            >
                              {cfg.icon}
                              {cfg.label}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            {p.tutar ? (
                              <span className="text-sm text-zinc-300 tabular-nums">{fmt(p.tutar)}</span>
                            ) : (
                              <span className="text-zinc-700 text-sm">—</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <span className="text-sm text-zinc-500 tabular-nums">{p.m2.toLocaleString("tr-TR")}</span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <span className="text-xs text-zinc-600">{p.baslangic ?? "—"}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Teklif Geçmişi */}
              <div className="rounded-xl" style={{ background: "#111", border: "1px solid #1f1f1f" }}>
                <div className="px-5 py-4" style={{ borderBottom: "1px solid #1f1f1f" }}>
                  <h3 className="text-sm text-zinc-200">Teklif Geçmişi</h3>
                </div>

                {/* Stats row */}
                <div className="px-5 py-3 flex items-center gap-6" style={{ borderBottom: "1px solid #1a1a1a", background: "#0d0d0d" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-600">Toplam</span>
                    <span className="text-xs text-zinc-300">7 teklif</span>
                  </div>
                  <div className="w-px h-3 bg-zinc-800" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-600">Kabul</span>
                    <span className="text-xs" style={{ color: "#34d399" }}>3 (%43)</span>
                  </div>
                  <div className="w-px h-3 bg-zinc-800" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-600">Ort. Marj</span>
                    <span className="text-xs" style={{ color: "#34d399" }}>+65%</span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="px-5 py-3">
                  {teklifGecmisi.map((t, idx) => {
                    const cfg = teklifDurumMap[t.durum];
                    return (
                      <div
                        key={t.id}
                        className="flex items-center gap-4 py-3.5"
                        style={{ borderBottom: idx < teklifGecmisi.length - 1 ? "1px solid #181818" : "none" }}
                      >
                        {/* Timeline dot */}
                        <div className="flex flex-col items-center shrink-0">
                          <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                          {idx < teklifGecmisi.length - 1 && (
                            <div className="w-px flex-1 mt-1" style={{ background: "#222", minHeight: 16 }} />
                          )}
                        </div>

                        <div className="text-xs text-zinc-600 w-20 shrink-0">{t.tarih}</div>

                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-zinc-300 truncate block">{t.proje}</span>
                        </div>

                        <div className="text-sm text-zinc-400 tabular-nums whitespace-nowrap">
                          {fmt(t.tutar)}
                        </div>

                        <span
                          className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap"
                          style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}22` }}
                        >
                          {cfg.icon} {cfg.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT — 35% */}
            <div className="w-72 shrink-0 flex flex-col gap-4">

              {/* İletişim */}
              <div className="rounded-xl" style={{ background: "#111", border: "1px solid #1f1f1f" }}>
                <div className="px-5 py-4" style={{ borderBottom: "1px solid #1f1f1f" }}>
                  <h3 className="text-sm text-zinc-200">İletişim</h3>
                </div>
                <div className="px-5 py-4 flex flex-col gap-3.5">
                  {[
                    { icon: <User className="w-3.5 h-3.5" />, label: "Yetkili", value: "Ahmet Yılmaz" },
                    { icon: <Phone className="w-3.5 h-3.5" />, label: "Telefon", value: "0532 444 55 66" },
                    { icon: <Mail className="w-3.5 h-3.5" />, label: "E-posta", value: "ahmet@macfit.com.tr" },
                    { icon: <MapPin className="w-3.5 h-3.5" />, label: "Adres", value: "Maslak, İstanbul" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#1a1a1a", color: "#52525b" }}>
                        {row.icon}
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-700 uppercase tracking-widest mb-0.5">{row.label}</div>
                        <div className="text-sm text-zinc-300">{row.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Excel Import Profili */}
              <div className="rounded-xl" style={{ background: "#111", border: "1px solid #1f1f1f" }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #1f1f1f" }}>
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-zinc-600" />
                    <h3 className="text-sm text-zinc-200">Excel Import Profili</h3>
                  </div>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm text-zinc-600 mb-1">Henüz profil kaydedilmedi</p>
                  <p className="text-xs text-zinc-700 mb-3">BOQ import sırasında otomatik kaydedilir</p>
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                    style={{ border: "1px solid #2a2a2a" }}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    Şablon İndir
                  </button>
                </div>
              </div>

              {/* Notlar */}
              <div className="rounded-xl" style={{ background: "#111", border: "1px solid #1f1f1f" }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #1f1f1f" }}>
                  <div className="flex items-center gap-2">
                    <StickyNote className="w-3.5 h-3.5 text-zinc-600" />
                    <h3 className="text-sm text-zinc-200">Notlar</h3>
                  </div>
                  <button
                    onClick={() => setNotDuzenle((v) => !v)}
                    className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    {notDuzenle ? "Kaydet" : "Düzenle"}
                  </button>
                </div>
                <div className="px-5 py-4">
                  {notDuzenle ? (
                    <textarea
                      value={notlar}
                      onChange={(e) => setNotlar(e.target.value)}
                      className="w-full text-sm text-zinc-400 bg-transparent resize-none outline-none leading-relaxed"
                      style={{ minHeight: 90, border: "1px solid #2a2a2a", borderRadius: 8, padding: "8px 10px", background: "#0d0d0d" }}
                    />
                  ) : (
                    <p className="text-sm text-zinc-500 leading-relaxed">{notlar}</p>
                  )}
                  <button
                    className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                    style={{ border: "1px solid #2a2a2a" }}
                    onClick={() => setNotDuzenle(true)}
                  >
                    <Plus className="w-3 h-3" />
                    Not Ekle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Copilot */}
      <AICopilot
        context="Müşteri Detay"
        welcomeMessage={`MACFit, portföyünüzün en büyük müşterisi.\n\n📊 Özet:\n• 5 proje, 38.2M ₺ toplam ciro\n• Kabul oranı: %43 (3/7)\n• Ortalama marj: +65%\n\n⚠️ MACFit Ankara Çankaya teklifi hâlâ değerlendirmede.\n\n💡 MACFit İstport Ankara ve Kadıköy projeleri için BOQ tamamlanmadı. Fiyat toplama kampanyası başlatmamı ister misin?`}
        shortcuts={[
          "Teklif geçmişi özetle",
          "Ankara takip mesajı",
          "BOQ kampanyası başlat",
          "Müşteri raporu",
        ]}
      />
    </div>
  );
}