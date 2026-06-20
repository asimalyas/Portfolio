import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import AdminLayout from "./components/admin/AdminLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminCollectionPage from "./pages/admin/AdminCollectionPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProfilePage from "./pages/admin/AdminProfilePage";

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="min-h-[50vh] bg-background p-8 text-sm text-muted-foreground">Loading dashboard...</div>
);

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route
                index
                element={
                  <Suspense fallback={<RouteFallback />}>
                    <AdminDashboard />
                  </Suspense>
                }
              />
              <Route path="profile" element={<AdminProfilePage />} />
              <Route path=":section" element={<AdminCollectionPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;