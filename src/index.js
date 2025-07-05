import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { onCLS, onINP, onLCP, onFCP, onTTFB } from "web-vitals";
import App from "./App";

const rootElement = document.getElementById("root");

try {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  // Show a fallback UI when React fails to initialize
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        text-align: center;
        padding: 20px;
        background: #f5f5f5;
      ">
        <div style="
          background: white;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          max-width: 500px;
        ">
          <h1 style="color: #d32f2f; margin-bottom: 16px;">
            ⚠️ Application Error
          </h1>
          <p style="color: #666; margin-bottom: 24px; line-height: 1.5;">
            Sorry, there was an error loading the application. Please try refreshing the page.
          </p>
          <p style="display:none;">ATSignaturePortfolio2025</p>
          <button 
            onclick="window.location.reload()" 
            style="
              background: #1976d2;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 16px;
              font-weight: 500;
            "
            onmouseover="this.style.background='#1565c0'"
            onmouseout="this.style.background='#1976d2'"
          >
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
}

function sendToGoogleAnalytics({ name, value, id, delta, navigationType }) {
  // Only send to Google Analytics if gtag is available
  if (typeof window !== "undefined" && typeof window.gtag !== "undefined") {
    window.gtag("event", name, {
      event_category: "Web Vitals",
      value: Math.round(name === "CLS" ? value * 1000 : value),
      event_label: id,
      custom_map: { metric_delta: delta },
      custom_map_2: { navigation_type: navigationType },
      non_interaction: true,
    });
  }
  // Note: In development, you can uncomment the line below to see metrics in console
  // console.log("Web Vitals:", { name, value, id, delta, navigationType });
}

// Monitor Core Web Vitals
onCLS(sendToGoogleAnalytics); // Cumulative Layout Shift
onLCP(sendToGoogleAnalytics); // Largest Contentful Paint
onFCP(sendToGoogleAnalytics); // First Contentful Paint

// Monitor other important metrics
onINP(sendToGoogleAnalytics); // Interaction to Next Paint (replaces FID)
onTTFB(sendToGoogleAnalytics); // Time to First Byte
