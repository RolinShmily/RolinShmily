import { I18nDictionary } from "../types";

export const en: I18nDictionary = {
  nav: {
    home: "Home",
    about: "About",
    works: "Works",
    source: "Source",
    langToggle: "Switch to Chinese",
  },
  hero: {
    terminalUser: "user@srprolin",
    terminalCmd: "whoami",
    terminalOutput: "RoL1n_SrP",
    roles: ["#DevOps", "#Gamer", "#Guitarist"],
    quote: '"Entities should not be multiplied unnecessarily."',
    actions: {
      about: "About",
      works: "Works",
      contact: "Get in touch",
    },
  },
  about: {
    title: "About Me",
    p1_pre: "Hey, I'm RoL1n — an electronic info undergrad at ",
    p1_school: "HAUT",
    p1_mid: ". I spend most of my time on Windows + WSL, always leaning into Linux and the open-web world. Fueled by genuine curiosity, I build with TypeScript and Python alongside ",
    p1_tool: "pi-coding-agent",
    p1_post: ", just trying to understand computers and everything built on top of them.",
    p2_pre: "When I step away from code, my downtime is pretty simple: writing tech notes and thoughts on ",
    p2_blog: "SrP-BloG",
    p2_mid1: ", strumming the ",
    p2_guitar: "guitar",
    p2_mid2: ", clicking heads in ",
    p2_cs2: "CS2",
    p2_mid3: ", or just chilling in ",
    p2_mc: "Minecraft",
    p2_post: ".",
    p3: "Right now, I'm mostly keeping my head down to prepare for postgraduate entrance exams — tackling this next milestone while steadily building things I genuinely care about.",
  },
  works: {
    title: "Works",
    projects: {
      "pi-kit": {
        title: "pi-kit",
        description: "Modular extensions, prompt templates & skills for Pi Coding Agent (@rol1n/pi-kit)",
      },
      "srp-blog": {
        title: "SrP-BloG",
        description: "Personal tech blog sharing hands-on guides across Linux, DevOps, networking & web development",
      },
      "srp-cfg": {
        title: "SrP-CFG_ForCS2",
        description: "Modular CS2 CFG Runtime, Desktop Installer & Searchable Knowledge Base",
      },
      "sekiro-mod-manager": {
        title: "Sekiro Mod Manager",
        description: "Zero-copy NTFS mod deployment, conflict resolution & portable mod packs for Sekiro",
      },
      "srp-img": {
        title: "SrP-IMG",
        description: "Full-featured multi-category random image API & modern waterfall gallery on Cloudflare Pages/Workers",
      },
      "porter-workflow": {
        title: "porter-workflow",
        description: "Bilingual video localization with Whisper & FFmpeg — CLI, MCP, WebUI & Agent Skill",
      },
      "20-fruit-recognition": {
        title: "20-Fruit_Recognition_System",
        description: "Deep Learning-Based 20-Fruit Classification with ResNet18 + CBAM Attention",
      },
    },
  },
  socials: {
    wechat: "WeChat",
    github: "GitHub",
    steam: "Steam",
    douyin: "DouYin",
    bilibili: "Bilibili",
    afdian: "Afdian",
    xiaoheihe: "Heybox",
  },
  wechat: {
    scanHint: "scan to follow",
  },
  footer: {
    copyright: "Copyright © 2024-2026 RoL1n_SrP",
    source: "Source",
  },
};
