/* ============================================================
   RoL1n_SrP 3D Avatar Card
   - Front: avatar image textured directly on the slab (no frame,
     only physical side thickness visible)
   - Back: link backplate with site/social icons + labels (clickable)
   - Floats natively over the page background (transparent canvas),
     free 3D drag rotation, hover parallax, idle breathing motion
   ============================================================ */
import * as THREE from "./vendor/three.module.min.js";

(() => {
  const container = document.getElementById("pixel-avatar");
  const canvas = document.getElementById("pixel-canvas");
  if (!container || !canvas) return;

  /* ------------------------------------------------------------
     1. Link definitions (shared by backplate painter & raycast)
     ------------------------------------------------------------ */
  const LINKS = [
    { label: "BloG",     url: "https://blog.srprolin.top",  color: "#f75c7e", vb: 640,
      d: "M288 88C288 74.7 298.7 64 312 64C457.8 64 576 182.2 576 328C576 341.3 565.3 352 552 352C538.7 352 528 341.3 528 328C528 208.7 431.3 112 312 112C298.7 112 288 101.3 288 88zM144 160C170.5 160 192 181.5 192 208L192 432C192 458.5 213.5 480 240 480C266.5 480 288 458.5 288 432C288 405.5 266.5 384 240 384C231.2 384 224 376.8 224 368L224 304C224 295.2 231.2 288 240 288C319.5 288 384 352.5 384 432C384 511.5 319.5 576 240 576C160.5 576 96 511.5 96 432L96 208C96 181.5 117.5 160 144 160zM312 160C404.8 160 480 235.2 480 328C480 341.3 469.3 352 456 352C442.7 352 432 341.3 432 328C432 261.7 378.3 208 312 208C298.7 208 288 197.3 288 184C288 170.7 298.7 160 312 160z" },
    { label: "Lov3",     url: "https://love.srprolin.top/", color: "#ff8fab", vb: 640,
      d: "M333.4 66.9C329.2 65 324.7 64 320 64C315.3 64 310.8 65 306.6 66.9L118.3 146.8C96.3 156.1 79.9 177.8 80 204C80.5 303.2 121.3 484.7 293.6 567.2C310.3 575.2 329.7 575.2 346.4 567.2C518.8 484.7 559.6 303.2 560 204C560.1 177.8 543.7 156.1 521.7 146.8L333.4 66.9zM313.6 247.5L320 256L326.4 247.5C337.5 232.7 354.9 224 373.3 224C405.7 224 432 250.3 432 282.7L432 288C432 337.1 366.2 386.1 335.5 406.3C326 412.5 314 412.5 304.6 406.3C273.9 386.1 208.1 337 208.1 288L208.1 282.7C208.1 250.3 234.4 224 266.8 224C285.3 224 302.7 232.7 313.7 247.5z" },
    { label: "Sheet",    url: "https://sheet.srprolin.top", color: "#00f0ff", vb: 640,
      d: "M529 71C519.6 61.6 504.4 61.6 495.1 71L447 119C444.6 121.4 442.7 124.3 441.5 127.5L426.1 168.5L348.6 246.1C303.5 216.7 249.3 215.9 217.6 247.7C206.6 258.7 199.6 272.3 196.2 287.3C192.5 303.9 177.1 318 160.1 318.9C134.5 320.2 110.8 329.6 92.8 347.5C48 392.3 56.4 473.3 111.5 528.4C166.6 583.5 247.6 592 292.4 547.2C310.3 529.3 319.8 505.5 321 479.9C321.9 462.9 336 447.6 352.6 443.8C367.6 440.4 381.2 433.3 392.2 422.4C424 390.6 423.2 336.5 393.8 291.4L471.4 213.8L512.4 198.4C515.6 197.2 518.5 195.3 520.9 192.9L568.9 144.9C578.3 135.5 578.3 120.3 568.9 111L529 71zM272 320C298.5 320 320 341.5 320 368C320 394.5 298.5 416 272 416C245.5 416 224 394.5 224 368C224 341.5 245.5 320 272 320z" },
    { label: "QQ",       url: "https://qm.qq.com/q/4eC5AuM0hi", color: "#12b7f5", vb: 640,
      d: "M530.1 484.4C518.6 485.8 485.2 431.7 485.2 431.7C485.2 463 469.1 503.9 434.2 533.5C451 538.7 489 552.7 480 567.9C472.7 580.2 354.5 575.8 320.4 571.9C286.3 575.7 168.1 580.2 160.8 567.9C151.8 552.7 189.7 538.7 206.6 533.5C171.7 504 155.5 463.1 155.5 431.7C155.5 431.7 122.2 485.8 110.6 484.4C105.2 483.8 98.2 454.8 119.9 384.7C130.2 351.7 141.9 324.2 160 278.9C156.9 162 205.2 63.9 320.3 63.9C434 63.9 483.5 160 480.6 278.9C498.7 324.1 510.5 351.8 520.7 384.7C542.5 454.8 535.4 483.8 530 484.4z" },
    { label: "GitHub",   url: "https://github.com/RolinShmily", color: "#e6edf3", vb: 640,
      d: "M237.9 461.4C237.9 463.4 235.6 465 232.7 465C229.4 465.3 227.1 463.7 227.1 461.4C227.1 459.4 229.4 457.8 232.3 457.8C235.3 457.5 237.9 459.1 237.9 461.4zM206.8 456.9C206.1 458.9 208.1 461.2 211.1 461.8C213.7 462.8 216.7 461.8 217.3 459.8C217.9 457.8 216 455.5 213 454.6C210.4 453.9 207.5 454.9 206.8 456.9zM251 455.2C248.1 455.9 246.1 457.8 246.4 460.1C246.7 462.1 249.3 463.4 252.3 462.7C255.2 462 257.2 460.1 256.9 458.1C256.6 456.2 253.9 454.9 251 455.2zM316.8 72C178.1 72 72 177.3 72 316C72 426.9 141.8 521.8 241.5 555.2C254.3 557.5 258.8 549.6 258.8 543.1C258.8 536.9 258.5 502.7 258.5 481.7C258.5 481.7 188.5 496.7 173.8 451.9C173.8 451.9 162.4 422.8 146 415.3C146 415.3 123.1 399.6 147.6 399.9C147.6 399.9 172.5 401.9 186.2 425.7C208.1 464.3 244.8 453.2 259.1 446.6C261.4 430.6 267.9 419.5 275.1 412.9C219.2 406.7 162.8 398.6 162.8 302.4C162.8 274.9 170.4 261.1 186.4 243.5C183.8 237 175.3 210.2 189 175.6C209.9 169.1 258 202.6 258 202.6C278 197 299.5 194.1 320.8 194.1C342.1 194.1 363.6 197 383.6 202.6C383.6 202.6 431.7 169 452.6 175.6C466.3 210.3 457.8 237 455.2 243.5C471.2 261.2 481 275 481 302.4C481 398.9 422.1 406.6 366.2 412.9C375.4 420.8 383.2 435.8 383.2 459.3C383.2 493 382.9 534.7 382.9 542.9C382.9 549.4 387.5 557.3 400.2 555C500.2 521.8 568 426.9 568 316C568 177.3 455.5 72 316.8 72z" },
    { label: "Steam",    url: "https://steamcommunity.com/profiles/76561199516828933/", color: "#66c0f4", vb: 640,
      d: "M568 320C568 457 456.8 568 319.6 568C205.8 568 110 491.7 80.6 387.6L175.8 426.9C182.2 459 210.7 483.3 244.7 483.3C283.9 483.3 316.6 450.9 314.9 409.8L399.4 349.6C451.5 350.9 495.2 308.7 495.2 256.1C495.2 204.5 453.2 162.6 401.5 162.6C349.8 162.6 307.8 204.6 307.8 256.1L307.8 257.3L248.6 343C233.1 342.1 217.9 346.4 205.1 355.1L72 300.1C82.2 172.4 189.1 72 319.6 72C456.8 72 568 183 568 320zM227.7 448.3L197.2 435.7C202.8 447.3 212.5 456.5 224.4 461.5C251.3 472.7 282.2 459.9 293.4 433.1C298.8 420.1 298.9 405.8 293.5 392.8C288.1 379.8 278 369.6 265 364.2C252.1 358.8 238.3 359 226.1 363.6L257.6 376.6C277.4 384.8 286.8 407.5 278.5 427.3C270.2 447.2 247.5 456.5 227.7 448.3zM401.5 193.8C435.9 193.8 463.8 221.7 463.8 256.1C463.8 290.5 435.9 318.4 401.5 318.4C367.1 318.4 339.2 290.5 339.2 256.1C339.2 221.7 367.1 193.8 401.5 193.8zM401.6 302.8C427.4 302.8 448.4 281.8 448.4 256C448.4 230.2 427.4 209.2 401.6 209.2C375.8 209.2 354.8 230.2 354.8 256C354.8 281.8 375.8 302.8 401.6 302.8z" },
    { label: "抖音",     url: "https://www.douyin.com/user/MS4wLjABAAAAo7eM2TrNX4lzekpyIIorhn-fs4GzMpkY7OUQzzGjjXup0nMk6PGqNqHFa4FnY2O_", color: "#25f4ee", vb: 640,
      d: "M544.5 273.9C500.5 274 457.5 260.3 421.7 234.7L421.7 413.4C421.7 446.5 411.6 478.8 392.7 506C373.8 533.2 347.1 554 316.1 565.6C285.1 577.2 251.3 579.1 219.2 570.9C187.1 562.7 158.3 545 136.5 520.1C114.7 495.2 101.2 464.1 97.5 431.2C93.8 398.3 100.4 365.1 116.1 336C131.8 306.9 156.1 283.3 185.7 268.3C215.3 253.3 248.6 247.8 281.4 252.3L281.4 342.2C266.4 337.5 250.3 337.6 235.4 342.6C220.5 347.6 207.5 357.2 198.4 369.9C189.3 382.6 184.4 398 184.5 413.8C184.6 429.6 189.7 444.8 199 457.5C208.3 470.2 221.4 479.6 236.4 484.4C251.4 489.2 267.5 489.2 282.4 484.3C297.3 479.4 310.4 469.9 319.6 457.2C328.8 444.5 333.8 429.1 333.8 413.4L333.8 64L421.8 64C421.7 71.4 422.4 78.9 423.7 86.2C426.8 102.5 433.1 118.1 442.4 131.9C451.7 145.7 463.7 157.5 477.6 166.5C497.5 179.6 520.8 186.6 544.6 186.6L544.6 274z" },
    { label: "Bilibili", url: "https://space.bilibili.com/422744280", color: "#00a1d6", vb: 24,
      d: "M4.977 3.561a1.31 1.31 0 111.818-1.884l2.828 2.728c.08.078.149.163.205.254h4.277a1.32 1.32 0 01.205-.254l2.828-2.728a1.31 1.31 0 011.818 1.884L17.82 4.66h.848A5.333 5.333 0 0124 9.992v7.34a5.333 5.333 0 01-5.333 5.334H5.333A5.333 5.333 0 010 17.333V9.992a5.333 5.333 0 015.333-5.333h.781L4.977 3.56zm.356 3.67a2.667 2.667 0 00-2.666 2.667v7.529a2.667 2.667 0 002.666 2.666h13.334a2.667 2.667 0 002.666-2.666v-7.53a2.667 2.667 0 00-2.666-2.666H5.333zm1.334 5.192a1.333 1.333 0 112.666 0v1.192a1.333 1.333 0 11-2.666 0v-1.192zM16 11.09c-.736 0-1.333.597-1.333 1.333v1.192a1.333 1.333 0 102.666 0v-1.192c0-.736-.597-1.333-1.333-1.333z" },
  ];

  // Hit rects in backplate canvas space (filled after layout computation)
  const linkRects = [];

  /* ------------------------------------------------------------
     2. Backplate: Links Board (icons + labels, clickable)
     ------------------------------------------------------------ */
  function createBackplateTexture() {
    const S = 512;
    const cvs = document.createElement("canvas");
    cvs.width = S;
    cvs.height = S;
    const ctx = cvs.getContext("2d");
    linkRects.length = 0;

    // Obsidian base
    ctx.fillStyle = "#0d0b1a";
    ctx.fillRect(0, 0, S, S);

    // Faint tech grid
    ctx.strokeStyle = "rgba(124, 58, 237, 0.10)";
    ctx.lineWidth = 1;
    for (let x = 32; x < S; x += 32) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, S); ctx.stroke();
    }
    for (let y = 32; y < S; y += 32) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(S, y); ctx.stroke();
    }

    // Corner brackets (cyber pink)
    const m = 26, bl = 24;
    ctx.strokeStyle = "rgba(247, 92, 126, 0.55)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(m, m + bl); ctx.lineTo(m, m); ctx.lineTo(m + bl, m);
    ctx.moveTo(S - m - bl, m); ctx.lineTo(S - m, m); ctx.lineTo(S - m, m + bl);
    ctx.moveTo(m, S - m - bl); ctx.lineTo(m, S - m); ctx.lineTo(m + bl, S - m);
    ctx.moveTo(S - m - bl, S - m); ctx.lineTo(S - m, S - m); ctx.lineTo(S - m, S - m - bl);
    ctx.stroke();

    // Header
    ctx.textAlign = "center";
    ctx.font = "bold 32px monospace";
    try { ctx.letterSpacing = "3px"; } catch { /* older canvas */ }
    ctx.fillStyle = "#ffffff";
    ctx.fillText("RoL1n_SrP", S / 2, 102);
    try { ctx.letterSpacing = "0px"; } catch { /* older canvas */ }

    /* Two-column link grid: 4 rows x 2 cols, centered */
    const CELL_W = 190;
    const CELL_H = 58;
    const GAP_X = 16;
    const GAP_Y = 14;
    const gridW = CELL_W * 2 + GAP_X;              // 396
    const gridH = CELL_H * 4 + GAP_Y * 3;          // 274
    const gridX = (S - gridW) / 2;                 // 58
    const gridY = 150;
    const iconSize = 28;
    const padX = 16;

    LINKS.forEach((link, i) => {
      const col = i < 4 ? 0 : 1; // left: personal sites + QQ, right: socials
      const row = i % 4;
      const cellX = gridX + col * (CELL_W + GAP_X);
      const cellY = gridY + row * (CELL_H + GAP_Y);

      // Hit rect (canvas space)
      linkRects.push({ x: cellX, y: cellY, w: CELL_W, h: CELL_H, url: link.url, label: link.label });

      // Row capsule
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.beginPath();
      ctx.roundRect(cellX, cellY, CELL_W, CELL_H, 12);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Icon vertically centered (SVG path via Path2D, scaled from viewBox)
      const iconY = cellY + (CELL_H - iconSize) / 2;
      const path = new Path2D(link.d);
      ctx.save();
      ctx.translate(cellX + padX, iconY);
      ctx.scale(iconSize / link.vb, iconSize / link.vb);
      ctx.fillStyle = link.color;
      ctx.fill(path);
      ctx.restore();

      // Label vertically centered
      ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
      ctx.font = "600 18px monospace";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(link.label, cellX + padX + iconSize + 12, cellY + CELL_H / 2 + 1);
      ctx.textBaseline = "alphabetic";
    });

    const tex = new THREE.CanvasTexture(cvs);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }

  /* ------------------------------------------------------------
     3. Three.js Scene, Frameless Card & Lighting
     ------------------------------------------------------------ */
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
  } catch (e) {
    console.warn("WebGL not supported:", e);
    return;
  }

  container.classList.add("has-gl");
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 150);
  camera.position.set(0, 0, 66); // far enough that the card diagonal never clips at any rotation

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
  dirLight.position.set(18, 22, 28);
  scene.add(dirLight);

  // Accent rim light (cyber pink) to accentuate side thickness
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

  /* --- Card Geometry: image covers the entire front (frameless) --- */
  const CARD_W = 23;
  const CARD_H = 23;
  const CARD_R = 2.4;      // Corner radius
  const CARD_DEPTH = 1.5;  // Physical thickness (visible on the sides only)
  const BEVEL = 0.12;      // Tiny bevel: reads as a card edge, not a frame

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

  // 1) Extruded body (thickness only)
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

  // UV-mapped rounded-rect face geometry
  function makeFaceGeo() {
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

  // 2) Front face: avatar image covering the whole face (frameless)
  const frontTexture = new THREE.TextureLoader().load(
    "assets/avatar.jpg",
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
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
  function createMarqueeTexture() {
    const cvs = document.createElement("canvas");
    cvs.width = 640;
    cvs.height = 192;
    const ctx = cvs.getContext("2d");
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

    // Bake a soft pink halo so the pulses read as glow, not flicker
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

  function buildSideBand() {
    // Outline offset outward past the bevel so the band fully covers the slab rim
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
    const segs = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      const len = a.distanceTo(b);
      segs.push({ a, b, len, start: total });
      total += len;
    }

    // Integer repeat count so the tape seams perfectly when scrolling
    const repeats = Math.max(3, Math.round(total / 10));
    const pos = [];
    const uvs = [];
    const idx = [];
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
  let downX = 0, downY = 0, lastX = 0, lastY = 0;
  let dragDistance = 0;
  let velX = 0, velY = 0;
  let mouseX = 0, mouseY = 0;

  function updateNdc(e) {
    const rect = canvas.getBoundingClientRect();
    ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  // Returns hit link or null (only when the back face is toward camera)
  function pickLink() {
    // Determine which face is toward the viewer geometrically:
    // camera z in card-local space > 0 → front; < 0 → back
    const camLocal = cardGroup.worldToLocal(camera.position.clone());
    if (camLocal.z >= 0) return null;

    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObject(backMesh, false);
    if (!hits.length) return null;

    // Map world hit point into the back plane's local space, then to
    // canvas pixels (rendering is not mirrored visually)
    const local = backMesh.worldToLocal(hits[0].point.clone());
    const cx = ((local.x + halfW) / CARD_W) * 512;
    const cy = (1 - (local.y + halfH) / CARD_H) * 512;

    let found = null;
    for (const r of linkRects) {
      if (cx >= r.x && cx <= r.x + r.w && cy >= r.y && cy <= r.y + r.h) {
        found = r;
        break;
      }
    }
    return found;
  }

  function onPointerDown(e) {
    dragging = true;
    dragDistance = 0;
    downX = lastX = e.clientX;
    downY = lastY = e.clientY;
    try { canvas.setPointerCapture(e.pointerId); } catch { /* noop */ }
  }

  function onPointerMove(e) {
    updateNdc(e);
    const rect = canvas.getBoundingClientRect();
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
      canvas.style.cursor = "grabbing";
    } else {
      // Hover feedback over back-face links
      const hit = pickLink();
      canvas.style.cursor = hit ? "pointer" : "grab";
    }
  }

  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;

    // Treat as click if barely moved
    if (dragDistance < 6) {
      updateNdc(e);
      const hit = pickLink();
      if (hit) window.open(hit.url, "_blank", "noopener");
    }
  }

  function onPointerLeave() {
    mouseX = 0;
    mouseY = 0;
    pointerLight.position.set(0, 0, 20);
    canvas.style.cursor = "grab";
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", () => { dragging = false; });
  canvas.addEventListener("pointerleave", onPointerLeave);

  /* ------------------------------------------------------------
     7. Resize Handling
     ------------------------------------------------------------ */
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  /* ------------------------------------------------------------
     8. Render Loop
     ------------------------------------------------------------ */
  function tick(now) {
    requestAnimationFrame(tick);

    const t = now * 0.001;

    if (!dragging) {
      // Momentum decay
      targetRot.y += velX;
      targetRot.x += velY;
      velX *= 0.91;
      velY *= 0.91;

      // Settle at the NEAREST half-turn from idle: front keeps the idle
      // perspective, a flip past 90° squares up to the back (so links
      // face the viewer straight-on and stay readable/clickable)
      const turns = Math.round((targetRot.y - idleRot.y) / Math.PI);
      const onBack = ((turns % 2) + 2) % 2 === 1;
      const restY = onBack
        ? Math.round(targetRot.y / Math.PI) * Math.PI
        : idleRot.y + Math.round((targetRot.y - idleRot.y) / (2 * Math.PI)) * 2 * Math.PI;
      const restX = onBack ? 0 : idleRot.x;
      const restZ = onBack ? 0 : idleRot.z;

      // Spring pull toward resting pose
      targetRot.x += (restX - targetRot.x) * 0.025;
      targetRot.y += (restY - targetRot.y) * 0.025;
      targetRot.z += (restZ - targetRot.z) * 0.025;

      // Mouse parallax
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

    // Idle breathing motion
    cardGroup.position.y = Math.sin(t * 1.1) * 0.65;
    cardGroup.position.z = 2.0 + Math.cos(t * 0.9) * 0.3;

    // Scroll the side ticker tape + breathing glow pulse
    marqueeTex.offset.x = (t * 0.32) % 1;
    const breathe = 0.5 + 0.5 * Math.sin(t * 2.6);
    const glow = 0.82 + breathe * 0.55; // 0.82 → 1.37 brightness sweep
    marqueeMat.color.setRGB(glow * 1.04, glow * 0.9, glow * 1.02);

    cardGroup.rotation.set(curRot.x, curRot.y, curRot.z);
    renderer.render(scene, camera);
  }

  requestAnimationFrame(tick);
})();
