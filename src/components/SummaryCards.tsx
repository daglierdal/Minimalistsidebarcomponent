import { FolderOpen, FileText, Receipt, CalendarClock, ArrowRight } from "lucide-react";

const kpiCards = [
  {
    icon: FolderOpen,
    label: "Aktif Proje",
    value: "5",
    sub: "2 devam ediyor",
    iconColor: "text-[#4F8CFF]",
    iconBg: "bg-[#4F8CFF]/10",
  },
  {
    icon: FileText,
    label: "Onay Bekleyen Teklif",
    value: "3",
    sub: "12M ₺ toplam hacim",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
  },
  {
    icon: Receipt,
    label: "Açık Hakediş",
    value: "2",
    sub: "4.2M ₺ beklemede",
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
  },
  {
    icon: CalendarClock,
    label: "Bu Hafta Termin",
    value: "2",
    sub: "Yargıcı, MACFit Çankaya",
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/10",
  },
];

const actionItems = [
  { label: "MACFit Forum teklifi onay bekliyor", tag: "Teklif" },
  { label: "Yargıcı Nişantaşı hakedişi hazırlanacak", tag: "Hakediş" },
  { label: "Koton BOQ'unda 4 kalem fiyatsız", tag: "BOQ" },
  { label: "MACFit Çankaya termin 12 gün kaldı", tag: "Termin" },
];

export function SummaryCards() {
  return (
    <div className="space-y-6 mb-8">
      {/* Big Blue Action Banner */}
      <div
        className="rounded-2xl px-7 py-6 flex items-center gap-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a2f5e 0%, #0f1e3d 60%, #0a1628 100%)", border: "1px solid rgba(79,140,255,0.35)" }}
      >
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(79,140,255,0.18) 0%, transparent 60%)" }}
        />

        {/* Left: count circle */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 relative z-10"
          style={{ background: "rgba(79,140,255,0.2)", border: "1px solid rgba(79,140,255,0.45)" }}
        >
          <span className="text-3xl text-[#4F8CFF]">4</span>
        </div>

        {/* Middle: text + items */}
        <div className="flex-1 min-w-0 relative z-10">
          <div className="text-white mb-3" style={{ fontSize: "17px" }}>
            Aksiyon bekleyen iş
          </div>
          <div className="flex flex-wrap gap-2">
            {actionItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5"
              >
                <span className="text-[10px] text-[#4F8CFF] bg-[#4F8CFF]/15 rounded px-1.5 py-0.5 leading-none shrink-0">
                  {item.tag}
                </span>
                <span className="text-xs text-zinc-300 whitespace-nowrap">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: CTA */}
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white shrink-0 relative z-10 transition-all hover:brightness-110"
          style={{ background: "#4F8CFF", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          Tümünü Gör
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl px-5 py-5 flex flex-col gap-3"
            style={{ background: "#111111", border: "1px solid #1f1f1f" }}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.iconBg}`}>
              <card.icon className={`w-4.5 h-4.5 ${card.iconColor}`} style={{ width: "18px", height: "18px" }} />
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">{card.label}</div>
              <div className="text-2xl text-white">{card.value}</div>
              <div className="text-[11px] text-zinc-600 mt-0.5">{card.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}