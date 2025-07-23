import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./components/theme-provider";
import { WasteReportsProvider } from "./contexts/waste-reports-context";
import { FeedProvider } from "./contexts/feed-context";
import { ErrorBoundary } from "./components/error-boundary";
import "./global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="ecotrack-ui-theme">
        <WasteReportsProvider>
          <FeedProvider>
            <App />
          </FeedProvider>
        </WasteReportsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
