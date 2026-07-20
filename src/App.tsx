import { useEffect } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import MainPortfolio from "./components/MainPortfolio";
import CategoryGallery from "./components/CategoryGallery";
import ProjectDetail from "./components/ProjectDetail";
import AdminDashboard from "./components/AdminDashboard";
import CustomCursor from "./components/CustomCursor";
import Header from "./components/Header";
import ContactForm from "./components/ContactForm";
import { PortfolioProvider } from "./context/PortfolioContext";

// Helper component to reset window scroll position on route modifications and record analytics
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset browser viewport height immediately on route switch
    window.scrollTo(0, 0);

    // Track page visit
    const trackVisit = async () => {
      try {
        await fetch("/api/visitors/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: pathname,
            referrer: document.referrer || "",
            screenSize: `${window.innerWidth}x${window.innerHeight}`
          })
        });
      } catch (err) {
        console.warn("Analytics tracking bypassed:", err);
      }
    };

    if (!pathname.startsWith("/admin")) {
      trackVisit();
    }
  }, [pathname]);

  return null;
}

function GlobalFooter() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <ContactForm />
    </footer>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <HashRouter>
        <ScrollToTop />
        
        {/* Dynamic trailing physics cursor */}
        <CustomCursor />

        {/* Global Navigation Header Sticky Across All Pages */}
        <Header />

        <main className="relative min-h-screen bg-slate-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-500 overflow-x-hidden antialiased pt-20">
          <Routes>
            {/* Main Landing Showroom */}
            <Route path="/" element={<MainPortfolio />} />
            
            {/* Dynamic filtered category project pages */}
            <Route path="/work/:category" element={<CategoryGallery />} />

            {/* Interactive project detail showroom page */}
            <Route path="/project/:id" element={<ProjectDetail />} />

            {/* Admin Portal CMS Control Room */}
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Fallback redirection anchor */}
            <Route path="*" element={<MainPortfolio />} />
          </Routes>
          <GlobalFooter />
        </main>
      </HashRouter>
    </PortfolioProvider>
  );
}
