# CLAUDE.md — Provider (site vitrine)

Instructions pour Claude Code sur ce dépôt. À lire avant toute modification.

## Le projet

Provider sera une plateforme qui regroupe les petites et moyennes entreprises du Maroc, **tous secteurs confondus**, en commençant par Casablanca. Elle permettra :

- aux clients (particuliers et entreprises) de trouver le bon prestataire grâce à des recommandations fondées sur des critères clairs ;
- aux entreprises de gagner en visibilité sur Google, dans les assistants IA (ChatGPT, Gemini, Claude, Perplexity) et sur les réseaux sociaux.

La plateforme elle-même n'est pas encore construite. **Ce dépôt contient uniquement le site vitrine.** Son rôle :

1. Affirmer la présence en ligne de Provider sur Google, dans les IA et sur les réseaux sociaux.
2. Expliquer le projet à deux publics : les **entreprises** qui veulent être trouvées, et les **clients** qui cherchent un prestataire.
3. Recueillir des inscriptions sur une liste d'attente (entreprises et clients intéressés).
4. Publier des guides utiles qui installent Provider comme une source fiable.

Le site vitrine ne contient **ni annuaire, ni fiches d'entreprises, ni classement, ni avis**. Ces fonctions viendront avec la plateforme.

Le site ne se limite à aucun secteur. Les exemples, illustrations et textes doivent couvrir des activités variées (artisans, commerces, services aux entreprises, restauration, santé et bien-être, formation, événementiel, BTP, etc.) sans en privilégier un.

Langue : français. L'arabe viendra plus tard ; organiser les textes pour que la traduction soit simple (pas de texte en dur dispersé dans les composants).

Monnaie : dirham marocain. Afficher « DH » à l'écran, `MAD` dans les données structurées. Format des nombres : `fr-FR`.

## Règles non négociables

