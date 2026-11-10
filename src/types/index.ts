export interface SocialLink {
  id: string;
  label: string;
  url?: string;
  action?: "wechat";
  color?: string;
  iconType: "symbol" | "svg-file";
  iconHref?: string;
  iconSrc?: string;
  ariaLabel?: string;
  /**
   * Temporarily hidden from all UI surfaces.
   * Config, icon sprite, CSS and i18n strings are kept, so flipping this
   * back to `false` (or removing it) re-enables the link without other edits.
   */
  hidden?: boolean;
}

export interface ProjectCardData {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  alt: string;
}

export interface BackplateLink {
  label: string;
  url?: string;
  action?: "wechat";
  color?: string;
  vb?: number;
  d?: string;
  iconSrc?: string;
}
