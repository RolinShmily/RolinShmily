import { SocialLink } from "../types";

/**
 * Full social link roster, including temporarily hidden platforms.
 *
 * To hide a platform, set `hidden: true` on its entry. All of its resources
 * (sprite symbol in SvgSprite.tsx, `.social-<id>` styles in index.css,
 * `t.socials.<id>` translations) stay in place, so re-enabling is a one-flag flip.
 *
 * Currently hidden: DouYin (`douyin`).
 */
const ALL_SOCIAL_LINKS: SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    url: "https://github.com/RolinShmily",
    iconType: "symbol",
    iconHref: "#icon-github",
    ariaLabel: "GitHub: RolinShmily",
  },
  {
    id: "steam",
    label: "Steam",
    url: "https://steamcommunity.com/profiles/76561199516828933/",
    iconType: "symbol",
    iconHref: "#icon-steam",
    ariaLabel: "Steam: RoL1n",
  },
  {
    id: "bilibili",
    label: "Bilibili",
    url: "https://space.bilibili.com/422744280",
    iconType: "symbol",
    iconHref: "#icon-bilibili",
    ariaLabel: "Bilibili: RoL1n_SrP",
  },
  {
    id: "douyin",
    label: "DouYin",
    url: "https://www.douyin.com/user/MS4wLjABAAAAo7eM2TrNX4lzekpyIIorhn-fs4GzMpkY7OUQzzGjjXup0nMk6PGqNqHFa4FnY2O_",
    iconType: "symbol",
    iconHref: "#icon-douyin",
    ariaLabel: "DouYin",
    hidden: true,
  },
  {
    id: "x",
    label: "X",
    url: "https://x.com/SrP9601",
    iconType: "symbol",
    iconHref: "#icon-x",
    ariaLabel: "X (Twitter): @SrP9601",
  },
  {
    id: "xiaoheihe",
    label: "Heybox",
    url: "https://www.xiaoheihe.cn/app/user/profile/58982380",
    iconType: "symbol",
    iconHref: "#icon-xiaoheihe",
    ariaLabel: "Xiaoheihe: RoL1n",
  },
  {
    id: "wechat",
    label: "WeChat",
    action: "wechat",
    iconType: "symbol",
    iconHref: "#icon-wechat",
    ariaLabel: "Open WeChat Official Account QR code",
  },
  {
    id: "afdian",
    label: "Afdian",
    url: "https://afdian.com/a/srprolin",
    iconType: "symbol",
    iconHref: "#icon-afdian",
    ariaLabel: "Afdian: srprolin",
  },
];

/** Visible social links, consumed by Hero and Footer. */
export const SOCIAL_LINKS: SocialLink[] = ALL_SOCIAL_LINKS.filter((link) => !link.hidden);
