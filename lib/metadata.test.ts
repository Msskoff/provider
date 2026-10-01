import { describe, expect, it } from "vitest";

import { buildMetadata, formatTitle } from "@/lib/metadata";
import { site } from "@/lib/site";

describe("formatTitle", () => {
  it("ajoute le nom du site après le titre de la page", () => {
    expect(formatTitle({ title: "Entreprises" })).toBe("Entreprises | Provider");
  });

  it("renvoie le nom du site seul sans titre", () => {
    expect(formatTitle({})).toBe("Provider");
  });
});

describe("buildMetadata", () => {
  const metadata = buildMetadata({
    title: "Entreprises",
    description: "Description de test.",
    path: "/entreprises",
  });

  it("fixe un titre absolu et la description", () => {
    expect(metadata.title).toEqual({ absolute: "Entreprises | Provider" });
    expect(metadata.description).toBe("Description de test.");
  });

  it("fixe une URL canonique absolue", () => {
    expect(metadata.alternates?.canonical).toBe(`${site.url}/entreprises`);
  });

  it("remplit Open Graph avec la locale fr_MA et le nom du site", () => {
    expect(metadata.openGraph).toMatchObject({
      title: "Entreprises | Provider",
      description: "Description de test.",
      url: `${site.url}/entreprises`,
      type: "website",
      locale: "fr_MA",
      siteName: "Provider",
    });
  });

  it("utilise une grande carte X", () => {
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("indexe la page par défaut", () => {
    expect(metadata.robots).toBeUndefined();
  });

  it("exclut des moteurs les pages internes", () => {
    const internal = buildMetadata({
      description: "Visuel interne.",
      path: "/social/test/square",
      noIndex: true,
    });
    expect(internal.robots).toEqual({ index: false, follow: false });
  });

  it("accepte le type article pour les guides", () => {
    const guide = buildMetadata({
      title: "Guide",
      description: "Un guide.",
      path: "/guides/exemple",
      type: "article",
    });
    expect(guide.openGraph).toMatchObject({ type: "article" });
  });
});
