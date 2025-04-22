import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Admin imports
import { AdminAuthProvider } from "@/hooks/use-admin-auth";
import { AdminProtectedRoute } from "@/components/AdminProtectedRoute";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";

function MainRouter() {
  const [location] = useLocation();
  
  // Check if we're on an admin page
  const isAdminRoute = location.startsWith("/admin");
  
  if (isAdminRoute) {
    return (
      <AdminAuthProvider>
        <Switch location={location} key={location}>
          <Route path="/admin/login" component={AdminLogin} />
          <AdminProtectedRoute path="/admin" component={AdminDashboard} />
          <Route component={NotFound} />
        </Switch>
      </AdminAuthProvider>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Navbar />
      <main className="container mx-auto pt-24 pb-16 px-4 md:px-6">
        <Switch location={location} key={location}>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <MainRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
