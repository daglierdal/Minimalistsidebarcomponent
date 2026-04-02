import { useNavigate, useLocation } from "react-router";
import { LayoutGrid, FolderOpen, Building2, Settings, ClipboardList, DollarSign, Archive, CheckSquare, FileText, LogOut } from "lucide-react";

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  badge?: string;
  badgeColor?: string;
  disabled?: boolean;
  accentColor?: string;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

const groups: MenuGroup[] = [
  {
    label: "Ana Menü",
    items: [
      { icon: LayoutGrid, label: "Dashboard", path: "/" },
      { icon: FolderOpen, label: "Aktif Projeler", path: "/projects", accentColor: "#22c55e" },
      { icon: FileText, label: "İhale Pipeline", path: "/teklifler", accentColor: "#f97316" },
      { icon: CheckSquare, label: "Görevlerim", path: "/gorevlerim" },
      { icon: Building2, label: "Müşteriler", path: "/customers" },
    ],
  },
  {
    label: "Takip",
    items: [
      { icon: FileText, label: "Teklif Takip", path: "/teklif-listesi" },
      { icon: ClipboardList, label: "Hakediş Listesi", path: "/hakedis", badge: "1", badgeColor: "bg-purple-600" },
      { icon: DollarSign, label: "Maliyet Özeti", path: "/maliyet-listesi" },
      { icon: Archive, label: "Teklif Havuzu", path: "/teklif-havuzu" },
    ],
  },
  {
    label: "Sistem",
    items: [
      { icon: Settings, label: "Ayarlar", path: "/ayarlar" },
    ],
  },
];

export function Sidebar({ activePage, user = "asiye" }: { activePage?: string; user?: "asiye" | "erdal" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
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
            {group.items.map((item, ii) => {
              const active = isActive(item.path);
              return (
                <button
                  key={ii}
                  onClick={() => !item.disabled && navigate(item.path)}
                  disabled={item.disabled}
                  className={`relative w-full flex items-center gap-3 px-3 py-2.5 mb-0.5 rounded-lg transition-colors ${
                    item.disabled
                      ? "text-zinc-700 cursor-not-allowed"
                      : active
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  }`}
                >
                  {item.accentColor && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r"
                      style={{ backgroundColor: item.accentColor }}
                    />
                  )}
                  <item.icon
                    className="w-4 h-4 shrink-0"
                    style={item.accentColor ? { color: item.accentColor } : undefined}
                  />
                  <span className="text-sm flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] ${item.badgeColor} text-white rounded-full px-1.5 py-0.5 leading-none`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
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
            <button className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900 transition-colors" title="Çıkış Yap">
              <LogOut className="w-3.5 h-3.5" />
            </button>
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
            <button className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900 transition-colors" title="Çıkış Yap">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}