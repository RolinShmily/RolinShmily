import React, { useState, useEffect, useRef } from "react";
import { useI18n } from "../i18n/context";

export const Navbar: React.FC = () => {
  const { t, locale, toggleLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [inHero, setInHero] = useState(true);
  const [retracted, setRetracted] = useState(false);

  const lastScrollY = useRef(0);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile drawer if screen is resized to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroThreshold = 260;

      const isPastHero = scrollY > heroThreshold;
      setInHero(!isPastHero);

      // Auto-close open menu if user scrolls page significantly
      if (isOpen && Math.abs(scrollY - lastScrollY.current) > 25) {
        setIsOpen(false);
      }

      // Scroll down: retract. Scroll up: reveal!
      if (!isPastHero || isOpen) {
        setRetracted(false);
      } else {
        const diff = scrollY - lastScrollY.current;
        if (diff > 8 && scrollY > 360) {
          setRetracted(true);
        } else if (diff < -6) {
          setRetracted(false);
        }
      }

      lastScrollY.current = scrollY;

      // Active section spy
      const sections = ["hero", "about", "works"];
      const scrollPos = scrollY + 160;
      let current = "";

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            current = id;
          }
        }
      }

      if (!current && scrollY < 280) {
        current = "hero";
      }

      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  const isHidden = inHero && !isOpen;
  const isRetracted = retracted && !isOpen && !inHero;

  return (
    <>
      <header
        id="navbar"
        className={`${isHidden ? "nav-hidden" : ""} ${isRetracted ? "nav-retracted" : ""}`}
      >
        <div className="nav-capsule">
          <a href="#hero" className="nav-logo" title="Back to top" onClick={() => setIsOpen(false)}>
            <img src="assets/avatar-profile.png" alt="RoL1n_SrP" className="nav-avatar" />
            <span className="nav-name">RoL1n</span>
          </a>

          {/* Clean nav links with icons - NO rounded boxes */}
          <nav className="nav-links" aria-label="Main Navigation">
            <a
              href="#hero"
              className={`nav-link ${activeSection === "hero" ? "active" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="nav-link-icon"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>{t.nav.home}</span>
            </a>
            <a
              href="#about"
              className={`nav-link ${activeSection === "about" ? "active" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="nav-link-icon"
              >
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
              <span>{t.nav.about}</span>
            </a>
            <a
              href="#works"
              className={`nav-link ${activeSection === "works" ? "active" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="nav-link-icon"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              <span>{t.nav.works}</span>
            </a>
          </nav>

          {/* Right cluster: Frameless Lang toggle + Frameless GitHub Source link */}
          <div className="nav-right">
            <button
              type="button"
              className="nav-lang-btn"
              onClick={toggleLocale}
              title={t.nav.langToggle}
              aria-label="Toggle language"
            >
              <span className={`lang-opt ${locale === "en" ? "active" : ""}`}>EN</span>
              <span className="lang-sep">/</span>
              <span className={`lang-opt ${locale === "zh" ? "active" : ""}`}>中</span>
            </button>

            <a
              className="nav-source-link"
              href="https://github.com/RolinShmily/RolinShmily"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub Source"
              aria-label="GitHub Repository Source Code"
            >
              <svg width="15" height="15" viewBox="0 0 640 640" fill="currentColor">
                <use href="#icon-github" />
              </svg>
              <span>{t.nav.source}</span>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                <use href="#icon-arrow-out" />
              </svg>
            </a>

            <button
              type="button"
              className={`nav-toggle ${isOpen ? "active" : ""}`}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div className={`nav-mobile-menu ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
          <a
            href="#hero"
            className={`nav-mobile-item ${activeSection === "hero" ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="nav-mobile-icon"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>{t.nav.home}</span>
          </a>
          <a
            href="#about"
            className={`nav-mobile-item ${activeSection === "about" ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="nav-mobile-icon"
            >
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
            <span>{t.nav.about}</span>
          </a>
          <a
            href="#works"
            className={`nav-mobile-item ${activeSection === "works" ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="nav-mobile-icon"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            <span>{t.nav.works}</span>
          </a>

          <div className="nav-mobile-divider" />

          <a
            className="nav-mobile-item"
            href="https://github.com/RolinShmily/RolinShmily"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
          >
            <svg width="18" height="18" viewBox="0 0 640 640" fill="currentColor" className="nav-mobile-icon">
              <use href="#icon-github" />
            </svg>
            <span style={{ flex: 1 }}>{t.nav.source}</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
              <use href="#icon-arrow-out" />
            </svg>
          </a>
        </div>
      </header>

      {/* Backdrop overlay for mobile menu */}
      <div
        className={`nav-mobile-backdrop ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
    </>
  );
};
