/**
 * Identité de Provider : source unique pour le site, le JSON-LD, Open Graph,
 * llms.txt et les profils externes (Google Business Profile, réseaux sociaux).
 * Toute modification ici doit être reportée à l'identique sur ces profils.
 */

export const SOCIAL_NETWORKS = [
  "facebook",
  "instagram",
  "linkedin",
  "tiktok",
  "whatsapp",
] as const;

export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number];

const DEFAULT_SITE_URL = "http://localhost:3000";

type SiteUrlEnv = {
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
};

/**
 * URL publique du site, sans barre oblique finale.
 * Ordre : NEXT_PUBLIC_SITE_URL, puis le domaine de production Vercel, puis localhost.
 */
export function resolveSiteUrl({ env }: { env: SiteUrlEnv }): string {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const candidate = explicit
    ? explicit
    : vercel
      ? `https://${vercel}`
      : DEFAULT_SITE_URL;

  const url = new URL(candidate);
  return url.origin;
}

export const site = {
  name: "Provider",
  /** Description courte, identique partout (site, JSON-LD, profils sociaux). */
  shortDescription:
    "Plateforme en préparation pour trouver le bon prestataire et rendre les PME du Maroc visibles, tous secteurs confondus. Lancement à Casablanca.",
  url: resolveSiteUrl({
    env: {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    },
  }),
  city: "Casablanca",
  countryCode: "MA",
  countryName: "Maroc",
  /** Langue du contenu (attribut lang, JSON-LD). */
  language: "fr-MA",
  /** Locale Open Graph. */
  ogLocale: "fr_MA",
  /** À compléter : adresse email de contact affichée sur le site. */
  email: null as string | null,
  /** À compléter : URL des comptes officiels. Seules les URL renseignées sont affichées. */
  socials: {
    facebook: null,
    instagram: null,
    linkedin: null,
    tiktok: null,
    whatsapp: null,
  } as Record<SocialNetwork, string | null>,
} as const;

/** URL absolue d'un chemin du site. */
export function absoluteUrl({ path }: { path: string }): string {
  return new URL(path, `${site.url}/`).toString();
}

/** Comptes sociaux renseignés, dans l'ordre de SOCIAL_NETWORKS. */
export function listSocialProfiles({
  socials,
}: {
  socials: Record<SocialNetwork, string | null>;
}): { network: SocialNetwork; url: string }[] {
  return SOCIAL_NETWORKS.flatMap((network) => {
    const url = socials[network];
    return url ? [{ network, url }] : [];
  });
}
