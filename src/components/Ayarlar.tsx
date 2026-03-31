import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Settings, User, Bell, Shield, Palette } from "lucide-react";

const sections = [
  { icon: User, label: "Profil Ayarları", desc: "Kullanıcı bilgileri ve hesap ayarları" },
  { icon: Bell, label: "Bildirimler", desc: "E-posta ve uygulama bildirimleri" },
  { icon: Shield, label: "Güvenlik", desc: "Şifre ve iki faktörlü doğrulama" },
  { icon: Palette, label: "Görünüm", desc: "Tema ve arayüz tercihleri" },
];

export function Ayarlar() {
  return (
    <div className="flex h-screen bg-black">
      <Sidebar activePage="ayarlar" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Ayarlar" />
        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#4F8CFF]/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-[#4F8CFF]" />
            </div>
            <div>
              <h2 className="text-white text-lg">Sistem Ayarları</h2>
              <p className="text-zinc-500 text-sm">Uygulama ve hesap yapılandırması</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((s, i) => (
              <button key={i} className="bg-[#111] border border-zinc-800 rounded-xl p-5 text-left hover:border-zinc-700 transition-colors group">
                <div className="flex items-center gap-3 mb-2">
                  <s.icon className="w-5 h-5 text-zinc-400 group-hover:text-[#4F8CFF] transition-colors" />
                  <span className="text-white text-sm">{s.label}</span>
                </div>
                <p className="text-zinc-500 text-xs">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
