import { Helmet } from "react-helmet-async";

const SITE_NAME = "MyCreditFICO";
const DEFAULT_DESCRIPTION =
  "Monitor all 3 bureau credit scores in real time, get AI-powered insights, and build your path to financial freedom.";
const DEFAULT_IMAGE = "/og-image.png"; // place a 1200×630 image in /public/

interface PageHeadProps {
  /** Page title — will be rendered as "{title} | MyCreditFICO". Omit for homepage. */
  title?: string;
  /** Override the meta description. Falls back to DEFAULT_DESCRIPTION. */
  description?: string;
  /** Override the OG/Twitter share image URL. */
  image?: string;
  /** Canonical URL for the page (e.g. "https://creditiq.app/dashboard"). */
  canonical?: string;
  /** Set to "noindex,nofollow" for auth/private pages. */
  robots?: string;
  /** BCP-47 locale string e.g. "en_US", "es_MX", "fr_FR". */
  locale?: string;
  /** Additional structured data JSON-LD object. */
  jsonLd?: Record<string, unknown>;
}

/**
 * PageHead — drop-in <head> manager for every page.
 *
 * Usage:
 *   <PageHead title="Dashboard" description="Your credit overview" robots="noindex" />
 */
export default function PageHead({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  canonical,
  robots = "index,follow",
  locale = "en_US",
  jsonLd,
}: PageHeadProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const resolvedImage = image.startsWith("http")
    ? image
    : `https://creditiq.app${image}`;

  return (
    <Helmet>
      {/* ── Primary ── */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* ── Open Graph ── */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={locale} />
      {canonical && <meta property="og:url" content={canonical} />}

      {/* ── Twitter / X ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@creditiq" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedImage} />

      {/* ── Theme ── */}
      <meta name="theme-color" content="#070B18" />
      <meta name="msapplication-TileColor" content="#4F46E5" />

      {/* ── Structured data ── */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
