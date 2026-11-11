/* ============================================================
   RoL1n_SrP 3D Avatar Card
   - Front: avatar image textured directly on the slab (no frame,
     only physical side thickness visible)
   - Back: the pencil-sketch avatar printed full-bleed on rice
     paper, with no frame or extra chrome
   - Side: scrolling ticker tape that crossfades to a paper-and-ink
     band whenever the page is in ink mode
   - Click to flip, drag to rotate; the card settles onto the nearest
     face, keeping the same posture on both sides, and reports the
     landing side so the page can open its ink-paper theme
   ============================================================ */
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { prefersReducedMotion } from "../utils/motion";

type CardSide = "front" | "back";

interface PixelAvatarProps {
  ink: boolean;
  onSideChange?: (side: CardSide) => void;
}

interface Rot {
  x: number;
  y: number;
  z: number;
}

interface CardAnim {
  start: number;
  duration: number;
  from: Rot;
  to: Rot;
  side: CardSide;
  ease: (t: number) => number;
}

const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export const PixelAvatar: React.FC<PixelAvatarProps> = React.memo(({ ink, onSideChange }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onSideChangeRef = useRef(onSideChange);
  onSideChangeRef.current = onSideChange;
  const inkRef = useRef(ink);
  inkRef.current = ink;

  useEffect(() => {
    const container = containerRef.current;
    const canvasEl = canvasRef.current;
    if (!container || !canvasEl) return;
    const cvs: HTMLCanvasElement = canvasEl;

    const makeStatic = () => {
      container.setAttribute("role", "img");
      container.removeAttribute("tabindex");
      container.setAttribute("aria-label", "RoL1n_SrP 3D avatar card");
    };

    if (prefersReducedMotion()) {
      container.classList.remove("is-loading");
      container.classList.add("is-fallback");
      makeStatic();
      return;
    }

    let disposed = false;

    /* ------------------------------------------------------------
       1. Back plate: the pencil-sketch avatar printed on rice paper
       The sketch is multiplied into a warm sheet so its white paper
       dissolves into the plate, while graphite and pencil colour stay
       readable. A hand-drawn frame and a muted vermilion seal pick up
       the red accents already present in the drawing.
       ------------------------------------------------------------ */
    function createInkBackTexture(): THREE.CanvasTexture {
      const S = 1024;
      const cvs = document.createElement("canvas");
      cvs.width = S;
      cvs.height = S;
      const ctx = cvs.getContext("2d");
      if (!ctx) return new THREE.CanvasTexture(cvs);

      const tex = new THREE.CanvasTexture(cvs);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;

      const paintPaper = () => {
        // Warm rice paper
        ctx.fillStyle = "#f4eddd";
        ctx.fillRect(0, 0, S, S);

        // Paper fibre
        for (let i = 0; i < 5200; i++) {
          const x = Math.random() * S;
          const y = Math.random() * S;
          const a = 0.012 + Math.random() * 0.05;
          ctx.fillStyle =
            Math.random() > 0.42 ? `rgba(52,47,38,${a})` : `rgba(255,255,255,${a * 1.8})`;
          const size = 0.6 + Math.random() * 1.6;
          ctx.fillRect(x, y, size, size);
        }
      };

      const paintGrain = (count: number, strength: number) => {
        for (let i = 0; i < count; i++) {
          const x = Math.random() * S;
          const y = Math.random() * S;
          const a = (0.01 + Math.random() * 0.04) * strength;
          ctx.fillStyle =
            Math.random() > 0.45 ? `rgba(48,42,34,${a})` : `rgba(255,255,255,${a * 1.6})`;
          const size = 0.6 + Math.random() * 1.5;
          ctx.fillRect(x, y, size, size);
        }
      };

      const paint = (sketch?: HTMLImageElement) => {
        ctx.clearRect(0, 0, S, S);
        paintPaper();

        if (sketch) {
          // Multiply lets the sketch's white paper dissolve into the sheet
          // while the pencil work keeps its own graphite and colour.
          ctx.save();
          ctx.globalCompositeOperation = "multiply";
          ctx.drawImage(sketch, 0, 0, S, S);
          ctx.restore();

          paintGrain(2400, 0.55);

          // A whisper of warm paper at the edges keeps the drawing printed
          // on the sheet instead of pasted onto it.
          const vg = ctx.createRadialGradient(
            S * 0.5,
            S * 0.47,
            S * 0.42,
            S * 0.5,
            S * 0.5,
            S * 0.78
          );
          vg.addColorStop(0, "rgba(244, 237, 221, 0)");
          vg.addColorStop(0.75, "rgba(244, 237, 221, 0.03)");
          vg.addColorStop(1, "rgba(244, 237, 221, 0.14)");
          ctx.fillStyle = vg;
          ctx.fillRect(0, 0, S, S);
        }

        tex.needsUpdate = true;
      };

      // Show the paper plate immediately; the drawing fades in when decoded.
      paint();
      const sketch = new Image();
      sketch.decoding = "async";
      sketch.onload = () => {
        if (!disposed) paint(sketch);
      };
      sketch.onerror = () => {
        console.warn("Back sketch failed to load; keeping the paper plate.");
      };
      sketch.src = "assets/avatars/avatar-back-sketch.webp";

      return tex;
    }

    /* ------------------------------------------------------------
       2. Three.js Scene, Frameless Card & Lighting
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
      makeStatic();
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
    const bodyMesh = new THREE.Mesh(bodyGeo, rimMat);
    cardGroup.add(bodyMesh);

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
      "assets/avatars/avatar-card.webp",
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
        makeStatic();
      }
    );
    const frontMesh = new THREE.Mesh(
      faceGeo,
      new THREE.MeshBasicMaterial({ map: frontTexture, toneMapped: false, side: THREE.DoubleSide })
    );
    const faceZ = CARD_DEPTH / 2 + BEVEL + 0.02;
    frontMesh.position.z = faceZ;
    cardGroup.add(frontMesh);

    // 3) Back face: line-art plate
    const backTexture = createInkBackTexture();
    const backMesh = new THREE.Mesh(
      faceGeo.clone(),
      new THREE.MeshBasicMaterial({ map: backTexture, toneMapped: false, side: THREE.DoubleSide })
    );
    backMesh.position.z = -faceZ;
    backMesh.rotation.y = Math.PI;
    cardGroup.add(backMesh);

    // 4) Side band: scrolling ticker tape, plus its paper-and-ink twin
    function createMarqueeTexture(inkMode: boolean): THREE.CanvasTexture {
      const cvs = document.createElement("canvas");
      cvs.width = 640;
      cvs.height = 192;
      const ctx = cvs.getContext("2d");
      if (!ctx) return new THREE.CanvasTexture(cvs);

      ctx.fillStyle = inkMode ? "#f3ecdd" : "#14111f";
      ctx.fillRect(0, 0, 640, 192);

      if (inkMode) {
        ctx.strokeStyle = "rgba(54,47,39,0.14)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 14);
        ctx.lineTo(640, 14);
        ctx.moveTo(0, 178);
        ctx.lineTo(640, 178);
        ctx.stroke();
      }

      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.font = "bold 76px monospace";
      const word = "RoL1n_SrP";
      const wordW = ctx.measureText(word).width;
      const gap = 56;
      const starW = 56;
      const unitW = wordW + gap * 2 + starW;
      const x0 = (640 - unitW) / 2;

      if (inkMode) {
        ctx.fillStyle = "rgba(36,31,26,0.92)";
        ctx.fillText(word, x0, 100);
        ctx.fillStyle = "rgba(154,74,78,0.92)";
        ctx.font = "bold 54px monospace";
        ctx.fillText("✦", x0 + wordW + gap, 98);
      } else {
        ctx.shadowColor = "#f75c7e";
        ctx.shadowBlur = 22;
        ctx.fillStyle = "rgba(214, 214, 224, 0.9)";
        ctx.fillText(word, x0, 100);
        ctx.fillStyle = "#f75c7e";
        ctx.font = "bold 54px monospace";
        ctx.fillText("✦", x0 + wordW + gap, 98);
        ctx.shadowBlur = 0;
      }

      const tex = new THREE.CanvasTexture(cvs);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.RepeatWrapping;
      tex.anisotropy = 4;
      return tex;
    }

    function buildSideBand(extraOffset = 0.02): { geo: THREE.BufferGeometry; repeats: number } {
      const off = BEVEL + extraOffset;
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
        pos.push(s.a.x, s.a.y, zHalf, s.a.x, s.a.y, -zHalf, s.b.x, s.b.y, zHalf, s.b.x, s.b.y, -zHalf);
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

    const marqueeTex = createMarqueeTexture(false);
    const inkMarqueeTex = createMarqueeTexture(true);
    const marqueeMat = new THREE.MeshBasicMaterial({ map: marqueeTex, toneMapped: false });
    const inkMarqueeMat = new THREE.MeshBasicMaterial({
      map: inkMarqueeTex,
      toneMapped: false,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const band = buildSideBand();
    const inkBand = buildSideBand(0.07);
    marqueeTex.repeat.x = band.repeats;
    inkMarqueeTex.repeat.x = inkBand.repeats;
    cardGroup.add(new THREE.Mesh(band.geo, marqueeMat));
    const inkBandMesh = new THREE.Mesh(inkBand.geo, inkMarqueeMat);
    inkBandMesh.visible = false;
    cardGroup.add(inkBandMesh);

    /* ------------------------------------------------------------
       5. Pose & Ink Palette
       ------------------------------------------------------------ */
    const idleRot = { x: -0.22, y: 0.45, z: 0.03 };
    const targetRot: Rot = { ...idleRot };
    const curRot: Rot = { ...idleRot };

    const rimDark = new THREE.Color(0x14111f);
    // In the paper theme the rim is the card's own white edge, not a dark
    // frame: it should melt into the page and let the sketch carry the shape.
    const rimInk = new THREE.Color(0xfaf5ec);
    const pinkLight = new THREE.Color(0xf75c7e);
    const neutralLight = new THREE.Color(0xf6ecdb);
    const violetLight = new THREE.Color(0x9d4edd);
    const inkViolet = new THREE.Color(0x8a857b);
    const cyanLight = new THREE.Color(0x00f0ff);

    let settledSide: CardSide = "front";
    let dragging = false;
    let mode: "idle" | "drag" | "anim" = "idle";
    let anim: CardAnim | null = null;
    let inkMix = 0;
    let dragDistance = 0;
    let lastX = 0;
    let lastY = 0;
    let mouseX = 0;
    let mouseY = 0;

    // Rest poses differ by exactly π on Y, so both faces keep the same
    // tilt and screen position; only the facing direction changes.
    function restPose(side: CardSide, fromY: number): Rot {
      const base = idleRot.y + (side === "back" ? Math.PI : 0);
      const turns = Math.round((fromY - base) / (Math.PI * 2));
      return { x: idleRot.x, y: base + turns * Math.PI * 2, z: idleRot.z };
    }

    function nearestSide(y: number): CardSide {
      const d = (((y - idleRot.y) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      return d > Math.PI / 2 && d < (Math.PI * 3) / 2 ? "back" : "front";
    }

    function startAnim(side: CardSide, duration: number, ease: (t: number) => number) {
      const from: Rot = { ...curRot };
      const to = restPose(side, from.y);
      anim = { start: performance.now(), duration, from, to, side, ease };
      mode = "anim";
    }

    /* ------------------------------------------------------------
       6. Interaction: Click-to-flip, drag rotation, keyboard flip
       ------------------------------------------------------------ */
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();

    function updateNdc(e: PointerEvent | MouseEvent) {
      const rect = cvs.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function overCard(): boolean {
      raycaster.setFromCamera(ndc, camera);
      return raycaster.intersectObject(bodyMesh, false).length > 0;
    }

    function flipOpposite() {
      const current = nearestSide(curRot.y);
      startAnim(current === "front" ? "back" : "front", 720, easeInOutCubic);
    }

    function onPointerDown(e: PointerEvent) {
      dragging = true;
      mode = "drag";
      anim = null;
      dragDistance = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      targetRot.x = curRot.x;
      targetRot.y = curRot.y;
      targetRot.z = curRot.z;
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
        cvs.style.cursor = "grabbing";
      } else {
        cvs.style.cursor = overCard() ? "grab" : "default";
      }
    }

    function onPointerUp(e: PointerEvent) {
      if (!dragging) return;
      dragging = false;
      cvs.style.cursor = "grab";

      if (dragDistance < 6) {
        updateNdc(e);
        if (overCard()) {
          flipOpposite();
          return;
        }
      }

      startAnim(nearestSide(curRot.y), 560, easeOutCubic);
    }

    function onPointerCancel() {
      if (!dragging) return;
      dragging = false;
      startAnim(nearestSide(curRot.y), 460, easeOutCubic);
    }

    function onPointerLeave() {
      mouseX = 0;
      mouseY = 0;
      pointerLight.position.set(0, 0, 20);
      if (!dragging) cvs.style.cursor = "default";
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      if (dragging) return;
      flipOpposite();
    }

    cvs.addEventListener("pointerdown", onPointerDown);
    cvs.addEventListener("pointermove", onPointerMove);
    cvs.addEventListener("pointerup", onPointerUp);
    cvs.addEventListener("pointercancel", onPointerCancel);
    cvs.addEventListener("pointerleave", onPointerLeave);
    container.addEventListener("keydown", onKeyDown);

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
       8. Render Loop: eased flips, idle parallax, ink crossfade
       ------------------------------------------------------------ */
    let animId: number;

    function tick(now: number) {
      animId = requestAnimationFrame(tick);
      const t = now * 0.001;

      if (mode === "anim" && anim) {
        const p = Math.min(Math.max((now - anim.start) / anim.duration, 0), 1);
        const e = anim.ease(p);
        curRot.x = anim.from.x + (anim.to.x - anim.from.x) * e;
        curRot.y = anim.from.y + (anim.to.y - anim.from.y) * e;
        curRot.z = anim.from.z + (anim.to.z - anim.from.z) * e;

        if (p >= 1) {
          curRot.x = anim.to.x;
          curRot.y = anim.to.y;
          curRot.z = anim.to.z;
          targetRot.x = anim.to.x;
          targetRot.y = anim.to.y;
          targetRot.z = anim.to.z;
          const landed = anim.side;
          anim = null;
          mode = "idle";
          if (landed !== settledSide) {
            settledSide = landed;
            onSideChangeRef.current?.(landed);
          }
        }
      } else if (mode === "drag" || dragging) {
        curRot.x += (targetRot.x - curRot.x) * 0.22;
        curRot.y += (targetRot.y - curRot.y) * 0.22;
        curRot.z += (targetRot.z - curRot.z) * 0.22;
      } else {
        const rest = restPose(settledSide, curRot.y);
        const tx = rest.x - mouseY * 0.12 + Math.sin(t * 0.7) * 0.02;
        const ty = rest.y + mouseX * 0.16 + Math.cos(t * 0.5) * 0.03;
        curRot.x += (tx - curRot.x) * 0.06;
        curRot.y += (ty - curRot.y) * 0.06;
        curRot.z += (rest.z - curRot.z) * 0.06;
      }

      cardGroup.position.y = Math.sin(t * 1.1) * 0.65;
      cardGroup.position.z = 2.0 + Math.cos(t * 0.9) * 0.3;

      // Ink crossfade: rim, lights and the side band all move together.
      const inkTarget = inkRef.current ? 1 : 0;
      inkMix += (inkTarget - inkMix) * 0.085;
      if (Math.abs(inkTarget - inkMix) < 0.002) inkMix = inkTarget;

      rimMat.color.copy(rimDark).lerp(rimInk, inkMix);
      rimMat.metalness = 0.7 + (0.02 - 0.7) * inkMix;
      rimMat.roughness = 0.35 + (0.92 - 0.35) * inkMix;

      rimKeyLight.color.copy(pinkLight).lerp(neutralLight, inkMix);
      rimKeyLight.intensity = 1.8 + (1.4 - 1.8) * inkMix;
      violetRimLight.color.copy(violetLight).lerp(inkViolet, inkMix);
      violetRimLight.intensity = 2.0 + (1.2 - 2.0) * inkMix;
      pointerLight.color.copy(cyanLight).lerp(neutralLight, inkMix);
      pointerLight.intensity = 1.5 + (1.05 - 1.5) * inkMix;
      renderer.toneMappingExposure = 1.1 + (1.18 - 1.1) * inkMix;

      marqueeTex.offset.x = (t * 0.32) % 1;
      inkMarqueeTex.offset.x = (t * 0.32) % 1;
      inkBandMesh.visible = inkMix > 0.001;
      inkMarqueeMat.opacity = inkMix;

      const breathe = 0.5 + 0.5 * Math.sin(t * 2.6);
      const glow = 0.82 + breathe * 0.55;
      const cr = glow * 1.04;
      const cg = glow * 0.9;
      const cb = glow * 1.02;
      const nr = glow * 0.97;
      const ng = glow * 0.96;
      const nb = glow * 0.93;
      marqueeMat.color.setRGB(
        cr + (nr - cr) * inkMix,
        cg + (ng - cg) * inkMix,
        cb + (nb - cb) * inkMix
      );
      inkMarqueeMat.color.setRGB(1, 1, 1);

      cardGroup.rotation.set(curRot.x, curRot.y, curRot.z);
      renderer.render(scene, camera);
    }

    animId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      cvs.removeEventListener("pointerdown", onPointerDown);
      cvs.removeEventListener("pointermove", onPointerMove);
      cvs.removeEventListener("pointerup", onPointerUp);
      cvs.removeEventListener("pointercancel", onPointerCancel);
      cvs.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("keydown", onKeyDown);
      renderer.dispose();
      bodyGeo.dispose();
      faceGeo.dispose();
      backMesh.geometry.dispose();
      band.geo.dispose();
      inkBand.geo.dispose();
      frontTexture.dispose();
      backTexture.dispose();
      marqueeTex.dispose();
      inkMarqueeTex.dispose();
      rimMat.dispose();
      marqueeMat.dispose();
      inkMarqueeMat.dispose();
    };
  }, []);

  return (
    <div className="hero-avatar-large">
      <div
        className="pixel-avatar is-loading"
        id="pixel-avatar"
        ref={containerRef}
        role="button"
        tabIndex={0}
        aria-label="RoL1n_SrP 3D avatar card — click or press Enter to flip"
      >
        <canvas className="pixel-canvas" id="pixel-canvas" ref={canvasRef} />
        <img
          className="pixel-fallback"
          src="assets/avatars/avatar-card.webp"
          alt="RoL1n_SrP pixel avatar with pink guitar"
        />
      </div>
    </div>
  );
});
