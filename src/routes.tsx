import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Dashboard } from "./components/Dashboard";
import { ProjectDetail } from "./components/ProjectDetail";
import { ProjectDetailNew } from "./components/ProjectDetailNew";
import { ProjectList } from "./components/ProjectList";
import { CustomerList } from "./components/CustomerList";
import { CustomerDetail } from "./components/CustomerDetail";
import { BOQDetail } from "./components/BOQDetail";
import { BOQPage } from "./components/BOQPage";
import { ApprovalPage } from "./components/ApprovalPage";
import { FiyatToplama } from "./components/FiyatToplama";
import { Teklifler } from "./components/Teklifler";
import { Hakedis } from "./components/Hakedis";
import { IsProgram } from "./components/IsProgram";
import { MaliyetListesi } from "./components/MaliyetListesi";
import { TeklifListesi } from "./components/TeklifListesi";
import { TeklifHavuzu } from "./components/TeklifHavuzu";
import { Gorevlerim } from "./components/Gorevlerim";
import { Ayarlar } from "./components/Ayarlar";
import { YeniProjeFormu } from "./components/YeniProjeFormu";
import { KesifNotlari } from "./components/KesifNotlari";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "projects", Component: ProjectList },
      { path: "project/:id", Component: ProjectDetail },
      { path: "projects/:id", Component: ProjectDetailNew },
      { path: "projects/:id/approval", Component: ApprovalPage },
      { path: "projects/:id/boq", Component: BOQPage },
      { path: "customers", Component: CustomerList },
      { path: "customers/:id", Component: CustomerDetail },
      { path: "boq/:id", Component: BOQDetail },
      { path: "fiyat-toplama", Component: FiyatToplama },
      { path: "teklifler", Component: Teklifler },
      { path: "hakedis", Component: Hakedis },
      { path: "is-programi", Component: IsProgram },
      { path: "maliyet-listesi", Component: MaliyetListesi },
      { path: "teklif-listesi", Component: TeklifListesi },
      { path: "teklif-havuzu", Component: TeklifHavuzu },
      { path: "gorevlerim", Component: Gorevlerim },
      { path: "ayarlar", Component: Ayarlar },
      { path: "yeni-proje", Component: YeniProjeFormu },
      { path: "kesif-notlari", Component: KesifNotlari },
    ],
  },
]);