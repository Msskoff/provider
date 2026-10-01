# CLAUDE.md — Provider

Instructions pour Claude Code sur ce dépôt. À lire avant toute modification.

## Le projet

Provider est un comparateur neutre des fiduciaires, comptables agréés et experts-comptables de Casablanca (Maroc).

- **Visiteurs** (créateurs d'entreprise, dirigeants de PME) : ils décrivent leur besoin et reçoivent un classement de cabinets, avec l'explication de chaque place. Usage gratuit.
- **Cabinets** : ils créent et gèrent leur fiche. Fiche gratuite ; abonnement payant pour des outils (statistiques, rapport de visibilité IA, contenu enrichi).
- **Promesse** : rendre chaque cabinet trouvable sur Google, dans les assistants IA (ChatGPT, Gemini, Claude, Perplexity) et sur les réseaux sociaux.

Langue du site : français. L'arabe viendra plus tard ; prévoir l'internationalisation (i18n) dès le départ, sans la livrer.

Monnaie : dirham marocain. Afficher « DH » à l'écran, utiliser `MAD` dans les données structurées. Format des nombres : `fr-FR` (espace comme séparateur de milliers).

## Règles non négociables

1. **Le classement ne s'achète jamais.** Aucun champ lié au paiement (abonnement, offre, statut Pro) ne doit entrer dans le calcul du score. Toute modification de `lib/ranking` doit le prouver par un test.
2. **Publicité des experts-comptables.** L'article 17 de la loi 15-89 interdit toute publicité personnelle aux experts-comptables inscrits à l'Ordre. Conséquences :
   - pas de mise en avant payante, pas de bannière sponsorisée pour un cabinet de statut `oec` ;
   - pas de paiement au contact pour le statut `oec` tant qu'un avocat ne l'a pas validé (fonctionnalité derrière un drapeau, désactivée par défaut) ;
   - les publications sur les réseaux sociaux de la plateforme ne mettent jamais en avant un cabinet `oec` en particulier (voir « Réseaux sociaux »).
3. **Données personnelles.** Loi 09-08 et CNDP. Collecter le minimum ; consentement explicite pour les avis et les demandes de contact ; pas de données personnelles dans les URL ni dans les paramètres UTM.
4. **Pas de fausses données en production.** Les cabinets fictifs (`is_demo = true`) n'existent que dans les seeds de développement. Ne jamais générer de faux avis, faux cabinets ou faux témoignages.
5. **Statut vérifié.** Le statut (`oec`, `agree`, `fid`) n'est affiché comme vérifié qu'après contrôle manuel (`status_verified_at` non nul).

## Stack

- **Next.js** (App Router, TypeScript strict), rendu côté serveur ou statique pour toutes les pages publiques : Google et les robots d'IA doivent lire le contenu **sans exécuter de JavaScript**.
- **Supabase** : PostgreSQL + PostGIS (distances), Auth (comptes des cabinets), Storage (logos, photos).
- **Hébergement** : Vercel.
- Images Open Graph générées avec `next/og` (`ImageResponse`).
- Tests : Vitest pour la logique, Playwright pour les parcours critiques.

Commandes (à confirmer quand le dépôt est initialisé) :

```bash
npm run dev          # serveur local
npm run test         # tests unitaires
npm run test:e2e     # tests Playwright
npm run lint         # ESLint + vérification des types
npx supabase db push # appliquer les migrations
```

## Modèle de données (tables principales)

| Table | Contenu clé |
| --- | --- |
| `cabinets` | `slug`, `name`, `statut` (`oec`/`agree`/`fid`), `status_verified_at`, `quartier_id`, `location` (geography), `languages[]`, `legal_forms[]`, `response_hours`, `founded_year`, `team_size`, `sectors[]`, `description`, `is_demo` |
| `cabinet_services` | `cabinet_id`, `service` (`creation`, `compta`, `paie`, `domiciliation`, `juridique`), `price_mad`, `unit` |
| `cabinet_socials` | `cabinet_id`, `network` (`facebook`, `instagram`, `linkedin`, `tiktok`, `youtube`, `x`), `url`, `verified_at` |
| `quartiers` | `slug`, `name`, `centroid` (geography) |
| `reviews` | `cabinet_id`, `rating` (1–5), `text`, `contact_request_id` (avis lié à une vraie demande), `published_at` |
| `contact_requests` | demande de devis d'un visiteur vers un cabinet |
| `subscriptions` | offre payante d'un cabinet — **jamais lue par le moteur de classement** |
| `share_events` | partages et visites issues des réseaux (réseau, page, `utm_*`, date) |
| `social_posts` | brouillons de publications pour les comptes de la plateforme, avec statut de validation |

Toute modification de schéma passe par une migration Supabase versionnée. Activer la Row Level Security sur toutes les tables.

## Moteur de recommandation (`lib/ranking`)

Fonction pure, testée, sans accès à la base.

1. **Filtres stricts** : le cabinet propose le service, gère la forme juridique demandée, parle la langue demandée (si précisée), a le statut exigé (si précisé). Chaque exclusion renvoie sa raison en clair.
2. **Sous-scores entre 0 et 1** :
   - `prix` = `1 - (prix - min) / (max - min)` parmi les candidats ; multiplié par 0,25 si le prix dépasse le budget.
   - `proximite` = `1 - distance_km / 12`, borné à [0, 1].
   - `avis` = moyenne bayésienne `(10 × moyenne_du_site + somme_des_notes) / (10 + nb_avis)`, puis `(note - 3) / 2`, borné.
   - `reactivite` = `1 - (heures - 2) / 46`, borné.
3. **Score** = somme des `poids × sous-score` divisée par la somme des poids, × 100, arrondi. Poids par défaut : prix 3, proximité 2, avis 3, réactivité 2 ; le visiteur peut les régler de 0 à 5.
4. **Explication** : chaque résultat renvoie les deux critères qui pèsent le plus et des faits lisibles (« 2 600 DH, dans votre budget », « 1,1 km de Maârif »).

## Visibilité Google (SEO)

- URL lisibles : `/cabinets/[slug]`, `/quartiers/[slug]`, `/services/[service]`, `/services/[service]/[quartier]`, `/guides/[slug]`.
- `title` et `meta description` générés depuis la fiche ; URL canonique sur chaque page.
- `sitemap.xml` dynamique ; `robots.txt` propre.
- Données structurées JSON-LD sur chaque fiche : `AccountingService` (adresse, `geo`, `knowsLanguage`, `priceRange`, `makesOffer` en `MAD`, `aggregateRating` seulement s'il y a des avis réels), `FAQPage`, `BreadcrumbList`. Ajouter `sameAs` avec les profils sociaux vérifiés du cabinet.
- Viser de bons Core Web Vitals : images optimisées, peu de JavaScript côté client sur les pages publiques.

## Visibilité dans les IA (GEO)

- Chaque fiche commence par un paragraphe factuel généré depuis les données (statut, quartier, année, langues, formes juridiques, prix). Pas de texte marketing vague.
- FAQ générée depuis les données et régénérée à chaque modification de fiche.
- `/llms.txt` généré automatiquement : présentation du site, liste des cabinets avec un résumé d'une ligne, pages par quartier, guides.
- `robots.txt` autorise explicitement `GPTBot`, `ClaudeBot`, `PerplexityBot` et `Google-Extended`.
- Cohérence des informations : le nom, le quartier et le téléphone doivent être identiques sur la fiche, dans le JSON-LD et dans les profils sociaux liés.

## Visibilité sur les réseaux sociaux

L'objectif : quand une fiche est partagée (WhatsApp, Facebook, LinkedIn, Instagram, X), l'aperçu doit donner envie de cliquer, et chaque partage doit être mesurable. WhatsApp et Facebook sont prioritaires au Maroc.

### 1. Aperçus de liens (Open Graph)

- Sur chaque page publique : `og:title`, `og:description`, `og:url`, `og:type`, `og:image` (+ largeur, hauteur, `og:image:alt`), `og:locale` = `fr_MA`, `og:site_name`.
- Cartes X : `twitter:card` = `summary_large_image`.
- `og:image` généré dynamiquement par `next/og` pour chaque cabinet, quartier, service et guide : nom, statut, quartier, note et nombre d'avis (si réels), prix « dès ». Format 1200 × 630.
- Garder les images légères (viser moins de 300 Ko) pour que l'aperçu s'affiche bien dans WhatsApp.
- Les textes d'aperçu sont factuels. Pour un cabinet `oec`, aucune formule promotionnelle (« le meilleur », « le moins cher »).

### 2. Liens de partage

- Partage par WhatsApp (`https://wa.me/?text=`), Facebook, LinkedIn et copie du lien. Sur mobile, utiliser l'API de partage natif quand elle existe.
- Chaque lien partagé porte des paramètres `utm_source`, `utm_medium=social`, `utm_campaign`. Jamais de donnée personnelle dans ces paramètres.
- Enregistrer les visites issues des réseaux dans `share_events` pour alimenter les statistiques des cabinets.

### 3. Profils sociaux des cabinets

- Le cabinet peut lier ses comptes (`cabinet_socials`). Un lien est affiché comme vérifié seulement après contrôle (`verified_at`).
- Les profils vérifiés sont ajoutés à `sameAs` dans le JSON-LD : cela renforce la cohérence de l'entreprise pour Google et pour les IA.
- La complétude de fiche compte au moins un profil social vérifié.

### 4. Kit de partage pour les cabinets

- Pour chaque cabinet : une image carrée 1080 × 1080 et une image verticale 1080 × 1920 (stories) générées par `next/og`, plus un texte prêt à publier avec le lien de la fiche.
- Le texte se limite aux faits (services, quartier, langues, lien). Le cabinet publie lui-même ; la plateforme ne publie jamais à sa place.
- Pour un cabinet `oec`, le kit se limite à un lien informatif vers sa fiche, sans formule promotionnelle. À faire valider par un avocat avant le lancement.

### 5. Comptes sociaux de la plateforme

- Contenus à forte valeur : guides (« combien coûte une SARL-AU à Casablanca »), index des prix moyens par service et par quartier, nouveaux quartiers couverts, conseils aux créateurs.
- Les publications sont générées comme **brouillons** dans `social_posts` ; une personne les valide avant toute publication. Pas de publication automatique sans validation.
- Ne jamais mettre en avant un cabinet `oec` nommément. Les cabinets cités dans une publication le sont sur des critères publics et identiques pour tous.

## Conventions de code

- TypeScript strict ; pas de `any`.
- Logique métier dans `lib/` en fonctions pures, testées ; composants sans logique de classement.
- Accès aux données côté serveur uniquement ; clé `service_role` jamais exposée au client.
- Formats via `Intl` (`fr-FR`, `MAD`) ; aucune chaîne de prix formatée à la main.
- Libellés d'interface en français, rédigés du point de vue du visiteur.
- Chaque nouvelle page publique doit avoir : `title`, `description`, URL canonique, Open Graph, JSON-LD adapté, et une entrée dans le sitemap. Un test vérifie ces éléments.

## Ce qu'il ne faut pas faire

- Ne pas faire dépendre une page publique d'un rendu côté client pour son contenu principal.
- Ne pas bloquer les robots d'IA.
- Ne pas afficher de note agrégée sans avis réels.
- Ne pas publier sur un réseau social sans validation humaine.
- Ne pas copier de contenu (descriptions, avis) depuis d'autres annuaires.
