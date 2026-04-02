import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  X,
  Upload,
  Paperclip,
  Calendar,
  Users,
  FileText,
  Layers,
  AlertCircle,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { AICopilot } from "./AICopilot";

// ─── Data ─────────────────────────────────────────────────────────────────────

const musteriListesi = ["MACFit", "Yargıcı", "Koton", "LC Waikiki", "Decathlon", "Dagi", "Yataş Bedding"];
const projeTipleri = ["İhale", "Keşif", "Teklif"];
const sorumluListesi = ["Asiye", "Erdal"];
const sahaListesi = ["Erhan", "Seda"];
const satinAlmaListesi = ["Melike"];

const disiplinler = [
  { id: "insaat",    label: "İnşaat" },
  { id: "elektrik",  label: "Elektrik" },
  { id: "mekanik",   label: "Mekanik" },
  { id: "dekorasyon",label: "Dekorasyon" },
  { id: "mobilya",   label: "Mobilya" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-widest">
      {children}
      {required && <span className="ml-1 text-[#4F8CFF]">*</span>}
    </label>
  );
}

function Input({
  placeholder,
  type = "text",
  value,
  onChange,
  error,
}: {
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3.5 py-2.5 rounded-lg text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-all"
      style={{
        background: "#0d0d0d",
        border: error ? "1px solid rgba(239,68,68,0.5)" : "1px solid #242424",
        boxShadow: error ? "0 0 0 2px rgba(239,68,68,0.08)" : undefined,
      }}
      onFocus={(e) => {
        (e.target as HTMLElement).style.borderColor = "#4F8CFF";
        (e.target as HTMLElement).style.boxShadow = "0 0 0 2px rgba(79,140,255,0.08)";
      }}
      onBlur={(e) => {
        (e.target as HTMLElement).style.borderColor = error ? "rgba(239,68,68,0.5)" : "#242424";
        (e.target as HTMLElement).style.boxShadow = error ? "0 0 0 2px rgba(239,68,68,0.08)" : "none";
      }}
    />
  );
}

function DateInput({ placeholder, value, onChange }: { placeholder?: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 pr-10 rounded-lg text-sm text-zinc-400 outline-none transition-all appearance-none"
        style={{ background: "#0d0d0d", border: "1px solid #242424", colorScheme: "dark" }}
        onFocus={(e) => {
          (e.target as HTMLElement).style.borderColor = "#4F8CFF";
          (e.target as HTMLElement).style.boxShadow = "0 0 0 2px rgba(79,140,255,0.08)";
        }}
        onBlur={(e) => {
          (e.target as HTMLElement).style.borderColor = "#242424";
          (e.target as HTMLElement).style.boxShadow = "none";
        }}
      />
      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700 pointer-events-none" />
    </div>
  );
}

