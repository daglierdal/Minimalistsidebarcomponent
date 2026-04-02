import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { AICopilot } from "./AICopilot";
import { useNavigate } from "react-router";
import {
  Search,
  ChevronDown,
  ArrowUpRight,
  Eye,
  EyeOff,
  MoreHorizontal,
  Plus,
  Lock,
} from "lucide-react";

type Durum = "Aktif" | "İhale Aşaması" | "Teklif Gönderildi" | "Tamamlandı" | "İptal";
type Tip = "Keşif" | "İhale";

interface Project {
  id: string;
  name: string;
  musteri: string;
  tip: Tip;
  m2: number;
  durum: Durum;
  termin: string;
  terminUrgent?: boolean;
  teklifTutari: string | null; // null = gizli (sadece Planlama+Erdal)
  gizli: boolean; // teklif tutarı kısıtlı mı
}

const allProjects: Project[] = [
  {
    id: "1",
    name: "MACFit Ankara",
    musteri: "MACFit",
    tip: "Keşif",
    m2: 950,
    durum: "Aktif",
    termin: "15 Haz 2026",
    teklifTutari: "4.200.000 ₺",
    gizli: false,
  },
  {
    id: "2",
    name: "Yargıcı Nişantaşı",
    musteri: "Yargıcı",
    tip: "İhale",
    m2: 320,
    durum: "İhale Aşaması",
    termin: "20 May 2026",
    terminUrgent: true,
    teklifTutari: "2.550.000 ₺",
    gizli: true,
  },
  {
    id: "3",
    name: "Koton Kızılay",
    musteri: "Koton",
    tip: "Keşif",
    m2: 450,
    durum: "Teklif Gönderildi",
    termin: "15 Ağu 2026",
    teklifTutari: "2.800.000 ₺",
    gizli: true,
  },
  {
    id: "4",
    name: "So Chic Florya",
    musteri: "So Chic",
    tip: "Keşif",
    m2: 280,
    durum: "Tamamlandı",
    termin: "01 Mar 2026",
    teklifTutari: "3.100.000 ₺",
    gizli: false,
  },
  {
    id: "5",
    name: "MACFit Forum İstanbul",
    musteri: "MACFit",
    tip: "Keşif",
    m2: 1100,
    durum: "Aktif",
    termin: "15 Haz 2026",
    teklifTutari: "5.750.000 ₺",
    gizli: false,
  },
  {
    id: "6",
    name: "MACFit Bursa Nilüfer",
    musteri: "MACFit",
    tip: "Keşif",
    m2: 870,
    durum: "İhale Aşaması",
    termin: "01 Eyl 2026",
    teklifTutari: "3.900.000 ₺",
    gizli: true,
  },
  {
    id: "7",
    name: "Boyner Bağcılar",
    musteri: "Boyner",
    tip: "İhale",
    m2: 600,
    durum: "İptal",
    termin: "10 Nis 2026",
    teklifTutari: "1.600.000 ₺",
    gizli: false,
  },
];

const durumConfig: Record<Durum, { dot: string; text: string; badge: string }> = {
  "Aktif": {
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    badge: "border border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  },
  "İhale Aşaması": {
    dot: "bg-[#4F8CFF]",
    text: "text-[#4F8CFF]",
    badge: "border border-[#4F8CFF]/40 bg-[#4F8CFF]/10 text-[#4F8CFF]",
  },
  "Teklif Gönderildi": {
    dot: "bg-amber-400",
    text: "text-amber-400",
    badge: "border border-amber-500/40 bg-amber-500/10 text-amber-400",
  },
  "Tamamlandı": {
    dot: "bg-zinc-500",
    text: "text-zinc-400",
    badge: "border border-zinc-700 bg-zinc-800/60 text-zinc-400",
  },
  "İptal": {
    dot: "bg-red-500",
    text: "text-red-400",
    badge: "border border-red-500/40 bg-red-500/10 text-red-400",
  },
};

const musteriOptions = ["Tüm Müşteriler", ...Array.from(new Set(allProjects.map((p) => p.musteri)))];
const tipOptions = ["Tüm Tipler", "Keşif", "İhale"];
const durumOptions = ["Tüm Durumlar", "Aktif", "İhale Aşaması", "Teklif Gönderildi", "Tamamlandı", "İptal"];

function FilterSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 rounded-lg text-xs text-zinc-300 outline-none cursor-pointer transition-colors hover:border-zinc-600"
        style={{ background: "#111111", border: "1px solid #2a2a2a" }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
    </div>
  );
}

