import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { SummaryCards } from "./SummaryCards";
import { ProjectTable } from "./ProjectTable";
import { AICopilot } from "./AICopilot";

export function Dashboard() {
  return (
    <div className="flex h-screen bg-black">
      <Sidebar activePage="projects" />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-8">
          <SummaryCards />
          <ProjectTable />
        </main>
      </div>
      <AICopilot context="Projeler" />
    </div>
  );
}