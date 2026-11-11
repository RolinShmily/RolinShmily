import React, { useEffect, useState, useCallback } from "react";
import { SvgSprite } from "./components/SvgSprite";
import { BackgroundEffects } from "./components/BackgroundEffects";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Works } from "./components/Works";
import { Footer } from "./components/Footer";
import { WeChatPopover } from "./components/WeChatPopover";
import { InkReveal } from "./components/InkReveal";
import { useScrollReveal } from "./hooks/useScrollReveal";

export const App: React.FC = () => {
  const [wechatAnchor, setWechatAnchor] = useState<HTMLElement | null>(null);
  const [inkTarget, setInkTarget] = useState(false);
  const [inkTheme, setInkTheme] = useState(false);
  useScrollReveal();

  const handleOpenWeChat = useCallback((el?: HTMLElement) => {
    const target = el || (document.querySelector(".hero-social-row .social-wechat") as HTMLElement);
    setWechatAnchor((prev) => (prev === target ? null : target));
  }, []);

  const handleAvatarSideChange = useCallback((side: "front" | "back") => {
    setInkTarget(side === "back");
  }, []);

  // The palette flips under the fog at peak density, so no element is ever
  // caught mid-way between the dark and ink themes.
  useEffect(() => {
    document.documentElement.classList.toggle("ink-mode", inkTheme);
  }, [inkTheme]);

  return (
    <>
      <SvgSprite />
      <BackgroundEffects />
      <Navbar />
      <Hero
        onOpenWeChat={handleOpenWeChat}
        avatarInk={inkTheme}
        onAvatarSideChange={handleAvatarSideChange}
      />
      <About />
      <Works />
      <Footer onOpenWeChat={handleOpenWeChat} />
      <WeChatPopover anchorEl={wechatAnchor} onClose={() => setWechatAnchor(null)} />
      <InkReveal active={inkTarget} onThemeApplied={setInkTheme} />
    </>
  );
};

export default App;
