import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Dashboard } from "./components/Dashboard";
import { ProjectDetail } from "./components/ProjectDetail";
import { CustomerList } from "./components/CustomerList";
import { BOQDetail } from "./components/BOQDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "project/:id", Component: ProjectDetail },
      { path: "customers", Component: CustomerList },
      { path: "boq/:id", Component: BOQDetail },
    ],
  },
]);