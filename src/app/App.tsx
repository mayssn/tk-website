import { useEffect } from "react";
import AppRoutes from "./routes";
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer"; // ✅ add
import ScrollToTop from "./../components/ScrollToTop";
import { LanguageProvider, useLanguage } from "../context/LanguageContext";
import { OverlayProvider, useOverlay } from "../context/OverlayContext";
import ContactOverlay from "../components/overlays/ContactOverlay/ContactOverlay";
import TypesOverlay from "../components/overlays/TypesOverlay/TypesOverlay";

function GlobalOverlays() {
  const { open } = useOverlay();
  return (
    <>
      {open === "contact" && <ContactOverlay />}
      {open === "types" && <TypesOverlay />}
    </>
  );
}

function AppShell() {
  const { lang } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  return (
    <div className="app">
      <ScrollToTop />
      <Navbar />
      <main className="app-main">
        <AppRoutes />
      </main>
      <Footer />
      <GlobalOverlays />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <OverlayProvider>
        <AppShell />
      </OverlayProvider>
    </LanguageProvider>
  );
}