function SelectInput({
  placeholder,
  options,
  value,
  onChange,
  extra,
  error,
}: {
  placeholder: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  extra?: React.ReactNode;
  error?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-all"
        style={{
          background: "#0d0d0d",
          border: error ? "1px solid rgba(239,68,68,0.5)" : "1px solid #242424",
          color: value ? "#e4e4e7" : "#3f3f46",
        }}
      >
        <span>{value || placeholder}</span>
        <ChevronDown className="w-4 h-4 text-zinc-700 shrink-0" />
      </button>
      {open && (
        <div
          className="absolute top-full mt-1.5 left-0 right-0 z-50 rounded-xl overflow-hidden"
          style={{ background: "#161616", border: "1px solid #2a2a2a", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm transition-colors"
              style={{ color: value === opt ? "#4F8CFF" : "#a1a1aa" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#1f1f1f"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {opt}
            </button>
          ))}
          {extra}
        </div>
      )}
    </div>
  );
}

interface UploadedFile { name: string; size: string; }

// ─── Main ─────────────────────────────────────────────────────────────────────

export function YeniProjeFormu() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [musteri, setMusteri] = useState("");
  const [projeAdi, setProjeAdi] = useState("");
  const [projeTipi, setProjeTipi] = useState("");
  const [alan, setAlan] = useState("");
  const [konum, setKonum] = useState("");
  const [ihaleTarihi, setIhaleTarihi] = useState("");
  const [termin, setTermin] = useState("");
  const [baslangic, setBaslangic] = useState("");
  const [seciliDisiplinler, setSeciliDisiplinler] = useState<string[]>(disiplinler.map((d) => d.id));
  const [sorumlu, setSorumlu] = useState("Asiye");
  const [saha, setSaha] = useState("Erhan");
  const [satinAlma, setSatinAlma] = useState("Melike");
  const [notlar, setNotlar] = useState("");
  const [dosyalar, setDosyalar] = useState<UploadedFile[]>([
    { name: "MACFit_ihale_paketi.pdf", size: "12.4 MB" },
  ]);

  const errors = submitted
    ? {
        musteri: !musteri,
        projeAdi: !projeAdi,
        projeTipi: !projeTipi,
      }
    : { musteri: false, projeAdi: false, projeTipi: false };

  const toggleDisiplin = (id: string) => {
    setSeciliDisiplinler((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const newFiles = files.map((f) => ({
      name: f.name,
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
    }));
    setDosyalar((prev) => [...prev, ...newFiles]);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (!musteri || !projeAdi || !projeTipi) return;
    navigate("/teklifler");
  };

  const sectionCard = "rounded-xl p-5 mb-4";
  const sectionStyle = { background: "#111", border: "1px solid #1f1f1f" };

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex-1 overflow-y-auto" style={{ background: "#060606" }}>

          {/* Header band */}
          <div style={{ background: "#000", borderBottom: "1px solid #1a1a1a" }} className="px-7 pt-5 pb-5 flex-shrink-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 mb-4">
              <button
                onClick={() => navigate("/teklifler")}
                className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                İhale Pipeline
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-800" />
              <span className="text-xs text-zinc-300">Yeni Proje</span>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-lg text-white">Yeni Proje Oluştur</h1>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Proje bilgilerini girin, BOQ yüklemesi sonraki adımda yapılacak
                </p>
              </div>
              {/* Step indicator */}
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px]"
                    style={{ background: "#4F8CFF", color: "#fff" }}>1</div>
                  <span className="text-xs text-zinc-400">Proje Bilgileri</span>
                </div>
                <div className="w-8 h-px bg-zinc-800" />
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px]"
                    style={{ background: "#1a1a1a", border: "1px solid #333", color: "#555" }}>2</div>
                  <span className="text-xs text-zinc-700">BOQ Yükleme</span>
                </div>
                <div className="w-8 h-px bg-zinc-800" />
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px]"
                    style={{ background: "#1a1a1a", border: "1px solid #333", color: "#555" }}>3</div>
                  <span className="text-xs text-zinc-700">Teklif</span>
                </div>
              </div>
            </div>

            {/* Required field note */}
            <div className="flex items-center gap-1.5 mt-3">
              <span className="text-[11px] text-zinc-700">
                <span style={{ color: "#4F8CFF" }}>*</span> ile işaretli alanlar zorunludur
              </span>
            </div>
          </div>

          {/* Form body */}
          <div className="px-7 py-5">
            <div className="flex gap-5">

              {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
              <div className="flex-1 min-w-0">

                {/* Bölüm 1 — Temel Bilgiler */}
                <div className={sectionCard} style={sectionStyle}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "rgba(79,140,255,0.12)" }}>
                      <FileText className="w-3.5 h-3.5" style={{ color: "#4F8CFF" }} />
                    </div>
                    <h3 className="text-sm text-zinc-200">Temel Bilgiler</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    {/* Müşteri */}
                    <div className="col-span-2">
                      <Label required>Müşteri</Label>
                      <SelectInput
                        placeholder="Müşteri seçin..."
                        options={musteriListesi}
                        value={musteri}
                        onChange={setMusteri}
                        error={errors.musteri}
                        extra={
                          <button
                            type="button"
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                            style={{ color: "#4F8CFF", borderTop: "1px solid #222" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#1a1a2a"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Yeni Müşteri Ekle
                          </button>
                        }
                      />
                      {errors.musteri && (
                        <p className="mt-1 text-xs flex items-center gap-1" style={{ color: "#f87171" }}>
                          <AlertCircle className="w-3 h-3" /> Bu alan zorunludur
                        </p>
                      )}
                    </div>

                    {/* Proje Adı */}
                    <div className="col-span-2">
                      <Label required>Proje Adı</Label>
                      <Input
                        placeholder="Örn: MACFit Forum İstanbul"
                        value={projeAdi}
                        onChange={setProjeAdi}
                        error={errors.projeAdi}
                      />
                      {errors.projeAdi && (
                        <p className="mt-1 text-xs flex items-center gap-1" style={{ color: "#f87171" }}>
                          <AlertCircle className="w-3 h-3" /> Bu alan zorunludur
                        </p>
                      )}
                    </div>

                    {/* Proje Tipi */}
                    <div>
                      <Label required>Proje Tipi</Label>
                      <SelectInput
                        placeholder="Seçin..."
                        options={projeTipleri}
                        value={projeTipi}
                        onChange={setProjeTipi}
                        error={errors.projeTipi}
                      />
                      {errors.projeTipi && (
                        <p className="mt-1 text-xs flex items-center gap-1" style={{ color: "#f87171" }}>
                          <AlertCircle className="w-3 h-3" /> Zorunlu
                        </p>
                      )}
                    </div>

                    {/* Alan */}
                    <div>
                      <Label>Alan (m²)</Label>
                      <Input
                        type="number"
                        placeholder="Toplam alan"
                        value={alan}
                        onChange={setAlan}
                      />
                    </div>

                    {/* Konum */}
                    <div className="col-span-2">
                      <Label>Konum</Label>
                      <Input
                        placeholder="İl, ilçe veya adres"
                        value={konum}
                        onChange={setKonum}
                      />
                    </div>
                  </div>
                </div>

                {/* Bölüm 2 — Tarihler */}
                <div className={sectionCard} style={sectionStyle}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "rgba(251,191,36,0.10)" }}>
                      <Calendar className="w-3.5 h-3.5" style={{ color: "#fbbf24" }} />
                    </div>
                    <h3 className="text-sm text-zinc-200">Tarihler</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-3.5">
                    <div>
                      <Label>İhale Tarihi</Label>
                      <DateInput
                        placeholder="İhale teslim tarihi"
                        value={ihaleTarihi}
                        onChange={setIhaleTarihi}
                      />
                      <p className="mt-1 text-[11px] text-zinc-700">İhale teslim tarihi</p>
                    </div>
                    <div>
                      <Label>Termin</Label>
                      <DateInput
                        placeholder="Projenin teslim tarihi"
                        value={termin}
                        onChange={setTermin}
                      />
                      <p className="mt-1 text-[11px] text-zinc-700">Projenin teslim tarihi</p>
                    </div>
                    <div>
                      <Label>Başlangıç Tarihi</Label>
                      <DateInput
                        placeholder="Tahmini başlangıç"
                        value={baslangic}
                        onChange={setBaslangic}
                      />
                      <p className="mt-1 text-[11px] text-zinc-700">Tahmini başlangıç</p>
                    </div>
                  </div>
                </div>

                {/* Bölüm 3 — Disiplinler */}
                <div className={sectionCard} style={sectionStyle}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "rgba(52,211,153,0.10)" }}>
                      <Layers className="w-3.5 h-3.5" style={{ color: "#34d399" }} />
                    </div>
                    <h3 className="text-sm text-zinc-200">Disiplinler</h3>
                  </div>
                  <p className="text-xs text-zinc-600 mb-4 ml-8">Bu projede hangi disiplinler var?</p>

                  <div className="flex flex-wrap gap-2.5">
                    {disiplinler.map((d) => {
                      const checked = seciliDisiplinler.includes(d.id);
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => toggleDisiplin(d.id)}
                          className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm transition-all"
                          style={
                            checked
                              ? {
                                  background: "rgba(79,140,255,0.12)",
                                  border: "1px solid rgba(79,140,255,0.35)",
                                  color: "#4F8CFF",
                                }
                              : {
                                  background: "#0d0d0d",
                                  border: "1px solid #252525",
                                  color: "#3f3f46",
                                }
                          }
                        >
                          <div
                            className="w-4 h-4 rounded flex items-center justify-center transition-all"
                            style={
                              checked
                                ? { background: "#4F8CFF" }
                                : { background: "transparent", border: "1px solid #333" }
                            }
                          >
                            {checked && (
                              <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none">
                                <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom action bar */}
                <div
                  className="flex items-center justify-between px-5 py-4 rounded-xl mt-2"
                  style={{ background: "#0d0d0d", border: "1px solid #1f1f1f" }}
                >
                  <button
                    type="button"
                    onClick={() => navigate("/teklifler")}
                    className="px-5 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
                    style={{ border: "1px solid #2a2a2a" }}
                  >
                    İptal
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[11px] text-zinc-600">Oluşturulduktan sonra BOQ yükleyebilirsiniz</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm text-white hover:brightness-110 transition-all"
                      style={{ background: "#4F8CFF" }}
                    >
                      <Plus className="w-4 h-4" />
                      Proje Oluştur
                    </button>
                  </div>
                </div>
              </div>

              {/* ── RIGHT COLUMN ────────────────────────────────────────── */}
              <div className="w-72 shrink-0 flex flex-col gap-4">

                {/* Kart 1 — Proje Ekibi */}
                <div className="rounded-xl p-5" style={sectionStyle}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "rgba(139,92,246,0.12)" }}>
                      <Users className="w-3.5 h-3.5" style={{ color: "#a78bfa" }} />
                    </div>
                    <h3 className="text-sm text-zinc-200">Proje Ekibi</h3>
                  </div>

                  <div className="flex flex-col gap-3.5">
                    <div>
                      <Label>Proje Sorumlusu</Label>
                      <SelectInput
                        placeholder="Seçin..."
                        options={sorumluListesi}
                        value={sorumlu}
                        onChange={setSorumlu}
                      />
                    </div>
                    <div>
                      <Label>Saha Sorumlusu</Label>
                      <SelectInput
                        placeholder="Seçin..."
                        options={sahaListesi}
                        value={saha}
                        onChange={setSaha}
                      />
                    </div>
                    <div>
                      <Label>Satınalma</Label>
                      <SelectInput
                        placeholder="Seçin..."
                        options={satinAlmaListesi}
                        value={satinAlma}
                        onChange={setSatinAlma}
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] text-zinc-700">Ekip sonra da değiştirilebilir</p>
                </div>

                {/* Kart 2 — Notlar */}
                <div className="rounded-xl p-5" style={sectionStyle}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "rgba(251,191,36,0.10)" }}>
                      <FileText className="w-3.5 h-3.5" style={{ color: "#fbbf24" }} />
                    </div>
                    <h3 className="text-sm text-zinc-200">Proje Notları</h3>
                  </div>
                  <textarea
                    placeholder="İhale ile ilgili notlar, özel durumlar..."
                    value={notlar}
                    onChange={(e) => setNotlar(e.target.value)}
                    rows={4}
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm text-zinc-300 placeholder-zinc-700 outline-none resize-none transition-all"
                    style={{ background: "#0d0d0d", border: "1px solid #242424" }}
                    onFocus={(e) => {
                      (e.target as HTMLElement).style.borderColor = "#4F8CFF";
                      (e.target as HTMLElement).style.boxShadow = "0 0 0 2px rgba(79,140,255,0.08)";
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLElement).style.borderColor = "#242424";
                      (e.target as HTMLElement).style.boxShadow = "none";
                    }}
                  />
                </div>

                {/* Kart 3 — Dosya Yükleme */}
                <div className="rounded-xl p-5" style={sectionStyle}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "rgba(52,211,153,0.10)" }}>
                      <Upload className="w-3.5 h-3.5" style={{ color: "#34d399" }} />
                    </div>
                    <div>
                      <h3 className="text-sm text-zinc-200">İhale Dosyaları</h3>
                      <span className="text-[11px] text-zinc-700 ml-1">(opsiyonel)</span>
                    </div>
                  </div>

                  {/* Drop zone */}
                  <div
                    className="rounded-lg transition-all cursor-pointer"
                    style={{
                      border: dragging ? "1.5px dashed #4F8CFF" : "1.5px dashed #2a2a2a",
                      background: dragging ? "rgba(79,140,255,0.04)" : "#0a0a0a",
                      padding: "20px 12px",
                    }}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files ?? []);
                        setDosyalar((prev) => [
                          ...prev,
                          ...files.map((f) => ({ name: f.name, size: `${(f.size / 1024 / 1024).toFixed(1)} MB` })),
                        ]);
                      }}
                    />
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: "#181818", border: "1px solid #2a2a2a" }}
                      >
                        <Upload className="w-4 h-4 text-zinc-600" />
                      </div>
                      <p className="text-xs text-zinc-500">
                        İhale dokümanlarını sürükleyin veya{" "}
                        <span style={{ color: "#4F8CFF" }}>tıklayın</span>
                      </p>
                      <p className="text-[11px] text-zinc-700">PDF, ZIP, DWG, Excel — Max 50MB</p>
                    </div>
                  </div>

                  {/* Uploaded files */}
                  {dosyalar.length > 0 && (
                    <div className="mt-3 flex flex-col gap-2">
                      {dosyalar.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                          style={{ background: "#0d0d0d", border: "1px solid #1f1f1f" }}
                        >
                          <Paperclip className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-zinc-300 truncate">{f.name}</p>
                            <p className="text-[11px] text-zinc-700">{f.size}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setDosyalar((prev) => prev.filter((_, idx) => idx !== i))}
                            className="w-5 h-5 flex items-center justify-center rounded text-zinc-700 hover:text-zinc-400 transition-colors shrink-0"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Copilot */}
      <AICopilot
        context="Yeni Proje Formu"
        welcomeMessage={`Yeni bir proje oluşturuyorsun.\n\nZorunlu alanları doldurduktan sonra BOQ yükleme adımına geçebilirsin.\n\n💡 İpucu: MACFit projeleri için disiplin setini önceki projelerden kopyalayabilirim.\n\nMüşteri seçtikten sonra geçmiş proje ortalamalarını sana göstereyim mi?`}
        shortcuts={[
          "MACFit geçmiş projeleri",
          "Disiplin seti öner",
          "İhale şablonu hazırla",
          "BOQ tahmini fiyat",
        ]}
      />
    </div>
  );
}
