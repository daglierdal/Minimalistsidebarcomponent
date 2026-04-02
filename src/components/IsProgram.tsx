import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ChevronRight,
  Home,
  Download,
  Share2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { AICopilot } from "./AICopilot";

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewMode = "gun" | "hafta" | "ay";

interface Task {
  id: string;
  name: string;
  progress: number; // 0-100
  startWeek: number; // 0-based week index from chart start
  durationWeeks: number;
  status: "done" | "active" | "delayed" | "pending";
  warning?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

// Chart spans Nisan 1 – Haziran 28, 2026 (13 weeks)
// Week 0 = Nis 1–7, Week 4 = May 1, Week 8 = Haz 1

const tasks: Task[] = [
  {
    id: "t1",
    name: "Yıkım & Söküm",
    progress: 100,
    startWeek: 0,
    durationWeeks: 2,
    status: "done",
  },
  {
    id: "t2",
    name: "Alçıpan İmalat",
    progress: 70,
    startWeek: 1,
    durationWeeks: 5,
    status: "delayed",
    warning: "3 gün geride",
  },
  {
    id: "t3",
    name: "Seramik Kaplama",
    progress: 40,
    startWeek: 4,
    durationWeeks: 4,
    status: "active",
  },
  {
    id: "t4",
    name: "Elektrik Tesisatı",
    progress: 30,
    startWeek: 3,
    durationWeeks: 6,
    status: "active",
  },
  {
    id: "t5",
    name: "Mekanik Tesisat",
    progress: 20,
    startWeek: 5,
    durationWeeks: 5,
    status: "active",
  },
  {
    id: "t6",
    name: "Mobilya & Dekor",
    progress: 0,
    startWeek: 9,
    durationWeeks: 4,
    status: "pending",
  },
];

// 13 weeks: Nisan 1 – Haziran 28
const TOTAL_WEEKS = 13;

const weekLabels: { week: number; label: string; isMonthStart?: boolean; month?: string }[] = [];
const months = [
  { name: "Nisan 2026", weeks: [0, 1, 2, 3] },
  { name: "Mayıs 2026", weeks: [4, 5, 6, 7] },
  { name: "Haziran 2026", weeks: [8, 9, 10, 11, 12] },
];

// Week day labels (Mon of each week offset from Apr 1)
const weekDayLabels = [
  "1 Nis", "8 Nis", "15 Nis", "22 Nis",
  "29 Nis", "6 May", "13 May", "20 May",
  "27 May", "3 Haz", "10 Haz", "17 Haz", "24 Haz",
];

// Today = March 30, 2026 → on chart it's just before Nisan 1 (~week -0.14)
// Place "today" marker at the very start (week 0, ~day 0)
const TODAY_WEEK_OFFSET = -0.14; // slightly before week 0

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getBarColor(task: Task): { bar: string; fill: string; glow: string } {
  if (task.status === "done")
    return {
      bar: "rgba(52,211,153,0.15)",
      fill: "linear-gradient(90deg,#16a34a,#34d399)",
      glow: "rgba(52,211,153,0.35)",
    };
  if (task.status === "delayed")
    return {
      bar: "rgba(79,140,255,0.10)",
      fill: "linear-gradient(90deg,#3b72d9,#4F8CFF)",
      glow: "rgba(79,140,255,0.35)",
    };
  if (task.status === "pending")
    return {
      bar: "rgba(63,63,70,0.3)",
      fill: "#3f3f46",
      glow: "transparent",
    };
  return {
    bar: "rgba(79,140,255,0.10)",
    fill: "linear-gradient(90deg,#3b72d9,#4F8CFF)",
    glow: "rgba(79,140,255,0.3)",
  };
}

function StatusIcon({ task }: { task: Task }) {
  if (task.status === "done")
    return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
  if (task.status === "delayed")
    return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
  if (task.status === "pending")
    return <Circle className="w-3.5 h-3.5 text-zinc-700 shrink-0" />;
  return <Clock className="w-3.5 h-3.5 text-[#4F8CFF] shrink-0" />;
}

function ProgressBadge({ pct, status }: { pct: number; status: Task["status"] }) {
  const color =
    status === "done"
      ? "text-emerald-400"
      : status === "delayed"
      ? "text-amber-400"
      : status === "pending"
      ? "text-zinc-700"
      : "text-[#4F8CFF]";
  return <span className={`text-[11px] tabular-nums ${color}`}>{pct}%</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function IsProgram() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("hafta");
  const chartRef = useRef<HTMLDivElement>(null);

  const ROW_H = 52; // px per task row
  const LABEL_W = 220; // px for left task label column
  const PROGRESS_W = 48; // px for progress column

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar activePage="is-programi" />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <div
          className="px-7 pt-5 pb-0 flex-shrink-0"
          style={{ background: "#000000", borderBottom: "1px solid #1a1a1a" }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 mb-3">
            <button
              onClick={() => navigate("/projects")}
              className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1"
            >
              <Home className="w-3 h-3" />
              Projeler
            </button>
            <ChevronRight className="w-3 h-3 text-zinc-700" />
            <button
              onClick={() => navigate("/projects/2")}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              MACFit Ankara
            </button>
            <ChevronRight className="w-3 h-3 text-zinc-700" />
            <span className="text-[11px] text-zinc-300">İş Programı</span>
          </div>

          {/* Title + Controls */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg text-white">İş Programı</h2>
              <p className="text-xs text-zinc-600 mt-0.5">
                MACFit Ankara · Nisan – Haziran 2026 · 6 görev
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div
                className="flex items-center rounded-lg p-0.5"
                style={{ background: "#111111", border: "1px solid #2a2a2a" }}
              >
                {(["gun", "hafta", "ay"] as ViewMode[]).map((m) => {
                  const labels = { gun: "Gün", hafta: "Hafta", ay: "Ay" };
                  const isActive = viewMode === m;
                  return (
                    <button
                      key={m}
                      onClick={() => setViewMode(m)}
                      className="px-4 py-1.5 rounded-md text-xs transition-all"
                      style={
                        isActive
                          ? { background: "#4F8CFF", color: "#fff" }
                          : { color: "#71717a" }
                      }
                    >
                      {labels[m]}
                    </button>
                  );
                })}
              </div>

              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-300 hover:text-white transition-colors"
                style={{ border: "1px solid #2a2a2a", background: "#111111" }}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                BOQ'dan Güncelle
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto" style={{ background: "#080808" }}>
          <div className="px-7 pt-5 pb-8">
            {/* Gantt Card */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid #1f1f1f" }}
            >
              {/* ── Month header row ── */}
              <div
                className="flex"
                style={{ background: "#0A0A0A", borderBottom: "1px solid #1f1f1f" }}
              >
                {/* Task label col */}
                <div
                  className="shrink-0 flex items-center px-4 py-2.5"
                  style={{
                    width: LABEL_W + PROGRESS_W,
                    borderRight: "1px solid #1f1f1f",
                  }}
                >
                  <span className="text-[11px] text-zinc-600 uppercase tracking-widest">Görev</span>
                </div>
                {/* Month spans */}
                <div className="flex flex-1">
                  {months.map((mo) => (
                    <div
                      key={mo.name}
                      className="flex items-center justify-center py-2.5 text-[11px] text-zinc-500 uppercase tracking-widest"
                      style={{
                        width: `${(mo.weeks.length / TOTAL_WEEKS) * 100}%`,
                        borderRight: "1px solid #1f1f1f",
                      }}
                    >
                      {mo.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Week header row ── */}
              <div
                className="flex"
                style={{ background: "#0D0D0D", borderBottom: "1px solid #1f1f1f" }}
              >
                <div
                  className="shrink-0"
                  style={{
                    width: LABEL_W + PROGRESS_W,
                    borderRight: "1px solid #1f1f1f",
                  }}
                />
                <div className="flex flex-1 relative">
                  {weekDayLabels.map((lbl, wi) => (
                    <div
                      key={wi}
                      className="flex items-center justify-center py-2 text-[10px] text-zinc-700"
                      style={{
                        width: `${(1 / TOTAL_WEEKS) * 100}%`,
                        borderRight: wi < TOTAL_WEEKS - 1 ? "1px solid #181818" : "none",
                      }}
                    >
                      {lbl}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Task rows ── */}
              <div ref={chartRef} className="relative" style={{ background: "#111111" }}>
                {tasks.map((task, ti) => {
                  const colors = getBarColor(task);
                  const isLast = ti === tasks.length - 1;

                  return (
                    <div
                      key={task.id}
                      className="flex items-center group transition-colors hover:bg-zinc-900/30"
                      style={{
                        height: ROW_H,
                        borderBottom: isLast ? "none" : "1px solid #1a1a1a",
                      }}
                    >
                      {/* Task label */}
                      <div
                        className="shrink-0 flex items-center gap-2.5 px-4"
                        style={{ width: LABEL_W, borderRight: "1px solid #1f1f1f", height: "100%" }}
                      >
                        <StatusIcon task={task} />
                        <span
                          className={`text-sm truncate ${
                            task.status === "done"
                              ? "text-zinc-400"
                              : task.status === "pending"
                              ? "text-zinc-700"
                              : "text-zinc-200"
                          }`}
                        >
                          {task.name}
                        </span>
                        {task.warning && (
                          <span
                            className="ml-auto shrink-0 text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap"
                            style={{
                              background: "rgba(234,179,8,0.12)",
                              border: "1px solid rgba(234,179,8,0.3)",
                              color: "#fbbf24",
                            }}
                          >
                            ⚠ {task.warning}
                          </span>
                        )}
                      </div>

                      {/* Progress % */}
                      <div
                        className="shrink-0 flex items-center justify-center"
                        style={{
                          width: PROGRESS_W,
                          height: "100%",
                          borderRight: "1px solid #1f1f1f",
                        }}
                      >
                        <ProgressBadge pct={task.progress} status={task.status} />
                      </div>

                      {/* Chart area */}
                      <div className="flex-1 relative h-full flex items-center px-1">
                        {/* Vertical week grid lines */}
                        {weekDayLabels.map((_, wi) => (
                          <div
                            key={wi}
                            className="absolute top-0 bottom-0 w-px"
                            style={{
                              left: `${(wi / TOTAL_WEEKS) * 100}%`,
                              background: "#181818",
                            }}
                          />
                        ))}

                        {/* Today line — at ~0% (start of chart = Apr 1, today = Mar 30) */}
                        <div
                          className="absolute top-0 bottom-0 z-10"
                          style={{
                            left: `${Math.max(0, (TODAY_WEEK_OFFSET / TOTAL_WEEKS) * 100)}%`,
                            width: 2,
                            background: "rgba(239,68,68,0.85)",
                            boxShadow: "0 0 6px rgba(239,68,68,0.5)",
                          }}
                        />

                        {/* Bar background track */}
                        <div
                          className="absolute rounded"
                          style={{
                            left: `calc(${(task.startWeek / TOTAL_WEEKS) * 100}% + 4px)`,
                            width: `calc(${(task.durationWeeks / TOTAL_WEEKS) * 100}% - 8px)`,
                            height: 22,
                            background: colors.bar,
                            border: `1px solid ${colors.bar}`,
                          }}
                        >
                          {/* Filled progress */}
                          <div
                            className="h-full rounded"
                            style={{
                              width: `${task.progress}%`,
                              background: colors.fill,
                              boxShadow: task.status !== "pending" ? `0 0 8px ${colors.glow}` : "none",
                              transition: "width 0.6s ease",
                            }}
                          />

                          {/* Progress label inside bar */}
                          {task.progress > 0 && (
                            <div
                              className="absolute inset-0 flex items-center pl-2"
                            >
                              <span className="text-[10px] text-white/70 leading-none">
                                {task.name.split(" ")[0]}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Today label at top */}
                <div
                  className="absolute top-0 z-20 flex flex-col items-center"
                  style={{
                    left: `calc(${LABEL_W + PROGRESS_W}px + ${Math.max(0, (TODAY_WEEK_OFFSET / TOTAL_WEEKS)) * (100)}%)`,
                    transform: "translateX(-50%)",
                    pointerEvents: "none",
                  }}
                >
                  <div
                    className="text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap"
                    style={{
                      background: "rgba(239,68,68,0.15)",
                      border: "1px solid rgba(239,68,68,0.4)",
                      color: "#f87171",
                    }}
                  >
                    Bugün · 30 Mar
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 mt-4 px-1">
              {[
                { color: "#34d399", label: "Tamamlandı" },
                { color: "#4F8CFF", label: "Devam ediyor" },
                { color: "#fbbf24", label: "Gecikme uyarısı" },
                { color: "#3f3f46", label: "Başlamadı" },
                { color: "#ef4444", label: "Bugün" },
              ].map((leg) => (
                <div key={leg.label} className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-2 rounded-sm"
                    style={{ background: leg.color, opacity: leg.label === "Bugün" ? 1 : 0.8 }}
                  />
                  <span className="text-[11px] text-zinc-600">{leg.label}</span>
                </div>
              ))}
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-4 gap-3 mt-5">
              {[
                { label: "Tamamlanan", value: "1", sub: "görev", color: "#34d399" },
                { label: "Devam Eden", value: "4", sub: "görev", color: "#4F8CFF" },
                { label: "Gecikme", value: "1", sub: "görev", color: "#fbbf24" },
                { label: "Başlamadı", value: "1", sub: "görev", color: "#52525b" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl px-4 py-3.5 flex items-center gap-3"
                  style={{ background: "#111111", border: "1px solid #1f1f1f" }}
                >
                  <div
                    className="w-2 h-8 rounded-full shrink-0"
                    style={{ background: s.color, opacity: 0.7 }}
                  />
                  <div>
                    <div className="text-sm" style={{ color: s.color }}>{s.value} {s.sub}</div>
                    <div className="text-[11px] text-zinc-600 mt-0.5">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alt aksiyon barı */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-7 py-3.5"
          style={{ background: "#0D0D0D", borderTop: "1px solid #1f1f1f" }}
        >
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <span>
              Son güncelleme:{" "}
              <span className="text-zinc-400">30 Mart 2026, 09:14</span>
            </span>
            <span className="flex items-center gap-1 text-amber-500">
              <AlertTriangle className="w-3 h-3" />
              Alçıpan İmalat 3 gün geride
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              style={{ border: "1px solid #2a2a2a", background: "#111111" }}
            >
              <Download className="w-3.5 h-3.5" />
              Excel Export
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm text-white transition-all hover:brightness-110"
              style={{ background: "#4F8CFF" }}
            >
              <Share2 className="w-3.5 h-3.5" />
              Gantt Paylaş
            </button>
          </div>
        </div>
      </div>

      {/* AI Copilot */}
      <AICopilot
        context="İş Programı"
        welcomeMessage={`Alçıpan 3 gün geride.\n\nSeramik başlangıcı 5 Nisan — malzeme teslimi 3 Nisan olmalı.\n\nSatınalma uyarısı göndereyim mi?\n\n📊 Kritik yol:\n• Alçıpan → Seramik → Mobilya & Dekor\n• Gecikme devam ederse teslim tarihi 12 gün kayabilir.\n\nRisk analizi raporu hazırlamamı ister misin?`}
        shortcuts={[
          "Satınalma uyarısı gönder",
          "Kritik yol analizi",
          "Gecikme raporu",
          "Teslim tarihi tahmini",
        ]}
      />
    </div>
  );
}