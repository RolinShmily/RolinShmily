import React from "react";
import { useI18n } from "../i18n/context";

export const About: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="about" className="section">
      <h2 className="section-title reveal">{t.about.title}</h2>
      <div id="about-content" className="about-content reveal">
        <p>
          {t.about.p1_pre}
          <a
            href="https://www.haut.edu.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="link-tag"
            title="Henan University of Technology"
          >
            <span>{t.about.p1_school}</span>
            <img
              src="assets/haut-emblem.png"
              alt=""
              className="w-[1.15em] h-[1.15em] rounded-full object-contain shrink-0"
            />
          </a>
          {t.about.p1_mid}
          <a
            href="https://github.com/RolinShmily/pi-kit"
            target="_blank"
            rel="noopener noreferrer"
            className="link-tag"
            title="pi-kit on GitHub"
          >
            <span>{t.about.p1_tool}</span>
            <svg viewBox="0 0 560 560" fill="currentColor">
              <path d="M420 280H280V140H0V0H420V280Z" />
              <path d="M560 560H420V280H560V560Z" />
              <path d="M140 560H0V140H140V280H280V420H140V560Z" />
            </svg>
          </a>
          {t.about.p1_post}
        </p>
        <p>
          {t.about.p2_pre}
          <a
            href="https://blog.srprolin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="link-tag"
            title="SrP-BloG"
          >
            <span>{t.about.p2_blog}</span>
            <svg viewBox="0 0 640 640" fill="currentColor">
              <path d="M288 88C288 74.7 298.7 64 312 64C457.8 64 576 182.2 576 328C576 341.3 565.3 352 552 352C538.7 352 528 341.3 528 328C528 208.7 431.3 112 312 112C298.7 112 288 101.3 288 88zM144 160C170.5 160 192 181.5 192 208L192 432C192 458.5 213.5 480 240 480C266.5 480 288 458.5 288 432C288 405.5 266.5 384 240 384C231.2 384 224 376.8 224 368L224 304C224 295.2 231.2 288 240 288C319.5 288 384 352.5 384 432C384 511.5 319.5 576 240 576C160.5 576 96 511.5 96 432L96 208C96 181.5 117.5 160 144 160zM312 160C404.8 160 480 235.2 480 328C480 341.3 469.3 352 456 352C442.7 352 432 341.3 432 328C432 261.7 378.3 208 312 208C298.7 208 288 197.3 288 184C288 170.7 298.7 160 312 160z" />
            </svg>
          </a>
          {t.about.p2_mid1}
          <a
            href="https://www.bilibili.com/video/BV1kzwpeaE4h"
            target="_blank"
            rel="noopener noreferrer"
            className="link-tag"
            title="Guitar on Bilibili"
          >
            <span>{t.about.p2_guitar}</span>
            <svg viewBox="0 0 512 512" fill="currentColor">
              <path d="M465 7c-9.4-9.4-24.6-9.4-33.9 0L383 55c-2.4 2.4-4.3 5.3-5.5 8.5l-15.4 41-77.5 77.6c-45.1-29.4-99.3-30.2-131 1.6c-11 11-18 24.6-21.4 39.6c-3.7 16.6-19.1 30.7-36.1 31.6c-25.6 1.3-49.3 10.7-67.3 28.6C-16 328.4-7.6 409.4 47.5 464.5s136.1 63.5 180.9 18.7c17.9-17.9 27.4-41.7 28.6-67.3c.9-17 15-32.3 31.6-36.1c15-3.4 28.6-10.5 39.6-21.4c31.8-31.8 31-85.9 1.6-131l77.6-77.6 41-15.4c3.2-1.2 6.1-3.1 8.5-5.5l48-48c9.4-9.4 9.4-24.6 0-33.9L465 7zM208 256a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
            </svg>
          </a>
          {t.about.p2_mid2}
          <a
            href="https://www.bilibili.com/video/BV1UMB6BXEYj"
            target="_blank"
            rel="noopener noreferrer"
            className="link-tag"
            title="CS2 Highlights on Bilibili"
          >
            <span>{t.about.p2_cs2}</span>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.71 3.23a.02.02 0 0 1-.02-.02c0-.08 0-.37 0-.42 0-.13-.14-.18-.21-.08-.01.01-.15.21-.23.33a.02.02 0 0 1-.02.01h-6.55a.05.05 0 0 1-.05-.05l-.01-.17a.05.05 0 0 1 .05-.05l.34.03a.06.06 0 0 0 .06-.04l.25-.99a.05.05 0 0 0-.03-.05l-.23-.09a.04.04 0 0 1-.03-.03c-.04-.17-.37-1.32-1.99-1.58-.78-.13-1.3.21-1.57.48a1.6 1.6 0 0 0-.3.41l-.1.21-.05.24.05.98a.11.11 0 0 0 .04.08l.36.15-.2.33a.06.06 0 0 1-.05.04s-.42.01-.62.02c-.39.01-1.25.48-1.88 1.84-.62 1.33-.72 1.55-.72 1.55a.07.07 0 0 1-.07.04l-.58 0a.07.07 0 0 0-.09.06l-.9 2.54a.06.06 0 0 0 .02.11l.62.39a.06.06 0 0 1 .02.06l-.33.97a.19.19 0 0 1-.02.06l-.44.38a.1.1 0 0 0-.03.06l-.6 1.53a.06.06 0 0 1-.06.05l-.34 0a.16.16 0 0 0-.16.15l-.2 2.29a1.7 1.7 0 0 1-.02.12l-.16.91a.13.13 0 0 1-.03.05l-.56.43c-.26.24-.6.69-.77 1l-1.86 3.93c-.04.08-.08.22-.08.32l.13.23c0 .09-.03.46-.07.53L.82 23.65a.1.1 0 0 0 0 .09l.03.07.09.18 1.9 0c.11.02.24-.13.25-.3l.1-1.29-.02-.2 3.6-4.23c.1-.11.23-.32.29-.45l1.72-3.79a.17.17 0 0 1 .1-.09l.11-.03a.17.17 0 0 1 .18.05c.15.18.5.78.68 1.03.14.21.85 1.23 1.15 1.57.09.09.35.2.47.27a.08.08 0 0 1 .03.11l-1.03 1.81-.46 2.14a.95.95 0 0 0-.03.15l-.41 1.48c0 .19-.14.29-.16.51l-.15 1.08a.06.06 0 0 0 .06.06l2.55.02.28 0a1.1 1.1 0 0 0 .08 0c.12-.01.56-.07.75-.15.11-.04.18-.08.23-.13.18-.19.2-.28.2-.4 0-.02-.01-.07-.03-.1-.01-.02-.03-.04-.06-.05l-1.18-.36a.37.37 0 0 1-.19-.13l-.32-.47a.09.09 0 0 1 .02-.1l.62-.6a.2.2 0 0 0 .05-.08l1.9-4.48c.09-.29.06-.61 0-.95-.04-.25-.68-1.32-.85-1.62-.15-.26-1.07-1.87-1.29-2.25-.08-.14-.19-.13-.23-.28l-.07-1.11a.04.04 0 0 1 .03-.05l.34-.03a.09.09 0 0 0 .07-.05l1.15-2.15a.1.1 0 0 0 0-.1l-.24-.29a.09.09 0 0 1 0-.08l.35-.38a.05.05 0 0 1 .07-.02l.94.52a.38.38 0 0 0 .18.05c.26 0 .69-.15.91-.29a.38.38 0 0 0 .14-.15l.46-1.07.03 0 .13.6a.06.06 0 0 0 .08.05l1.35-.3a.07.07 0 0 0 .05-.08l-.32-1.34a.07.07 0 0 1 .01-.06l.13-.2a.28.28 0 0 0 .04-.08l.16-.73a.04.04 0 0 1 .04-.03l3.73 0a.09.09 0 0 0 .09-.09v-.64a.02.02 0 0 1 .02-.02h1.44a.05.05 0 0 0 .05-.05v-.28a.05.05 0 0 0-.05-.05h-1.44z" />
            </svg>
          </a>
          {t.about.p2_mid3}
          <a
            href="https://www.bilibili.com/video/BV14xtAzgEiQ"
            target="_blank"
            rel="noopener noreferrer"
            className="link-tag"
            title="Minecraft on Bilibili"
          >
            <span>{t.about.p2_mc}</span>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="5" width="6" height="6" rx="0.5" />
              <rect x="15" y="5" width="6" height="6" rx="0.5" />
              <path d="M9 11h6v5h3v7h-3v-4h-2v4h-2v-4H9v4H6v-7h3v-5z" />
            </svg>
          </a>
          {t.about.p2_post}
        </p>
        <p>
          {t.about.p3}
        </p>
      </div>
    </section>
  );
};
