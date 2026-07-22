import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Cupons from "./pages/Cupons";
import Contratos from "./pages/Contratos";
import Relatorios from "./pages/Relatorios";
import ValidacaoCupom from "./pages/ValidacaoCupom";
import Solicitacoes from "./pages/Solicitacoes";
import Planejamento from "./pages/Planejamento";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/validacao" element={<AppLayout><ValidacaoCupom /></AppLayout>} />
          <Route path="/cupons" element={<AppLayout><Cupons /></AppLayout>} />
          <Route path="/relatorios" element={<AppLayout><Relatorios /></AppLayout>} />
          <Route path="/contratos" element={<AppLayout><Contratos /></AppLayout>} />
          <Route path="/solicitacoes" element={<AppLayout><Solicitacoes /></AppLayout>} />
          <Route path="/planejamento" element={<AppLayout><Planejamento /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
