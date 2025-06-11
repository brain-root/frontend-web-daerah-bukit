import React, { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";
import "./index.css";
import { queryClient } from "./lib/react-query";
import { setupDebugHelpers } from "./utils/debugHelpers";

// Setup debug helpers in development
if (process.env.NODE_ENV === "development") {
  setupDebugHelpers();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
