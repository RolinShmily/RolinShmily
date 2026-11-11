import React from "react";

/**
 * The paper theme's quiet shan-shui backdrop. A pale sun, layered ridges and
 * low mist sit behind the content at low contrast, so the page reads like a
 * print rather than a flat white sheet. Every wash is deliberately faint; the
 * foreground text and the card stay the focus.
 */
export const InkLandscape: React.FC = () => (
  <div id="ink-landscape" aria-hidden="true">
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMax slice"
      focusable="false"
    >
      <defs>
        <radialGradient id="inkLandscapeSky" cx="78%" cy="22%" r="76%">
          <stop offset="0" stopColor="#fffaf1" stopOpacity="0.42" />
          <stop offset="0.52" stopColor="#fbf4e8" stopOpacity="0.16" />
          <stop offset="1" stopColor="#f2ecdf" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="inkLandscapeSunHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#e5bcb3" stopOpacity="0.5" />
          <stop offset="0.42" stopColor="#ecd3c6" stopOpacity="0.24" />
          <stop offset="1" stopColor="#f2ecdf" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="inkLandscapeSunDisc" cx="42%" cy="38%" r="62%">
          <stop offset="0" stopColor="#d98f8c" stopOpacity="0.58" />
          <stop offset="0.72" stopColor="#c47a7b" stopOpacity="0.34" />
          <stop offset="1" stopColor="#b56c6f" stopOpacity="0.1" />
        </radialGradient>
        <linearGradient id="inkLandscapeFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8c887d" stopOpacity="0.25" />
          <stop offset="0.58" stopColor="#9d9789" stopOpacity="0.12" />
          <stop offset="1" stopColor="#b0a99a" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="inkLandscapeMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6f7b6d" stopOpacity="0.24" />
          <stop offset="0.55" stopColor="#8b8b7b" stopOpacity="0.12" />
          <stop offset="1" stopColor="#b3aa98" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="inkLandscapeNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5f5a50" stopOpacity="0.22" />
          <stop offset="0.5" stopColor="#7a6a5f" stopOpacity="0.1" />
          <stop offset="1" stopColor="#9d8a7a" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="inkLandscapeMist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf7ef" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fbf7ef" stopOpacity="0.58" />
          <stop offset="1" stopColor="#fbf7ef" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="inkLandscapeMistWarm" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f7efe3" stopOpacity="0" />
          <stop offset="0.45" stopColor="#f5e7dc" stopOpacity="0.46" />
          <stop offset="1" stopColor="#f7efe3" stopOpacity="0" />
        </linearGradient>
        <filter id="inkLandscapeBlurFar" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id="inkLandscapeBlurMid" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="inkLandscapeBlurNear" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id="inkLandscapeBlurMist" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="inkLandscapeBlurSun" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      {/* Warm light pooling around the pale sun */}
      <rect
        className="ink-landscape-sky"
        width="1440"
        height="900"
        fill="url(#inkLandscapeSky)"
      />

      <g className="ink-landscape-sun">
        <circle
          cx="1128"
          cy="206"
          r="150"
          fill="url(#inkLandscapeSunHalo)"
          filter="url(#inkLandscapeBlurSun)"
        />
        <circle cx="1128" cy="206" r="46" fill="url(#inkLandscapeSunDisc)" />
        <circle
          cx="1128"
          cy="206"
          r="62"
          fill="none"
          stroke="#b56c6f"
          strokeOpacity="0.13"
          strokeWidth="1"
        />
      </g>

      {/* The narrow crop on phones hides the right-hand sun, so a second,
          smaller one sits inside the visible center of the scene. */}
      <g className="ink-landscape-sun-mobile">
        <circle
          cx="842"
          cy="206"
          r="86"
          fill="url(#inkLandscapeSunHalo)"
          filter="url(#inkLandscapeBlurSun)"
        />
        <circle cx="842" cy="206" r="28" fill="url(#inkLandscapeSunDisc)" />
        <circle
          cx="842"
          cy="206"
          r="38"
          fill="none"
          stroke="#b56c6f"
          strokeOpacity="0.12"
          strokeWidth="1"
        />
      </g>

      <g
        className="ink-landscape-birds"
        fill="none"
        stroke="#4f4a42"
        strokeOpacity="0.26"
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        <path d="M1004 262 q10 -8 20 0 q10 -8 20 0" />
        <path d="M1050 236 q7 -6 14 0 q7 -6 14 0" strokeOpacity="0.19" />
        <path d="M966 292 q5 -4 10 0 q5 -4 10 0" strokeOpacity="0.15" />
      </g>

      {/* Distant ridges, then nearer ones with a little more graphite */}
      <g className="ink-landscape-far" filter="url(#inkLandscapeBlurFar)">
        <path
          d="M-60 760 C 80 720, 130 610, 230 612 C 330 614, 382 700, 470 688 C 560 676, 612 548, 710 552 C 806 556, 852 664, 946 656 C 1040 648, 1084 548, 1178 552 C 1270 556, 1308 646, 1398 636 C 1442 631, 1472 610, 1500 606 L 1500 900 L -60 900 Z"
          fill="url(#inkLandscapeFar)"
        />
        <path
          d="M-40 806 C 110 774, 190 714, 300 722 C 410 730, 466 796, 566 788 C 676 780, 736 686, 838 692 C 936 698, 992 788, 1090 782 C 1188 776, 1246 712, 1340 718 C 1408 722, 1458 752, 1490 762 L 1490 900 L -40 900 Z"
          fill="#b9b0a2"
          fillOpacity="0.14"
        />
      </g>

      <g className="ink-landscape-mid" filter="url(#inkLandscapeBlurMid)">
        <path
          d="M-50 852 C 80 820, 150 744, 260 748 C 360 752, 420 814, 522 808 C 624 802, 680 712, 782 716 C 884 720, 938 808, 1038 804 C 1138 800, 1196 728, 1296 732 C 1374 736, 1428 776, 1490 786 L 1490 900 L -50 900 Z"
          fill="url(#inkLandscapeMid)"
        />
        <path
          d="M-40 872 C 120 852, 220 800, 338 808 C 456 816, 510 866, 624 862 C 742 858, 802 802, 914 806 C 1024 810, 1082 862, 1194 858 C 1296 854, 1376 824, 1482 826 L 1482 900 L -40 900 Z"
          fill="#8b7f70"
          fillOpacity="0.09"
        />
      </g>

      <g className="ink-landscape-near" filter="url(#inkLandscapeBlurNear)">
        <path
          d="M-50 900 L -50 872 C 90 858, 220 840, 360 846 C 500 852, 590 880, 730 872 C 870 864, 970 836, 1100 842 C 1230 848, 1340 870, 1490 860 L 1490 900 Z"
          fill="url(#inkLandscapeNear)"
        />
      </g>

      {/* Mist pooling between the ranges */}
      <g className="ink-landscape-mist" filter="url(#inkLandscapeBlurMist)">
        <rect x="-80" y="700" width="1600" height="100" fill="url(#inkLandscapeMist)" opacity="0.78" />
        <rect x="-80" y="792" width="1600" height="72" fill="url(#inkLandscapeMist)" opacity="0.62" />
        <ellipse cx="360" cy="762" rx="380" ry="40" fill="url(#inkLandscapeMistWarm)" opacity="0.66" />
        <ellipse cx="1080" cy="744" rx="440" ry="36" fill="url(#inkLandscapeMistWarm)" opacity="0.52" />
      </g>

      {/* Dry-brush contours along the ridges */}
      <g
        className="ink-landscape-contours"
        fill="none"
        stroke="#5b554b"
        strokeLinecap="round"
        opacity="0.35"
      >
        <path
          d="M190 626 C 280 604, 340 618, 410 652 C 440 668, 470 686, 500 684"
          strokeWidth="1.1"
          strokeOpacity="0.22"
        />
        <path
          d="M660 576 C 720 560, 780 566, 840 606"
          strokeWidth="1"
          strokeOpacity="0.18"
        />
        <path
          d="M872 668 C 946 648, 1010 612, 1082 620 C 1138 628, 1178 662, 1244 662"
          strokeWidth="1"
          strokeOpacity="0.17"
        />
        <path
          d="M260 754 C 360 758, 430 790, 510 806"
          strokeWidth="0.9"
          strokeOpacity="0.14"
        />
        <path
          d="M360 848 C 470 846, 570 862, 660 870"
          strokeWidth="0.9"
          strokeOpacity="0.13"
        />
      </g>

      {/* A few cun-like texture strokes on the nearest ridge */}
      <g
        className="ink-landscape-contours"
        fill="none"
        stroke="#544f46"
        strokeOpacity="0.14"
        strokeWidth="1"
        strokeLinecap="round"
      >
        <path d="M560 844 q8 12 4 26" />
        <path d="M590 848 q6 10 3 22" />
        <path d="M620 852 q5 9 2 18" />
        <path d="M850 840 q7 11 4 24" />
        <path d="M880 844 q5 8 3 18" />
      </g>

      {/* Pine sprig entering from the upper-left corner */}
      <g className="ink-landscape-pine" opacity="0.46">
        <g fill="none" stroke="#465f50" strokeLinecap="round">
          <path
            d="M-30 130 C 50 148, 110 176, 190 236"
            strokeWidth="2.4"
            strokeOpacity="0.24"
          />
          <path
            d="M40 145 C 70 132, 100 128, 132 136"
            strokeWidth="1.4"
            strokeOpacity="0.22"
          />
          <path
            d="M95 178 C 124 170, 152 172, 182 188"
            strokeWidth="1.2"
            strokeOpacity="0.2"
          />
          <path
            d="M145 212 C 170 208, 192 214, 214 232"
            strokeWidth="1"
            strokeOpacity="0.17"
          />
        </g>
        <g
          fill="none"
          stroke="#4c6857"
          strokeOpacity="0.2"
          strokeWidth="0.9"
          strokeLinecap="round"
        >
          <path d="M130 136 l-6 -12 M132 136 l2 -14 M136 137 l10 -9" />
          <path d="M180 188 l-6 -11 M184 188 l4 -13 M188 190 l11 -7" />
          <path d="M212 232 l-5 -10 M216 232 l4 -12 M220 234 l10 -7" />
          <path d="M70 156 l-5 -11 M76 160 l6 -10 M108 186 l-6 -10 M114 190 l7 -9 M164 226 l-6 -9 M170 230 l7 -8" />
        </g>
      </g>

      {/* Wet ink washes behind the ridges add warmth and cool */}
      <g
        className="ink-landscape-washes"
        filter="url(#inkLandscapeBlurMist)"
        opacity="0.5"
      >
        <ellipse cx="206" cy="668" rx="210" ry="92" fill="#9b4a52" fillOpacity="0.07" />
        <ellipse cx="1240" cy="700" rx="240" ry="96" fill="#4c6857" fillOpacity="0.07" />
      </g>
    </svg>
  </div>
);
