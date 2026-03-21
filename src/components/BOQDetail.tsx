import { Sidebar } from "./Sidebar";
import { ChevronRight, FileSpreadsheet, Download, Upload, Sparkles, Plus, Send } from "lucide-react";
import { useState } from "react";

type BOQItem = {
  id: number;
  sectionId: number;
  itemName: string;
  unit: string;
  quantity: number;
  materialPrice: number;
  laborPrice: number;
  totalPrice: number;
  amount: number;
  vat: number;
  notes: string;
};

export function BOQDetail() {
  const [editingRowId, setEditingRowId] = useState<number | null>(5);
  const [items, setItems] = useState<BOQItem[]>([
    { id: 1, sectionId: 1, itemName: "Duvar yıkım", unit: "m²", quantity: 120, materialPrice: 35, laborPrice: 50, totalPrice: 85, amount: 10200, vat: 20, notes: "—" },
    { id: 2, sectionId: 1, itemName: "Moloz kaldırma", unit: "m³", quantity: 45, materialPrice: 20, laborPrice: 60, totalPrice: 80, amount: 3600, vat: 20, notes: "—" },
    { id: 3, sectionId: 2, itemName: "Beton döküm", unit: "m³", quantity: 12, materialPrice: 450, laborPrice: 200, totalPrice: 650, amount: 7800, vat: 20, notes: "Temel" },
    { id: 4, sectionId: 2, itemName: "Tuğla duvar örme", unit: "m²", quantity: 85, materialPrice: 120, laborPrice: 90, totalPrice: 210, amount: 17850, vat: 20, notes: "—" },
    { id: 5, sectionId: 3, itemName: "Tek yüz alçıpan", unit: "m²", quantity: 200, materialPrice: 80, laborPrice: 75, totalPrice: 155, amount: 31000, vat: 20, notes: "—" },
    { id: 6, sectionId: 3, itemName: "Çift yüz alçıpan", unit: "m²", quantity: 140, materialPrice: 95, laborPrice: 100, totalPrice: 195, amount: 27300, vat: 20, notes: "—" },
    { id: 7, sectionId: 4, itemName: "Alçı sıva", unit: "m²", quantity: 340, materialPrice: 45, laborPrice: 55, totalPrice: 100, amount: 34000, vat: 20, notes: "İnce" },
    { id: 8, sectionId: 4, itemName: "Boya badana", unit: "m²", quantity: 680, materialPrice: 25, laborPrice: 35, totalPrice: 60, amount: 40800, vat: 20, notes: "2 kat" },
  ]);

  const sections = [
    { id: 1, name: "01 — YIKIM VE SÖKÜM" },
    { id: 2, name: "02 — KABA İNŞAAT" },
    { id: 3, name: "03 — ALÇIPAN" },
    { id: 4, name: "04 — SIVA VE BOYA" },
  ];

  const totalItems = items.length;
  const totalMaterial = items.reduce((sum, item) => sum + (item.materialPrice * item.quantity), 0);
  const totalLabor = items.reduce((sum, item) => sum + (item.laborPrice * item.quantity), 0);
  const grandTotal = items.reduce((sum, item) => sum + item.amount, 0);

  const renderRow = (item: BOQItem) => {
    const isEditing = editingRowId === item.id;

    if (isEditing) {
      return (
        <tr key={item.id} className="border-b border-zinc-800 bg-zinc-900/50">
          <td className="px-4 py-2 text-sm text-white">{item.id}</td>
          <td className="px-4 py-2">
            <input
              type="text"
              defaultValue={item.itemName}
              className="w-full bg-black border-2 border-[#4F8CFF] rounded px-2 py-1 text-sm text-white focus:outline-none"
            />
          </td>
          <td className="px-4 py-2">
            <input
              type="text"
              defaultValue={item.unit}
              className="w-full bg-black border-2 border-[#4F8CFF] rounded px-2 py-1 text-sm text-white focus:outline-none"
            />
          </td>
          <td className="px-4 py-2">
            <input
              type="number"
              defaultValue={item.quantity}
              className="w-full bg-black border-2 border-[#4F8CFF] rounded px-2 py-1 text-sm text-white focus:outline-none"
            />
          </td>
          <td className="px-4 py-2">
            <input
              type="number"
              defaultValue={item.materialPrice}
              className="w-full bg-black border-2 border-[#4F8CFF] rounded px-2 py-1 text-sm text-white focus:outline-none"
            />
          </td>
          <td className="px-4 py-2">
            <input
              type="number"
              defaultValue={item.laborPrice}
              className="w-full bg-black border-2 border-[#4F8CFF] rounded px-2 py-1 text-sm text-white focus:outline-none"
            />
          </td>
          <td className="px-4 py-2">
            <input
              type="number"
              defaultValue={item.totalPrice}
              className="w-full bg-black border-2 border-[#4F8CFF] rounded px-2 py-1 text-sm text-white focus:outline-none"
            />
          </td>
          <td className="px-4 py-2">
            <input
              type="text"
              defaultValue={`${item.amount.toLocaleString('tr-TR')} ₺`}
              className="w-full bg-black border-2 border-[#4F8CFF] rounded px-2 py-1 text-sm text-white focus:outline-none"
            />
          </td>
          <td className="px-4 py-2 text-sm text-zinc-400">%{item.vat}</td>
          <td className="px-4 py-2">
            <input
              type="text"
              defaultValue={item.notes}
              className="w-full bg-black border-2 border-[#4F8CFF] rounded px-2 py-1 text-sm text-white focus:outline-none"
            />
          </td>
        </tr>
      );
    }

    return (
      <tr
        key={item.id}
        className="border-b border-zinc-800 hover:bg-zinc-800/50 cursor-pointer"
        onClick={() => setEditingRowId(item.id)}
      >
        <td className="px-4 py-2 text-sm text-white">{item.id}</td>
        <td className="px-4 py-2 text-sm text-white">{item.itemName}</td>
        <td className="px-4 py-2 text-sm text-zinc-400">{item.unit}</td>
        <td className="px-4 py-2 text-sm text-white">{item.quantity}</td>
        <td className="px-4 py-2 text-sm text-zinc-400">{item.materialPrice} ₺</td>
        <td className="px-4 py-2 text-sm text-zinc-400">{item.laborPrice} ₺</td>
        <td className="px-4 py-2 text-sm text-white">{item.totalPrice} ₺</td>
        <td className="px-4 py-2 text-sm text-white">{item.amount.toLocaleString('tr-TR')} ₺</td>
        <td className="px-4 py-2 text-sm text-zinc-400">%{item.vat}</td>
        <td className="px-4 py-2 text-sm text-zinc-400">{item.notes}</td>
      </tr>
    );
  };

  return (
    <div className="flex h-screen bg-black">
      <Sidebar activePage="boq" />
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm">
              <span className="text-zinc-400 hover:text-white cursor-pointer">Projeler</span>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
              <span className="text-zinc-400 hover:text-white cursor-pointer">MACFit Ankara Çankaya</span>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
              <span className="text-zinc-400 hover:text-white cursor-pointer">BOQ</span>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
              <span className="text-white">İnşaat</span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl text-white">İnşaat Disiplini</h1>
                <span className="px-3 py-1 rounded-full text-xs bg-zinc-800 text-zinc-300">
                  Durum: Taslak
                </span>
                <button className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors text-sm">
                  Tamamlandı Olarak İşaretle
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-zinc-700 text-white rounded-lg hover:bg-zinc-900 transition-colors text-sm">
                  <Upload className="w-4 h-4" />
                  Excel Import
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-zinc-700 text-white rounded-lg hover:bg-zinc-900 transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  Excel Export
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors text-sm">
                  <Sparkles className="w-4 h-4" />
                  AI Öner
                </button>
              </div>
            </div>

            {/* Discipline Summary Bar */}
            <div className="bg-[#111111] rounded-lg px-6 py-3 mb-6">
              <div className="flex items-center gap-6 text-sm">
                <span className="text-zinc-400">
                  Kalem Sayısı: <span className="text-white ml-1">{totalItems}</span>
                </span>
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-400">
                  Malzeme Toplam: <span className="text-white ml-1">{totalMaterial.toLocaleString('tr-TR')} ₺</span>
                </span>
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-400">
                  İşçilik Toplam: <span className="text-white ml-1">{totalLabor.toLocaleString('tr-TR')} ₺</span>
                </span>
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-400">
                  Genel Toplam: <span className="text-white ml-1">{grandTotal.toLocaleString('tr-TR')} ₺</span>
                </span>
              </div>
            </div>

            {/* BOQ Table */}
            <div className="bg-[#111111] rounded-lg overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-black border-b border-zinc-800">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs text-zinc-400">Sıra</th>
                      <th className="text-left px-4 py-3 text-xs text-zinc-400">İş Kalemi</th>
                      <th className="text-left px-4 py-3 text-xs text-zinc-400">Birim</th>
                      <th className="text-left px-4 py-3 text-xs text-zinc-400">Miktar</th>
                      <th className="text-left px-4 py-3 text-xs text-zinc-400">Malzeme BF</th>
                      <th className="text-left px-4 py-3 text-xs text-zinc-400">İşçilik BF</th>
                      <th className="text-left px-4 py-3 text-xs text-zinc-400">Toplam BF</th>
                      <th className="text-left px-4 py-3 text-xs text-zinc-400">Tutar</th>
                      <th className="text-left px-4 py-3 text-xs text-zinc-400">KDV</th>
                      <th className="text-left px-4 py-3 text-xs text-zinc-400">Notlar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Section 1 */}
                    <tr className="bg-[#0D0D0D]">
                      <td colSpan={10} className="px-4 py-3 text-sm text-white">
                        {sections[0].name}
                      </td>
                    </tr>
                    {items.filter(item => item.sectionId === 1).map(renderRow)}

                    {/* Section 2 */}
                    <tr className="bg-[#0D0D0D]">
                      <td colSpan={10} className="px-4 py-3 text-sm text-white">
                        {sections[1].name}
                      </td>
                    </tr>
                    {items.filter(item => item.sectionId === 2).map(renderRow)}

                    {/* Section 3 */}
                    <tr className="bg-[#0D0D0D]">
                      <td colSpan={10} className="px-4 py-3 text-sm text-white">
                        {sections[2].name}
                      </td>
                    </tr>
                    {items.filter(item => item.sectionId === 3).map(renderRow)}

                    {/* Section 4 */}
                    <tr className="bg-[#0D0D0D]">
                      <td colSpan={10} className="px-4 py-3 text-sm text-white">
                        {sections[3].name}
                      </td>
                    </tr>
                    {items.filter(item => item.sectionId === 4).map(renderRow)}

                    {/* Add New Item Button */}
                    <tr>
                      <td colSpan={10} className="px-4 py-4">
                        <button className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                          <Plus className="w-4 h-4" />
                          Yeni Kalem Ekle
                        </button>
                      </td>
                    </tr>

                    {/* Footer Total */}
                    <tr className="bg-[#0D0D0D] sticky bottom-0 border-t border-zinc-700">
                      <td className="px-4 py-3 text-sm text-white">TOPLAM</td>
                      <td className="px-4 py-3 text-sm text-zinc-400">—</td>
                      <td className="px-4 py-3 text-sm text-zinc-400">—</td>
                      <td className="px-4 py-3 text-sm text-zinc-400">—</td>
                      <td className="px-4 py-3 text-sm text-zinc-400">—</td>
                      <td className="px-4 py-3 text-sm text-zinc-400">—</td>
                      <td className="px-4 py-3 text-sm text-zinc-400">—</td>
                      <td className="px-4 py-3 text-sm text-white">{grandTotal.toLocaleString('tr-TR')} ₺</td>
                      <td className="px-4 py-3 text-sm text-zinc-400">—</td>
                      <td className="px-4 py-3 text-sm text-zinc-400">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>

        {/* AI Assistant Panel */}
        <aside className="w-[280px] bg-[#111111] border-l border-zinc-800 flex flex-col">
          <div className="p-4 border-b border-zinc-800">
            <h3 className="text-white flex items-center gap-2">
              <span>🤖</span>
              <span>AI Asistan</span>
            </h3>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-zinc-200 mb-4">
                Bu disiplinde 2 eksik kalem tespit ettim: <span className="text-white">Şap döküm</span> ve{' '}
                <span className="text-white">Su yalıtımı</span>. Eklememi ister misin?
              </p>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-[#4F8CFF] text-white rounded-lg hover:bg-[#6BA3FF] transition-colors text-sm">
                  Ekle
                </button>
                <button className="flex-1 px-3 py-2 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors text-sm">
                  Geç
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-zinc-800">
            <div className="relative">
              <input
                type="text"
                placeholder="AI'ye sor..."
                className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 pr-10 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#7C3AED]">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
