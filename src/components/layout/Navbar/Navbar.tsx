import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { useOverlay } from "../../../context/OverlayContext";
import { useSiteSettings } from "../../../hooks/useSiteSettings";
import { urlFor } from "../../../lib/sanity/image";
import "./Navbar.css";

type NavItem = {
  label_en: string;
  label_ar: string;
  href: string;
};

export default function Navbar() {
  const { lang, toggleLang } = useLanguage();
  const { openOverlay } = useOverlay();
  const { logo, navLinks = [], loading } = useSiteSettings();

  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  // Fallback (content-only)
  const fallback: NavItem[] = useMemo(
    () => [
      { label_en: "Home", label_ar: "الرئيسية", href: "/" },
      {
        label_en: "Trucks & Vans",
        label_ar: "الشاحنات والمركبات الخفيفة",
        href: "/trucks",
      },
      { label_en: "Trailers", label_ar: "المقطورات", href: "/trailers" },
      { label_en: "Marine", label_ar: "النقل البحري", href: "/marine" },
      // ❌ no contact here (we hard-code it below to open overlay)
    ],
    []
  );

  const items: NavItem[] = (navLinks.length > 0 ? navLinks : fallback).filter(
    (i) => i?.href && i.href !== "/contact" // ❌ ignore sanity /contact link
  );

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleClick(href?: string) {
    if (!href) return;

    // close menu on mobile after click
    closeMenu();

    navigate(href);
  }

  function handleContactClick() {
    closeMenu();
    openOverlay("contact");
  }

  // Close menu on route change (e.g., back/forward)
  useEffect(() => {
    closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="tk-nav">
      <div className="tk-nav__inner">
        {/* Logo */}
        <div
          className="tk-nav__logo"
          role="button"
          tabIndex={0}
          onClick={() => {
            closeMenu();
            navigate("/");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              closeMenu();
              navigate("/");
            }
          }}
        >
          {logo ? (
            <img
              src={urlFor(logo).width(220).quality(90).url()}
              alt="Thermo King"
              style={{ height: 34, objectFit: "contain" }}
              className="tk-nav_image"
            />
          ) : (
            <span>{loading ? "…" : "THERMO KING"}</span>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="tk-nav__burger"
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="tk-mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="tk-nav__burgerLine" />
          <span className="tk-nav__burgerLine" />
          <span className="tk-nav__burgerLine" />
        </button>

        {/* Desktop nav */}
        <nav className="tk-nav__links tk-nav__links--desktop">
          {items.map((item, idx) => {
            const label = lang === "ar" ? item.label_ar : item.label_en;

            return (
              <NavLink
                key={`${item.href}-${idx}`}
                to={item.href}
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => handleClick(item.href)}
              >
                {label}
              </NavLink>
            );
          })}

          {/* ✅ HARD-CODED CONTACT (opens overlay) */}
          <button
            type="button"
            className="tk-nav__contact"
            onClick={handleContactClick}
          >
            {lang === "ar" ? "تواصل معنا" : "Contact Us"}
          </button>

          <button className="tk-nav__lang" type="button" onClick={toggleLang}>
            {lang === "en" ? "العربية" : "EN"}
          </button>
        </nav>
      </div>

      {/* Mobile menu (overlay panel) */}
      <div className={`tk-nav__mobile ${menuOpen ? "is-open" : ""}`}>
        {/* click outside area */}
        <button
          className="tk-nav__backdrop"
          type="button"
          aria-label="Close menu"
          onClick={closeMenu}
        />

        <nav
          id="tk-mobile-menu"
          className="tk-nav__panel"
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          <div className="tk-nav__panelHeader">
            <button
              className="tk-nav__close"
              type="button"
              aria-label="Close menu"
              onClick={closeMenu}
            >
              ✕
            </button>

            <button className="tk-nav__lang" type="button" onClick={toggleLang}>
              {lang === "en" ? "العربية" : "EN"}
            </button>
          </div>

          <div className="tk-nav__panelLinks">
            {items.map((item, idx) => {
              const label = lang === "ar" ? item.label_ar : item.label_en;

              return (
                <NavLink
                  key={`m-${item.href}-${idx}`}
                  to={item.href}
                  className={({ isActive }) =>
                    `tk-nav__mobileLink ${isActive ? "active" : ""}`
                  }
                  onClick={() => handleClick(item.href)}
                >
                  {label}
                </NavLink>
              );
            })}

            {/* ✅ MOBILE CONTACT (opens overlay) */}
            <button
              type="button"
              className="tk-nav__mobileLink tk-nav__contact"
              onClick={handleContactClick}
            >
              {lang === "ar" ? "تواصل معنا" : "Contact Us"}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
