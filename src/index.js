import React from "react";
import { createRoot } from "react-dom/client";
import { getCLS, getFID, getLCP } from "web-vitals";
import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function sendToGoogleAnalytics({ name, delta, id }) {
  // eslint-disable-next-line no-undef
  gtag("event", name, {
    event_category: "Web Vitals",
    value: Math.round(name === "CLS" ? delta * 1000 : delta),
    event_label: id,
    non_interaction: true,
  });
}

getCLS(sendToGoogleAnalytics);
getFID(sendToGoogleAnalytics);
getLCP(sendToGoogleAnalytics);
