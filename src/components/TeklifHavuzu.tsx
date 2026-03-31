import { useState } from "react";
import {
  ChevronDown,
  Calendar,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Clock,
  X,
  ArrowRight,
  Package,
  Users,
  ChevronRight,
  Send,
  BarChart2,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { AICopilot } from "./AICopilot";

// ─── Types ────────────────────────────────────────────────────────────────────

type MainTab = "tedarikci" | "taseron";

interface TedarikciRow {
  id: string;
  firma: string;
  kategori: string;
  kalem: string;
  birim: string;
  birimFiyat: number;
  proje: string;
  tarih: string;
  trend: "up" | "down" | "neutral";
  trendPct?: number;
}

interface TaseronRow {
  id: string;
  firma: string;
  kategori: string;
  proje: string;
  tutar: number;
  durum: "kabul" | "degerlendirilmede" | "reddedildi" | "beklemede";
  tarih: string;
}

interface SlideKalem {
  aciklama: string;
  miktar: string;
  birimFiyat: string;
  toplam: number;
}

interface SlideOverData {
  firma: string;
  proje: string;
  kategori: string;
  tutar: number;
  tarih: string;
  kalemler: SlideKalem[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const tedarikciRows: TedarikciRow[] = [
  {
    id: "td1",
    firma: "Kartal Seramik",
    kategori: "Seramik",
    kalem: "Seramik Kaplama 60x60",
    birim: "m²",
    birimFiyat: 85,
    proje: "MACFit Forum",
    tarih: "Mar 2026",
    trend: "up",
    trendPct: 3.7,
  },
  {
    id: "td2",
    firma: "Kartal Seramik",
    kategori: "Seramik",
    kalem: "Seramik Kaplama 60x60",
    birim: "m²",
    birimFiyat: 82,
    proje: "LC Waikiki",
    tarih: "Oca 2026",
    trend: "neutral",
  },
  {
    id: "td3",
    firma: "Aydın Yapı",
    kategori: "Seramik",
    kalem: "Seramik Kaplama 60x60",
    birim: "m²",
    birimFiyat: 92,
    proje: "MACFit Forum",
    tarih: "Mar 2026",
    trend: "neutral",
  },
  {
    id: "td4",
    firma: "Kartal Elektrik",
    kategori: "Elektrik",
    kalem: "Kablo NYY 3x4",
    birim: "mt",
    birimFiyat: 38,
    proje: "MACFit Forum",
    tarih: "Mar 2026",
    trend: "up",
    trendPct: 5.6,
  },
  {
    id: "td5",
    firma: "Demirci Alçıpan",
    kategori: "Alçıpan",
    kalem: "Alçıpan 12.5mm",
    birim: "m²",
    birimFiyat: 145,
    proje: "Yargıcı Nişantaşı",
    tarih: "Mar 2026",
    trend: "down",
    trendPct: 2.1,
  },
  {
    id: "td6",
    firma: "Atlas Boya",
    kategori: "Boya",
    kalem: "İç Cephe Boya (2 kat)",
    birim: "m²",
    birimFiyat: 48,
    proje: "Koton Kızılay",
    tarih: "Şub 2026",
    trend: "neutral",
  },
];

const taseronRows: TaseronRow[] = [
  {
    id: "ts1",
    firma: "Beşoluk Elektrik",
    kategori: "Elektrik",
    proje: "MACFit Forum İstanbul",
    tutar: 1_200_000,
    durum: "kabul",
    tarih: "Mar 2026",
  },
  {
    id: "ts2",
    firma: "Erkan Gündoğdu",
    kategori: "Elektrik",
    proje: "MACFit Ankara",
    tutar: 890_000,
    durum: "kabul",
    tarih: "Şub 2026",
  },
  {
    id: "ts3",
    firma: "Şaban Gürbüz",
    kategori: "Elektrik",
    proje: "Yargıcı Nişantaşı",
    tutar: 450_000,
    durum: "degerlendirilmede",
    tarih: "Mar 2026",
  },
  {
    id: "ts4",
    firma: "Salih Coşkun",
    kategori: "Alçıpan",
    proje: "MACFit Forum İstanbul",
    tutar: 680_000,
    durum: "kabul",
    tarih: "Mar 2026",
  },
  {
    id: "ts5",
    firma: "Mert İnşaat",
    kategori: "İnşaat",
    proje: "Koton Kızılay",
    tutar: 1_960_000,
    durum: "beklemede",
    tarih: "Mar 2026",
  },
];

const slideOverMap: Record<string, SlideOverData> = {
  ts1: {
    firma: "Beşoluk Elektrik",
    proje: "MACFit Forum İstanbul",
    kategori: "Elektrik",
    tutar: 1_200_000,
    tarih: "Mart 2026",
    kalemler: [
      { aciklama: "Kablo NYY 3x4", miktar: "450 mt", birimFiyat: "38 ₺", toplam: 17_100 },
      { aciklama: "Kablo NYM 3x2.5", miktar: "780 mt", birimFiyat: "22 ₺", toplam: 17_160 },
      { aciklama: "Pano DB-1", miktar: "2 adet", birimFiyat: "8.500 ₺", toplam: 17_000 },
      { aciklama: "Topraklama hattı", miktar: "120 mt", birimFiyat: "12 ₺", toplam: 1_440 },
      { aciklama: "İşçilik (montaj)", miktar: "götürü", birimFiyat: "—", toplam: 1_147_300 },
    ],
  },
  ts2: {
    firma: "Erkan Gündoğdu",
    proje: "MACFit Ankara",
    kategori: "Elektrik",
    tutar: 890_000,
    tarih: "Şubat 2026",
    kalemler: [
      { aciklama: "Kablo NYY 3x4", miktar: "320 mt", birimFiyat: "36 ₺", toplam: 11_520 },
      { aciklama: "Kablo NYM 3x2.5", miktar: "600 mt", birimFiyat: "21 ₺", toplam: 12_600 },
      { aciklama: "Pano DB-1", miktar: "1 adet", birimFiyat: "8.000 ₺", toplam: 8_000 },
      { aciklama: "İşçilik (montaj)", miktar: "götürü", birimFiyat: "—", toplam: 857_880 },
    ],
  },
  ts3: {
    firma: "Şaban Gürbüz",
    proje: "Yargıcı Nişantaşı",
    kategori: "Elektrik",
    tutar: 450_000,
    tarih: "Mart 2026",
    kalemler: [
      { aciklama: "Kablo NYY 3x4", miktar: "180 mt", birimFiyat: "38 ₺", toplam: 6_840 },
      { aciklama: "Pano DB-1", miktar: "1 adet", birimFiyat: "8.500 ₺", toplam: 8_500 },
      { aciklama: "İşçilik (montaj)", miktar: "götürü", birimFiyat: "—", toplam: 434_660 },
    ],
  },
  ts4: {
    firma: "Salih Coşkun",
    proje: "MACFit Forum İstanbul",
    kategori: "Alçıpan",
    tutar: 680_000,
    tarih: "Mart 2026",
    kalemler: [
      { aciklama: "Alçıpan 12.5mm", miktar: "1.200 m²", birimFiyat: "145 ₺", toplam: 174_000 },
      { aciklama: "Metal Profil", miktar: "2.400 mt", birimFiyat: "48 ₺", toplam: 115_200 },
      { aciklama: "Vida & Aksesuar", miktar: "götürü", birimFiyat: "—", toplam: 15_000 },
      { aciklama: "İşçilik (montaj)", miktar: "götürü", birimFiyat: "—", toplam: 375_800 },
    ],
  },
  ts5: {
    firma: "Mert İnşaat",
    proje: "Koton Kızılay",
    kategori: "İnşaat",
    tutar: 1_960_000,
    tarih: "Mart 2026",
    kalemler: [
      { aciklama: "Yıkım & Söküm", miktar: "800 m²", birimFiyat: "220 ₺", toplam: 176_000 },
      { aciklama: "Beton Döşeme", miktar: "600 m²", birimFiyat: "380 ₺", toplam: 228_000 },
      { aciklama: "Duvar Örme", miktar: "450 m²", birimFiyat: "340 ₺", toplam: 153_000 },
      { aciklama: "İşçilik", miktar: "götürü", birimFiyat: "—", toplam: 1_403_000 },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000)
    return (n / 1_000_000).toLocaleString("tr-TR", { minimumFractionDigits: 3, maximumFractionDigits: 3 }) + " ₺";
  return n.toLocaleString("tr-TR") + " ₺";
}

function fmtSmall(n: number): string {
  return n.toLocaleString("tr-TR") + " ₺";
}

type DurumCfg = { label: string; style: React.CSSProperties; icon: React.ReactNode };
const durumCfg: Record<TaseronRow["durum"], DurumCfg> = {
  kabul: {
    label: "Kabul Edildi",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    style: { background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.25)", color: "#34d399" },
  },
  degerlendirilmede: {
    label: "Değerlendirmede",
    icon: <Clock className="w-3.5 h-3.5" />,
    style: { background: "rgba(234,179,8,0.10)", border: "1px solid rgba(234,179,8,0.25)", color: "#fbbf24" },
  },
  reddedildi: {
    label: "Reddedildi",
    icon: <X className="w-3.5 h-3.5" />,
    style: { background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.22)", color: "#f87171" },
  },
  beklemede: {
    label: "Beklemede",
    icon: <Clock className="w-3.5 h-3.5" />,
    style: { background: "rgba(113,113,122,0.12)", border: "1px solid #2a2a2a", color: "#71717a" },
  },
};

function TrendCell({ trend, pct }: { trend: TedarikciRow["trend"]; pct?: number }) {
  if (trend === "neutral") return <span className="text-zinc-700 text-sm"><Minus className="w-3.5 h-3.5 inline" /></span>;
  if (trend === "up")
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
        style={{ background: "rgba(249,115,22,0.10)", border: "1px solid rgba(249,115,22,0.22)", color: "#fb923c" }}>
        <TrendingUp className="w-3 h-3" />+{pct}%
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
      style={{ background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.22)", color: "#34d399" }}>
      <TrendingDown className="w-3 h-3" />-{pct}%
    </span>
  );
}

function KategoriPill({ label }: { label: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    Seramik: { bg: "rgba(79,140,255,0.10)", color: "#4F8CFF" },
    Elektrik: { bg: "rgba(251,191,36,0.10)", color: "#fbbf24" },
    Alçıpan: { bg: "rgba(192,132,252,0.10)", color: "#c084fc" },
    Boya: { bg: "rgba(52,211,153,0.10)", color: "#34d399" },
    İnşaat: { bg: "rgba(249,115,22,0.10)", color: "#fb923c" },
  };
  const style = map[label] ?? { bg: "rgba(113,113,122,0.12)", color: "#71717a" };
  return (
    <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-full"
      style={{ background: style.bg, border: `1px solid ${style.color}33`, color: style.color }}>
      {label}
    </span>
  );
}

function Dropdown({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 transition-colors whitespace-nowrap"
        style={{ border: "1px solid #2a2a2a", background: "#111111" }}>
        {value || label}
        <ChevronDown className="w-3.5 h-3.5 shrink-0" />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 rounded-lg overflow-hidden min-w-[160px]"
          style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}>
          {[label, ...options].map(opt => (
            <button key={opt} onClick={() => { onChange(opt === label ? "" : opt); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors">
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Slide Over ───────────────────────────────────────────────────────────────

function SlideOver({ data, onClose }: { data: SlideOverData; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col"
        style={{
          width: 420,
          background: "#0D0D0D",
          borderLeft: "1px solid #2a2a2a",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex-shrink-0" style={{ borderBottom: "1px solid #1f1f1f" }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-base text-white">{data.firma}</h3>
              <p className="text-xs text-zinc-600 mt-0.5">{data.proje}</p>
            </div>
            <button onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Meta pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <KategoriPill label={data.kategori} />
            <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-full"
              style={{ background: "rgba(79,140,255,0.08)", border: "1px solid rgba(79,140,255,0.2)", color: "#4F8CFF" }}>
              {fmt(data.tutar)}
            </span>
            <span className="text-[11px] text-zinc-600">{data.tarih}</span>
          </div>
        </div>

        {/* Kalem listesi */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="text-[11px] text-zinc-600 uppercase tracking-widest mb-3">Kalem Detayı</div>

          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1f1f1f" }}>
            {/* Thead */}
            <div className="grid grid-cols-4 px-4 py-2.5 text-[10px] text-zinc-600 uppercase tracking-widest"
              style={{ background: "#0A0A0A", borderBottom: "1px solid #1f1f1f" }}>
              <span className="col-span-2">Açıklama</span>
              <span className="text-right">Birim Fiyat</span>
              <span className="text-right">Toplam</span>
            </div>

            {data.kalemler.map((k, i) => {
              const isLast = i === data.kalemler.length - 1;
              return (
                <div key={i} className="grid grid-cols-4 items-center px-4 py-3"
                  style={{
                    background: "#111111",
                    borderBottom: isLast ? "none" : "1px solid #1a1a1a",
                  }}>
                  <div className="col-span-2">
                    <div className="text-xs text-zinc-300">{k.aciklama}</div>
                    <div className="text-[10px] text-zinc-700 mt-0.5">{k.miktar}</div>
                  </div>
                  <div className="text-right text-xs text-zinc-600 tabular-nums">{k.birimFiyat}</div>
                  <div className="text-right text-xs text-zinc-200 tabular-nums">{fmtSmall(k.toplam)}</div>
                </div>
              );
            })}

            {/* Toplam footer */}
            <div className="grid grid-cols-4 items-center px-4 py-3"
              style={{ background: "#0D0D0D", borderTop: "1px solid #1f1f1f" }}>
              <div className="col-span-2 text-[11px] text-zinc-600 uppercase tracking-widest">Toplam</div>
              <div />
              <div className="text-right text-sm text-[#4F8CFF] tabular-nums">{fmt(data.tutar)}</div>
            </div>
          </div>

          {/* Firma istatistikleri */}
          <div className="mt-5 rounded-xl px-4 py-4 space-y-2.5"
            style={{ background: "#111111", border: "1px solid #1f1f1f" }}>
            <div className="text-[11px] text-zinc-600 uppercase tracking-widest mb-3">Firma Geçmişi</div>
            {[
              { label: "Toplam proje", value: "3 proje" },
              { label: "Ort. teklif tutarı", value: "1.050.000 ₺" },
              { label: "Fiyat trendi", value: "+%4 artış", color: "#fb923c" },
              { label: "Piyasa durumu", value: "%8 altında", color: "#34d399" },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-600">{s.label}</span>
                <span className="text-xs" style={{ color: s.color ?? "#a1a1aa" }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex-shrink-0" style={{ borderTop: "1px solid #1f1f1f" }}>
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm text-white transition-all hover:brightness-110"
            style={{ background: "#4F8CFF" }}>
            <Send className="w-4 h-4" />
            Bu firmaya yeni teklif iste
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TeklifHavuzu() {
  const [activeTab, setActiveTab] = useState<MainTab>("tedarikci");
  const [firmaFilter, setFirmaFilter] = useState("");
  const [projeFilter, setProjeFilter] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [slideOver, setSlideOver] = useState<string | null>(null);

  const slideData = slideOver ? slideOverMap[slideOver] : null;

  // Filter options
  const tdFirmalar = [...new Set(tedarikciRows.map(r => r.firma))];
  const tdProjeler = [...new Set(tedarikciRows.map(r => r.proje))];
  const tdKategoriler = [...new Set(tedarikciRows.map(r => r.kategori))];

  const tsFirmalar = [...new Set(taseronRows.map(r => r.firma))];
  const tsProjeler = [...new Set(taseronRows.map(r => r.proje))];
  const tsKategoriler = [...new Set(taseronRows.map(r => r.kategori))];

  const firmalar = activeTab === "tedarikci" ? tdFirmalar : tsFirmalar;
  const projeler = activeTab === "tedarikci" ? tdProjeler : tsProjeler;
  const kategoriler = activeTab === "tedarikci" ? tdKategoriler : tsKategoriler;

  const filteredTD = tedarikciRows.filter(r =>
    (!firmaFilter || r.firma === firmaFilter) &&
    (!projeFilter || r.proje === projeFilter) &&
    (!kategoriFilter || r.kategori === kategoriFilter)
  );
  const filteredTS = taseronRows.filter(r =>
    (!firmaFilter || r.firma === firmaFilter) &&
    (!projeFilter || r.proje === projeFilter) &&
    (!kategoriFilter || r.kategori === kategoriFilter)
  );

  // Summary stats
  const tsKabul = taseronRows.filter(r => r.durum === "kabul").length;
  const tsToplamHacim = taseronRows.reduce((s, r) => s + r.tutar, 0);

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar activePage="teklif-havuzu" />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <div className="px-7 pt-5 pb-0 flex-shrink-0"
          style={{ background: "#000000", borderBottom: "1px solid #1a1a1a" }}>
          {/* Title row */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg text-white">Teklif Havuzu</h2>
              <p className="text-xs text-zinc-600 mt-0.5">
                Tüm projeler · Tedarikçi & Taşeron teklifleri
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <BarChart2 className="w-3.5 h-3.5" />
              <span><span className="text-zinc-300">{taseronRows.length}</span> taşeron · <span className="text-zinc-300">{tedarikciRows.length}</span> tedarikçi kaydı</span>
            </div>
          </div>

          {/* Main tabs */}
          <div className="flex items-center gap-1 mb-4">
            {([
              { key: "tedarikci" as MainTab, label: "Tedarikçi Teklifleri", icon: <Package className="w-3.5 h-3.5" />, count: tedarikciRows.length },
              { key: "taseron" as MainTab, label: "Taşeron Teklifleri", icon: <Users className="w-3.5 h-3.5" />, count: taseronRows.length },
            ]).map(tab => {
              const isActive = activeTab === tab.key;
              return (
                <button key={tab.key} onClick={() => { setActiveTab(tab.key); setFirmaFilter(""); setProjeFilter(""); setKategoriFilter(""); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-t-lg text-sm transition-all relative"
                  style={{
                    background: isActive ? "#111111" : "transparent",
                    color: isActive ? "#fff" : "#71717a",
                    borderBottom: isActive ? "2px solid #4F8CFF" : "2px solid transparent",
                    border: isActive ? "1px solid #1f1f1f" : "none",
                    borderBottomColor: isActive ? "#4F8CFF" : "transparent",
                  }}>
                  <span style={{ color: isActive ? "#4F8CFF" : "#52525b" }}>{tab.icon}</span>
                  {tab.label}
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full ml-1"
                    style={{ background: isActive ? "rgba(79,140,255,0.15)" : "#1a1a1a", color: isActive ? "#4F8CFF" : "#52525b" }}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ background: "#080808" }}>
          <div className="px-7 pt-4 pb-8 space-y-4">
            {/* Filter bar */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ border: "1px solid #2a2a2a", background: "#111111", minWidth: 200 }}>
                <Search className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                <input className="bg-transparent text-xs text-zinc-300 placeholder-zinc-700 outline-none w-full"
                  placeholder="Firma veya kalem ara..." />
              </div>
              <Dropdown label="Tüm Firmalar" options={firmalar} value={firmaFilter} onChange={setFirmaFilter} />
              <Dropdown label="Tüm Projeler" options={projeler} value={projeFilter} onChange={setProjeFilter} />
              <Dropdown label="Tüm Kategoriler" options={kategoriler} value={kategoriFilter} onChange={setKategoriFilter} />
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-500 hover:text-zinc-300 transition-colors ml-auto"
                style={{ border: "1px solid #2a2a2a", background: "#111111" }}>
                <Calendar className="w-3.5 h-3.5" />
                Oca – Mar 2026
                <ChevronDown className="w-3 h-3" />
              </button>
              {(firmaFilter || projeFilter || kategoriFilter) && (
                <button onClick={() => { setFirmaFilter(""); setProjeFilter(""); setKategoriFilter(""); }}
                  className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors">
                  Temizle
                </button>
              )}
            </div>

            {/* ── TEDARİKÇİ sekmesi ── */}
            {activeTab === "tedarikci" && (
              <>
                {/* Özet kartlar */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Kayıtlı Firma", value: tdFirmalar.length, color: "text-zinc-200", border: "1px solid #1f1f1f" },
                    { label: "Toplam Kayıt", value: tedarikciRows.length, color: "text-[#4F8CFF]", border: "1px solid rgba(79,140,255,0.15)" },
                    { label: "Fiyat Artışı", value: "2 kalem", color: "text-orange-400", border: "1px solid rgba(249,115,22,0.15)" },
                    { label: "Kategori", value: tdKategoriler.length, color: "text-emerald-400", border: "1px solid rgba(52,211,153,0.15)" },
                  ].map((c, i) => (
                    <div key={i} className="rounded-xl px-4 py-3.5" style={{ background: "#111111", border: c.border }}>
                      <div className="text-[11px] text-zinc-600 uppercase tracking-widest mb-1.5">{c.label}</div>
                      <div className={`text-xl ${c.color}`}>{c.value}</div>
                    </div>
                  ))}
                </div>

                {/* Tablo */}
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1f1f1f" }}>
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: "#0A0A0A", borderBottom: "1px solid #1f1f1f" }}>
                        {["Firma", "Kategori", "Kalem Açıklaması", "Birim", "Birim Fiyat", "Proje", "Tarih", "Trend"].map((col, i) => (
                          <th key={i} className={`py-3.5 px-4 text-[11px] text-zinc-600 uppercase tracking-widest font-normal ${i >= 3 ? "text-right" : "text-left"}`}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTD.map((row, idx) => (
                        <tr key={row.id} className="transition-colors hover:bg-zinc-900/30 cursor-pointer"
                          style={{ background: "#111111", borderBottom: idx < filteredTD.length - 1 ? "1px solid #1a1a1a" : "none" }}>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] shrink-0"
                                style={{ background: "#1a1a1a", border: "1px solid #282828", color: "#71717a" }}>
                                {row.firma[0]}
                              </div>
                              <span className="text-sm text-zinc-200 whitespace-nowrap">{row.firma}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5"><KategoriPill label={row.kategori} /></td>
                          <td className="px-4 py-3.5 text-sm text-zinc-400 max-w-[180px] truncate">{row.kalem}</td>
                          <td className="px-4 py-3.5 text-right text-xs text-zinc-600">{row.birim}</td>
                          <td className="px-4 py-3.5 text-right">
                            <span className="text-sm text-zinc-200 tabular-nums">{row.birimFiyat} ₺</span>
                          </td>
                          <td className="px-4 py-3.5 text-right text-xs text-zinc-500 whitespace-nowrap">{row.proje}</td>
                          <td className="px-4 py-3.5 text-right text-xs text-zinc-600">{row.tarih}</td>
                          <td className="px-4 py-3.5 text-right"><TrendCell trend={row.trend} pct={row.trendPct} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── TAŞERON sekmesi ── */}
            {activeTab === "taseron" && (
              <>
                {/* Özet kartlar */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Toplam Taşeron", value: tsFirmalar.length, color: "text-zinc-200", border: "1px solid #1f1f1f" },
                    { label: "Kabul Edilen", value: tsKabul, color: "text-emerald-400", border: "1px solid rgba(52,211,153,0.15)" },
                    { label: "Değerlendirmede", value: taseronRows.filter(r => r.durum === "degerlendirilmede").length, color: "text-amber-400", border: "1px solid rgba(234,179,8,0.15)" },
                    { label: "Toplam Hacim", value: fmt(tsToplamHacim), color: "text-[#4F8CFF]", border: "1px solid rgba(79,140,255,0.15)" },
                  ].map((c, i) => (
                    <div key={i} className="rounded-xl px-4 py-3.5" style={{ background: "#111111", border: c.border }}>
                      <div className="text-[11px] text-zinc-600 uppercase tracking-widest mb-1.5">{c.label}</div>
                      <div className={`text-xl ${c.color}`}>{c.value}</div>
                    </div>
                  ))}
                </div>

                {/* Tablo */}
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1f1f1f" }}>
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: "#0A0A0A", borderBottom: "1px solid #1f1f1f" }}>
                        {[
                          { label: "Firma", align: "left" },
                          { label: "Kategori", align: "left" },
                          { label: "Proje", align: "left" },
                          { label: "Teklif Tutarı", align: "right" },
                          { label: "Durum", align: "left" },
                          { label: "Tarih", align: "center" },
                          { label: "İşlemler", align: "center" },
                        ].map((col, i) => (
                          <th key={i} className={`py-3.5 px-4 text-[11px] text-zinc-600 uppercase tracking-widest font-normal text-${col.align}`}>
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTS.map((row, idx) => {
                        const cfg = durumCfg[row.durum];
                        const isSelected = slideOver === row.id;
                        return (
                          <tr key={row.id}
                            className="transition-colors hover:bg-zinc-900/30 cursor-pointer"
                            style={{
                              background: isSelected ? "rgba(79,140,255,0.05)" : "#111111",
                              borderBottom: idx < filteredTS.length - 1 ? "1px solid #1a1a1a" : "none",
                              borderLeft: isSelected ? "2px solid #4F8CFF" : "2px solid transparent",
                            }}>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] shrink-0"
                                  style={{ background: "#1a1a1a", border: "1px solid #282828", color: "#71717a" }}>
                                  {row.firma[0]}
                                </div>
                                <span className="text-sm text-zinc-200 whitespace-nowrap">{row.firma}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5"><KategoriPill label={row.kategori} /></td>
                            <td className="px-4 py-3.5 text-sm text-zinc-500 whitespace-nowrap">{row.proje}</td>
                            <td className="px-4 py-3.5 text-right">
                              <span className="text-sm text-zinc-200 tabular-nums">{fmt(row.tutar)}</span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap"
                                style={cfg.style}>
                                {cfg.icon}{cfg.label}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-center text-xs text-zinc-600">{row.tarih}</td>
                            <td className="px-4 py-3.5 text-center">
                              <button
                                onClick={() => setSlideOver(slideOver === row.id ? null : row.id)}
                                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all hover:brightness-110"
                                style={{ background: "rgba(79,140,255,0.10)", border: "1px solid rgba(79,140,255,0.22)", color: "#4F8CFF" }}>
                                Detay
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Alt bar */}
        <div className="flex-shrink-0 flex items-center justify-between px-7 py-3.5"
          style={{ background: "#0D0D0D", borderTop: "1px solid #1f1f1f" }}>
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            {activeTab === "tedarikci" ? (
              <>
                <span><span className="text-zinc-400">{filteredTD.length}</span> kayıt</span>
                <span className="flex items-center gap-1 text-orange-500">
                  <TrendingUp className="w-3 h-3" />2 kalemde fiyat artışı
                </span>
              </>
            ) : (
              <>
                <span><span className="text-zinc-400">{filteredTS.length}</span> taşeron</span>
                <span className="flex items-center gap-1 text-emerald-500">
                  <CheckCircle2 className="w-3 h-3" />{tsKabul} kabul edildi
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              style={{ border: "1px solid #2a2a2a", background: "#111111" }}>
              <ArrowRight className="w-3.5 h-3.5" />
              Excel Export
            </button>
            <button className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm text-white transition-all hover:brightness-110"
              style={{ background: "#4F8CFF" }}>
              <Send className="w-3.5 h-3.5" />
              Yeni Teklif İste
            </button>
          </div>
        </div>
      </div>

      {/* Slide Over */}
      {slideData && <SlideOver data={slideData} onClose={() => setSlideOver(null)} />}

      {/* AI Copilot */}
      <AICopilot
        context="Teklif Havuzu"
        welcomeMessage={`Beşoluk Elektrik son 3 projede ortalama **1.050.000 ₺** teklif verdi.\n\nFiyatları **%4 artış** trendinde.\n\nMACFit Forum teklifi piyasa ortalamasının **%8 altında** — avantajlı.\n\n💡 Öneriler:\n• Kartal Seramik fiyatı %3.7 arttı — alternatif tedarikçi araştırılabilir.\n• Şaban Gürbüz teklifi 8 gündür değerlendirmede.\n\nToplu teklif karşılaştırma raporu hazırlayayım mı?`}
        shortcuts={[
          "Fiyat karşılaştır",
          "Trend analizi",
          "Yeni teklif iste",
          "Taşeron raporu",
        ]}
      />
    </div>
  );
}
