import type { Metadata, Viewport } from "next";

import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { copy } from "@/lib/copy";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

import "./globals.css";

const MAIN_CONTENT_ID = "contenu";

const defaultMetadata = buildMetadata({
  description: site.shortDescription,
  path: "/",
});

/**
 * Valeurs par défaut ; chaque page les remplace par les siennes via buildMetadata.
 * Pas d'URL canonique ici : héritée, elle ferait pointer toute page sans
 * métadonnées propres (404 comprise) vers l'accueil.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  title: defaultMetadata.title,
  description: defaultMetadata.description,
  openGraph: { ...defaultMetadata.openGraph, url: undefined },
  twitter: defaultMetadata.twitter,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111417" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.language}>
      <body>
        <a className="skip-link" href={`#${MAIN_CONTENT_ID}`}>
          {copy.layout.skipLink}
        </a>
        <SiteHeader />
        <main id={MAIN_CONTENT_ID}>{children}</main>
        <SiteFooter />
        <JsonLd nodes={[organizationJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
