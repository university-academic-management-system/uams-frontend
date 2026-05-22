// components/header.tsx
export interface HeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  viewport?: string;
  charset?: string;
  canonicalUrl?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noIndex?: boolean;
  themeColor?: string;
  favicon?: string;
  metaTags?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
  linkTags?: Array<{
    rel: string;
    href: string;
    as?: string;
    type?: string;
    sizes?: string;
  }>;
}
