import React, { useState, useEffect } from "react";
import { PixelAvatar } from "./PixelAvatar";
import { SOCIAL_LINKS } from "../data/socials";
import { prefersReducedMotion } from "../utils/motion";
import { useI18n } from "../i18n/context";

interface HeroProps {
  onOpenWeChat: (el: HTMLElement) => void;
  avatarInk: boolean;
  onAvatarSideChange: (side: "front" | "back") => void;
}

export const Hero: React.FC<HeroProps> = React.memo(({ onOpenWeChat, avatarInk, onAvatarSideChange }) => {
  const { t } = useI18n();
  const fullText = "RoL1n_SrP";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplayText(fullText);
      return;
    }

    let i = 0;
    let timer: ReturnType<typeof setInterval>;

    const startTyping = () => {
      timer = setInterval(() => {
        if (i < fullText.length) {
          setDisplayText(fullText.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      }, 100);
    };

    const initialTimeout = setTimeout(startTyping, 650);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(timer);
    };
  }, []);

  return (
    <section id="hero" className="section">
      <div className="hero-split">
        <div className="hero-left">
          <PixelAvatar ink={avatarInk} onSideChange={onAvatarSideChange} />
        </div>

        <div className="hero-right">
          <div className="hero-terminal">
            <div className="terminal-line terminal-cmdline">
              <span className="terminal-user">user@srprolin</span>
              <span className="terminal-sep">:</span>
              <span className="terminal-path">~</span>
              <span className="terminal-sep">$</span>
              <span className="terminal-cmd">whoami</span>
            </div>
            <div className="terminal-output">
              <span className="terminal-gt">&gt;</span>
              <span className="typing-text">{displayText}</span>
              <span className="typing-cursor" aria-hidden="true">
                _
              </span>
            </div>
            <p className="terminal-role">
              <span className="tag-item">#DevOps</span>
              <span className="tag-item">#Gamer</span>
              <span className="tag-item">#Guitarist</span>
            </p>
            <blockquote className="terminal-quote">
              {t.hero.quote}
            </blockquote>
          </div>

          {/* Row 1: External Sub-sites */}
          <div className="hero-sites-row">
            <a
              href="https://blog.srprolin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-site-btn"
              title="SrP-BloG"
            >
              <svg className="site-icon" viewBox="0 0 640 640" width="22" height="22" fill="currentColor">
                <path d="M288 88C288 74.7 298.7 64 312 64C457.8 64 576 182.2 576 328C576 341.3 565.3 352 552 352C538.7 352 528 341.3 528 328C528 208.7 431.3 112 312 112C298.7 112 288 101.3 288 88zM144 160C170.5 160 192 181.5 192 208L192 432C192 458.5 213.5 480 240 480C266.5 480 288 458.5 288 432C288 405.5 266.5 384 240 384C231.2 384 224 376.8 224 368L224 304C224 295.2 231.2 288 240 288C319.5 288 384 352.5 384 432C384 511.5 319.5 576 240 576C160.5 576 96 511.5 96 432L96 208C96 181.5 117.5 160 144 160zM312 160C404.8 160 480 235.2 480 328C480 341.3 469.3 352 456 352C442.7 352 432 341.3 432 328C432 261.7 378.3 208 312 208C298.7 208 288 197.3 288 184C288 170.7 298.7 160 312 160z" />
              </svg>
              <span className="site-label">BloG</span>
              <svg className="site-arrow" width="14" height="14" strokeWidth="2.5">
                <use href="#icon-arrow-out" />
              </svg>
            </a>
            <a
              href="https://love.srprolin.top/"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-site-btn"
              title="Lov3 Space"
            >
              <svg className="site-icon" viewBox="0 0 640 640" width="22" height="22" fill="currentColor">
                <path d="M333.4 66.9C329.2 65 324.7 64 320 64C315.3 64 310.8 65 306.6 66.9L118.3 146.8C96.3 156.1 79.9 177.8 80 204C80.5 303.2 121.3 484.7 293.6 567.2C310.3 575.2 329.7 575.2 346.4 567.2C518.8 484.7 559.6 303.2 560 204C560.1 177.8 543.7 156.1 521.7 146.8L333.4 66.9zM313.6 247.5L320 256L326.4 247.5C337.5 232.7 354.9 224 373.3 224C405.7 224 432 250.3 432 282.7L432 288C432 337.1 366.2 386.1 335.5 406.3C326 412.5 314 412.5 304.6 406.3C273.9 386.1 208.1 337 208.1 288L208.1 282.7C208.1 250.3 234.4 224 266.8 224C285.3 224 302.7 232.7 313.7 247.5z" />
              </svg>
              <span className="site-label">Lov3</span>
              <svg className="site-arrow" width="14" height="14" strokeWidth="2.5">
                <use href="#icon-arrow-out" />
              </svg>
            </a>
          </div>

          {/* Row 2: Circular Social Brand Buttons */}
          <div className="hero-social-row">
            {SOCIAL_LINKS.map((link) => {
              const className = `hero-social-circle social-${link.id}`;
              if (link.action === "wechat") {
                return (
                  <button
                    key={link.id}
                    type="button"
                    className={className}
                    onClick={(e) => onOpenWeChat(e.currentTarget)}
                    title="WeChat Official Account"
                    aria-label={link.ariaLabel}
                  >
                    <svg width="22" height="22">
                      <use href={link.iconHref} />
                    </svg>
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
                  title={link.label}
                  aria-label={link.ariaLabel}
                >
                  <svg width="22" height="22">
                    <use href={link.iconHref} />
                  </svg>
                </a>
              );
            })}
          </div>

          {/* Row 3: Action Pills */}
          <div className="hero-actions-row">
            <a href="#about" className="hero-action-pill" title={t.hero.actions.about}>
              <span>{t.hero.actions.about}</span>
              <span className="pill-arrow-wrap">
                <svg className="pill-arrow" width="18" height="18">
                  <use href="#icon-arrow-right" />
                </svg>
              </span>
            </a>
            <a href="#works" className="hero-action-pill" title={t.hero.actions.works}>
              <span>{t.hero.actions.works}</span>
              <span className="pill-arrow-wrap">
                <svg className="pill-arrow" width="18" height="18">
                  <use href="#icon-arrow-right" />
                </svg>
              </span>
            </a>
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
      </div>

      <div className="scroll-indicator">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" className="bounce">
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
        </svg>
      </div>
    </section>
  );
});
