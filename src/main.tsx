
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Dynamic import to ensure React is fully loaded
async function initializeApp() {
  const { default: App } = await import('./App.tsx');
  
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("Root element not found");
  }

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

// Initialize the app
initializeApp().catch(console.error);
