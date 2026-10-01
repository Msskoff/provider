import { absoluteUrl, listSocialProfiles, site } from "@/lib/site";

/** Nœud JSON-LD (schema.org), sans @context : celui-ci est ajouté par jsonLdDocument. */
export type JsonLdNode = {
  "@type": string;
  "@id"?: string;
  [key: string]: unknown;
};

export type JsonLdDocument = {
  "@context": "https://schema.org";
  "@graph": JsonLdNode[];
};

export const ORGANIZATION_ID = `${site.url}/#organization`;
export const WEBSITE_ID = `${site.url}/#website`;

/** Organization : présente sur toutes les pages. */
export function organizationJsonLd(): JsonLdNode {
  const sameAs = listSocialProfiles({ socials: site.socials }).map(
    (profile) => profile.url,
  );

  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: site.name,
    url: absoluteUrl({ path: "/" }),
    description: site.shortDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressCountry: site.countryCode,
    },
    areaServed: { "@type": "Country", name: site.countryName },
    ...(site.email ? { email: site.email } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/** WebSite : présent sur toutes les pages. */
export function websiteJsonLd(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    url: absoluteUrl({ path: "/" }),
    description: site.shortDescription,
    inLanguage: site.language,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** Regroupe plusieurs nœuds dans un seul document @graph. */
export function jsonLdDocument({
  nodes,
}: {
  nodes: JsonLdNode[];
}): JsonLdDocument {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/**
 * Sérialise pour une balise <script type="application/ld+json">.
 * Échappe « < », « > » et « & » pour qu'aucun contenu ne puisse fermer la balise.
 */
export function serializeJsonLd({ data }: { data: JsonLdDocument }): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
