import { useState, useRef, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { AICopilot } from "./AICopilot";
import {
  ChevronDown,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
  X,
  Home,
  ChevronRight as Chevron,
  Download,
  Upload,
  MoreHorizontal,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BOQItem {
  id: string;
  pozNo: string;
  isTanimi: string;
  birim: string;
  miktar: number;
  malzemeBF: number;
  iscilikBF: number;
  aiHistory?: number[]; // previous project prices
}

interface Section {
  id: string;
  kod: string;
  baslik: string;
  items: BOQItem[];
}

interface Tab {
  id: string;
  label: string;
  kalemSayisi: number;
  sections: Section[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const insaatSections: Section[] = [
  {
    id: "s1",
    kod: "01",
    baslik: "YIKIM",
    items: [
      { id: "i1", pozNo: "01.001", isTanimi: "Mevcut zemin kaplaması sökümü", birim: "m²", miktar: 950, malzemeBF: 0, iscilikBF: 18, aiHistory: [16, 17, 18] },
      { id: "i2", pozNo: "01.002", isTanimi: "Alçı duvar yıkımı", birim: "m²", miktar: 420, malzemeBF: 0, iscilikBF: 22, aiHistory: [20, 22, 25] },
      { id: "i3", pozNo: "01.003", isTanimi: "Asma tavan sökümü", birim: "m²", miktar: 800, malzemeBF: 0, iscilikBF: 14, aiHistory: [12, 14, 15] },
      { id: "i4", pozNo: "01.004", isTanimi: "Mevcut kapı-pencere söküm", birim: "adet", miktar: 24, malzemeBF: 0, iscilikBF: 85, aiHistory: [75, 80, 90] },
      { id: "i5", pozNo: "01.005", isTanimi: "Moloz nakliyesi (konteyner dahil)", birim: "ton", miktar: 38, malzemeBF: 120, iscilikBF: 45, aiHistory: [130, 120, 115] },
      { id: "i6", pozNo: "01.006", isTanimi: "Boya ve kaplamaların temizlenmesi", birim: "m²", miktar: 650, malzemeBF: 0, iscilikBF: 0, aiHistory: [8, 9, 10] },
    ],
  },
  {
    id: "s2",
    kod: "02",
    baslik: "DUVAR",
    items: [
      { id: "i7", pozNo: "02.001", isTanimi: "Gazbeton duvar örülmesi (10cm)", birim: "m²", miktar: 380, malzemeBF: 145, iscilikBF: 55, aiHistory: [140, 148, 155] },
      { id: "i8", pozNo: "02.002", isTanimi: "Gazbeton duvar örülmesi (20cm)", birim: "m²", miktar: 210, malzemeBF: 185, iscilikBF: 65, aiHistory: [180, 190, 195] },
      { id: "i9", pozNo: "02.003", isTanimi: "Alçı sıva (iç duvar, tek kat)", birim: "m²", miktar: 1150, malzemeBF: 38, iscilikBF: 42, aiHistory: [35, 38, 40] },
      { id: "i10", pozNo: "02.004", isTanimi: "Alçı sıva (tavan)", birim: "m²", miktar: 950, malzemeBF: 42, iscilikBF: 48, aiHistory: [40, 44, 46] },
      { id: "i11", pozNo: "02.005", isTanimi: "Çelik profil bölme duvar (60mm)", birim: "m²", miktar: 290, malzemeBF: 0, iscilikBF: 0, aiHistory: [220, 235, 245] },
      { id: "i12", pozNo: "02.006", isTanimi: "Akustik yalıtım levhası yerleştirilmesi", birim: "m²", miktar: 180, malzemeBF: 95, iscilikBF: 28, aiHistory: [90, 95, 100] },
      { id: "i13", pozNo: "02.007", isTanimi: "Köşe profili ve bant uygulaması", birim: "mt", miktar: 620, malzemeBF: 12, iscilikBF: 8, aiHistory: [10, 12, 14] },
    ],
  },
  {
    id: "s3",
    kod: "03",
    baslik: "KAPLAMA",
    items: [
      { id: "i14", pozNo: "03.001", isTanimi: "Porselen zemin kaplama (60x60)", birim: "m²", miktar: 750, malzemeBF: 0, iscilikBF: 0, aiHistory: [380, 420, 450] },
      { id: "i15", pozNo: "03.002", isTanimi: "Ahşap laminant parke (8mm)", birim: "m²", miktar: 200, malzemeBF: 185, iscilikBF: 35, aiHistory: [180, 188, 195] },
      { id: "i16", pozNo: "03.003", isTanimi: "Halı zemin kaplama", birim: "m²", miktar: 0, malzemeBF: 0, iscilikBF: 0, aiHistory: [95, 100, 110] },
      { id: "i17", pozNo: "03.004", isTanimi: "Derz dolgu ve silikon aplikasyonu", birim: "mt", miktar: 1200, malzemeBF: 8, iscilikBF: 6, aiHistory: [7, 8, 9] },
    ],
  },
];

const tabs: Tab[] = [
  { id: "insaat", label: "İnşaat", kalemSayisi: 81, sections: insaatSections },
  {
    id: "elektrik", label: "Elektrik", kalemSayisi: 322, sections: [
      {
        id: "e1", kod: "01", baslik: "KABLO VE TESISATLAMA", items: [
          { id: "e1i1", pozNo: "01.001", isTanimi: "NYM 3x2.5 kablo döşemesi", birim: "mt", miktar: 2400, malzemeBF: 4.5, iscilikBF: 3.2, aiHistory: [4.2, 4.5, 4.8] },
          { id: "e1i2", pozNo: "01.002", isTanimi: "NYM 3x4 kablo döşemesi", birim: "mt", miktar: 850, malzemeBF: 7.2, iscilikBF: 3.5, aiHistory: [6.8, 7.2, 7.6] },
          { id: "e1i3", pozNo: "01.003", isTanimi: "Koruge boru (32mm) döşemesi", birim: "mt", miktar: 1200, malzemeBF: 0, iscilikBF: 0, aiHistory: [3.5, 3.8, 4.0] },
        ],
      },
    ],
  },
  {
    id: "mekanik", label: "Mekanik", kalemSayisi: 75, sections: [
      {
        id: "m1", kod: "01", baslik: "İKLİMLENDİRME", items: [
          { id: "m1i1", pozNo: "01.001", isTanimi: "VRF dış ünite montajı", birim: "adet", miktar: 4, malzemeBF: 48500, iscilikBF: 4500, aiHistory: [46000, 48500, 51000] },
          { id: "m1i2", pozNo: "01.002", isTanimi: "Kaset tipi iç ünite (24.000 BTU)", birim: "adet", miktar: 18, malzemeBF: 0, iscilikBF: 0, aiHistory: [12800, 13500, 14200] },
        ],
      },
    ],
  },
  {
    id: "mobilya", label: "Mobilya", kalemSayisi: 47, sections: [
      {
        id: "mob1", kod: "01", baslik: "RESEPSIYON & LOBI", items: [
          { id: "mob1i1", pozNo: "01.001", isTanimi: "Resepsiyon tezgahı (özel üretim)", birim: "adet", miktar: 1, malzemeBF: 28500, iscilikBF: 4500, aiHistory: [26000, 28500, 30000] },
          { id: "mob1i2", pozNo: "01.002", isTanimi: "Bekleme koltuğu seti (4'lü)", birim: "set", miktar: 6, malzemeBF: 4800, iscilikBF: 0, aiHistory: [4500, 4800, 5200] },
        ],
      },
    ],
  },
  {
    id: "aydinlatma", label: "Aydınlatma", kalemSayisi: 42, sections: [
      {
        id: "ay1", kod: "01", baslik: "GENEL AYDINLATMA", items: [
          { id: "ay1i1", pozNo: "01.001", isTanimi: "LED panel armatür (60x60, 36W)", birim: "adet", miktar: 120, malzemeBF: 0, iscilikBF: 0, aiHistory: [420, 450, 480] },
          { id: "ay1i2", pozNo: "01.002", isTanimi: "LED şerit aydınlatma", birim: "mt", miktar: 380, malzemeBF: 85, iscilikBF: 22, aiHistory: [80, 85, 92] },
        ],
      },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function AIPopup({
  item,
  onClose,
  onApply,
}: {
  item: BOQItem;
  onClose: () => void;
  onApply: (val: number) => void;
}) {
  const history = item.aiHistory ?? [];
  const sorted = [...history].sort((a, b) => a - b);
  const median = sorted.length > 0 ? sorted[Math.floor(sorted.length / 2)] : 0;

  return (
    <div
      className="absolute right-10 z-50 w-64 rounded-xl shadow-2xl p-4"
      style={{ background: "#1A1A1A", border: "1px solid rgba(124,58,237,0.35)", bottom: "100%" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-purple-500/20 flex items-center justify-center">
            <span className="text-[8px] text-purple-400">AI</span>
          </div>
          <span className="text-xs text-purple-400">Fiyat Önerisi</span>
        </div>
        <button onClick={onClose} className="text-zinc-600 hover:text-zinc-400">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="text-xs text-zinc-500 mb-2">Son 3 projede bu kalem (Malzeme BF):</div>
      <div className="flex items-center gap-2 mb-3">
        {history.map((h, i) => (
          <div key={i} className="flex-1 text-center py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-300">
            {h.toLocaleString("tr-TR")} ₺
          </div>
        ))}
      </div>
      <div
        className="flex items-center justify-between px-3 py-2 rounded-lg mb-3"
        style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)" }}
      >
        <span className="text-xs text-zinc-400">Medyan öneri:</span>
        <span className="text-sm text-purple-300">{median.toLocaleString("tr-TR")} ₺</span>
      </div>
      <button
        onClick={() => onApply(median)}
        className="w-full py-2 rounded-lg text-xs text-white transition-all hover:brightness-110"
        style={{ background: "rgba(124,58,237,0.7)" }}
      >
        Bu fiyatı uygula → {median.toLocaleString("tr-TR")} ₺
      </button>
    </div>
  );
}

interface EditCell {
  itemId: string;
  field: "malzemeBF" | "iscilikBF" | "miktar";
}

function SectionBlock({
  section,
  editCell,
  setEditCell,
  itemData,
  onCellChange,
  aiPopupItemId,
  setAiPopupItemId,
  onApplyAI,
}: {
  section: Section;
  editCell: EditCell | null;
  setEditCell: (c: EditCell | null) => void;
  itemData: Record<string, BOQItem>;
  onCellChange: (id: string, field: EditCell["field"], val: number) => void;
  aiPopupItemId: string | null;
  setAiPopupItemId: (id: string | null) => void;
  onApplyAI: (itemId: string, val: number) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const sectionItems = section.items.map((i) => itemData[i.id] ?? i);
  const sectionTotal = sectionItems.reduce(
    (sum, it) => sum + it.miktar * (it.malzemeBF + it.iscilikBF),
    0
  );
  const fiyatsizCount = sectionItems.filter((it) => it.malzemeBF === 0 && it.iscilikBF === 0).length;

  return (
    <div className="mb-1">
      {/* Section header */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 cursor-pointer select-none group"
        style={{ background: "#0D0D0D", borderBottom: "1px solid #1a1a1a" }}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
        )}
        <span className="text-[11px] text-zinc-500 font-mono tracking-widest">{section.kod}</span>
        <span className="text-xs text-zinc-400 uppercase tracking-wider">{section.baslik}</span>
        <span className="text-[10px] text-zinc-700 ml-1">({section.items.length} kalem)</span>
        {fiyatsizCount > 0 && !collapsed && (
          <span className="flex items-center gap-1 text-[10px] text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-2 py-0.5 ml-1">
            <AlertTriangle className="w-2.5 h-2.5" />
            {fiyatsizCount} fiyatsız
          </span>
        )}
        <div className="flex-1" />
        <span className="text-xs text-zinc-500">
          {sectionTotal.toLocaleString("tr-TR")} ₺
        </span>
      </div>

      {!collapsed && (
        <div>
          {sectionItems.map((item) => {
            const isFiyatsiz = item.malzemeBF === 0 && item.iscilikBF === 0;
            const tutar = item.miktar * (item.malzemeBF + item.iscilikBF);
            const toplamBF = item.malzemeBF + item.iscilikBF;
            const isAIOpen = aiPopupItemId === item.id;

            return (
              <div
                key={item.id}
                className={`flex items-center border-b border-zinc-900/60 transition-colors hover:bg-zinc-800/10 relative ${
                  isFiyatsiz ? "bg-orange-500/[0.03]" : ""
                }`}
              >
                {/* Orange left bar for fiyatsız */}
                {isFiyatsiz && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-orange-500/60" />
                )}

                {/* Poz No */}
                <div className="w-20 shrink-0 px-4 py-2.5">
                  <span className="text-[11px] text-zinc-600 font-mono">{item.pozNo}</span>
                </div>

                {/* İş Tanımı */}
                <div className="flex-1 min-w-0 px-2 py-2.5">
                  <div className="flex items-center gap-2">
                    {isFiyatsiz && (
                      <AlertTriangle className="w-3 h-3 text-orange-400 shrink-0" />
                    )}
                    <span className={`text-xs truncate ${isFiyatsiz ? "text-orange-200/70" : "text-zinc-300"}`}>
                      {item.isTanimi}
                    </span>
                  </div>
                </div>

                {/* Birim */}
                <div className="w-14 shrink-0 px-2 py-2.5 text-center">
                  <span className="text-[11px] text-zinc-600">{item.birim}</span>
                </div>

                {/* Miktar */}
                <EditableCell
                  value={item.miktar}
                  itemId={item.id}
                  field="miktar"
                  editCell={editCell}
                  setEditCell={setEditCell}
                  onChange={onCellChange}
                  width="w-20"
                />

                {/* Malzeme BF */}
                <EditableCell
                  value={item.malzemeBF}
                  itemId={item.id}
                  field="malzemeBF"
                  editCell={editCell}
                  setEditCell={setEditCell}
                  onChange={onCellChange}
                  width="w-24"
                  highlight={isFiyatsiz ? "orange" : undefined}
                />

                {/* İşçilik BF */}
                <EditableCell
                  value={item.iscilikBF}
                  itemId={item.id}
                  field="iscilikBF"
                  editCell={editCell}
                  setEditCell={setEditCell}
                  onChange={onCellChange}
                  width="w-24"
                />

                {/* Toplam BF */}
                <div className="w-24 shrink-0 px-3 py-2.5 text-right">
                  <span className="text-[11px] text-zinc-400">
                    {toplamBF > 0 ? toplamBF.toLocaleString("tr-TR") : "—"}
                  </span>
                </div>

                {/* Tutar */}
                <div className="w-28 shrink-0 px-3 py-2.5 text-right">
                  <span className={`text-xs ${tutar > 0 ? "text-white" : "text-zinc-700"}`}>
                    {tutar > 0 ? tutar.toLocaleString("tr-TR") + " ₺" : "—"}
                  </span>
                </div>

                {/* AI Lightbulb */}
                <div className="w-10 shrink-0 flex items-center justify-center relative">
                  <button
                    onClick={() => setAiPopupItemId(isAIOpen ? null : item.id)}
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                      isAIOpen
                        ? "bg-purple-500/30 text-purple-400"
                        : "text-zinc-700 hover:text-purple-400 hover:bg-purple-500/10"
                    }`}
                    title="AI fiyat önerisi"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                  </button>
                  {isAIOpen && (
                    <AIPopup
                      item={item}
                      onClose={() => setAiPopupItemId(null)}
                      onApply={(val) => onApplyAI(item.id, val)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EditableCell({
  value,
  itemId,
  field,
  editCell,
  setEditCell,
  onChange,
  width,
  highlight,
}: {
  value: number;
  itemId: string;
  field: EditCell["field"];
  editCell: EditCell | null;
  setEditCell: (c: EditCell | null) => void;
  onChange: (id: string, field: EditCell["field"], val: number) => void;
  width: string;
  highlight?: "orange";
}) {
  const isEditing = editCell?.itemId === itemId && editCell?.field === field;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  return (
    <div
      className={`${width} shrink-0 px-2 py-1.5 cursor-text`}
      onClick={() => setEditCell({ itemId, field })}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="number"
          defaultValue={value}
          className="w-full text-xs text-white text-right bg-transparent outline-none rounded px-1"
          style={{ border: "1px solid #4F8CFF", background: "rgba(79,140,255,0.08)" }}
          onBlur={(e) => {
            onChange(itemId, field, parseFloat(e.target.value) || 0);
            setEditCell(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") {
              onChange(itemId, field, parseFloat((e.target as HTMLInputElement).value) || 0);
              setEditCell(null);
            }
          }}
        />
      ) : (
        <div
          className={`text-xs text-right px-1 py-0.5 rounded transition-colors hover:bg-zinc-800/60 ${
            value === 0
              ? highlight === "orange"
                ? "text-orange-400/60"
                : "text-zinc-700"
              : "text-zinc-300"
          }`}
        >
          {value === 0 ? "—" : value.toLocaleString("tr-TR")}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function BOQPage() {
  const [activeTab, setActiveTab] = useState("insaat");
  const [editCell, setEditCell] = useState<EditCell | null>(null);
  const [aiPopupItemId, setAiPopupItemId] = useState<string | null>(null);

  // Flatten all items for state
  const initialItemData: Record<string, BOQItem> = {};
  tabs.forEach((tab) =>
    tab.sections.forEach((sec) =>
      sec.items.forEach((item) => {
        initialItemData[item.id] = { ...item };
      })
    )
  );
  const [itemData, setItemData] = useState<Record<string, BOQItem>>(initialItemData);

  const handleCellChange = (id: string, field: EditCell["field"], val: number) => {
    setItemData((prev) => ({ ...prev, [id]: { ...prev[id], [field]: val } }));
  };

  const handleApplyAI = (itemId: string, val: number) => {
    setItemData((prev) => ({ ...prev, [itemId]: { ...prev[itemId], malzemeBF: val } }));
    setAiPopupItemId(null);
  };

  const currentTab = tabs.find((t) => t.id === activeTab)!;

  // Totals (only insaat for demo, scale factor applied)
  const maliyetTotal = Object.values(itemData).reduce(
    (sum, it) => sum + it.miktar * (it.malzemeBF + it.iscilikBF),
    0
  );
  const carpan = 1.25;
  const teklifTotal = maliyetTotal * carpan;
  const karMarji = maliyetTotal > 0 ? ((teklifTotal - maliyetTotal) / teklifTotal) * 100 : 0;

  const fiyatsizToplamCount = currentTab.sections
    .flatMap((s) => s.items)
    .filter((it) => {
      const d = itemData[it.id] ?? it;
      return d.malzemeBF === 0 && d.iscilikBF === 0;
    }).length;

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar activePage="projects" user="asiye" />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <div
          className="px-6 pt-5 pb-0 flex-shrink-0"
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
            <Chevron className="w-3 h-3 text-zinc-700" />
            <button
              onClick={() => (window.location.href = "/projects/1")}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              MACFit Ankara
            </button>
            <Chevron className="w-3 h-3 text-zinc-700" />
            <span className="text-[11px] text-zinc-300">BOQ - Maliyet Çalışması</span>
          </div>

          {/* Title row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg text-white">BOQ — Maliyet Çalışması</h2>
              <p className="text-xs text-zinc-600 mt-0.5">MACFit Ankara · 950 m² · Son güncelleme: bugün</p>
            </div>
            <div className="flex items-center gap-2">
              {fiyatsizToplamCount > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {fiyatsizToplamCount} fiyatsız kalem
                </div>
              )}
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 transition-colors" style={{ border: "1px solid #2a2a2a" }}>
                <Upload className="w-3.5 h-3.5" />
                İçe Aktar
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 transition-colors" style={{ border: "1px solid #2a2a2a" }}>
                <Download className="w-3.5 h-3.5" />
                Dışa Aktar
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-400 transition-colors" style={{ border: "1px solid #2a2a2a" }}>
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-end gap-0">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              const tabFiyatsiz = tab.sections
                .flatMap((s) => s.items)
                .filter((it) => {
                  const d = itemData[it.id] ?? it;
                  return d.malzemeBF === 0 && d.iscilikBF === 0;
                }).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-5 py-3 text-sm transition-colors border-b-2 ${
                    isActive
                      ? "text-white border-[#4F8CFF]"
                      : "text-zinc-600 border-transparent hover:text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full leading-none ${
                      isActive ? "bg-[#4F8CFF]/20 text-[#4F8CFF]" : "bg-zinc-800 text-zinc-600"
                    }`}
                  >
                    {tab.kalemSayisi}
                  </span>
                  {tabFiyatsiz > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 absolute top-2 right-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table area */}
        <div className="flex-1 overflow-y-auto" style={{ background: "#0A0A0A" }}>
          {/* Table header */}
          <div
            className="sticky top-0 z-10 flex items-center"
            style={{ background: "#050505", borderBottom: "1px solid #1f1f1f" }}
          >
            <div className="w-20 shrink-0 px-4 py-2.5">
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Poz No</span>
            </div>
            <div className="flex-1 min-w-0 px-2 py-2.5">
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest">İş Tanımı</span>
            </div>
            <div className="w-14 shrink-0 px-2 py-2.5 text-center">
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Birim</span>
            </div>
            <div className="w-20 shrink-0 px-2 py-2.5 text-right">
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Miktar</span>
            </div>
            <div className="w-24 shrink-0 px-2 py-2.5 text-right">
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Malz. BF</span>
            </div>
            <div className="w-24 shrink-0 px-2 py-2.5 text-right">
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest">İşç. BF</span>
            </div>
            <div className="w-24 shrink-0 px-3 py-2.5 text-right">
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Toplam BF</span>
            </div>
            <div className="w-28 shrink-0 px-3 py-2.5 text-right">
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Tutar</span>
            </div>
            <div className="w-10 shrink-0" />
          </div>

          {/* Sections */}
          {currentTab.sections.map((section) => (
            <SectionBlock
              key={section.id}
              section={section}
              editCell={editCell}
              setEditCell={setEditCell}
              itemData={itemData}
              onCellChange={handleCellChange}
              aiPopupItemId={aiPopupItemId}
              setAiPopupItemId={setAiPopupItemId}
              onApplyAI={handleApplyAI}
            />
          ))}
        </div>

        {/* Fixed footer */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-6 py-3"
          style={{
            background: "#0D0D0D",
            borderTop: "1px solid #1f1f1f",
          }}
        >
          <div className="flex items-center gap-1.5 text-xs text-zinc-600">
            <Lightbulb className="w-3.5 h-3.5 text-purple-500/60" />
            <span>
              Herhangi bir satırda{" "}
              <span className="text-purple-400">💡</span> ikonuna tıklayarak AI fiyat önerisi alın.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-0.5">Toplam Maliyet</div>
              <div className="text-sm text-white">
                {maliyetTotal > 0
                  ? maliyetTotal.toLocaleString("tr-TR") + " ₺"
                  : "—"}
              </div>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="text-right">
              <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-0.5">Toplam Teklif</div>
              <div className="text-sm text-[#4F8CFF]">
                {teklifTotal > 0
                  ? teklifTotal.toLocaleString("tr-TR") + " ₺"
                  : "—"}
              </div>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="text-right">
              <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-0.5">Kâr Marjı</div>
              <div
                className="text-sm"
                style={{
                  color:
                    karMarji >= 20
                      ? "#4ade80"
                      : karMarji >= 10
                      ? "#facc15"
                      : "#f87171",
                }}
              >
                %{karMarji.toFixed(1)}
              </div>
            </div>
            <button
              className="ml-4 px-5 py-2 rounded-lg text-sm text-white transition-all hover:brightness-110"
              style={{ background: "#4F8CFF" }}
            >
              Teklifi Hazırla →
            </button>
          </div>
        </div>
      </div>

      {/* AI Copilot */}
      <AICopilot
        context="BOQ"
        welcomeMessage={
          "MACFit Ankara BOQ analizi:\n• 4 disiplinde toplam 567 kalem\n• 6 fiyatsız kalem tespit edildi\n• En yüksek belirsizlik: Kaplama bölümü\n• AI önerisi: Çelik bölme duvar fiyatı eksik"
        }
        shortcuts={["Boş kalemlere öner", "İcmal özeti", "Projeden kopyala", "Tedarikçi talebi"]}
      />
    </div>
  );
}
