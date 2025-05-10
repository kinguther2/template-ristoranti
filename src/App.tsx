import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { AdminProvider } from "./context/AdminContext";
import MainLayout from "./layouts/MainLayout";
import { useEffect } from "react";

// Pages
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Gallery from "./pages/Gallery";
import Staff from "./pages/Staff";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente per gestire le immagini mancanti
const ImageErrorHandler = () => {
  useEffect(() => {
    // Handler globale per le immagini che non si caricano
    const handleImageErrors = () => {
      document.addEventListener('error', function(e) {
        const target = e.target as HTMLImageElement;
        if (target.tagName === 'IMG') {
          console.log('Immagine 404 sostituita con placeholder:', target.src);
          target.src = 'https://via.placeholder.com/400x300?text=Immagine+non+trovata';
          target.onerror = null; // Previene loop infiniti
        }
      }, true);
    };
    
    handleImageErrors();
    
    // Cleanup
    return () => {
      document.removeEventListener('error', handleImageErrors);
    };
  }, []);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AdminProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ImageErrorHandler />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout><Home /></MainLayout>} />
              <Route path="/menu" element={<MainLayout><Menu /></MainLayout>} />
              <Route path="/gallery" element={<MainLayout><Gallery /></MainLayout>} />
              <Route path="/staff" element={<MainLayout><Staff /></MainLayout>} />
              <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AdminProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
