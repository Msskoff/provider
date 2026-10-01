import type { RouteId } from "@/lib/routes";
import type { SocialNetwork } from "@/lib/site";

/**
 * Textes de l'interface. Regroupés ici pour préparer la traduction en arabe :
 * les composants n'écrivent aucun texte en dur.
 */
export const copy = {
  layout: {
    skipLink: "Aller au contenu",
    homeLinkLabel: "Provider, retour à l'accueil",
    mainNavLabel: "Navigation principale",
    footerNavLabel: "Informations",
    socialNavLabel: "Provider sur les réseaux sociaux",
    location: "Casablanca, Maroc",
  },
  routes: {
    home: "Accueil",
    entreprises: "Entreprises",
    clients: "Clients",
    commentCaMarche: "Comment ça marche",
    guides: "Guides",
    aPropos: "À propos",
    contact: "Contact",
    confidentialite: "Confidentialité",
    mentionsLegales: "Mentions légales",
  } satisfies Record<RouteId, string>,
  socials: {
    facebook: "Facebook",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    tiktok: "TikTok",
    whatsapp: "WhatsApp",
  } satisfies Record<SocialNetwork, string>,
} as const;
