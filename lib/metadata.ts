import type { Metadata } from "next";

import { absoluteUrl, site } from "@/lib/site";

type BuildMetadataParams = {
  /** Titre propre à la page, sans le nom du site. Ignoré pour l'accueil si absent. */
  title?: string;
  description: string;
  /** Chemin de la page, ex. "/entreprises". */
  path: string;
  /** "article" pour les guides, "website" sinon. */
  type?: "website" | "article";
  /** Pages internes (visuels sociaux, etc.) à exclure des moteurs. */
  noIndex?: boolean;
};

/** Titre complet : « Titre | Provider », ou « Provider » seul. */
export function formatTitle({ title }: { title?: string }): string {
  return title ? `${title} | ${site.name}` : site.name;
}

/**
 * Métadonnées d'une page : title, description, URL canonique, Open Graph et carte X.
 * Les images Open Graph sont fournies par les fichiers opengraph-image de Next.
 */
export function buildMetadata({
  title,
  description,
  path,
  type = "website",
  noIndex = false,
}: BuildMetadataParams): Metadata {
  const fullTitle = formatTitle({ title });
  const url = absoluteUrl({ path });

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      type,
      locale: site.ogLocale,
      siteName: site.name,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
