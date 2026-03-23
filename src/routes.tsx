import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Dashboard } from "./components/Dashboard";
import { ProjectDetail } from "./components/ProjectDetail";
import { ProjectDetailNew } from "./components/ProjectDetailNew";
import { CustomerList } from "./components/CustomerList";
import { BOQDetail } from "./components/BOQDetail";
import { ApprovalPage } from "./components/ApprovalPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "project/:id", Component: ProjectDetail },
      { path: "projects/:id", Component: ProjectDetailNew },
      { path: "projects/:id/approval", Component: ApprovalPage },
      { path: "customers", Component: CustomerList },
      { path: "boq/:id", Component: BOQDetail },
    ],
  },
]);