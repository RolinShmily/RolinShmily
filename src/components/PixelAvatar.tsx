/* ============================================================
   RoL1n_SrP 3D Avatar Card
   - Front: avatar image textured directly on the slab (no frame,
     only physical side thickness visible)
   - Back: link backplate with site/social icons + labels (clickable)
   - Side: scrolling ticker tape around the slab edge
   - Floats natively over page, free 3D drag rotation with momentum,
     idle breathing motion, nearest half-turn settling, and hover parallax
   ============================================================ */
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { prefersReducedMotion } from "../utils/motion";

interface PixelAvatarProps {
  onOpenWeChat: () => void;
}

export const PixelAvatar: React.FC<PixelAvatarProps> = React.memo(({ onOpenWeChat }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onOpenWeChatRef = useRef(onOpenWeChat);
  onOpenWeChatRef.current = onOpenWeChat;

  useEffect(() => {
    const container = containerRef.current;
    const canvasEl = canvasRef.current;
    if (!container || !canvasEl) return;
    const cvs: HTMLCanvasElement = canvasEl;

    if (prefersReducedMotion()) {
      container.classList.remove("is-loading");
      container.classList.add("is-fallback");
      return;
    }

    const MONO_STACK = (() => {
      const css = getComputedStyle(document.documentElement);
      const families = ["--font-mono-latin", "--font-cjk"]
        .map((name) => css.getPropertyValue(name).trim())
        .filter(Boolean);
      return [...families, "ui-monospace", "monospace"].join(", ");
    })();

    /* ------------------------------------------------------------
       1. Link definitions (shared by backplate painter & raycast)
       ------------------------------------------------------------ */
    const LINKS = [
      {
        label: "BloG",
        url: "https://blog.srprolin.com",
        color: "#f75c7e",
        vb: 640,
        d: "M288 88C288 74.7 298.7 64 312 64C457.8 64 576 182.2 576 328C576 341.3 565.3 352 552 352C538.7 352 528 341.3 528 328C528 208.7 431.3 112 312 112C298.7 112 288 101.3 288 88zM144 160C170.5 160 192 181.5 192 208L192 432C192 458.5 213.5 480 240 480C266.5 480 288 458.5 288 432C288 405.5 266.5 384 240 384C231.2 384 224 376.8 224 368L224 304C224 295.2 231.2 288 240 288C319.5 288 384 352.5 384 432C384 511.5 319.5 576 240 576C160.5 576 96 511.5 96 432L96 208C96 181.5 117.5 160 144 160zM312 160C404.8 160 480 235.2 480 328C480 341.3 469.3 352 456 352C442.7 352 432 341.3 432 328C432 261.7 378.3 208 312 208C298.7 208 288 197.3 288 184C288 170.7 298.7 160 312 160z",
      },
      {
        label: "Lov3",
        url: "https://love.srprolin.top/",
        color: "#ff8fab",
        vb: 640,
        d: "M333.4 66.9C329.2 65 324.7 64 320 64C315.3 64 310.8 65 306.6 66.9L118.3 146.8C96.3 156.1 79.9 177.8 80 204C80.5 303.2 121.3 484.7 293.6 567.2C310.3 575.2 329.7 575.2 346.4 567.2C518.8 484.7 559.6 303.2 560 204C560.1 177.8 543.7 156.1 521.7 146.8L333.4 66.9zM313.6 247.5L320 256L326.4 247.5C337.5 232.7 354.9 224 373.3 224C405.7 224 432 250.3 432 282.7L432 288C432 337.1 366.2 386.1 335.5 406.3C326 412.5 314 412.5 304.6 406.3C273.9 386.1 208.1 337 208.1 288L208.1 282.7C208.1 250.3 234.4 224 266.8 224C285.3 224 302.7 232.7 313.7 247.5z",
      },
      {
        label: "WeChat",
        action: "wechat",
        color: "#07c160",
        vb: 24,
        d: "M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 10.436 7.17c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z",
      },
      {
        label: "Afdian",
        url: "https://afdian.com/a/srprolin",
        color: "#b99bff",
        vb: 24,
        d: "M9 14.234a.567.567 0 1 0 0 1.134.567.567 0 0 0 0-1.134m5.351 1.705a.567.567 0 1 0 0 1.135.567.567 0 0 0 0-1.135m8.401 1.436c-.189.095-.461.1-.713.013-.169-.06-.352-.116-.534-.172-.339-.104-.904-.276-1.011-.407a.533.533 0 1 0-.853.643c.059.08.139.146.22.209-.816 1.131-4.398 3.382-9.464 2.273-2.283-.5-3.819-1.413-4.444-2.639-.451-.885-.348-1.797-.133-2.293.62-1.29 5.097-4.261 7.955-5.943a.537.537 0 0 0 .188-.733c-.149-.254-.49-.356-.73-.189-.231.135-1.015.601-2.015 1.236-.338-.227-.923-.508-1.86-.6-1.486-.148-4.92-.805-6.029-1.275C2.535 7.162.731 6.27 1.131 5.267c.092-.234.527-.613 1.47-.974a8.5 8.5 0 0 1 1.995-.492l-.212.103c-.642.312-1.343.662-1.813 1.075-.034-.022-.07-.044-.094-.069a.527.527 0 0 0-.754-.017.533.533 0 0 0-.017.756c.19.2.471.35.829.465l.039.014c1.245.383 3.458.336 6.578.211 1.345-.052 2.615-.102 3.674-.082 3.512.07 6.152 1.469 8.07 4.279 1.178 1.725.753 3.426.079 4.903a1.4 1.4 0 0 1-.231-.222.54.54 0 0 0-.75-.085.535.535 0 0 0-.086.751c.109.137.665.778 1.355.724l.037-.002c.021-.003.042.001.064-.003.472-.086.768-.063 1.045.111.367.232.547.37.511.485-.021.073-.076.125-.168.177M8.19 11.418l-.315.231a1.6 1.6 0 0 1-.243-.32c.123-.038.33.007.558.089m14.733 4.356a1.9 1.9 0 0 0-.81-.27c.632-1.544 1.034-3.565-.336-5.572-2.096-3.072-5.101-4.668-8.93-4.744-1.091-.022-2.377.029-3.737.083-1.58.063-3.683.145-5.112.027.285-.155.588-.304.851-.431 1.006-.49 1.797-.872 1.535-1.548-.137-.396-.547-.603-1.219-.618C3.748 2.669.688 3.489.138 4.872c-.31.779-.361 2.282 2.775 3.61 1.29.548 4.934 1.216 6.341 1.355.397.039.701.119.931.205a75 75 0 0 0-.986.664c-.577-.329-1.521-.718-2.226-.237a.94.94 0 0 0-.435.768c-.01.385.224.763.486 1.066-1.038.83-1.877 1.634-2.175 2.253-.332.762-.467 2.008.153 3.224.786 1.544 2.524 2.62 5.166 3.199 3.454.755 6.437.075 8.411-.966 1.099-.579 1.878-1.27 2.257-1.887l.356.113c.169.051.338.103.496.159.522.181 1.1.157 1.545-.068l.025-.013c.336-.177.577-.46.683-.803.285-.922-.528-1.432-1.018-1.74",
      },
      {
        label: "GitHub",
        url: "https://github.com/RolinShmily",
        color: "#e6edf3",
        vb: 640,
        d: "M237.9 461.4C237.9 463.4 235.6 465 232.7 465C229.4 465.3 227.1 463.7 227.1 461.4C227.1 459.4 229.4 457.8 232.3 457.8C235.3 457.5 237.9 459.1 237.9 461.4zM206.8 456.9C206.1 458.9 208.1 461.2 211.1 461.8C213.7 462.8 216.7 461.8 217.3 459.8C217.9 457.8 216 455.5 213 454.6C210.4 453.9 207.5 454.9 206.8 456.9zM251 455.2C248.1 455.9 246.1 457.8 246.4 460.1C246.7 462.1 249.3 463.4 252.3 462.7C255.2 462 257.2 460.1 256.9 458.1C256.6 456.2 253.9 454.9 251 455.2zM316.8 72C178.1 72 72 177.3 72 316C72 426.9 141.8 521.8 241.5 555.2C254.3 557.5 258.8 549.6 258.8 543.1C258.8 536.9 258.5 502.7 258.5 481.7C258.5 481.7 188.5 496.7 173.8 451.9C173.8 451.9 162.4 422.8 146 415.3C146 415.3 123.1 399.6 147.6 399.9C147.6 399.9 172.5 401.9 186.2 425.7C208.1 464.3 244.8 453.2 259.1 446.6C261.4 430.6 267.9 419.5 275.1 412.9C219.2 406.7 162.8 398.6 162.8 302.4C162.8 274.9 170.4 261.1 186.4 243.5C183.8 237 175.3 210.2 189 175.6C209.9 169.1 258 202.6 258 202.6C278 197 299.5 194.1 320.8 194.1C342.1 194.1 363.6 197 383.6 202.6C383.6 202.6 431.7 169 452.6 175.6C466.3 210.3 457.8 237 455.2 243.5C471.2 261.2 481 275 481 302.4C481 398.9 422.1 406.6 366.2 412.9C375.4 420.8 383.2 435.8 383.2 459.3C383.2 493 382.9 534.7 382.9 542.9C382.9 549.4 387.5 557.3 400.2 555C500.2 521.8 568 426.9 568 316C568 177.3 455.5 72 316.8 72z",
      },
      {
        label: "Steam",
        url: "https://steamcommunity.com/profiles/76561199516828933/",
        color: "#66c0f4",
        vb: 640,
        d: "M568 320C568 457 456.8 568 319.6 568C205.8 568 110 491.7 80.6 387.6L175.8 426.9C182.2 459 210.7 483.3 244.7 483.3C283.9 483.3 316.6 450.9 314.9 409.8L399.4 349.6C451.5 350.9 495.2 308.7 495.2 256.1C495.2 204.5 453.2 162.6 401.5 162.6C349.8 162.6 307.8 204.6 307.8 256.1L307.8 257.3L248.6 343C233.1 342.1 217.9 346.4 205.1 355.1L72 300.1C82.2 172.4 189.1 72 319.6 72C456.8 72 568 183 568 320zM227.7 448.3L197.2 435.7C202.8 447.3 212.5 456.5 224.4 461.5C251.3 472.7 282.2 459.9 293.4 433.1C298.8 420.1 298.9 405.8 293.5 392.8C288.1 379.8 278 369.6 265 364.2C252.1 358.8 238.3 359 226.1 363.6L257.6 376.6C277.4 384.8 286.8 407.5 278.5 427.3C270.2 447.2 247.5 456.5 227.7 448.3zM401.5 193.8C435.9 193.8 463.8 221.7 463.8 256.1C463.8 290.5 435.9 318.4 401.5 318.4C367.1 318.4 339.2 290.5 339.2 256.1C339.2 221.7 367.1 193.8 401.5 193.8zM401.6 302.8C427.4 302.8 448.4 281.8 448.4 256C448.4 230.2 427.4 209.2 401.6 209.2C375.8 209.2 354.8 230.2 354.8 256C354.8 281.8 375.8 302.8 401.6 302.8z",
      },
      {
        label: "DouYin",
        url: "https://www.douyin.com/user/MS4wLjABAAAAo7eM2TrNX4lzekpyIIorhn-fs4GzMpkY7OUQzzGjjXup0nMk6PGqNqHFa4FnY2O_",
        color: "#25f4ee",
        vb: 640,
        d: "M544.5 273.9C500.5 274 457.5 260.3 421.7 234.7L421.7 413.4C421.7 446.5 411.6 478.8 392.7 506C373.8 533.2 347.1 554 316.1 565.6C285.1 577.2 251.3 579.1 219.2 570.9C187.1 562.7 158.3 545 136.5 520.1C114.7 495.2 101.2 464.1 97.5 431.2C93.8 398.3 100.4 365.1 116.1 336C131.8 306.9 156.1 283.3 185.7 268.3C215.3 253.3 248.6 247.8 281.4 252.3L281.4 342.2C266.4 337.5 250.3 337.6 235.4 342.6C220.5 347.6 207.5 357.2 198.4 369.9C189.3 382.6 184.4 398 184.5 413.8C184.6 429.6 189.7 444.8 199 457.5C208.3 470.2 221.4 479.6 236.4 484.4C251.4 489.2 267.5 489.2 282.4 484.3C297.3 479.4 310.4 469.9 319.6 457.2C328.8 444.5 333.8 429.1 333.8 413.4L333.8 64L421.8 64C421.7 71.4 422.4 78.9 423.7 86.2C426.8 102.5 433.1 118.1 442.4 131.9C451.7 145.7 463.7 157.5 477.6 166.5C497.5 179.6 520.8 186.6 544.6 186.6L544.6 274z",
      },
      {
        label: "Bilibili",
        url: "https://space.bilibili.com/422744280",
        color: "#00a1d6",
        vb: 24,
        d: "M4.977 3.561a1.31 1.31 0 111.818-1.884l2.828 2.728c.08.078.149.163.205.254h4.277a1.32 1.32 0 01.205-.254l2.828-2.728a1.31 1.31 0 011.818 1.884L17.82 4.66h.848A5.333 5.333 0 0124 9.992v7.34a5.333 5.333 0 01-5.333 5.334H5.333A5.333 5.333 0 010 17.333V9.992a5.333 5.333 0 015.333-5.333h.781L4.977 3.56zm.356 3.67a2.667 2.667 0 00-2.666 2.667v7.529a2.667 2.667 0 002.666 2.666h13.334a2.667 2.667 0 002.666-2.666v-7.53a2.667 2.667 0 00-2.666-2.666H5.333zm1.334 5.192a1.333 1.333 0 112.666 0v1.192a1.333 1.333 0 11-2.666 0v-1.192zM16 11.09c-.736 0-1.333.597-1.333 1.333v1.192a1.333 1.333 0 102.666 0v-1.192c0-.736-.597-1.333-1.333-1.333z",
      },
      {
        label: "Heybox",
        url: "https://www.xiaoheihe.cn/app/user/profile/58982380",
        color: "#ffffff",
        vb: 512,
        d: "M 228.00 94.00 Q 228.00 82.00 238.39 88.00 L 383.88 172.00 Q 396.00 179.00 396.00 193.00 L 396.00 319.00 Q 396.00 333.00 383.84 339.95 L 350.42 359.05 Q 340.00 365.00 340.00 353.00 L 340.00 217.00 Q 340.00 211.00 334.79 208.02 L 289.21 181.98 Q 284.00 179.00 284.00 185.00 L 284.00 220.00 Q 284.00 228.00 276.00 228.00 L 236.00 228.00 Q 228.00 228.00 228.00 220.00 Z M 284.00 418.00 Q 284.00 430.00 273.61 424.00 L 128.12 340.00 Q 116.00 333.00 116.00 319.00 L 116.00 193.00 Q 116.00 179.00 128.16 172.05 L 161.58 152.95 Q 172.00 147.00 172.00 159.00 L 172.00 295.00 Q 172.00 301.00 177.21 303.98 L 222.79 330.02 Q 228.00 333.00 228.00 327.00 L 228.00 292.00 Q 228.00 284.00 236.00 284.00 L 276.00 284.00 Q 284.00 284.00 284.00 292.00 Z",
      },
    ];

    interface LinkHitRect {
      x: number;
      y: number;
      w: number;
      h: number;
      url?: string;
      action?: string;
      label: string;
    }

    const linkRects: LinkHitRect[] = [];

    /* ------------------------------------------------------------
       2. Backplate: Links Board (icons + labels, clickable)
       ------------------------------------------------------------ */
    function createBackplateTexture(): THREE.CanvasTexture {
      const S = 512;
      const cvs = document.createElement("canvas");
      cvs.width = S;
      cvs.height = S;
      const ctx = cvs.getContext("2d");
      if (!ctx) return new THREE.CanvasTexture(cvs);

      linkRects.length = 0;

      // Obsidian base
      ctx.fillStyle = "#0d0b1a";
      ctx.fillRect(0, 0, S, S);

      // Faint tech grid
      ctx.strokeStyle = "rgba(124, 58, 237, 0.10)";
      ctx.lineWidth = 1;
      for (let x = 32; x < S; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, S);
        ctx.stroke();
      }
      for (let y = 32; y < S; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(S, y);
        ctx.stroke();
      }

      // Corner brackets (cyber pink)
      const m = 26,
        bl = 24;
      ctx.strokeStyle = "rgba(247, 92, 126, 0.55)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(m, m + bl);
      ctx.lineTo(m, m);
      ctx.lineTo(m + bl, m);
      ctx.moveTo(S - m - bl, m);
      ctx.lineTo(S - m, m);
      ctx.lineTo(S - m, m + bl);
      ctx.moveTo(m, S - m - bl);
      ctx.lineTo(m, S - m);
      ctx.lineTo(m + bl, S - m);
      ctx.moveTo(S - m - bl, S - m);
      ctx.lineTo(S - m, S - m);
      ctx.lineTo(S - m, S - m - bl);
      ctx.stroke();

      // Header
      ctx.textAlign = "center";
      ctx.font = `bold 32px ${MONO_STACK}`;
      try {
        (ctx as unknown as { letterSpacing: string }).letterSpacing = "3px";
      } catch {
        /* older canvas */
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillText("RoL1n_SrP", S / 2, 102);
      try {
        (ctx as unknown as { letterSpacing: string }).letterSpacing = "0px";
      } catch {
        /* older canvas */
      }

      /* Two-column link grid: 5 rows x 2 cols, centered */
      const ROWS = 5;
      const CELL_W = 190;
      const CELL_H = 50;
      const GAP_X = 16;
      const GAP_Y = 12;
      const gridW = CELL_W * 2 + GAP_X;
      const gridX = (S - gridW) / 2;
      const gridY = 138;
      const iconSize = 26;
      const padX = 16;
      const tex = new THREE.CanvasTexture(cvs);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;

      LINKS.forEach((link, i) => {
        const col = i < ROWS ? 0 : 1;
        const row = i % ROWS;
        const cellX = gridX + col * (CELL_W + GAP_X);
        const cellY = gridY + row * (CELL_H + GAP_Y);

        linkRects.push({
          x: cellX,
          y: cellY,
          w: CELL_W,
          h: CELL_H,
          url: link.url,
          action: link.action,
          label: link.label,
        });

        // Row capsule
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.beginPath();
        ctx.roundRect(cellX, cellY, CELL_W, CELL_H, 12);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();

        const iconY = cellY + (CELL_H - iconSize) / 2;
        if (link.d) {
          const path = new Path2D(link.d);
          ctx.save();
          ctx.translate(cellX + padX, iconY);
          const s = iconSize / (link.vb || 640);
          ctx.scale(s, s);
          ctx.fillStyle = link.color || "#ffffff";
          ctx.fill(path);
          ctx.restore();
        }

        ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
        ctx.font = `600 18px ${MONO_STACK}`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(link.label, cellX + padX + iconSize + 12, cellY + CELL_H / 2 + 1);
        ctx.textBaseline = "alphabetic";
      });

      return tex;
    }

    /* ------------------------------------------------------------
       3. Three.js Scene, Frameless Card & Lighting
       ------------------------------------------------------------ */
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: cvs,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch (e) {
      console.warn("WebGL not supported:", e);
      container.classList.remove("has-gl", "is-loading");
      container.classList.add("is-fallback");
      return;
    }

    container.classList.add("has-gl");
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 150);
    camera.position.set(0, 0, 66);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(18, 22, 28);
    scene.add(dirLight);

    const rimKeyLight = new THREE.DirectionalLight(0xf75c7e, 1.8);
    rimKeyLight.position.set(-25, 12, 18);
    scene.add(rimKeyLight);

    const violetRimLight = new THREE.PointLight(0x9d4edd, 2.0, 70);
    violetRimLight.position.set(-18, -14, 18);
    scene.add(violetRimLight);

    const pointerLight = new THREE.PointLight(0x00f0ff, 1.5, 60);
    pointerLight.position.set(0, 0, 20);
    scene.add(pointerLight);

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    const cardGroup = new THREE.Group();
    masterGroup.add(cardGroup);

    const CARD_W = 23;
    const CARD_H = 23;
    const CARD_R = 2.4;
    const CARD_DEPTH = 1.5;
    const BEVEL = 0.12;

    const cardShape = new THREE.Shape();
    const halfW = CARD_W / 2;
    const halfH = CARD_H / 2;
    cardShape.moveTo(-halfW + CARD_R, -halfH);
    cardShape.lineTo(halfW - CARD_R, -halfH);
    cardShape.quadraticCurveTo(halfW, -halfH, halfW, -halfH + CARD_R);
    cardShape.lineTo(halfW, halfH - CARD_R);
    cardShape.quadraticCurveTo(halfW, halfH, halfW - CARD_R, halfH);
    cardShape.lineTo(-halfW + CARD_R, halfH);
    cardShape.quadraticCurveTo(-halfW, halfH, -halfW, halfH - CARD_R);
    cardShape.lineTo(-halfW, -halfH + CARD_R);
    cardShape.quadraticCurveTo(-halfW, -halfH, -halfW + CARD_R, -halfH);

    // 1) Extruded body
    const bodyGeo = new THREE.ExtrudeGeometry(cardShape, {
      steps: 1,
      depth: CARD_DEPTH,
      bevelEnabled: true,
      bevelThickness: BEVEL,
      bevelSize: BEVEL,
      bevelSegments: 2,
    });
    bodyGeo.center();

    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x14111f,
      metalness: 0.7,
      roughness: 0.35,
    });
    cardGroup.add(new THREE.Mesh(bodyGeo, rimMat));

    function makeFaceGeo(): THREE.ShapeGeometry {
      const geo = new THREE.ShapeGeometry(cardShape, 8);
      const pos = geo.attributes.position;
      const uvs = new Float32Array(pos.count * 2);
      for (let i = 0; i < pos.count; i++) {
        uvs[i * 2] = (pos.getX(i) + halfW) / CARD_W;
        uvs[i * 2 + 1] = (pos.getY(i) + halfH) / CARD_H;
      }
      geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
      return geo;
    }

    const faceGeo = makeFaceGeo();

    // 2) Front face: avatar image
    const frontTexture = new THREE.TextureLoader().load(
      "assets/avatar-card.webp",
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        container.classList.remove("is-loading");
        container.classList.add("is-ready");
      },
      undefined,
      (error) => {
        console.warn("Avatar texture failed to load:", error);
        container.classList.remove("has-gl", "is-loading");
        container.classList.add("is-fallback");
      }
    );
    const frontMesh = new THREE.Mesh(
      faceGeo,
      new THREE.MeshBasicMaterial({ map: frontTexture, toneMapped: false, side: THREE.DoubleSide })
    );
    const faceZ = CARD_DEPTH / 2 + BEVEL + 0.02;
    frontMesh.position.z = faceZ;
    cardGroup.add(frontMesh);

    // 3) Back face: links board
    const backplateTexture = createBackplateTexture();
    const backMesh = new THREE.Mesh(
      faceGeo.clone(),
      new THREE.MeshBasicMaterial({ map: backplateTexture, toneMapped: false, side: THREE.DoubleSide })
    );
    backMesh.position.z = -faceZ;
    backMesh.rotation.y = Math.PI;
    cardGroup.add(backMesh);

    // 4) Side band: scrolling "RoL1n_SrP" ticker tape around the slab edge
    function createMarqueeTexture(): THREE.CanvasTexture {
      const cvs = document.createElement("canvas");
      cvs.width = 640;
      cvs.height = 192;
      const ctx = cvs.getContext("2d");
      if (!ctx) return new THREE.CanvasTexture(cvs);

      ctx.fillStyle = "#14111f";
      ctx.fillRect(0, 0, 640, 192);

      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.font = "bold 76px monospace";
      const word = "RoL1n_SrP";
      const wordW = ctx.measureText(word).width;
      const gap = 56;
      const starW = 56;
      const unitW = wordW + gap * 2 + starW;
      const x0 = (640 - unitW) / 2;

      ctx.shadowColor = "#f75c7e";
      ctx.shadowBlur = 22;
      ctx.fillStyle = "rgba(214, 214, 224, 0.9)";
      ctx.fillText(word, x0, 100);
      ctx.fillStyle = "#f75c7e";
      ctx.font = "bold 54px monospace";
      ctx.fillText("✦", x0 + wordW + gap, 98);
      ctx.shadowBlur = 0;

      const tex = new THREE.CanvasTexture(cvs);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.RepeatWrapping;
      tex.anisotropy = 4;
      return tex;
    }

    function buildSideBand(): { geo: THREE.BufferGeometry; repeats: number } {
      const off = BEVEL + 0.02;
      const hw = halfW + off;
      const hh = halfH + off;
      const r = CARD_R + off;
      const outline = new THREE.Shape();
      outline.moveTo(-hw + r, -hh);
      outline.lineTo(hw - r, -hh);
      outline.quadraticCurveTo(hw, -hh, hw, -hh + r);
      outline.lineTo(hw, hh - r);
      outline.quadraticCurveTo(hw, hh, hw - r, hh);
      outline.lineTo(-hw + r, hh);
      outline.quadraticCurveTo(-hw, hh, -hw, hh - r);
      outline.lineTo(-hw, -hh + r);
      outline.quadraticCurveTo(-hw, -hh, -hw + r, -hh);

      const pts = outline.getPoints(48);
      const zHalf = (CARD_DEPTH + 2 * BEVEL) / 2 + 0.03;
      let total = 0;
      const segs: { a: THREE.Vector2; b: THREE.Vector2; len: number; start: number }[] = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        const b = pts[(i + 1) % pts.length];
        const len = a.distanceTo(b);
        segs.push({ a, b, len, start: total });
        total += len;
      }

      const repeats = Math.max(3, Math.round(total / 10));
      const pos: number[] = [];
      const uvs: number[] = [];
      const idx: number[] = [];
      let vi = 0;
      for (const s of segs) {
        const u0 = s.start / total;
        const u1 = (s.start + s.len) / total;
        pos.push(
          s.a.x, s.a.y, zHalf, s.a.x, s.a.y, -zHalf,
          s.b.x, s.b.y, zHalf, s.b.x, s.b.y, -zHalf
        );
        uvs.push(u0, 1, u0, 0, u1, 1, u1, 0);
        idx.push(vi, vi + 1, vi + 2, vi + 2, vi + 1, vi + 3);
        vi += 4;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(idx);
      geo.computeVertexNormals();
      return { geo, repeats };
    }

    const marqueeTex = createMarqueeTexture();
    const marqueeMat = new THREE.MeshBasicMaterial({ map: marqueeTex, toneMapped: false });
    const band = buildSideBand();
    marqueeTex.repeat.x = band.repeats;
    cardGroup.add(new THREE.Mesh(band.geo, marqueeMat));

    /* ------------------------------------------------------------
       5. Pose & Entrance
       ------------------------------------------------------------ */
    const idleRot = { x: -0.22, y: 0.45, z: 0.03 };
    const targetRot = { ...idleRot };
    const curRot = { x: idleRot.x, y: idleRot.y, z: idleRot.z };

    /* ------------------------------------------------------------
       6. Interaction: Drag Rotation, Parallax, Link Raycast
       ------------------------------------------------------------ */
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();

    let dragging = false;
    let lastX = 0,
      lastY = 0;
    let dragDistance = 0;
    let velX = 0,
      velY = 0;
    let mouseX = 0,
      mouseY = 0;

    function updateNdc(e: PointerEvent | MouseEvent) {
      const rect = cvs.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function pickLink(): LinkHitRect | null {
      const camLocal = cardGroup.worldToLocal(camera.position.clone());
      if (camLocal.z >= 0) return null;

      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObject(backMesh, false);
      if (!hits.length) return null;

      const local = backMesh.worldToLocal(hits[0].point.clone());
      const cx = ((local.x + halfW) / CARD_W) * 512;
      const cy = (1 - (local.y + halfH) / CARD_H) * 512;

      let found: LinkHitRect | null = null;
      for (const r of linkRects) {
        if (cx >= r.x && cx <= r.x + r.w && cy >= r.y && cy <= r.y + r.h) {
          found = r;
          break;
        }
      }
      return found;
    }

    function onPointerDown(e: PointerEvent) {
      dragging = true;
      dragDistance = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      try {
        cvs.setPointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    }

    function onPointerMove(e: PointerEvent) {
      updateNdc(e);
      const rect = cvs.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      pointerLight.position.x = mouseX * 22;
      pointerLight.position.y = -mouseY * 22;

      if (dragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        dragDistance += Math.abs(dx) + Math.abs(dy);

        targetRot.y += dx * 0.0075;
        targetRot.x += dy * 0.0075;
        targetRot.x = Math.max(-1.3, Math.min(1.3, targetRot.x));

        velX = Math.max(-0.25, Math.min(0.25, dx * 0.0075));
        velY = Math.max(-0.25, Math.min(0.25, dy * 0.0075));
        cvs.style.cursor = "grabbing";
      } else {
        const hit = pickLink();
        cvs.style.cursor = hit ? "pointer" : "grab";
      }
    }

    function onPointerUp(e: PointerEvent) {
      if (!dragging) return;
      dragging = false;

      if (dragDistance < 6) {
        updateNdc(e);
        const hit = pickLink();
        if (hit?.action === "wechat") {
          onOpenWeChatRef.current();
        } else if (hit?.url) {
          window.open(hit.url, "_blank", "noopener");
        }
      }
    }

    function onPointerLeave() {
      mouseX = 0;
      mouseY = 0;
      pointerLight.position.set(0, 0, 20);
      cvs.style.cursor = "grab";
    }

    cvs.addEventListener("pointerdown", onPointerDown);
    cvs.addEventListener("pointermove", onPointerMove);
    cvs.addEventListener("pointerup", onPointerUp);
    cvs.addEventListener("pointercancel", () => {
      dragging = false;
    });
    cvs.addEventListener("pointerleave", onPointerLeave);

    /* ------------------------------------------------------------
       7. Resize Handling
       ------------------------------------------------------------ */
    function resize() {
      const w = cvs.clientWidth;
      const h = cvs.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(cvs);
    resize();

    /* ------------------------------------------------------------
       8. Render Loop with Physics & Snap-settling
       ------------------------------------------------------------ */
    let animId: number;

    function tick(now: number) {
      animId = requestAnimationFrame(tick);
      const t = now * 0.001;

      if (!dragging) {
        targetRot.y += velX;
        targetRot.x += velY;
        velX *= 0.91;
        velY *= 0.91;

        const turns = Math.round((targetRot.y - idleRot.y) / Math.PI);
        const onBack = ((turns % 2) + 2) % 2 === 1;
        const restY = onBack
          ? Math.round(targetRot.y / Math.PI) * Math.PI
          : idleRot.y + Math.round((targetRot.y - idleRot.y) / (2 * Math.PI)) * 2 * Math.PI;
        const restX = onBack ? 0 : idleRot.x;
        const restZ = onBack ? 0 : idleRot.z;

        targetRot.x += (restX - targetRot.x) * 0.025;
        targetRot.y += (restY - targetRot.y) * 0.025;
        targetRot.z += (restZ - targetRot.z) * 0.025;

        const tx = targetRot.x - mouseY * 0.18 + Math.sin(t * 0.7) * 0.025;
        const ty = targetRot.y + mouseX * 0.22 + Math.cos(t * 0.5) * 0.035;

        curRot.x += (tx - curRot.x) * 0.06;
        curRot.y += (ty - curRot.y) * 0.06;
        curRot.z += (targetRot.z - curRot.z) * 0.06;
      } else {
        curRot.x += (targetRot.x - curRot.x) * 0.22;
        curRot.y += (targetRot.y - curRot.y) * 0.22;
        curRot.z += (targetRot.z - curRot.z) * 0.22;
      }

      cardGroup.position.y = Math.sin(t * 1.1) * 0.65;
      cardGroup.position.z = 2.0 + Math.cos(t * 0.9) * 0.3;

      marqueeTex.offset.x = (t * 0.32) % 1;
      const breathe = 0.5 + 0.5 * Math.sin(t * 2.6);
      const glow = 0.82 + breathe * 0.55;
      marqueeMat.color.setRGB(glow * 1.04, glow * 0.9, glow * 1.02);

      cardGroup.rotation.set(curRot.x, curRot.y, curRot.z);
      renderer.render(scene, camera);
    }

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      cvs.removeEventListener("pointerdown", onPointerDown);
      cvs.removeEventListener("pointermove", onPointerMove);
      cvs.removeEventListener("pointerup", onPointerUp);
      cvs.removeEventListener("pointerleave", onPointerLeave);
      renderer.dispose();
      bodyGeo.dispose();
      faceGeo.dispose();
      band.geo.dispose();
      frontTexture.dispose();
      backplateTexture.dispose();
      marqueeTex.dispose();
      rimMat.dispose();
      marqueeMat.dispose();
    };
  }, []);

  return (
    <div className="hero-avatar-large">
      <div
        className="pixel-avatar is-loading"
        id="pixel-avatar"
        ref={containerRef}
        role="img"
        aria-label="RoL1n_SrP 3D pixel avatar card"
      >
        <canvas className="pixel-canvas" id="pixel-canvas" ref={canvasRef} />
        <img
          className="pixel-fallback"
          src="assets/avatar-card.webp"
          alt="RoL1n_SrP pixel avatar with pink guitar"
        />
      </div>
    </div>
  );
});
