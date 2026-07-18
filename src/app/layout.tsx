import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Footer } from "@/components/ui/Footer";
import { SiteChrome } from "@/components/ui/SiteChrome";
import { getSeo } from "@/lib/data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const seo = getSeo();

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: {
    default: seo.defaultTitle,
    template: seo.titleTemplate,
  },
  description: seo.defaultDescription,
  verification: seo.gscVerification ? { google: seo.gscVerification } : undefined,
  openGraph: {
    type: "website",
    siteName: seo.siteName,
    title: seo.defaultTitle,
    description: seo.defaultDescription,
    url: seo.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    site: seo.twitterHandle,
    creator: seo.twitterHandle,
    title: seo.defaultTitle,
    description: seo.defaultDescription,
  },
  alternates: {
    canonical: seo.siteUrl,
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Somen Biswas",
  url: seo.siteUrl,
  jobTitle: "Solo AI Builder & Founder",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kolkata",
    addressRegion: "West Bengal",
    addressCountry: "IN",
  },
  sameAs: [
    "https://x.com/somen_2k",
    "https://www.instagram.com/somen.biswas.910/",
    "https://www.youtube.com/@CareerGrowthRemotely",
    "https://linkedin.com/in/somen-biswas-410727215",
    "https://github.com/somen2k0",
  ],
  worksFor: [
    { "@type": "Organization", name: "NexGuild", url: "https://nexguild.in" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="ambient-bg" aria-hidden="true" />
        <div className="noise-overlay" />
        <SiteChrome footer={<Footer />}>{children}</SiteChrome>
        {seo.ga4Id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${seo.ga4Id}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${seo.ga4Id}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
