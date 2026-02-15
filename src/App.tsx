import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ChargesLanding from "./pages/ChargesLanding";
import CreateCharge from "./pages/CreateCharge";
import ChargeDetail from "./pages/ChargeDetail";
import CreateRuleWizard from "./pages/CreateRuleWizard";
import BulkUpload from "./pages/BulkUpload";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/charges" element={<ChargesLanding />} />
          <Route path="/charges/new" element={<CreateCharge />} />
          <Route path="/charges/:chargeCode" element={<ChargeDetail />} />
          <Route path="/charges/:chargeCode/rules/new" element={<CreateRuleWizard />} />
          <Route path="/charges/:chargeCode/bulk-upload" element={<BulkUpload />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
