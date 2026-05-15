import type { HeadProps } from "@type/index.type";


export default function Head({
  title = 'My App',
  description = 'A React application',
  keywords = 'react, vite, app',
  author = '',
  viewport = 'width=device-width, initial-scale=1.0',
  charset = 'UTF-8',
  canonicalUrl = '',
  robots = 'index, follow',
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  noIndex = false,
  themeColor = '#000000',
  favicon = '/favicon.ico',
  metaTags = [],
  linkTags = [],
}: HeadProps) {
  return (
    <>
      {/* Basic Meta Tags */}
      <meta charSet={charset} />
      <meta name="viewport" content={viewport} />
      
      {/* Title */}
      <title>{title}</title>
      
      {/* SEO Meta Tags */}
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content={robots} />
      )}
      
      {/* Theme Color */}
      <meta name="theme-color" content={themeColor} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Favicon */}
      {favicon && <link rel="icon" type="image/x-icon" href={favicon} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content={ogType} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:site_name" content={title} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle || title} />
      <meta name="twitter:description" content={twitterDescription || description} />
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
      
      {/* Additional Custom Meta Tags */}
      {metaTags.map((tag, index) => {
        if (tag.property) {
          return <meta key={index} property={tag.property} content={tag.content} />;
        }
        return <meta key={index} name={tag.name} content={tag.content} />;
      })}
      
      {/* Additional Custom Link Tags */}
      {linkTags.map((tag, index) => (
        <link
          key={index}
          rel={tag.rel}
          href={tag.href}
          as={tag.as}
          type={tag.type}
          sizes={tag.sizes}
        />
      ))}
    </>
  );
}