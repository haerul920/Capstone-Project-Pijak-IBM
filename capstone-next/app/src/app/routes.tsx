import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Dashboard } from "./components/pages/Dashboard";
import { InputData } from "./components/pages/InputData";
import { Analytics } from "./components/pages/Analytics";
import { Predictions } from "./components/pages/Predictions";
import { Products } from "./components/pages/Products";
import { Reports } from "./components/pages/Reports";
import { Settings } from "./components/pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "input-data", Component: InputData },
      { path: "analytics", Component: Analytics },
      { path: "predictions", Component: Predictions },
      { path: "products", Component: Products },
      { path: "reports", Component: Reports },
      { path: "settings", Component: Settings },
    ],
  },
]);
