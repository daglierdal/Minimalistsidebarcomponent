const projects = [
  {
    name: "MACFit Çankaya",
    location: "Ankara/Çankaya",
    amount: "850",
    date: "01.06.26",
    progress: 35,
    status: "Devam Ediyor",
    statusType: "active",
  },
  {
    name: "MACFit Bursa Nilüfer",
    location: "Bursa/Nilüfer",
    amount: "950",
    date: "01.09.26",
    progress: 0,
    status: "Planlama",
    statusType: "location",
  },
  {
    name: "MACFit Kadıköy",
    location: "İstanbul/Kadıköy",
    amount: "950",
    date: "01.09.26",
    progress: 10,
    status: "Aktif",
    statusType: "subtle",
  },
  {
    name: "Yargıcı Nişantaşı",
    location: "İstanbul/Nişantaşı",
    amount: "320",
    date: "20.05.26",
    progress: 60,
    status: "Devam Ediyor",
    statusType: "active",
  },
  {
    name: "Koton Ankara Kızılay",
    location: "Ankara/Kızılay",
    amount: "450",
    date: "15.08.26",
    progress: 0,
    status: "Aktif",
    statusType: "subtle",
  },
];

function StatusBadge({ status, statusType }: { status: string; statusType: string }) {
  if (statusType === "active") {
    return (
      <span className="inline-block px-2.5 py-1 rounded-full text-xs border border-amber-500/60 text-amber-400 bg-amber-500/10">
        {status}
      </span>
    );
  }
  if (statusType === "subtle") {
    return (
      <span className="inline-block px-2.5 py-1 rounded-full text-xs border border-[#4F8CFF]/40 text-[#4F8CFF] bg-[#4F8CFF]/10">
        {status}
      </span>
    );
  }
  // location / default
  return (
    <span className="inline-block px-2.5 py-1 rounded-full text-xs border border-zinc-700 text-zinc-400 bg-zinc-800/60">
      {status}
    </span>
  );
}

export function ProjectTable() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800 bg-black">
            <th className="text-left px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">Proje Adı</th>
            <th className="text-left px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">Müşteri</th>
            <th className="text-left px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">Tip</th>
            <th className="text-left px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">m²</th>
            <th className="text-left px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">Bitiş</th>
            <th className="text-left px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">İlerleme</th>
            <th className="text-left px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">Durum</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr
              key={index}
              className="border-b border-zinc-800 hover:bg-zinc-800/60 cursor-pointer"
              onClick={() => (window.location.href = "/projects/1")}
            >
              <td className="px-4 py-3">
                <div className="text-sm text-white whitespace-nowrap">{project.name}</div>
              </td>
              <td className="px-4 py-3">
                <div className="text-xs text-zinc-400 whitespace-nowrap">{project.location}</div>
              </td>
              <td className="px-4 py-3">
                <div className="text-xs text-zinc-400 whitespace-nowrap">MACFit | Keşif</div>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-white">{project.amount}</div>
              </td>
              <td className="px-4 py-3">
                <div className="text-xs text-zinc-400 whitespace-nowrap">{project.date}</div>
              </td>
              <td className="px-4 py-3 min-w-[120px]">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4F8CFF] rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-zinc-400 w-8 text-right shrink-0">
                    {project.progress}%
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={project.status} statusType={project.statusType} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}