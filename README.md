# REW4RDS by TAKATAK

**App ID Clover (production) :** `239362NZSVFSC`
**Développeur :** TAKATAK (compte développeur Clover 9KJ25ATT15TTW)
**État au portail :** brouillon (draft) — rien de soumis.
**Dépôt :** takatakca/REW4RD

## Ce que fait l'app

Cartes-cadeaux complètes : vente à la caisse et sur le site du marchand (la vente web devient une vraie commande Clover), échange comme mode de paiement (partiel accepté), recharges, registre au niveau du groupe de marchands, rapports de passif pour 4CCOUNTING. Loi du Québec : aucune expiration, aucuns frais d'inactivité. (Nom du package local : REW4RD.)

## Paliers (doctrine de prix de Matt, 2026-10-28)

Chaque app a SES propres paliers. Base = le nécessaire essentiel · Premium = plus d'avantages · VIP = le full kit, tout ce que Clover offre pour la catégorie.

- **Base 50 $/mois** — vente de cartes physiques et numériques (code + QR) depuis une commande Clover ; activation à la vente ; échange partiel comme tender personnalisé à la caisse ; solde par code/QR.
- **Premium 100 $/mois** — + vente sur le site du marchand via Ecommerce (la vente devient une commande Clover) ; échange à la borne et au checkout web ; recharges partout ; solde par téléphone (même client que LOY4LTY).
- **VIP 150 $/mois** — full kit : registre de groupe multi-succursales complet ; rapports de passif en continu vers 4CCOUNTING ; option d'arrimage à l'API Cartes-cadeaux Clover pour les marchands au programme Clover Gift Cards ; cartes promo pilotées par M4RKETING.

Prix facturés via les plans d'abonnement du Clover App Market (à créer au portail — voir DEPLOY.md).

## Permissions Clover visées

Orders R/W · Payments R/W (tender) · Customers R/W · Merchant R ; Ecommerce pour la vente web

## Structure

- `docs/listing/` — fiche marketplace (description FR/EN) et textes légaux, depuis le package de soumission local (`~/workspace/clover-apps/`)
- `app/api/clover/` — points d'entrée webhook + OAuth (scaffold, même patron que Food Hub)
- `lib/clover/config.ts` — configuration par variables d'environnement (aucun secret dans le code)
- `config/app.config.json` — identité de l'app et paliers
- `DEPLOY.md` — ce qui reste à faire, étape par étape, pour la vague portail

## Le système unique TAKATAK

Cette application fait partie de la suite TAKATAK sur Clover : toutes les apps partagent le même dos d'événements (webhooks Clover), le même **client unique reconnu par son numéro de téléphone** (+ courriel), et les mêmes commandes et paiements Clover. Aucune app ne vit en silo : les données qu'elle produit alimentent les autres apps de la suite (voir « Clover API — Main Stuff — Robot Notepad », section 3, déposé au Drive Opérations et dans `~/workspace/clover-apps/`).


## État du code (2026-10-28)

Application Next.js 16 qui fonctionne (tests verts, build OK). Mise en ligne : `DEPLOY.md` § 5.

**Ce qui marche :**
- **Commun (kit Suite TAKATAK, identique dans les 9 apps)** : connexion Clover OAuth v2 (jetons scellés, rafraîchis
  seuls, supprimés à la désinstallation) · webhook Clover (vérification, X-Clover-Auth, chaque événement une fois) ·
  base PostgreSQL (ou mémoire en dev) · session marchand · paliers Base / Premium / VIP lus depuis la facturation
  Clover (`OWN_MERCHANTS` = VIP) · marchand `RNVTBYMCKXEJ1` en lecture seule · lien Suite TAKATAK avec Food Hub ·
  page d'accueil FR/EN, tableau de bord `/app`, pages légales `/legal/*`, `/api/health`, `/api/cron`, clés d'appareils.
- **Tableau de bord premium (2026-10-29, kit commun)** : menu latéral avec sous-menus (les écrans de cette app,
  Suite TAKATAK, Mon compte, Aide) · Mon compte → Profil, Forfait et facturation, Actions autorisées, Appareils,
  Paiements et dépôts, Sécurité et données (export JSON), Journal d'activité · rôle Clover de la personne (propriétaire,
  administrateur, gérant, employé) vérifié par le serveur pour chaque action sensible, et noté au journal · sélecteur
  des 9 apps de la suite (annuaire Food Hub) · version mobile. Comment tout s'emboîte : `docs/SUITE_KIT.md`.
- Cartes-cadeaux : code de 16 caractères (seul son empreinte SHA-256 est gardée), vente 5 $–1000 $, échange partiel,
  recharges, solde, registre de chaque mouvement, passif total
- Loi du Québec : aucune date d'expiration, aucuns frais d'inactivité
- Mode de paiement Clover « Carte-cadeau REW4RDS » créé à la connexion du marchand ; deux échanges simultanés ne
  peuvent pas dépenser le même solde

**Ce qui reste :**
- Vente web via Ecommerce Clover (Premium), arrimage à l'API Cartes-cadeaux Clover (VIP), QR imprimé.

**Développer :** `npm install` · `npm run dev` · `npm run typecheck` · `npm test` · `npm run build`. Règles pour
les agents : `AGENTS.md` ; journal : `WORKLOG.md`.
