import { describe, expect, it } from "vitest";

import {
  absoluteUrl,
  listSocialProfiles,
  resolveSiteUrl,
  site,
} from "@/lib/site";

describe("resolveSiteUrl", () => {
  it("utilise NEXT_PUBLIC_SITE_URL en priorité, sans barre oblique finale", () => {
    expect(
      resolveSiteUrl({
        env: {
          NEXT_PUBLIC_SITE_URL: "https://provider.ma/",
          VERCEL_PROJECT_PRODUCTION_URL: "provider.vercel.app",
        },
      }),
    ).toBe("https://provider.ma");
  });

  it("se rabat sur le domaine de production Vercel, en https", () => {
    expect(
      resolveSiteUrl({
        env: { VERCEL_PROJECT_PRODUCTION_URL: "provider.vercel.app" },
      }),
    ).toBe("https://provider.vercel.app");
  });

  it("utilise localhost sans configuration", () => {
    expect(resolveSiteUrl({ env: {} })).toBe("http://localhost:3000");
  });

  it("ignore une valeur vide", () => {
    expect(resolveSiteUrl({ env: { NEXT_PUBLIC_SITE_URL: "  " } })).toBe(
      "http://localhost:3000",
    );
  });

  it("refuse une URL invalide", () => {
    expect(() =>
      resolveSiteUrl({ env: { NEXT_PUBLIC_SITE_URL: "pas une url" } }),
    ).toThrow();
  });
});

describe("absoluteUrl", () => {
  it("construit une URL absolue à partir d'un chemin", () => {
    expect(absoluteUrl({ path: "/entreprises" })).toBe(
      `${site.url}/entreprises`,
    );
    expect(absoluteUrl({ path: "/" })).toBe(`${site.url}/`);
  });
});

describe("listSocialProfiles", () => {
  it("ne garde que les comptes renseignés, dans l'ordre défini", () => {
    expect(
      listSocialProfiles({
        socials: {
          facebook: null,
          instagram: "https://instagram.com/exemple",
          linkedin: "https://linkedin.com/company/exemple",
          tiktok: null,
          whatsapp: null,
        },
      }),
    ).toEqual([
      { network: "instagram", url: "https://instagram.com/exemple" },
      { network: "linkedin", url: "https://linkedin.com/company/exemple" },
    ]);
  });
});
