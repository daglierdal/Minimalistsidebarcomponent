import { LayoutGrid, FolderOpen, Building2, FileText, BarChart3, ShoppingCart, Users, Settings, Cog } from "lucide-react";

const groups = [
  {
    label: "Ana Menü",
    items: [
      { icon: LayoutGrid, label: "Dashboard", page: "dashboard" },
      { icon: FolderOpen, label: "Projeler", page: "projects" },
      { icon: Building2, label: "Müşteriler", page: "customers" },
    ],
  },
  {
    label: "Teklif Yönetimi",
    items: [
      { icon: FileText, label: "Teklifler", page: "teklifler", badge: "3", badgeColor: "bg-orange-500" },
      { icon: BarChart3, label: "Maliyetler", page: "maliyetler" },
    ],
  },
  {
    label: "Operasyon",
    items: [
      { icon: ShoppingCart, label: "Satınalma", page: "satinalma", disabled: true },
      { icon: Users, label: "Taşeron", page: "taseron", disabled: true },
    ],
  },
  {
    label: "Sistem",
    items: [
      { icon: Settings, label: "Ayarlar", page: "ayarlar" },
    ],
  },
];

export function Sidebar({ activePage = "projects", user = "asiye" }: { activePage?: string; user?: "asiye" | "erdal" }) {
  const handleNav = (page: string, disabled?: boolean) => {
    if (disabled) return;
    if (page === "projects") window.location.href = "/";
    else if (page === "customers") window.location.href = "/customers";
    else if (page === "dashboard") window.location.href = "/";
  };

  return (
    <aside className="w-[220px] bg-black border-r border-zinc-800 flex flex-col">
      <div className="p-6 pb-4">
        <h1 className="text-xl tracking-tight text-white">AkrotesOS</h1>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto">
        {groups.map((group, gi) => (
          <div key={gi}>
            {gi > 0 && <div className="border-t border-zinc-800 my-3" />}
            <div className="px-3 mb-1.5">
              <span className="text-[10px] uppercase tracking-widest text-zinc-600 select-none">
                {group.label}
              </span>
            </div>
            {group.items.map((item, ii) => (
              <button
                key={ii}
                onClick={() => handleNav(item.page, item.disabled)}
                disabled={item.disabled}
                className={`w-full flex items-center gap-3 px-3 py-2.5 mb-0.5 rounded-lg transition-colors ${
                  item.disabled
                    ? "text-zinc-700 cursor-not-allowed"
                    : item.page === activePage
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="text-sm flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] ${item.badgeColor} text-white rounded-full px-1.5 py-0.5 leading-none`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        {user === "erdal" ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-xs text-red-400">E</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate">Erdal Dağlı</div>
              <div className="inline-block text-[10px] bg-red-500/20 text-red-400 rounded px-1.5 py-0.5 mt-0.5 leading-none">
                Admin
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#4F8CFF]/20 flex items-center justify-center">
              <span className="text-xs text-[#4F8CFF]">A</span>
            </div>
            <div className="flex-1">
              <div className="text-sm text-white">Asiye</div>
              <div className="inline-block text-[10px] bg-[#4F8CFF]/20 text-[#4F8CFF] rounded px-1.5 py-0.5 mt-0.5 leading-none">
                Planlama
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}