import { ArrowUpRight } from "lucide-react";

interface Project {
  id: string;
  name: string;
  musteri: string;
  tip: string;
  durum: "Aktif" | "Planlama" | "Devam Ediyor" | "Tamamlandı" | "Beklemede";
  termin: string;
  terminUrgent?: boolean;
}

const projects: Project[] = [
  {
    id: "1",
    name: "MACFit Forum İstanbul",
    musteri: "MACFit",
    tip: "Spor Tesisi",
    durum: "Aktif",
    termin: "15 Haz 2026",
  },
  {
    id: "2",
    name: "MACFit Çankaya",
    musteri: "MACFit",
    tip: "Spor Tesisi",
    durum: "Devam Ediyor",
    termin: "01 Haz 2026",
    terminUrgent: true,
  },
  {
    id: "3",
    name: "MACFit Bursa Nilüfer",
    musteri: "MACFit",
    tip: "Spor Tesisi",
    durum: "Planlama",
    termin: "01 Eyl 2026",
  },
  {
    id: "4",
    name: "MACFit Kadıköy",
    musteri: "MACFit",
    tip: "Spor Tesisi",
    durum: "Aktif",
    termin: "01 Eyl 2026",
  },
  {
    id: "5",
    name: "Yargıcı Nişantaşı",
    musteri: "Yargıcı",
    tip: "Mağaza",
    durum: "Devam Ediyor",
    termin: "20 May 2026",
    terminUrgent: true,
  },
  {
    id: "6",
    name: "Koton Ankara Kızılay",
    musteri: "Koton",
    tip: "Mağaza",
    durum: "Aktif",
    termin: "15 Ağu 2026",
  },
];

const durumConfig: Record<Project["durum"], { label: string; className: string }> = {
  "Aktif": {
    label: "Aktif",
    className: "border border-[#4F8CFF]/40 text-[#4F8CFF] bg-[#4F8CFF]/10",
  },
  "Devam Ediyor": {
    label: "Devam Ediyor",
    className: "border border-amber-500/40 text-amber-400 bg-amber-500/10",
  },
  "Planlama": {
    label: "Planlama",
    className: "border border-zinc-600 text-zinc-400 bg-zinc-800/60",
  },
  "Tamamlandı": {
    label: "Tamamlandı",
    className: "border border-green-500/40 text-green-400 bg-green-500/10",
  },
  "Beklemede": {
    label: "Beklemede",
    className: "border border-zinc-600 text-zinc-500 bg-zinc-800/40",
  },
};

function StatusBadge({ durum }: { durum: Project["durum"] }) {
  const cfg = durumConfig[durum];
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

export function ProjectTable() {
  return (
    <div>
      {/* Table header row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-zinc-400">Projeler</span>
        <button
          className="text-xs text-[#4F8CFF] hover:text-white transition-colors flex items-center gap-1"
          onClick={() => (window.location.href = "/")}
        >
          Tümünü gör <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid #1f1f1f" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ background: "#0A0A0A" }} className="border-b border-zinc-800/80">
              <th className="text-left px-4 py-3 text-[11px] text-zinc-500 uppercase tracking-widest font-normal">
                Proje Adı
              </th>
              <th className="text-left px-4 py-3 text-[11px] text-zinc-500 uppercase tracking-widest font-normal">
                Müşteri
              </th>
              <th className="text-left px-4 py-3 text-[11px] text-zinc-500 uppercase tracking-widest font-normal">
                Tip
              </th>
              <th className="text-left px-4 py-3 text-[11px] text-zinc-500 uppercase tracking-widest font-normal">
                Durum
              </th>
              <th className="text-left px-4 py-3 text-[11px] text-zinc-500 uppercase tracking-widest font-normal">
                Termin
              </th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                className="border-b border-zinc-800/40 hover:bg-zinc-800/20 cursor-pointer transition-colors group"
                style={{ background: "#111111" }}
                onClick={() => (window.location.href = `/projects/${project.id}`)}
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
                  <span className="text-xs text-zinc-500 bg-zinc-800/60 px-2 py-1 rounded-md">
                    {project.tip}
                  </span>
                </td>

                {/* Durum */}
                <td className="px-4 py-3.5">
                  <StatusBadge durum={project.durum} />
                </td>

                {/* Termin */}
                <td className="px-4 py-3.5">
                  <span
                    className={`text-xs whitespace-nowrap ${
                      project.terminUrgent ? "text-amber-400" : "text-zinc-500"
                    }`}
                  >
                    {project.terminUrgent && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 mb-0.5 align-middle" />
                    )}
                    {project.termin}
                  </span>
                </td>

                {/* Arrow */}
                <td className="px-3 py-3.5 text-right">
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
