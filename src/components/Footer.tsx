import React, { useState, useEffect } from "react";
import { BrandCanvas } from "./BrandCanvas";
import { SOCIAL_LINKS } from "../data/socials";
import { useI18n } from "../i18n/context";

interface FooterProps {
  onOpenWeChat: (el: HTMLElement) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenWeChat }) => {
  const { t } = useI18n();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        setShowBackToTop(window.scrollY > window.innerHeight * 0.5);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="footer">
      <div className="footer-glow" aria-hidden="true" />

      {/* Expanded Social Network & Contact Tags */}
      <div className="footer-connect reveal">
        <div className="footer-social-tags">
          {SOCIAL_LINKS.map((link) => {
            const label = t.socials[link.id] || link.label;
            const className = `footer-social-tag social-${link.id}`;
            if (link.action === "wechat") {
              return (
                <button
                  key={link.id}
                  type="button"
                  className={className}
                  onClick={(e) => onOpenWeChat(e.currentTarget)}
                  title={label}
                >
                  <svg width="18" height="18">
                    <use href={link.iconHref} />
                  </svg>
                  <span>{label}</span>
                </button>
              );
            }

            return (
              <a
                key={link.id}
                href={link.url}
                className={className}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
              >
                <svg width="18" height="18">
                  <use href={link.iconHref} />
                </svg>
                <span>{label}</span>
              </a>
            );
          })}
        </div>

        <div className="footer-cta-box">
          <a
            className="hero-action-pill hero-action-cta"
            href="mailto:contact@srprolin.com"
            title={t.hero.actions.contact}
            aria-label={t.hero.actions.contact}
          >
            <span>{t.hero.actions.contact}</span>
            <span className="pill-mail-wrap">
              <svg className="pill-mail" width="18" height="18">
                <use href="#icon-envelope" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      <div className="footer-brand reveal">
        <BrandCanvas />
      </div>

      <div className="footer-inner">
        <p className="footer-text reveal">
          Copyright &copy; 2024-2026{" "}
          <a href="https://github.com/RolinShmily" target="_blank" rel="noopener noreferrer">
            RoL1n_SrP
          </a>{" "}
          &middot;{" "}
          <a href="https://github.com/RolinShmily/RolinShmily" target="_blank" rel="noopener noreferrer">
            {t.footer.source}
          </a>
        </p>
        <p className="footer-counter reveal">
          <img src="https://count.getloli.com/@RolinShmily" alt="Visitor Counter" />
        </p>
      </div>

      <button
        className={`back-to-top ${showBackToTop ? "visible" : ""}`}
        id="back-to-top"
        aria-label="Back to top"
        onClick={scrollToTop}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
        </svg>
      </button>
    </footer>
  );
};
