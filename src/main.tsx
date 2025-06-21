import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "remixicon/fonts/remixicon.css";
import "./style.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Theme>
      <App />
    </Theme>
  </React.StrictMode>,
);
