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

