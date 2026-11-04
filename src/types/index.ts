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
