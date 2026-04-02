import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronRight,
  Edit2,
  Plus,
  Calendar,
  User,
  MapPin,
  Layers,
  Home,
  AlertCircle,
  X,
  ZoomIn,
  Tag,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { AICopilot } from "./AICopilot";

// ─── Types ────────────────────────────────────────────────────────────────────

type Onem = "kritik" | "orta" | "normal";
type Etiket = "elektrik" | "insaat" | "mekanik" | "dekorasyon" | "genel";

interface Fotograf {
  url: string;
  alt: string;
}

interface Not {
  id: string;
  baslik: string;
  etiket: Etiket;
  tarih: string;
  icerik: string;
  fotograflar: Fotograf[];
  onem: Onem;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const etiketMap: Record<Etiket, { label: string; color: string; bg: string; border: string }> = {
  elektrik:   { label: "Elektrik",   color: "#4F8CFF", bg: "rgba(79,140,255,0.10)",  border: "rgba(79,140,255,0.25)" },
  insaat:     { label: "İnşaat",     color: "#fb923c", bg: "rgba(249,115,22,0.10)",  border: "rgba(249,115,22,0.25)" },
  mekanik:    { label: "Mekanik",    color: "#34d399", bg: "rgba(52,211,153,0.10)",  border: "rgba(52,211,153,0.25)" },
  dekorasyon: { label: "Dekorasyon", color: "#a78bfa", bg: "rgba(139,92,246,0.10)", border: "rgba(139,92,246,0.25)" },
  genel:      { label: "Genel",      color: "#71717a", bg: "rgba(82,82,91,0.12)",    border: "rgba(82,82,91,0.25)" },
};

const onemMap: Record<Onem, { label: string; dot: string; color: string; bg: string; border: string }> = {
  kritik: { label: "Kritik", dot: "🔴", color: "#f87171", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.22)" },
  orta:   { label: "Orta",   dot: "🟡", color: "#fbbf24", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.22)" },
  normal: { label: "Normal", dot: "🟢", color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.20)" },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const notlar: Not[] = [
  {
    id: "n1",
    baslik: "Elektrik Pano Durumu",
    etiket: "elektrik",
    tarih: "15 Mar 2026",
    icerik: "Mevcut pano yetersiz, 3x63A'dan 3x125A'ya yükseltilmeli. Trafo mesafesi yaklaşık 40m. TEDAŞ başvurusu gerekecek.",
    fotograflar: [
      { url: "https://images.unsplash.com/photo-1761251947512-a293e482919f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", alt: "Elektrik panosu" },
      { url: "https://images.unsplash.com/photo-1601462904263-f2fa0c851cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", alt: "Kablo tesisatı" },
    ],
    onem: "kritik",
  },
  {
    id: "n2",
    baslik: "Tavan Yüksekliği",
    etiket: "insaat",
    tarih: "15 Mar 2026",
    icerik: "Zemin kat brüt 4.20m, 1. kat brüt 3.80m. Asma tavan sonrası net yükseklik yeterli. Mekanik kanal geçişlerinde dikkat.",
    fotograflar: [
      { url: "https://images.unsplash.com/photo-1768321902529-8679230e0aa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", alt: "Tavan yüksekliği" },
    ],
    onem: "orta",
  },
  {
    id: "n3",
    baslik: "Mekanik Tesisat",
    etiket: "mekanik",
    tarih: "15 Mar 2026",
    icerik: "Mevcut klima dış ünite alanı arka cephede. 4 adet VRF dış ünite sığabilir. Boru güzergahı asma tavan içinden.",
    fotograflar: [],
    onem: "normal",
  },
  {
    id: "n4",
    baslik: "Yangın Merdiveni",
    etiket: "insaat",
    tarih: "15 Mar 2026",
    icerik: "2. çıkış yolu mevcut ama kapı genişliği 80cm — 90cm'ye genişletilmeli. İtfaiye onayı gerekli.",
    fotograflar: [
      { url: "https://images.unsplash.com/photo-1584636633466-e1146b0c3518?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", alt: "Yangın çıkışı" },
    ],
    onem: "kritik",
  },
  {
    id: "n5",
    baslik: "Zemin Durumu",
    etiket: "dekorasyon",
    tarih: "15 Mar 2026",
    icerik: "Mevcut şap düzgün, seramik yapıştırılabilir. Islak hacimlerde su yalıtımı yenilenecek.",
    fotograflar: [],
    onem: "normal",
  },
  {
    id: "n6",
    baslik: "Bina Yönetimi Kısıtları",
    etiket: "genel",
    tarih: "15 Mar 2026",
    icerik: "Çalışma saatleri 08:00-18:00. Hafta sonu izin alınması gerekiyor. Asansör kullanımı kısıtlı — malzeme taşıma için vinç gerekebilir.",
    fotograflar: [],
    onem: "orta",
  },
];

const tabs = ["Genel", "BOQ", "RFQ", "Teklif", "Dosyalar", "Keşif"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FotografThumbnail({ foto, onClick }: { foto: Fotograf; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative w-20 h-14 rounded-lg overflow-hidden group shrink-0"
      style={{ border: "1px solid #2a2a2a" }}
    >
      <img src={foto.url} alt={foto.alt} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
        <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </button>
  );
}

function NotKarti({ not }: { not: Not }) {
  const [lightbox, setLightbox] = useState<Fotograf | null>(null);
  const et = etiketMap[not.etiket];
  const on = onemMap[not.onem];

  return (
    <>
      <div
        className="rounded-xl p-5 transition-all"
        style={{
          background: "#111",
          border: not.onem === "kritik" ? "1px solid rgba(239,68,68,0.18)" : "1px solid #1f1f1f",
        }}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm text-zinc-100">{not.baslik}</h4>
            {/* Etiket chip */}
            <span
              className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full"
              style={{ background: et.bg, border: `1px solid ${et.border}`, color: et.color }}
            >
              <Tag className="w-2.5 h-2.5" />
              {et.label}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Önem badge */}
            <span
              className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap"
              style={{ background: on.bg, border: `1px solid ${on.border}`, color: on.color }}
            >
              {on.dot} {on.label}
            </span>
            {/* Date */}
            <span className="text-[11px] text-zinc-700">{not.tarih}</span>
            {/* Edit */}
            <button className="w-6 h-6 flex items-center justify-center rounded text-zinc-700 hover:text-zinc-400 transition-colors">
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm text-zinc-500 leading-relaxed mb-3">{not.icerik}</p>

        {/* Photos */}
        {not.fotograflar.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {not.fotograflar.map((foto, i) => (
              <FotografThumbnail key={i} foto={foto} onClick={() => setLightbox(foto)} />
            ))}
            <span className="text-[11px] text-zinc-700 ml-1">
              {not.fotograflar.length} fotoğraf
            </span>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-8"
          style={{ background: "rgba(0,0,0,0.92)" }}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full text-zinc-400 hover:text-white transition-colors"
            style={{ background: "#1a1a1a", border: "1px solid #333" }}
            onClick={() => setLightbox(null)}
          >
            <X className="w-4 h-4" />
          </button>
          <img
            src={lightbox.url.replace("w=400", "w=1200")}
            alt={lightbox.alt}
            className="max-w-full max-h-full rounded-xl object-contain"
            style={{ border: "1px solid #2a2a2a" }}
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-zinc-500">{lightbox.alt}</p>
        </div>
      )}
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function KesifNotlari() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Keşif");
  const [filterEtiket, setFilterEtiket] = useState<Etiket | "">("");
  const [filterOnem, setFilterOnem] = useState<Onem | "">("");

  const kritikSayisi = notlar.filter((n) => n.onem === "kritik").length;

  const filtered = notlar.filter((n) => {
    const eOk = !filterEtiket || n.etiket === filterEtiket;
    const oOk = !filterOnem || n.onem === filterOnem;
    return eOk && oOk;
  });

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex-1 overflow-y-auto" style={{ background: "#060606" }}>

          {/* Header band */}
          <div style={{ background: "#000", borderBottom: "1px solid #1a1a1a" }} className="px-7 pt-5 pb-0 flex-shrink-0">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 mb-4">
              <button
                onClick={() => navigate("/teklifler")}
                className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                İhale Pipeline
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-800" />
              <button className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                MACFit Ankara Çankaya
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-800" />
              <span className="text-xs text-zinc-300">Keşif</span>
            </div>

            {/* Project header card */}
            <div
              className="rounded-xl px-5 py-4 flex items-center justify-between mb-4"
              style={{ background: "#111", border: "1px solid #222" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.22)" }}
                >
                  <span className="text-sm" style={{ color: "#fb923c" }}>M</span>
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-base text-white">MACFit Ankara Çankaya</h2>
                    <span
                      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(249,115,22,0.10)", border: "1px solid rgba(249,115,22,0.22)", color: "#fb923c" }}
                    >
                      İhale Aşaması
                    </span>
                    <span
                      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(82,82,91,0.15)", border: "1px solid #2a2a2a", color: "#71717a" }}
                    >
                      MACFit
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 mt-0.5">850 m² · Ankara, Çankaya · Keşif: 15 Mar 2026</p>
                </div>
              </div>

              {/* Critical warning */}
              {kritikSayisi > 0 && (
                <div
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg"
                  style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)" }}
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" style={{ color: "#f87171" }} />
                  <span className="text-xs" style={{ color: "#f87171" }}>
                    <span className="tabular-nums">{kritikSayisi}</span> kritik madde
                  </span>
                </div>
              )}
            </div>

            {/* Tab navigation */}
            <div className="flex items-center gap-0.5">
              {tabs.map((tab) => {
                const active = tab === activeTab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="relative px-4 py-3 text-sm transition-colors"
                    style={{ color: active ? "#e4e4e7" : "#52525b" }}
                    onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "#a1a1aa"; }}
                    onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "#52525b"; }}
                  >
                    {tab}
                    {active && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                        style={{ background: "#4F8CFF" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Page content */}
          <div className="px-7 py-5 flex flex-col gap-5">

            {/* BÖLÜM 1 — Keşif Bilgileri */}
            <div className="rounded-xl" style={{ background: "#111", border: "1px solid #1f1f1f" }}>
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #1f1f1f" }}>
                <h3 className="text-sm text-zinc-200">Keşif Bilgileri</h3>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                  style={{ border: "1px solid #2a2a2a" }}
                >
                  <Edit2 className="w-3 h-3" />
                  Düzenle
                </button>
              </div>

              <div className="px-5 py-5 grid grid-cols-2 gap-x-10 gap-y-5">
                {/* Sol sütun */}
                <div className="flex flex-col gap-4">
                  {[
                    { icon: <Calendar className="w-3.5 h-3.5" />, label: "Keşif Tarihi", value: "15 Mar 2026" },
                    { icon: <User className="w-3.5 h-3.5" />, label: "Keşif Yapan", value: "Erdal Dağlı" },
                    { icon: <MapPin className="w-3.5 h-3.5" />, label: "Lokasyon", value: "Ankara, Çankaya" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "#1a1a1a", border: "1px solid #252525", color: "#52525b" }}
                      >
                        {row.icon}
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-700 uppercase tracking-widest mb-0.5">{row.label}</div>
                        <div className="text-sm text-zinc-300">{row.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sağ sütun */}
                <div className="flex flex-col gap-4">
                  {[
                    { icon: <Layers className="w-3.5 h-3.5" />, label: "Toplam Alan", value: "850 m²" },
                    { icon: <Home className="w-3.5 h-3.5" />, label: "Kat", value: "Zemin + 1. Kat" },
                    { icon: <AlertCircle className="w-3.5 h-3.5" />, label: "Mevcut Durum", value: "Boş alan, eski kiracı tahliye etmiş" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "#1a1a1a", border: "1px solid #252525", color: "#52525b" }}
                      >
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
            </div>

            {/* BÖLÜM 2 — Notlar */}
            <div>
              {/* Section header */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm text-zinc-200">
                    Keşif Notları
                    <span className="text-zinc-600 ml-1.5">({notlar.length})</span>
                  </h3>

                  {/* Önem özet pills */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full cursor-pointer transition-all"
                      style={{
                        background: filterOnem === "kritik" ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.06)",
                        border: "1px solid rgba(239,68,68,0.20)",
                        color: "#f87171",
                      }}
                      onClick={() => setFilterOnem(filterOnem === "kritik" ? "" : "kritik")}
                    >
                      🔴 {notlar.filter((n) => n.onem === "kritik").length} Kritik
                    </span>
                    <span
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full cursor-pointer transition-all"
                      style={{
                        background: filterOnem === "orta" ? "rgba(251,191,36,0.15)" : "rgba(251,191,36,0.06)",
                        border: "1px solid rgba(251,191,36,0.20)",
                        color: "#fbbf24",
                      }}
                      onClick={() => setFilterOnem(filterOnem === "orta" ? "" : "orta")}
                    >
                      🟡 {notlar.filter((n) => n.onem === "orta").length} Orta
                    </span>
                    <span
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full cursor-pointer transition-all"
                      style={{
                        background: filterOnem === "normal" ? "rgba(52,211,153,0.15)" : "rgba(52,211,153,0.06)",
                        border: "1px solid rgba(52,211,153,0.18)",
                        color: "#34d399",
                      }}
                      onClick={() => setFilterOnem(filterOnem === "normal" ? "" : "normal")}
                    >
                      🟢 {notlar.filter((n) => n.onem === "normal").length} Normal
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Etiket filter */}
                  <div className="flex items-center gap-1.5">
                    {(Object.keys(etiketMap) as Etiket[]).map((e) => {
                      const cfg = etiketMap[e];
                      const active = filterEtiket === e;
                      return (
                        <button
                          key={e}
                          onClick={() => setFilterEtiket(active ? "" : e)}
                          className="text-[11px] px-2.5 py-1 rounded-full transition-all"
                          style={{
                            background: active ? cfg.bg : "transparent",
                            border: `1px solid ${active ? cfg.border : "#252525"}`,
                            color: active ? cfg.color : "#52525b",
                          }}
                        >
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>

                  {(filterEtiket || filterOnem) && (
                    <button
                      className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors px-2"
                      onClick={() => { setFilterEtiket(""); setFilterOnem(""); }}
                    >
                      Temizle
                    </button>
                  )}

                  {/* Add note */}
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white hover:brightness-110 transition-all"
                    style={{ background: "#4F8CFF" }}
                  >
                    <Plus className="w-4 h-4" />
                    Not Ekle
                  </button>
                </div>
              </div>

              {/* Critical banner */}
              {kritikSayisi > 0 && !filterEtiket && !filterOnem && (
                <div
                  className="flex items-start gap-3 px-4 py-3 rounded-xl mb-4"
                  style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.14)" }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#f87171" }} />
                  <div>
                    <p className="text-sm text-zinc-300">
                      <span style={{ color: "#f87171" }}>{kritikSayisi} kritik madde</span> tespit edildi.
                    </p>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      Elektrik pano güçlendirmesi ve yangın merdiveni genişletmesi teklif maliyetini etkileyebilir. AI Copilot ile etki analizini yapabilirsiniz.
                    </p>
                  </div>
                </div>
              )}

              {/* Note cards — 2 column masonry-like grid */}
              <div className="grid grid-cols-2 gap-3.5">
                {filtered.map((not) => (
                  <NotKarti key={not.id} not={not} />
                ))}

                {filtered.length === 0 && (
                  <div
                    className="col-span-2 flex flex-col items-center justify-center py-14 rounded-xl"
                    style={{ background: "#111", border: "1px solid #1f1f1f" }}
                  >
                    <p className="text-sm text-zinc-600">Bu filtreye uygun not bulunamadı</p>
                    <button
                      className="mt-2 text-xs text-zinc-700 hover:text-zinc-500 transition-colors"
                      onClick={() => { setFilterEtiket(""); setFilterOnem(""); }}
                    >
                      Filtreleri temizle
                    </button>
                  </div>
                )}
              </div>

              {/* Footer summary */}
              <div
                className="mt-4 flex items-center justify-between px-5 py-3.5 rounded-xl"
                style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}
              >
                <div className="flex items-center gap-5 text-xs text-zinc-600">
                  <span>Son keşif: <span className="text-zinc-400">15 Mar 2026</span></span>
                  <span className="text-zinc-800">·</span>
                  <span>Keşif yapan: <span className="text-zinc-400">Erdal Dağlı</span></span>
                  <span className="text-zinc-800">·</span>
                  <span>Toplam fotoğraf: <span className="text-zinc-400">4</span></span>
                </div>
                <button
                  className="flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-lg transition-colors"
                  style={{ border: "1px solid #2a2a2a", color: "#52525b" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#a1a1aa"; (e.currentTarget as HTMLElement).style.borderColor = "#3a3a3a"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#52525b"; (e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a"; }}
                >
                  PDF Raporu İndir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Copilot */}
      <AICopilot
        context="Keşif Notları"
        welcomeMessage={`MACFit Ankara Çankaya keşfi tamamlanmış.\n\n⚠️ 2 kritik madde tespit ettim:\n\n🔴 Elektrik pano güçlendirmesi — TEDAŞ başvurusu 4-6 hafta sürebilir. Termin risk!\n🔴 Yangın merdiveni genişletme — İtfaiye onayı gerekli, ~2 hafta.\n\n💰 Bu iki kalem teklife ~₺85.000 ek maliyet ekleyebilir.\n\nTeklif pozisyonlarına bu kalemleri eklememi ister misin?`}
        shortcuts={[
          "Kritik kalemleri teklife ekle",
          "Termin risk analizi",
          "TEDAŞ başvuru süreci",
          "Keşif PDF raporu",
        ]}
      />
    </div>
  );
}