1. **Aucune entreprise nommée ni classée.** Le site vitrine ne cite, ne compare et ne recommande aucune entreprise réelle. Pas de fausses entreprises, pas de faux avis, pas de faux témoignages, pas de logos de clients inventés.
2. **Aucun chiffre inventé.** Toute statistique (créations d'entreprises, usage d'internet ou de l'IA, etc.) cite sa source avec un lien et une date. Sans source, on n'écrit pas le chiffre.
3. **Le classement ne s'achète pas.** Les textes présentent Provider comme une plateforme neutre : la recommandation dépend de critères publics, jamais d'un paiement. Ne jamais promettre « être en tête des résultats » contre paiement.
4. **Professions réglementées.** Certaines professions ont des règles strictes sur la publicité (au Maroc notamment les experts-comptables, les avocats, les médecins, les notaires, les architectes). Les textes qui s'adressent aux entreprises ne promettent ni publicité ni mise en avant à ces professions ; ils parlent de présence informative et neutre. Les points précis sont à faire valider par un avocat.
5. **Données personnelles.** Loi 09-08 et CNDP. Les formulaires collectent le minimum, avec une case de consentement explicite non cochée par défaut et un lien vers la politique de confidentialité. Pas de données personnelles dans les URL ni dans les paramètres UTM.
6. **Pas de traceur sans consentement.** Mesure d'audience sans cookies de préférence (Vercel Web Analytics ou Plausible). Si un outil pose des cookies, afficher un choix « Refuser » aussi visible que « Accepter ».

## Stack

- **Next.js** (App Router, TypeScript strict), pages **statiques** (SSG) : tout le contenu est lisible sans JavaScript par Google et les robots d'IA.
- Contenu des guides en **MDX** dans `content/guides/`, avec un en-tête (frontmatter) : `title`, `description`, `date`, `updated`, `sources`.
- Formulaires : Server Actions qui écrivent dans **Supabase** (table `waitlist`) via une fonction RPC ; clé `service_role` jamais exposée au client.
- Images Open Graph générées avec `next/og`.
- Hébergement : **Vercel**.
- Tests : Vitest pour les fonctions de `lib/`, Playwright (JavaScript désactivé) pour vérifier les métadonnées des pages.

Commandes (à confirmer quand le dépôt est initialisé) :

```bash
npm run dev          # serveur local
npm run build        # build statique
npm run test         # tests unitaires
npm run test:e2e     # tests Playwright
npm run lint         # ESLint + vérification des types
```

## Pages

| Route | Rôle |
| --- | --- |
| `/` | Ce qu'est Provider, pour qui, pourquoi. Deux appels à l'action : « J'ai une entreprise » et « Je cherche un prestataire ». |
| `/entreprises` | Pour les PME de tous secteurs : la fiche gratuite, la visibilité sur Google, dans les IA et sur les réseaux sociaux, le classement qui ne s'achète pas. Formulaire de liste d'attente. |
| `/clients` | Pour les particuliers et les entreprises qui cherchent un prestataire : comment Provider les aidera à choisir (critères, informations vérifiées, avis liés à de vraies demandes). Formulaire « Prévenez-moi du lancement ». |
| `/comment-ca-marche` | Les critères de recommandation (adéquation au besoin, prix, proximité, avis, réactivité) et la règle de neutralité, expliqués simplement. |
| `/guides` et `/guides/[slug]` | Articles utiles (voir « Contenus »). |
| `/a-propos` | L'équipe, la mission, Casablanca comme point de départ. |
| `/contact` | Formulaire de contact simple ; adresse email affichée en texte sélectionnable. |
| `/confidentialite` | Politique de confidentialité (loi 09-08, CNDP). |
| `/mentions-legales` | Identité de l'éditeur, hébergeur. |

## Formulaires (liste d'attente)

Table Supabase `waitlist` : `id`, `kind` (`entreprise` ou `client`), `name`, `email`, `phone` (facultatif), `company_name` et `sector` (pour les entreprises), `need` (pour les clients : type de prestataire recherché), `city` (Casablanca par défaut), `consent_at`, `utm_source`, `utm_medium`, `utm_campaign`, `created_at`.

- Le secteur se choisit dans une liste large et ouverte (avec « Autre, précisez »), définie dans `lib/sectors.ts`.
- Écriture uniquement par une fonction RPC `join_waitlist` (SECURITY DEFINER) qui valide les champs ; RLS activée, aucune lecture publique.
- Message de confirmation clair sur la page, sans promesse de date.
- Protection anti-spam simple (champ piège caché + limite de fréquence), sans CAPTCHA tiers.

## Visibilité Google (SEO)

- Chaque page a : `title` unique, `meta description`, URL canonique, Open Graph, carte X, et une entrée dans `sitemap.xml`. Un test Playwright le vérifie.
- `robots.txt` propre, `sitemap.xml` généré au build.
- Données structurées JSON-LD :
  - sur toutes les pages : `Organization` (nom, logo, URL, `sameAs` vers les comptes sociaux officiels, `areaServed` Maroc) et `WebSite` ;
  - sur les guides : `Article` (auteur, `datePublished`, `dateModified`) et `FAQPage` si le guide contient des questions-réponses ;
  - `BreadcrumbList` sur les pages de second niveau.
- Requêtes visées en priorité : « annuaire entreprises Casablanca », « trouver un prestataire Casablanca », « référencement PME Maroc », « visibilité entreprise Google Maroc », « être cité par ChatGPT ».
- Performances : pages statiques, images optimisées (`next/image`), très peu de JavaScript côté client.

## Visibilité dans les IA (GEO)

- Textes factuels et précis : qui, quoi, où, combien, avec sources. Pas de jargon marketing vague.
- Chaque guide commence par une réponse directe en deux ou trois phrases, puis le détail.
- Sections questions-réponses dans les guides, balisées en `FAQPage`.
- `/llms.txt` généré au build : présentation de Provider, liste des pages et des guides avec un résumé d'une ligne.
- `robots.txt` autorise explicitement `GPTBot`, `ClaudeBot`, `PerplexityBot` et `Google-Extended`.
- Cohérence : le nom « Provider », la description courte et la ville sont identiques sur le site, dans le JSON-LD, sur Google Business Profile et sur les réseaux sociaux.

## Visibilité sur les réseaux sociaux

WhatsApp, Facebook, Instagram, LinkedIn et TikTok. Facebook et WhatsApp pour toucher les petites entreprises, LinkedIn pour les entreprises de services, Instagram et TikTok pour les commerces et les activités grand public.

- **Aperçus de liens** : sur chaque page, `og:title`, `og:description`, `og:url`, `og:type`, `og:image` (1200 × 630, généré par `next/og`, avec `og:image:alt`), `og:locale` = `fr_MA`, `og:site_name` = `Provider`, `twitter:card` = `summary_large_image`. Images légères (viser moins de 300 Ko) pour WhatsApp.
- **Liens de partage** sur les guides : WhatsApp, Facebook, LinkedIn, X et copie du lien, avec `utm_source`, `utm_medium=social`, `utm_campaign` (nom du guide, jamais une donnée personnelle).
- **Comptes officiels** : liens dans le pied de page et dans `sameAs` de l'`Organization`. Les URL des comptes sont centralisées dans `lib/site.ts`.
- **Visuels à publier** : pour chaque guide, une image carrée 1080 × 1080 et une image verticale 1080 × 1920 générées par `next/og`, accessibles à une route interne non indexée (`/social/[slug]/square`, `/social/[slug]/story`).
- **Publications** : rédigées comme brouillons dans `content/social/` (un fichier par publication), relues et publiées à la main. Aucune publication automatique.
- Les UTM des visites issues des réseaux sont transmises au formulaire de liste d'attente pour savoir quel réseau amène des inscriptions.

## Contenus

Guides prévus au lancement (chacun avec sources datées, utiles à tous les secteurs) :

1. Comment rendre son entreprise visible sur Google au Maroc (fiche Google Business Profile, site, avis).
2. Comment être cité par ChatGPT et les assistants IA quand on est une PME.
3. Bien présenter son activité sur les réseaux sociaux : ce qui compte pour être trouvé.
4. Comment choisir un prestataire : les critères qui comptent, quel que soit le métier.

Ton : clair, direct, du point de vue du lecteur. Phrases courtes. Pas de superlatifs (« le meilleur », « n°1 »). Pas de conseil juridique ou fiscal personnalisé : renvoyer vers un professionnel.

## Identité visuelle

Pas encore définie. En attendant : une typographie lisible, une couleur d'accent sobre, des contrastes conformes WCAG AA, thème clair et sombre. Centraliser les couleurs et polices dans des variables CSS pour pouvoir changer d'identité sans toucher aux composants. Les illustrations et photos montrent des métiers variés.

## Conventions de code

- TypeScript strict ; pas de `any`.
- Textes de l'interface regroupés dans `content/` ou `lib/copy.ts`, pas dispersés dans les composants.
- Fonctions de `lib/` pures et testées (métadonnées, JSON-LD, UTM, llms.txt).
- Formats via `Intl` (`fr-FR`).
- Accessibilité : un seul `h1` par page, ordre des titres respecté, champs de formulaire avec `label`, focus visible.

## Ce qu'il ne faut pas faire

- Ne pas créer d'annuaire, de fiche d'entreprise ou de classement dans ce dépôt.
- Ne pas nommer, comparer ou recommander une entreprise réelle.
- Ne pas centrer le discours sur un seul secteur d'activité.
- Ne pas publier de chiffre sans source.
- Ne pas faire dépendre une page du JavaScript côté client pour son contenu principal.
- Ne pas bloquer les robots d'IA.
- Ne pas publier sur un réseau social sans relecture humaine.
