export type Locale = "en" | "zh";

export interface ProjectTranslation {
  title: string;
  description: string;
}

export interface I18nDictionary {
  nav: {
    home: string;
    about: string;
    works: string;
    source: string;
    langToggle: string;
  };
  hero: {
    terminalUser: string;
    terminalCmd: string;
    terminalOutput: string;
    roles: string[];
    quote: string;
    actions: {
      about: string;
      works: string;
      contact: string;
    };
  };
  about: {
    title: string;
    p1_pre: string;
    p1_school: string;
    p1_mid: string;
    p1_tool: string;
    p1_post: string;
    p2_pre: string;
    p2_blog: string;
    p2_mid1: string;
    p2_guitar: string;
    p2_mid2: string;
    p2_cs2: string;
    p2_mid3: string;
    p2_mc: string;
    p2_post: string;
    p3: string;
  };
  works: {
    title: string;
    projects: Record<string, ProjectTranslation>;
  };
  socials: Record<string, string>;
  wechat: {
    scanHint: string;
  };
  footer: {
    copyright: string;
    source: string;
  };
}
