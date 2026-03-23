import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

const defaultShortcuts = [
  "Aktif projeleri özetle",
  "Bu haftanın işleri",
  "Geciken projeler",
];

const defaultWelcome = "Merhaba Asiye! 5 aktif projen var. 2 projede BOQ tamamlanmadı.";

interface Message {
  id: number;
  role: "ai" | "user";
  text: string;
}

interface AICopilotProps {
  context?: string;
  welcomeMessage?: string;
  shortcuts?: string[];
}

export function AICopilot({
  context = "Projeler",
  welcomeMessage = defaultWelcome,
  shortcuts = defaultShortcuts,
}: AICopilotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "ai", text: welcomeMessage },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isThinking) return;
    const userMsg: Message = { id: Date.now(), role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const cannedReplies: Record<string, string> = {
        "Risk analizi": "Risk değerlendirmesi:\n• Elektrik kalemi zarar bölgesinde — en kritik risk\n• Aydınlatma henüz fiyatlanmamış — belirsizlik riski\n• Toplam marj %25 — kabul edilebilir",
        "Müşteri geçmişi": "MACFit geçmişi:\n• Son 3 projede ort. kâr %22\n• Bu teklif ortalamanın %3 üzerinde\n• Genelde Mobilya kaleminde pazarlık yapmışlar",
        "Revizyon özeti": "Revizyon önerisi:\n• Elektrik çarpanını 0.92x → 1.10x'e çekin\n• Bu değişiklik +312K ₺ kâr ekler\n• Toplam kâr oranı %27'ye yükselir",
        "Senaryo oluştur": "3 senaryo hazırladım:\n• Muhafazakâr: %20 kâr, Elektrik 1.05x\n• Mevcut: %25 kâr\n• Agresif: %30 kâr, tüm çarpanlar +0.1x",
        "Müşteri benchmark": "Benchmark verisi:\n• Sektör ort. inşaat marjı %22\n• Bu proje inşaat marjı %27 — iyi\n• Mobilya %45 — rakiplerin %30'una kıyasla yüksek",
        "Optimal çarpan": "Optimal çarpan önerisi:\n• İnşaat: 1.27x ✓\n• Mobilya: 1.35x (düşürün, pazarlık riski)\n• Elektrik: 1.10x (artırın, zarar var)\n• Mekanik: 1.57x ✓",
        "Kârlılık özeti": "Kârlılık özeti:\n• Teklif: 12.0M ₺\n• Maliyet: 9.6M ₺\n• Kâr: 2.4M ₺ (%25)\n• En yüksek marj: Mobilya %45\n• En düşük: Elektrik -%8",
        "Boş kalemlere öner": "Fiyatsız 3 kalem tespit ettim. Geçmiş projelerden öneriler ekleyebilirim.",
        "İcmal özeti": "BOQ icmal: 45 kalem, 3 fiyatsız, toplam tahmini 5.99M ₺.",
        "Projeden kopyala": "Hangi projeden kopyalamak istersiniz? Benzer 2 proje bulundu.",
        "Tedarikçi talebi": "Tedarikçi teklif talebi oluşturuldu. 5 tedarikçiye gönderilebilir.",
      };

      const reply =
        cannedReplies[text.trim()] ??
        `"${text.trim()}" için analiz hazırlanıyor — yakında gerçek zamanlı verilerle yanıt verebileceğim.`;

      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "ai", text: reply }]);
      setIsThinking(false);
    }, 700);
  };

  return (
    <div
      className="w-[320px] flex flex-col h-full"
      style={{
        background: "linear-gradient(180deg, #131119 0%, #111111 100%)",
        borderLeft: "1px solid rgba(124, 58, 237, 0.25)",
        borderRadius: "12px 0 0 12px",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-zinc-800/60">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
          style={{ background: "rgba(124, 58, 237, 0.25)" }}
        >
          <span className="text-[10px] text-white select-none">AI</span>
        </div>
        <span className="text-sm" style={{ color: "#7C3AED" }}>
          Copilot
        </span>
        <div className="flex-1" />
        <span className="text-[10px] text-zinc-500 bg-zinc-800/80 rounded-full px-2 py-0.5">
          {context}
        </span>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) =>
          msg.role === "ai" ? (
            <div key={msg.id} className="flex items-start gap-2">
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: "rgba(124, 58, 237, 0.25)" }}
              >
                <span className="text-[8px] text-purple-400">AI</span>
              </div>
              <div
                className="rounded-xl rounded-tl-sm px-3 py-2 text-xs text-zinc-300 leading-relaxed max-w-[220px] whitespace-pre-line"
                style={{ background: "#1A1A1A" }}
              >
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex justify-end">
              <div
                className="rounded-xl rounded-tr-sm px-3 py-2 text-xs text-white leading-relaxed max-w-[220px]"
                style={{ background: "rgba(124, 58, 237, 0.35)" }}
              >
                {msg.text}
              </div>
            </div>
          )
        )}
        {isThinking && (
          <div className="flex items-start gap-2">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: "rgba(124, 58, 237, 0.25)" }}
            >
              <span className="text-[8px] text-purple-400">AI</span>
            </div>
            <div
              className="rounded-xl rounded-tl-sm px-3 py-2 text-xs text-zinc-500 leading-relaxed"
              style={{ background: "#1A1A1A" }}
            >
              <span className="inline-flex gap-0.5">
                <span className="animate-bounce" style={{ animationDelay: "0ms" }}>·</span>
                <span className="animate-bounce" style={{ animationDelay: "150ms" }}>·</span>
                <span className="animate-bounce" style={{ animationDelay: "300ms" }}>·</span>
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="px-3 pb-4 pt-2 border-t border-zinc-800/60">
        <div className="flex items-center gap-2 bg-zinc-900 rounded-xl px-3 py-2.5 border border-zinc-800">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Bir şeyler yaz..."
            className="flex-1 bg-transparent text-xs text-zinc-300 placeholder-zinc-600 outline-none"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isThinking}
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{ background: "#7C3AED" }}
          >
            <Send className="w-3 h-3 text-white" />
          </button>
        </div>

        {/* Shortcut pills */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {shortcuts.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              disabled={isThinking}
              className="text-[10px] text-zinc-500 bg-zinc-800/70 hover:bg-zinc-700/70 hover:text-zinc-300 rounded-full px-2.5 py-1 transition-colors leading-none disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}