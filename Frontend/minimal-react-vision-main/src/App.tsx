// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RequireAuth from "@/components/RequireAuth";

import Index       from "./pages/Index";
import Recomandari from "./pages/Recomandari";
import Statistici  from "./pages/Statistici";
import Planner     from "./pages/Planner";
import Login       from "./pages/Login";
import Register    from "./pages/Register";
import Settings    from "./pages/Settings";
import NotFound    from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ruta default */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* rute publice */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* rute protejate */}
          <Route
            path="/recomandari"
            element={
              <RequireAuth>
                <Recomandari />
              </RequireAuth>
            }
          />
          <Route
            path="/statistici"
            element={
              <RequireAuth>
                <Statistici />
              </RequireAuth>
            }
          />

          <Route
            path="/planner"
            element={
              <RequireAuth>
                <Planner />
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <Settings />
              </RequireAuth>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
