import { useState, Fragment } from "react";
import { useNavigate } from "react-router";
import {
  ChevronRight,
  Building2,
  Ruler,
  Tag,
  Calendar,
  Pencil,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  Search,
  Upload,
  ClipboardPaste,
  MoreHorizontal,
  Download,
  Send,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { AICopilot } from "./AICopilot";

/* ─────────────────────────── TYPES ──────────────────────────── */

interface BOQRow {
  poz: string;
  aciklama: string;
  birim: string;
  miktar: number;
  malzemeBF: string;
  iscilikBF: string;
  toplamBF: string;
  tutar: string;
  durum: "ok" | "bekliyor";
}

interface BOQSection {
  id: string;
  title: string;
  toplam: string;
  rows: BOQRow[];
}

/* ─────────────────────────── DATA ──────────────────────────── */

const mainTabs = [
  { value: "genel", label: "Genel" },
  { value: "boq", label: "BOQ" },
  { value: "teklif", label: "Teklif" },
  { value: "kesif", label: "Keşif Notları" },
];

const infoCards = [
  { icon: Building2, label: "Müşteri", value: "MACFit" },
  { icon: Ruler, label: "Alan", value: "1.447 m²" },
  { icon: Tag, label: "Tip", value: "İhale" },
  { icon: Calendar, label: "Teslim", value: "15 Haz 2026" },
];

const modules = [
  { label: "BOQ", status: "Bekliyor", type: "amber" },
  { label: "Teklif", status: "—", type: "gray" },
  { label: "Satınalma", status: "—", type: "gray" },
];

const team = [
  { name: "Asiye", role: "Planlama", color: "bg-[#4F8CFF]/20 text-[#4F8CFF]", avatar: "bg-[#4F8CFF]/30 text-[#4F8CFF]" },
  { name: "Melike", role: "Satınalma", color: "bg-green-500/20 text-green-400", avatar: "bg-green-500/30 text-green-400" },
  { name: "Erhan", role: "Taşeron", color: "bg-purple-500/20 text-purple-400", avatar: "bg-purple-500/30 text-purple-400" },
  { name: "Buse", role: "Hakediş", color: "bg-orange-500/20 text-orange-400", avatar: "bg-orange-500/30 text-orange-400" },
];

const disciplineTabs = [
  { value: "insaat", label: "İnşaat", count: 45, amber: false },
  { value: "mobilya", label: "Mobilya", count: 22, amber: false },
  { value: "aydinlatma", label: "Aydınlatma", count: 15, amber: true },
  { value: "elektrik", label: "Elektrik", count: 52, amber: false },
  { value: "mekanik", label: "Mekanik", count: 34, amber: false },
];

const boqSections: BOQSection[] = [
  {
    id: "01",
    title: "01-YIKIM VE SÖKÜM",
    toplam: "302.008 ₺",
    rows: [
      {
        poz: "01_01",
        aciklama: "Yıkım-söküm ve moloz atımı",
        birim: "SET",
        miktar: 1,
        malzemeBF: "150.000",
        iscilikBF: "100.000",
        toplamBF: "250.000",
        tutar: "250.000 ₺",
        durum: "ok",
      },
      {
        poz: "01_02",
        aciklama: "Yatay düşey taşıma, vinç",
        birim: "SET",
        miktar: 1,
        malzemeBF: "",
        iscilikBF: "",
        toplamBF: "—",
        tutar: "—",
        durum: "bekliyor",
      },
      {
        poz: "01_03",
        aciklama: "Koruma önlemleri",
        birim: "SET",
        miktar: 1,
        malzemeBF: "70.000",
        iscilikBF: "50.000",
        toplamBF: "120.000",
        tutar: "120.000 ₺",
        durum: "ok",
      },
    ],
  },
  { id: "02", title: "02-DOLGU-ŞAP VE İZOLASYON", toplam: "344.328 ₺", rows: [] },
  { id: "03", title: "03-DUVAR İMALATLARI", toplam: "892.450 ₺", rows: [] },
  { id: "04", title: "04-TAVAN İMALATLARI", toplam: "1.245.000 ₺", rows: [] },
  { id: "05", title: "05-YER KAPLAMALARI", toplam: "1.890.000 ₺", rows: [] },
  { id: "06", title: "06-BOYA VE DEKORASYON", toplam: "578.000 ₺", rows: [] },
  { id: "07", title: "07-MUHTELİF İŞLER", toplam: "636.727 ₺", rows: [] },
];

/* ─────────────────────────── TEKLIF DATA ──────────────────────────── */

interface TeklifRow {
  disiplin: string;
  mod: string;
  carpan: string;
  teklifTutari: string;
  maliyet: string;
  kar: string;
  oran: string;
  negative?: boolean;
  empty?: boolean;
}

const teklifRows: TeklifRow[] = [
  {
    disiplin: "İnşaat",
    mod: "çarpan",
    carpan: "1.27x",
    teklifTutari: "7.587.947 ₺",
    maliyet: "5.988.513 ₺",
    kar: "+1.599.434 ₺",
    oran: "%27",
  },
  {
    disiplin: "Mobilya",
    mod: "çarpan",
    carpan: "1.45x",
    teklifTutari: "1.168.158 ₺",
    maliyet: "805.626 ₺",
    kar: "+362.532 ₺",
    oran: "%45",
  },
  {
    disiplin: "Aydınlatma",
    mod: "yüzde",
    carpan: "%35",
    teklifTutari: "—",
    maliyet: "—",
    kar: "—",
    oran: "—",
    empty: true,
  },
  {
    disiplin: "Elektrik",
    mod: "çarpan",
    carpan: "0.92x",
    teklifTutari: "1.596.253 ₺",
    maliyet: "1.735.058 ₺",
    kar: "-138.805 ₺",
    oran: "-%8",
    negative: true,
  },
  {
    disiplin: "Mekanik",
    mod: "çarpan",
    carpan: "1.57x",
    teklifTutari: "1.651.432 ₺",
    maliyet: "1.051.868 ₺",
    kar: "+599.564 ₺",
    oran: "%57",
  },
];

const teklifSubTabs = [
  { value: "icmal", label: "İCMAL" },
  { value: "insaat", label: "İnşaat" },
  { value: "mobilya", label: "Mobilya" },
  { value: "aydinlatma", label: "Aydınlatma" },
  { value: "elektrik", label: "Elektrik" },
  { value: "mekanik", label: "Mekanik" },
];

/* ─────────────────────────── SMALL COMPONENTS ──────────────────────────── */

function ModuleBadge({ status, type }: { status: string; type: string }) {
  if (type === "amber")
    return (
      <span className="px-2.5 py-1 rounded-full text-xs border border-amber-500/50 text-amber-400 bg-amber-500/10">
        {status}
      </span>
    );
  return (
    <span className="px-2.5 py-1 rounded-full text-xs border border-zinc-700 text-zinc-500 bg-zinc-800/60">
      {status}
    </span>
  );
}

function StatusBadge({ durum }: { durum: "ok" | "bekliyor" }) {
  if (durum === "ok")
    return (
      <span className="px-2 py-0.5 rounded text-[10px] border border-green-500/40 text-green-400 bg-green-500/10 whitespace-nowrap">
        OK
      </span>
    );
  return (
    <span className="px-2 py-0.5 rounded text-[10px] border border-amber-500/40 text-amber-400 bg-amber-500/10 whitespace-nowrap">
        Bekliyor
      </span>
    );
}

function EditableCell({
  value,
  placeholder = "",
}: {
  value: string;
  placeholder?: string;
}) {
  const [val, setVal] = useState(value);
  return (
    <input
      type="text"
      value={val}
      placeholder={placeholder}
      onChange={(e) => setVal(e.target.value)}
      className="w-full bg-transparent text-right text-xs text-white outline-none placeholder-zinc-600 rounded px-1 py-0.5 focus:ring-1 focus:ring-[#4F8CFF]/40 transition-all"
    />
  );
}

/* ─────────────────────────── TEKLIF TAB ──────────────────────────── */

function TeklifTab() {
  const [activeSubTab, setActiveSubTab] = useState("icmal");
  const [carpanValues, setCarpanValues] = useState<Record<string, string>>(
    Object.fromEntries(teklifRows.map((r) => [r.disiplin, r.carpan]))
  );

  return (
    <div className="space-y-0">
      {/* Sub-tab bar + Action buttons */}
      <div className="flex items-center border-b border-zinc-800 mb-0">
        <div className="flex gap-0 flex-1">
          {teklifSubTabs.map((st) => (
            <button
              key={st.value}
              onClick={() => setActiveSubTab(st.value)}
              className={`px-4 py-2.5 text-sm transition-colors relative ${
                activeSubTab === st.value
                  ? st.value === "icmal"
                    ? "text-white"
                    : "text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              } ${st.value === "icmal" ? "tracking-wide" : ""}`}
              style={st.value === "icmal" && activeSubTab === "icmal" ? { fontWeight: 600 } : {}}
            >
              {st.label}
              {activeSubTab === st.value && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F8CFF] rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Right action area */}
        <div className="flex items-center gap-2 pb-1">
          <span className="px-2.5 py-1 rounded-full text-xs border border-amber-500/50 text-amber-400 bg-amber-500/10">
            Taslak — Rev.0
          </span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 border border-amber-500/50 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors text-xs">
            <Send className="w-3.5 h-3.5" />
            Onaya Gönder
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4F8CFF] text-white rounded-lg hover:bg-[#6BA3FF] transition-colors text-xs">
            <Download className="w-3.5 h-3.5" />
            Excel Export
          </button>
        </div>
      </div>

      {activeSubTab === "icmal" && (
        <div className="pt-4">
          {/* İCMAL Table */}
          <div className="rounded-xl overflow-hidden border border-zinc-800/80">
            <table className="w-full text-xs border-collapse">
              {/* Two-column header bar */}
              <thead>
                <tr>
                  <td colSpan={4} className="px-4 py-2.5" style={{ background: "rgba(79,140,255,0.13)" }}>
                    <span className="text-white tracking-widest text-[11px]">TEKLİF (Müşteriye)</span>
                  </td>
                  <td colSpan={3} className="px-4 py-2.5" style={{ background: "rgba(34,197,94,0.13)" }}>
                    <span className="text-white tracking-widest text-[11px]">MALİYET (İç kullanım)</span>
                  </td>
                </tr>
                {/* Column headers */}
                <tr style={{ background: "#0A0A0A" }} className="border-b border-zinc-800">
                  <th className="text-left px-4 py-2.5 text-zinc-500 font-normal w-[130px]">Disiplin</th>
                  <th className="text-left px-4 py-2.5 text-zinc-500 font-normal w-[80px]">Mod</th>
                  <th
                    className="text-right px-4 py-2.5 font-normal w-[110px]"
                    style={{ color: "rgba(79,140,255,0.7)" }}
                  >
                    Çarpan
                  </th>
                  <th
                    className="text-right px-4 py-2.5 font-normal w-[150px]"
                    style={{ background: "rgba(79,140,255,0.05)", color: "rgba(79,140,255,0.7)" }}
                  >
                    Teklif Tutarı
                  </th>
                  <th
                    className="text-right px-4 py-2.5 font-normal w-[150px]"
                    style={{ background: "rgba(34,197,94,0.05)", color: "rgba(34,197,94,0.7)" }}
                  >
                    Maliyet
                  </th>
                  <th
                    className="text-right px-4 py-2.5 font-normal w-[130px]"
                    style={{ background: "rgba(34,197,94,0.05)", color: "rgba(34,197,94,0.7)" }}
                  >
                    Kâr
                  </th>
                  <th
                    className="text-right px-4 py-2.5 font-normal w-[80px]"
                    style={{ background: "rgba(34,197,94,0.05)", color: "rgba(34,197,94,0.7)" }}
                  >
                    Oran
                  </th>
                </tr>
              </thead>
              <tbody>
                {teklifRows.map((row) => (
                  <tr
                    key={row.disiplin}
                    className="border-b border-zinc-800/50 hover:brightness-110 transition-all"
                    style={row.negative ? { background: "rgba(239,68,68,0.067)" } : {}}
                  >
                    {/* Disiplin */}
                    <td className="px-4 py-3 text-zinc-200">{row.disiplin}</td>
                    {/* Mod */}
                    <td className="px-4 py-3">
                      <span className="text-zinc-500 text-[10px] bg-zinc-800 px-2 py-0.5 rounded-full">
                        {row.mod}
                      </span>
                    </td>
                    {/* Çarpan — editable, blue tint */}
                    <td className="px-2 py-2" style={{ background: "rgba(79,140,255,0.04)" }}>
                      <input
                        type="text"
                        value={carpanValues[row.disiplin]}
                        onChange={(e) =>
                          setCarpanValues((prev) => ({ ...prev, [row.disiplin]: e.target.value }))
                        }
                        className="w-full bg-transparent text-right text-xs text-[#4F8CFF] outline-none px-1 py-0.5 rounded focus:ring-1 focus:ring-[#4F8CFF]/40 transition-all"
                      />
                    </td>
                    {/* Teklif Tutarı */}
                    <td
                      className="px-4 py-3 text-right text-white whitespace-nowrap"
                      style={{ background: "rgba(79,140,255,0.04)" }}
                    >
                      {row.teklifTutari}
                    </td>
                    {/* Maliyet */}
                    <td
                      className="px-4 py-3 text-right text-zinc-300 whitespace-nowrap"
                      style={{ background: "rgba(34,197,94,0.04)" }}
                    >
                      {row.maliyet}
                    </td>
                    {/* Kâr */}
                    <td
                      className="px-4 py-3 text-right whitespace-nowrap"
                      style={{ background: "rgba(34,197,94,0.04)" }}
                    >
                      <span className={row.negative ? "text-red-400" : row.empty ? "text-zinc-500" : "text-green-400"}>
                        {row.kar}
                      </span>
                    </td>
                    {/* Oran */}
                    <td
                      className="px-4 py-3 text-right whitespace-nowrap"
                      style={{ background: "rgba(34,197,94,0.04)" }}
                    >
                      <span className={row.negative ? "text-red-400" : row.empty ? "text-zinc-500" : "text-green-400"}>
                        {row.oran}
                      </span>
                    </td>
                  </tr>
                ))}

                {/* TOTAL ROW */}
                <tr
                  className="border-t-2 border-zinc-600"
                  style={{ background: "#0D0D0D" }}
                >
                  <td className="px-4 py-3">
                    <span className="text-zinc-100 tracking-widest text-[11px]">TOPLAM</span>
                  </td>
                  <td className="px-4 py-3" />
                  <td
                    className="px-4 py-3 text-right text-zinc-400"
                    style={{ background: "rgba(79,140,255,0.04)" }}
                  >
                    ort. 1.25x
                  </td>
                  <td
                    className="px-4 py-3 text-right text-white whitespace-nowrap"
                    style={{ background: "rgba(79,140,255,0.06)" }}
                  >
                    12.003.790 ₺
                  </td>
                  <td
                    className="px-4 py-3 text-right text-zinc-200 whitespace-nowrap"
                    style={{ background: "rgba(34,197,94,0.06)" }}
                  >
                    9.581.065 ₺
                  </td>
                  <td
                    className="px-4 py-3 text-right text-green-400 whitespace-nowrap"
                    style={{ background: "rgba(34,197,94,0.06)" }}
                  >
                    +2.422.725 ₺
                  </td>
                  <td
                    className="px-4 py-3 text-right text-green-400"
                    style={{ background: "rgba(34,197,94,0.06)" }}
                  >
                    %25
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab !== "icmal" && (
        <div className="pt-4">
          <div className="bg-[#111111] rounded-xl p-8 text-center">
            <p className="text-zinc-400 text-sm capitalize">{activeSubTab} teklif detayı yakında...</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── BOQ TAB ──────────────────────────── */

function BOQTab() {
  const [activeDiscipline, setActiveDiscipline] = useState("insaat");
  const [activeFilter, setActiveFilter] = useState("tumü");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["01"]));
  const [search, setSearch] = useState("");

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-0">
      {/* Discipline Sub-tabs */}
      <div className="flex gap-0 border-b border-zinc-800 mb-0">
        {disciplineTabs.map((dt) => (
          <button
            key={dt.value}
            onClick={() => setActiveDiscipline(dt.value)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors relative ${
              activeDiscipline === dt.value
                ? "text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {dt.amber && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            )}
            {dt.label}
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeDiscipline === dt.value
                  ? "bg-[#4F8CFF]/20 text-[#4F8CFF]"
                  : "bg-zinc-800 text-zinc-500"
              }`}
            >
              {dt.count}
            </span>
            {activeDiscipline === dt.value && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F8CFF] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Toolbar Row */}
      <div className="flex items-center gap-3 py-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kalem ara (poz no veya açıklama)..."
            className="w-full pl-9 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveFilter("tumü")}
            className={`px-3 py-1 rounded-full text-xs transition-colors border ${
              activeFilter === "tumü"
                ? "border-[#4F8CFF] text-[#4F8CFF] bg-[#4F8CFF]/10"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setActiveFilter("bekliyor")}
            className={`px-3 py-1 rounded-full text-xs transition-colors border ${
              activeFilter === "bekliyor"
                ? "border-amber-500 text-amber-400 bg-amber-500/20"
                : "border-amber-500/40 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
            }`}
          >
            Fiyat Bekliyor (3)
          </button>
          <button
            onClick={() => setActiveFilter("fiyatlandi")}
            className={`px-3 py-1 rounded-full text-xs transition-colors border ${
              activeFilter === "fiyatlandi"
                ? "border-zinc-500 text-zinc-300 bg-zinc-700"
                : "border-zinc-700 text-zinc-400 bg-zinc-800/60 hover:border-zinc-600"
            }`}
          >
            Fiyatlandı (42)
          </button>
        </div>

        <div className="flex-1" />

        {/* Action Buttons */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4F8CFF] text-white rounded-lg hover:bg-[#6BA3FF] transition-colors text-xs">
          <Upload className="w-3.5 h-3.5" />
          Excel Import
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-700 text-zinc-300 rounded-lg hover:border-zinc-500 hover:text-white transition-colors text-xs">
          <ClipboardPaste className="w-3.5 h-3.5" />
          Excel'den Yapıştır
        </button>

        {/* Total */}
        <div className="pl-3 border-l border-zinc-800">
          <span className="text-xs text-zinc-500">İnşaat Toplam: </span>
          <span className="text-sm text-white">5.988.513 ₺</span>
        </div>
      </div>

      {/* BOQ Table */}
      <div className="rounded-xl overflow-hidden border border-zinc-800/80">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr style={{ background: "#0A0A0A" }} className="border-b border-zinc-800">
              <th className="text-left px-3 py-2.5 text-zinc-500 font-normal w-[80px]">Poz</th>
              <th className="text-left px-3 py-2.5 text-zinc-500 font-normal">Açıklama</th>
              <th className="text-center px-3 py-2.5 text-zinc-500 font-normal w-[56px]">Birim</th>
              <th className="text-center px-3 py-2.5 text-zinc-500 font-normal w-[56px]">Miktar</th>
              <th className="text-right px-3 py-2.5 text-zinc-500 font-normal w-[110px]">
                <span className="text-[#4F8CFF]/60">Malzeme BF</span>
              </th>
              <th className="text-right px-3 py-2.5 text-zinc-500 font-normal w-[110px]">
                <span className="text-[#4F8CFF]/60">İşçilik BF</span>
              </th>
              <th className="text-right px-3 py-2.5 text-zinc-500 font-normal w-[100px]">Toplam BF</th>
              <th className="text-right px-3 py-2.5 text-zinc-500 font-normal w-[110px]">Tutar</th>
              <th className="text-center px-3 py-2.5 text-zinc-500 font-normal w-[80px]">Durum</th>
              <th className="w-[32px]" />
            </tr>
          </thead>
          <tbody>
            {boqSections.map((section) => {
              const isExpanded = expandedSections.has(section.id);
              return (
                <Fragment key={section.id}>
                  {/* Section Header Row */}
                  <tr
                    className="cursor-pointer select-none border-b border-zinc-800/60 hover:bg-zinc-800/20 transition-colors"
                    style={{ background: "#1A1A1A" }}
                    onClick={() => toggleSection(section.id)}
                  >
                    <td colSpan={7} className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        ) : (
                          <ChevronRightIcon className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        )}
                        <span className="text-zinc-200 tracking-wide">{section.title}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right text-zinc-300 whitespace-nowrap">
                      {section.toplam}
                    </td>
                    <td colSpan={2} />
                  </tr>

                  {/* Section Rows */}
                  {isExpanded &&
                    section.rows.map((row, ri) => (
                      <tr
                        key={`${section.id}-${ri}`}
                        className="border-b border-zinc-800/40 hover:bg-zinc-800/25 transition-colors group"
                      >
                        {/* Poz */}
                        <td className="px-3 py-2 text-zinc-500 font-mono">{row.poz}</td>
                        {/* Açıklama */}
                        <td className="px-3 py-2 text-zinc-300">{row.aciklama}</td>
                        {/* Birim */}
                        <td className="px-3 py-2 text-center text-zinc-500">{row.birim}</td>
                        {/* Miktar */}
                        <td className="px-3 py-2 text-center text-zinc-300">{row.miktar}</td>
                        {/* Malzeme BF — editable, blue tint */}
                        <td
                          className="px-2 py-1.5 text-right"
                          style={{ background: "rgba(79,140,255,0.03)" }}
                        >
                          <EditableCell
                            value={row.malzemeBF}
                            placeholder="—"
                          />
                        </td>
                        {/* İşçilik BF — editable, blue tint */}
                        <td
                          className="px-2 py-1.5 text-right"
                          style={{ background: "rgba(79,140,255,0.03)" }}
                        >
                          <EditableCell
                            value={row.iscilikBF}
                            placeholder="—"
                          />
                        </td>
                        {/* Toplam BF */}
                        <td className="px-3 py-2 text-right text-zinc-400">{row.toplamBF}</td>
                        {/* Tutar */}
                        <td className="px-3 py-2 text-right text-white whitespace-nowrap">{row.tutar}</td>
                        {/* Durum */}
                        <td className="px-3 py-2 text-center">
                          <StatusBadge durum={row.durum} />
                        </td>
                        {/* Menu */}
                        <td className="px-2 py-2 text-center">
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-zinc-300">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </Fragment>
              );
            })}

            {/* TOTAL ROW */}
            <tr
              className="border-t-2 border-zinc-700"
              style={{ background: "#0D0D0D" }}
            >
              <td colSpan={7} className="px-3 py-3">
                <span className="text-zinc-200 tracking-widest text-[11px]">İNŞAAT TOPLAM</span>
              </td>
              <td className="px-3 py-3 text-right text-white whitespace-nowrap">
                5.988.513 ₺
              </td>
              <td className="px-3 py-3 text-center">
                <span className="text-xs text-zinc-400">42/45</span>
              </td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────────────────── MAIN PAGE ──────────────────────────── */

export function ProjectDetailNew() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("genel");

  const copilotConfig = {
    genel: {
      context: "MACFit Forum / Genel",
      welcomeMessage:
        "MACFit Forum İstanbul — İhale projesi, 1.447 m². BOQ henüz tamamlanmadı. Excel import ile başlayabilirsin.",
      shortcuts: ["Proje özeti", "Benzer projeler", "BOQ'ya git", "Ekip durumu"],
    },
    boq: {
      context: "BOQ / İnşaat",
      welcomeMessage:
        "İnşaat disiplininde 45 kalem, 3 tanesi fiyatsız. Geçmiş projelerden fiyat önereyim mi?",
      shortcuts: ["Boş kalemlere öner", "İcmal özeti", "Projeden kopyala", "Tedarikçi talebi"],
    },
    teklif: {
      context: "Teklif / İCMAL",
      welcomeMessage:
        "Teklif özeti: 12M ₺ teklif, 9.6M ₺ maliyet, %25 kâr. Elektrik disiplini -139K ₺ zarar — çarpanı artırmanızı öneririm.",
      shortcuts: ["Senaryo oluştur", "Müşteri benchmark", "Optimal çarpan", "Kârlılık özeti"],
    },
    kesif: {
      context: "MACFit Forum / Keşif Notları",
      welcomeMessage: "Keşif notlarını buraya ekleyebilirsin.",
      shortcuts: ["Not ekle", "Dosya yükle"],
    },
  };

  const cp = copilotConfig[activeTab as keyof typeof copilotConfig] ?? copilotConfig.genel;

  return (
    <div className="flex h-screen bg-black">
      <Sidebar activePage="projects" />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex-1 overflow-y-auto p-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4 text-sm">
            <span
              className="text-zinc-400 hover:text-white cursor-pointer transition-colors"
              onClick={() => navigate("/")}
            >
              Projeler
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-white">MACFit Forum İstanbul</span>
          </div>

          {/* İhale Aşaması uyarı bandı */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5"
            style={{
              background: "rgba(234,179,8,0.07)",
              border: "1px solid rgba(234,179,8,0.25)",
            }}
          >
            <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
              <span className="text-amber-400 text-[10px]">!</span>
            </div>
            <span className="text-xs text-amber-300/90">
              Bu proje ihale aşamasında —{" "}
              <span className="text-amber-400">Satınalma</span> ve{" "}
              <span className="text-amber-400">Taşeron</span> henüz göremez.
              Yalnızca Planlama ve Erdal erişebilir.
            </span>
          </div>

          {/* Title Row */}
          <div className="flex items-center gap-4 mb-7">
            <h1 className="text-[26px] text-white flex-1">MACFit Forum İstanbul</h1>
            <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors text-sm">
              <Pencil className="w-3.5 h-3.5" />
              Düzenle
            </button>
            {/* Aktif badge yerine İhale Aşaması badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border border-[#4F8CFF]/40 text-[#4F8CFF] bg-[#4F8CFF]/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F8CFF]" />
              İhale Aşaması
            </span>
          </div>

          {/* Main Tab Bar */}
          <div className="flex gap-1 mb-0 border-b border-zinc-800">
            {mainTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2.5 text-sm transition-colors relative ${
                  activeTab === tab.value ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.label}
                {activeTab === tab.value && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F8CFF] rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className={activeTab === "boq" || activeTab === "teklif" ? "pt-0" : "pt-7"}>

            {activeTab === "genel" && (
              <div className="space-y-6">
                {/* 4 Info Cards */}
                <div className="grid grid-cols-4 gap-4">
                  {infoCards.map((card) => (
                    <div key={card.label} className="bg-[#111111] rounded-xl p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                        <card.icon className="w-4 h-4 text-zinc-400" />
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-wide mb-0.5">{card.label}</div>
                        <div className="text-sm text-white">{card.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Erdal'ın Notu */}
                <div>
                  <div className="text-xs text-zinc-500 uppercase tracking-widest mb-2 px-1">Erdal'ın Notu</div>
                  <div className="rounded-xl px-5 py-4 border-l-2 border-[#4F8CFF]/40" style={{ background: "#1A1A1A" }}>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      "İhale dosyası e-postada. Excel keşfi + mimari proje var. Asiye BOQ'yu import etsin."
                    </p>
                  </div>
                </div>

                {/* Modül Durumları */}
                <div>
                  <div className="text-xs text-zinc-500 uppercase tracking-widest mb-3 px-1">Modül Durumları</div>
                  <div className="grid grid-cols-3 gap-4">
                    {modules.map((mod) => (
                      <div key={mod.label} className="bg-[#111111] rounded-xl px-5 py-4 flex items-center justify-between">
                        <span className="text-sm text-zinc-300">{mod.label}</span>
                        <ModuleBadge status={mod.status} type={mod.type} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proje Ekibi */}
                <div>
                  <div className="text-xs text-zinc-500 uppercase tracking-widest mb-3 px-1">Proje Ekibi</div>
                  <div className="grid grid-cols-4 gap-4">
                    {team.map((member) => (
                      <div key={member.name} className="bg-[#111111] rounded-xl px-4 py-4 flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm ${member.avatar}`}>
                          {member.name[0]}
                        </div>
                        <div>
                          <div className="text-sm text-white">{member.name}</div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full mt-0.5 inline-block ${member.color}`}>
                            {member.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "boq" && <BOQTab />}

            {activeTab === "teklif" && <TeklifTab />}

            {activeTab === "kesif" && (
              <div className="bg-[#111111] rounded-xl p-8 text-center">
                <p className="text-zinc-400 text-sm">Keşif Notları içeriği yakında...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Copilot — switches context based on active tab */}
      <AICopilot
        key={activeTab}
        context={cp.context}
        welcomeMessage={cp.welcomeMessage}
        shortcuts={cp.shortcuts}
      />
    </div>
  );
}