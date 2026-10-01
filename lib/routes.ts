/**
 * Chemins des pages publiques. Utilisés par la navigation, le sitemap et llms.txt.
 * Les libellés correspondants sont dans lib/copy.ts.
 */
export const ROUTES = {
  home: "/",
  entreprises: "/entreprises",
  clients: "/clients",
  commentCaMarche: "/comment-ca-marche",
  guides: "/guides",
  aPropos: "/a-propos",
  contact: "/contact",
  confidentialite: "/confidentialite",
  mentionsLegales: "/mentions-legales",
} as const;

export type RouteId = keyof typeof ROUTES;

/** Liens de la navigation principale (en-tête). */
export const MAIN_NAV: readonly RouteId[] = [
  "entreprises",
  "clients",
  "commentCaMarche",
  "guides",
  "aPropos",
];

/** Liens du pied de page. */
export const FOOTER_NAV: readonly RouteId[] = [
  "contact",
  "confidentialite",
  "mentionsLegales",
];
