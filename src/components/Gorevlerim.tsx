import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { CheckSquare, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

const tasks = [
  { id: 1, title: "Kadıköy Projesi BOQ revizyonu", project: "Kadıköy Residence", priority: "Yüksek", due: "2026-04-02", status: "Devam Ediyor" },
  { id: 2, title: "Malzeme fiyat güncellemesi", project: "Ataşehir Tower", priority: "Orta", due: "2026-04-05", status: "Bekliyor" },
  { id: 3, title: "Taşeron teklif değerlendirmesi", project: "Beşiktaş Plaza", priority: "Yüksek", due: "2026-04-01", status: "Devam Ediyor" },
  { id: 4, title: "Hakediş #3 onay kontrolü", project: "Kadıköy Residence", priority: "Düşük", due: "2026-04-10", status: "Bekliyor" },
  { id: 5, title: "İş programı güncelleme", project: "Ataşehir Tower", priority: "Orta", due: "2026-04-03", status: "Tamamlandı" },
];

const priorityColor: Record<string, string> = {
  "Yüksek": "text-red-400 bg-red-400/10",
  "Orta": "text-yellow-400 bg-yellow-400/10",
  "Düşük": "text-green-400 bg-green-400/10",
};

const statusIcon: Record<string, any> = {
  "Devam Ediyor": <Clock className="w-4 h-4 text-[#4F8CFF]" />,
  "Bekliyor": <AlertCircle className="w-4 h-4 text-yellow-400" />,
  "Tamamlandı": <CheckCircle2 className="w-4 h-4 text-green-400" />,
};

export function Gorevlerim() {
  return (
    <div className="flex h-screen bg-black">
      <Sidebar activePage="gorevlerim" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Görevlerim" />
        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#4F8CFF]/10 flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-[#4F8CFF]" />
            </div>
            <div>
              <h2 className="text-white text-lg">Görevlerim</h2>
              <p className="text-zinc-500 text-sm">{tasks.filter(t => t.status !== "Tamamlandı").length} aktif görev</p>
            </div>
          </div>

          <div className="bg-[#111] border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left text-xs text-zinc-500 px-4 py-3">Görev</th>
                  <th className="text-left text-xs text-zinc-500 px-4 py-3">Proje</th>
                  <th className="text-left text-xs text-zinc-500 px-4 py-3">Öncelik</th>
                  <th className="text-left text-xs text-zinc-500 px-4 py-3">Son Tarih</th>
                  <th className="text-left text-xs text-zinc-500 px-4 py-3">Durum</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-white">{task.title}</td>
                    <td className="px-4 py-3 text-sm text-zinc-400">{task.project}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${priorityColor[task.priority]}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-400">{task.due}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {statusIcon[task.status]}
                        <span className="text-sm text-zinc-300">{task.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