export function ProjectList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [musteri, setMusteri] = useState("Tüm Müşteriler");
  const [tip, setTip] = useState("Tüm Tipler");
  const [durum, setDurum] = useState("Tüm Durumlar");
  // Simulate current user — toggle for demo
  const [currentUser] = useState<"asiye" | "erdal">("asiye");
  const canSeeHidden = true; // Asiye = Planlama, Erdal = Admin — both can see

  const filtered = allProjects.filter((p) => {
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.musteri.toLowerCase().includes(search.toLowerCase());
    const matchMusteri = musteri === "Tüm Müşteriler" || p.musteri === musteri;
    const matchTip = tip === "Tüm Tipler" || p.tip === tip;
    const matchDurum = durum === "Tüm Durumlar" || p.durum === durum;
    return matchSearch && matchMusteri && matchTip && matchDurum;
  });

  const counts: Record<Durum, number> = {
    "Aktif": allProjects.filter((p) => p.durum === "Aktif").length,
    "İhale Aşaması": allProjects.filter((p) => p.durum === "İhale Aşaması").length,
    "Teklif Gönderildi": allProjects.filter((p) => p.durum === "Teklif Gönderildi").length,
    "Tamamlandı": allProjects.filter((p) => p.durum === "Tamamlandı").length,
    "İptal": allProjects.filter((p) => p.durum === "İptal").length,
  };

  return (
    <div className="flex h-screen bg-black">
      <Sidebar activePage="projects" user={currentUser} />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <div
          className="px-8 py-5 flex-shrink-0"
          style={{ background: "#000000", borderBottom: "1px solid #1a1a1a" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl text-white">Projeler</h2>
              <p className="text-xs text-zinc-600 mt-0.5">{allProjects.length} proje · {counts["Aktif"]} aktif</p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white transition-all hover:brightness-110"
              style={{ background: "#4F8CFF" }}
            >
              <Plus className="w-4 h-4" />
              Yeni Proje
            </button>
          </div>

          {/* Status chips */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {(Object.entries(counts) as [Durum, number][]).map(([d, count]) => {
              const cfg = durumConfig[d];
              const active = durum === d;
              return (
                <button
                  key={d}
                  onClick={() => setDurum(active ? "Tüm Durumlar" : d)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
                    active ? cfg.badge : "border border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {d}
                  <span className="ml-0.5 opacity-70">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Filter bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <FilterSelect value={musteri} options={musteriOptions} onChange={setMusteri} />
            <FilterSelect value={tip} options={tipOptions} onChange={setTip} />
            <FilterSelect value={durum} options={durumOptions} onChange={setDurum} />
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2 flex-1 max-w-xs"
              style={{ background: "#111111", border: "1px solid #2a2a2a" }}
            >
              <Search className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Proje veya müşteri ara..."
                className="bg-transparent text-xs text-zinc-300 placeholder-zinc-600 outline-none flex-1"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto px-8 py-6 relative">
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1f1f1f" }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: "#0A0A0A", borderBottom: "1px solid #1f1f1f" }}>
                  {["Proje Adı", "Müşteri", "Tip", "m²", "Durum", "Termin", "Teklif Tutarı", "İşlemler"].map(
                    (col) => (
                      <th
                        key={col}
                        className="text-left px-4 py-3 text-[11px] text-zinc-600 uppercase tracking-widest font-normal whitespace-nowrap"
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-zinc-600">
                      Filtrelere uyan proje bulunamadı.
                    </td>
                  </tr>
                )}
                {filtered.map((project) => {
                  const cfg = durumConfig[project.durum];
                  const showTutar = !project.gizli || canSeeHidden;
                  return (
                    <tr
                      key={project.id}
                      className="border-b border-zinc-900 hover:bg-zinc-900/40 transition-colors cursor-pointer group"
                      style={{ background: "#111111" }}
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      {/* Proje Adı */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-white group-hover:text-[#4F8CFF] transition-colors">
                          {project.name}
                        </span>
                      </td>

                      {/* Müşteri */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-zinc-400">{project.musteri}</span>
                      </td>

                      {/* Tip */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-xs px-2 py-1 rounded-md ${
                            project.tip === "İhale"
                              ? "bg-purple-500/10 text-purple-400"
                              : "bg-zinc-800/60 text-zinc-500"
                          }`}
                        >
                          {project.tip}
                        </span>
                      </td>

                      {/* m² */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-zinc-500">{project.m2.toLocaleString("tr-TR")}</span>
                      </td>

                      {/* Durum */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${cfg.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {project.durum}
                        </span>
                      </td>

                      {/* Termin */}
                      <td className="px-4 py-3.5">
                        <span className={`text-xs whitespace-nowrap ${project.terminUrgent ? "text-amber-400" : "text-zinc-500"}`}>
                          {project.terminUrgent && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 mb-0.5 align-middle" />
                          )}
                          {project.termin}
                        </span>
                      </td>

                      {/* Teklif Tutarı */}
                      <td className="px-4 py-3.5">
                        {project.teklifTutari === null ? (
                          <span className="text-xs text-zinc-700">—</span>
                        ) : project.gizli ? (
                          <div className="flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-zinc-600" />
                            <span className="text-xs text-zinc-600 select-none">Gizli</span>
                          </div>
                        ) : (
                          <span className="text-sm text-white">{project.teklifTutari}</span>
                        )}
                      </td>

                      {/* İşlemler */}
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => navigate(`/projects/${project.id}`)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                          <button className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer note */}
          <div className="flex items-center justify-end gap-2 mt-4">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: "#111111", border: "1px solid #1f1f1f" }}
            >
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <span className="text-[9px] text-red-400">E</span>
              </div>
              <Lock className="w-3 h-3 text-zinc-600" />
              <span className="text-[11px] text-zinc-600">
                <Eye className="w-3 h-3 inline mr-1 text-[#4F8CFF] opacity-80" />
                işaretli tutarlar yalnızca{" "}
                <span className="text-zinc-400">Planlama</span> ve{" "}
                <span className="text-red-400">Erdal</span> tarafından görülebilir.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Copilot */}
      <AICopilot
        context="Projeler"
        welcomeMessage={
          "Merhaba Asiye! Proje listesi özeti:\n• 2 aktif proje devam ediyor\n• 2 proje ihale/teklif aşamasında\n• Yargıcı Nişantaşı termini 20 gün kaldı\n• Koton teklifi yanıt bekliyor"
        }
        shortcuts={["Geciken projeler", "İhale aşamaları", "Aktif projeleri özetle", "Termin riski"]}
      />
    </div>
  );
}