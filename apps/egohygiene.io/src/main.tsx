import "@egohygiene/ui/styles.css";

import { mountBrowserApp } from "./app/browser";
import "./styles/app.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found.");
mountBrowserApp(rootElement);
