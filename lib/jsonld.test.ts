import { describe, expect, it } from "vitest";

import {
  ORGANIZATION_ID,
  jsonLdDocument,
  organizationJsonLd,
  serializeJsonLd,
  websiteJsonLd,
} from "@/lib/jsonld";
import { site } from "@/lib/site";

describe("organizationJsonLd", () => {
  const organization = organizationJsonLd();

  it("décrit Provider avec le nom, l'URL et la description courte du site", () => {
    expect(organization).toMatchObject({
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Provider",
      url: `${site.url}/`,
      description: site.shortDescription,
    });
  });

  it("indique Casablanca et le Maroc comme zone desservie", () => {
    expect(organization.address).toEqual({
      "@type": "PostalAddress",
      addressLocality: "Casablanca",
      addressCountry: "MA",
    });
    expect(organization.areaServed).toEqual({
      "@type": "Country",
      name: "Maroc",
    });
  });

  it("n'ajoute sameAs que si des comptes sociaux sont renseignés", () => {
    const hasSocials = Object.values(site.socials).some(Boolean);
    expect("sameAs" in organization).toBe(hasSocials);
  });
});

describe("websiteJsonLd", () => {
  it("relie le site à l'organisation et précise la langue", () => {
    expect(websiteJsonLd()).toMatchObject({
      "@type": "WebSite",
      name: "Provider",
      inLanguage: "fr-MA",
      publisher: { "@id": ORGANIZATION_ID },
    });
  });
});

describe("serializeJsonLd", () => {
  it("produit un document @graph valide", () => {
    const data = jsonLdDocument({ nodes: [websiteJsonLd()] });
    const parsed: unknown = JSON.parse(serializeJsonLd({ data }));
    expect(parsed).toEqual(data);
  });

  it("empêche un contenu de fermer la balise script", () => {
    const data = jsonLdDocument({
      nodes: [{ "@type": "Thing", name: "</script><script>alert(1)</script>" }],
    });
    const serialized = serializeJsonLd({ data });
    expect(serialized).not.toContain("</script");
    expect(serialized).not.toContain("<");
    const parsed = JSON.parse(serialized) as { "@graph": { name: string }[] };
    expect(parsed["@graph"][0]?.name).toBe(
      "</script><script>alert(1)</script>",
    );
  });
});
