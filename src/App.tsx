import React, { useState, useCallback } from "react";
import { SvgSprite } from "./components/SvgSprite";
import { BackgroundEffects } from "./components/BackgroundEffects";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Works } from "./components/Works";
import { Footer } from "./components/Footer";
import { WeChatPopover } from "./components/WeChatPopover";
import { useScrollReveal } from "./hooks/useScrollReveal";

export const App: React.FC = () => {
  const [wechatAnchor, setWechatAnchor] = useState<HTMLElement | null>(null);
  useScrollReveal();

  const handleOpenWeChat = useCallback((el?: HTMLElement) => {
    const target = el || (document.querySelector(".hero-social-row .social-wechat") as HTMLElement);
    setWechatAnchor((prev) => (prev === target ? null : target));
  }, []);

  return (
    <>
      <SvgSprite />
      <BackgroundEffects />
      <Navbar />
      <Hero onOpenWeChat={handleOpenWeChat} />
      <About />
      <Works />
      <Footer onOpenWeChat={handleOpenWeChat} />
      <WeChatPopover anchorEl={wechatAnchor} onClose={() => setWechatAnchor(null)} />
    </>
  );
};

export default App;
