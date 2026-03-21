import { FolderOpen, Users, Calendar, FileText, BarChart3, Settings, HelpCircle } from "lucide-react";

const navItems = [
  { icon: FolderOpen, label: "Projeler", active: true, page: "projects" },
  { icon: Users, label: "Müşteriler", page: "customers" },
  { icon: Calendar, label: "Keşif & BOQ", page: "boq" },
  { icon: FileText, label: "Tekfif" },
  { icon: BarChart3, label: "Satinalma" },
  { icon: Calendar, label: "Taşeron" },
  { icon: FileText, label: "Taşeron Çarı" },
  { icon: Settings, label: "Ödemeler" },
];

export function Sidebar({ activePage = "projects" }: { activePage?: string }) {
  return (
    <aside className="w-[220px] bg-black border-r border-zinc-800 flex flex-col">
      <div className="p-6">
        <h1 className="text-xl tracking-tight text-white">AkrotesOS</h1>
      </div>
      
      <nav className="flex-1 px-3">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              if (item.page === "projects") {
                window.location.href = "/";
              } else if (item.page === "customers") {
                window.location.href = "/customers";
              } else if (item.page === "boq") {
                window.location.href = "/boq/1";
              }
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg transition-colors ${
              item.page === activePage
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:bg-zinc-900"
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800" />
          <div className="flex-1">
            <div className="text-sm text-white">Erdal Dağlı</div>
            <div className="text-xs text-zinc-500">Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}