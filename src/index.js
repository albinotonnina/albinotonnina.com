import React from "react";
import ReactDOM from "react-dom";
import { getCLS, getFID, getLCP } from "web-vitals";
import App from "./App";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
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
