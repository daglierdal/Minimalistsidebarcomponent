import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { SummaryCards } from "./SummaryCards";
import { ProjectTable } from "./ProjectTable";

export function Dashboard() {
  return (
    <div className="flex h-screen bg-black">
      <Sidebar activePage="projects" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-8">
          <SummaryCards />
          <ProjectTable />
        </main>
      </div>
    </div>
  );
}