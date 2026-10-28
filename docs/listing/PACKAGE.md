# PACKAGE DE SOUMISSION — REW4RD by TAKATAK

**Application :** REW4RD by TAKATAK
**Développeur :** TAKATAK (TAKATAK Marketing, Montréal, Québec, Canada)
**Contact soutien :** takatak.ca@gmail.com · +1 450-999-4999
**État du package :** Brouillon local préparé le 2026-10-26 — rien n'est publié ni soumis.
**Documents liés :** `legal/politique-confidentialite.md`, `legal/privacy-policy.md`, `legal/conditions-utilisation.md`, `legal/terms.md`, `video-script.md`
**Positionnement :** application de cartes-cadeaux pour marchands Clover — vente au comptoir et sur le site du marchand, échange comme mode de paiement, registre maison. Textes, code et visuels 100 % TAKATAK. REW4RD se branche sur le même hub que Fidélité Reward (voir `~/workspace/clover-apps/loyalty/SPEC-INTEGRATION-SITE-CLOVER.md`) : le site vend, Clover encaisse et échange, un seul client reconnu par son numéro de téléphone.

---

## Nom de l'application (fiche marketplace)

**REW4RD by TAKATAK**

## Accroche (tagline)

FR : « Cartes-cadeaux vendues à la caisse et sur votre site, échangeables partout chez vous — sans frais d'expiration, conformes au Québec. »
EN : "Gift cards sold at your counter and on your website, redeemable everywhere you do business — no expiry, Québec-compliant."

## Description complète

### FR

REW4RD by TAKATAK donne à votre commerce un programme de cartes-cadeaux complet, branché sur Clover et sur votre propre site web.

**Vendues là où vos clients sont**
- À la caisse : vendez une carte physique ou numérique directement depuis votre commande Clover, payable comme n'importe quel achat.
- Sur votre site : la vente passe par votre checkout habituel et devient une vraie commande Clover dans votre système — pas un système parallèle.
- Cartes **numériques** livrées par courriel avec code + code QR, et cartes **physiques** avec code et QR imprimés, activées au moment de la vente.

**Échangées comme de l'argent — chez vous seulement**
- La carte devient un mode de paiement : à la caisse, à la borne et au checkout de votre site.
- Échange **partiel** accepté : le solde restant demeure sur la carte, au cent près.
- Solde insuffisant ? Le client paie le reste par un autre mode, sur la même commande.
- Recharges en tout temps, à la caisse ou sur le site.

**Un solde qui suit le client, pas la succursale**
- Le registre des cartes est tenu au niveau de votre groupe : une carte achetée dans un emplacement s'échange dans tous vos emplacements participants.
- Solde consultable par code, par scan du QR ou par numéro de téléphone lorsque la carte est rattachée au client (même client unique que Fidélité Reward).

**La vue comptable que votre comptable va aimer**
- En tout temps : cartes vendues, montants échangés, et **passif en circulation** (les soldes dus à vos clients), par emplacement et par période.
- Exports prêts pour votre comptabilité — ces chiffres alimentent **4CCOUNTING by TAKATAK**.

**Conçu pour le Québec**
- Aucune date d'expiration et aucun frais d'inactivité sur les cartes vendues aux consommateurs — c'est la loi au Québec, et REW4RD l'applique par défaut (détails à la section « Droit du Québec »).
- Interface en français d'abord, anglais complet. Données traitées selon la Loi 25 ; TAKATAK ne vend aucune donnée et ne l'utilise pas à des fins publicitaires.

### EN

REW4RD by TAKATAK gives your business a complete gift card program, connected to Clover and to your own website.

**Sold wherever your customers are**
- At the counter: sell a physical or digital card right from your Clover order, paid like any other purchase.
- On your website: the sale flows through your usual checkout and becomes a real Clover order in your system — not a parallel system.
- **Digital** cards delivered by email with a code + QR code, and **physical** cards with a printed code and QR, activated at the moment of sale.

**Redeemed like money — at your business only**
- The card becomes a payment method: at the counter, at the kiosk, and at your website checkout.
- **Partial** redemption supported: the remaining balance stays on the card, to the cent.
- Balance too small? The customer pays the rest with another tender, on the same order.
- Reloads any time, at the counter or on the website.

**A balance that follows the customer, not the branch**
- The card ledger is kept at your group level: a card bought at one location redeems at all your participating locations.
- Balance checkable by code, by QR scan, or by phone number when the card is linked to the customer (the same unique customer as Fidélité Reward).

**The accounting view your accountant will love**
- At any time: cards sold, amounts redeemed, and **outstanding liability** (the balances you owe your customers), by location and by period.
- Exports ready for your books — these numbers feed **4CCOUNTING by TAKATAK**.

**Built for Québec**
- No expiry date and no inactivity fees on consumer gift cards — that is the law in Québec, and REW4RD enforces it by default (see the "Québec law" section).
- French-first interface, full English. Data handled under Québec's Law 25; TAKATAK never sells data and never uses it for advertising.

## Catégorie suggérée

**Gift Cards / Loyalty & Rewards (Cartes-cadeaux / Fidélité et récompenses)** — catégorie exacte à confirmer dans la liste du portail (voir « À CONFIRMER AU PORTAIL »).

## Fonctionnalités (spécification)

### 1. Vente et activation
- Vente à la caisse : la carte est une ligne de la commande Clover (montant libre ou montants prédéfinis configurés par le marchand). **Activation seulement après paiement confirmé** (webhook de paiement → relecture de la commande et du paiement via l'API) : une carte dont la commande n'est pas payée demeure dormante et inutilisable — aucun risque de carte « gratuite » sur commande annulée.
- Vente sur le site du marchand : même parcours que la spec d'intégration du hub — commande créée via l'API Orders avec de vrais identifiants, paiement par le checkout hébergé Clover (3-D Secure 2 lorsque le paiement par carte l'exige, selon la spec), activation à la confirmation du paiement, carte numérique livrée par courriel (code + QR) dès l'activation.
- Achat par un client identifié : la carte se rattache à son compte client unique (clé = numéro de téléphone), visible dans son historique au même titre que ses commandes et ses points Fidélité.

### 2. Formats de cartes
- **Numérique** : courriel au destinataire (ou à l'acheteur), code de carte + code QR, message personnalisé optionnel de l'acheteur ; ajoutable au compte site du détenteur.
- **Physique** : code et QR imprimés sur la carte ; cartes vendues inactives en présentoir, activées à la caisse au moment de la vente payée.
- Codes à haute entropie, non séquentiels et non devinables ; le code complet n'est jamais affiché en entier après l'émission (consultation du solde avec code complet ou QR seulement).

### 3. Consultation de solde
- Par **code** (site du marchand, page de solde REW4RD), par **scan du QR** (comptoir, borne, téléphone du client), ou par **numéro de téléphone** pour les cartes rattachées au client unique (caisse, borne, compte site).
- Réponse minimale : solde actuel et statut de la carte (active, bloquée, épuisée). Aucun renseignement personnel n'est exposé par une consultation de solde.

### 4. Échange (utilisation comme mode de paiement)
- **Au comptoir (POS)** : mode de paiement REW4RD présenté dans le flux de paiement de la commande ; saisie du code ou scan du QR ; le montant appliqué est enregistré contre la commande via les mécanismes de paiement/tender de Clover (voir « Architecture »).
- **À la borne libre-service** : le client scanne le QR de sa carte ou saisit son code ; même logique d'application au total.
- **Au checkout du site** : le hub applique le solde de la carte à la commande avant de passer le reste éventuel au checkout hébergé Clover — le client voit la ventilation (carte-cadeau X $, carte bancaire Y $) avant de confirmer.
- **Échange partiel** : si le solde ≥ total, choix du montant à appliquer (par défaut le total) ; le solde restant demeure sur la carte. Si le solde < total, la carte est appliquée au complet et le reste est payé par un autre mode sur la même commande.
- Aucun échange contre de l'argent comptant et aucun retrait : la carte paie des achats chez le marchand, point (réserve légale à la section « Droit du Québec »).

### 5. Recharges
- Recharge à la caisse et sur le site : nouveau paiement, montant ajouté au solde de la même carte après confirmation du paiement, avec entrée au registre signée (ancien solde → nouveau solde).

### 6. Multi-emplacements
- Registre tenu **au niveau du groupe de marchands** (entité/groupe configuré à l'installation) : le solde est partagé et échangeable dans tous les emplacements du groupe ; chaque mouvement indique l'emplacement d'émission et l'emplacement d'échange.
- Un marchand à un seul emplacement n'a rien à configurer : le « groupe » est son commerce.

### 7. Garde-fous contre la fraude
- Activation uniquement après paiement vérifié (§1) — impossible d'activer une carte sur une commande impayée ou annulée.
- Codes à haute entropie ; jetons QR **opaques** (aucune donnée personnelle ni solde dans le QR) ; tentative de code = compteur de vélocité (blocage temporaire après échecs répétés, alertes au marchand).
- Plafonds configurables : montant maximal par carte, montant d'échange par heure et par carte, vélocité des consultations de solde.
- **Aucune sortie d'argent** : pas de remboursement de solde en espèces, pas de transfert de solde entre clients (hors réémission contrôlée ci-dessous).
- Carte perdue ou volée : blocage immédiat par le marchand (ou le détenteur identifié) et réémission d'une nouvelle carte au même solde, sur preuve d'achat ou de détention — chaque blocage/réémission est journalisé avec l'auteur.
- Registre append-only : aucun mouvement n'est jamais modifié ni effacé ; toute correction est une contre-entrée signée. C'est la base de la vue comptable (§8) et de la piste d'audit.

### 8. Vue comptable (marchand)
- Tableau de bord : **vendu** (valeur émise), **échangé** (valeur utilisée), **passif en circulation** (soldes actifs dus aux clients) — par période, par emplacement d'émission et par emplacement d'échange ; recharges distinguées des ventes initiales.
- Registre des mouvements exportable (CSV) : émission, recharge, échange (complet/partiel), blocage, réémission, contre-entrées.
- Ces chiffres alimentent **4CCOUNTING by TAKATAK** : le passif cartes-cadeaux y est un compte de passif du marchand, mis à jour par les exports/la synchro du registre.
- Taux d'échange et soldes dormants = **statistiques de rapport seulement** (voir la réserve « breakage » au droit du Québec).

## Architecture et correspondance Clover

**Fait de base (audit plateforme TAKATAK du 2026-10-26)** : l'audit n'établit **aucune API cartes-cadeaux native de Clover ouverte aux tiers** sur laquelle s'appuyer. REW4RD tient donc **son propre registre de cartes** dans le backend TAKATAK — exactement comme le registre de points de Fidélité Reward (aucune API de points non plus) — clé = **code de carte**, et applique ventes et échanges dans Clover par les API Orders/Payments. L'existence éventuelle d'un tender cartes-cadeaux natif accessible aux applications tierces est marquée **À CONFIRMER AU PORTAIL** ; l'application ne promet rien qui en dépende.

| Fonction | Réalisation |
|---|---|
| Registre des cartes (soldes, mouvements, statuts) | **Serveur TAKATAK** (base du hub), clé = code de carte à haute entropie ; portée = groupe de marchands |
| Vente à la caisse | Ligne de commande Clover (API **Orders**) ; activation déclenchée par webhook paiement → relecture commande + paiement (API **Payments**) |
| Vente sur le site | Hub (spec d'intégration site ↔ Clover) : commande atomique API Orders + paiement Hosted Checkout ; activation à la confirmation ; livraison courriel du code + QR |
| Échange au comptoir | Mécanisme de **tender personnalisé** / paiement appliqué à la commande via les API Orders/Payments — l'audit établit que les tenders personnalisés acceptent les paiements partiels sur les plans Station/Register, mais que les plans Payments Plus n'acceptent que des paiements complets par tender personnalisé : le flux d'échange partiel est conçu pour appliquer le montant carte **avant** de clore la commande, et le comportement exact par plan est **À PROUVER EN SANDBOX** |
| Échange à la borne | Même application au total via le hub/l'app ; l'audit note que les paiements partiels ne sont pas supportés nativement à la borne Clover : si le sandbox le confirme, l'échange à la borne se fait en **tender unique** (carte au complet) ou par renvoi de la commande ouverte au comptoir — **À PROUVER EN SANDBOX**, jamais promis avant preuve |
| Échange au checkout site | Le hub applique le montant carte à la commande (API Orders) avant la session de paiement du solde restant |
| Rattachement au client unique | API **Customers** (lecture) : retrouver le client par téléphone (clé du client unique) ; le lien carte ↔ client vit dans notre registre |
| Groupe et emplacements | API **Merchant** (lecture) : identité du marchand et de ses emplacements pour la portée du registre et les rapports |
| Connexion du marchand | OAuth Clover v2 avec PKCE ; jetons à expiration, rotation des refresh tokens dans le coffre du hub |

Aucune donnée de carte bancaire ne transite par REW4RD : les paiements d'achat et de recharge sont traités par Clover.

## Droit du Québec — cartes prépayées (à lire avant toute configuration)

> Au Québec, la **Loi sur la protection du consommateur** encadre strictement les cartes prépayées (cartes-cadeaux) vendues aux consommateurs. De manière générale, une carte prépayée vendue à un consommateur **ne peut pas comporter de date d'expiration**, et **la plupart des frais sont interdits** (frais d'activation, frais d'inactivité/dormance, frais d'administration). Les exceptions sont étroites et prévues par la loi et son règlement — par exemple les cartes remises **gratuitement** à titre promotionnel ou de don, ou certaines cartes liées à un service déterminé.
>
> **Ce que REW4RD applique par défaut pour tout marchand du Québec : aucune expiration, aucun frais d'inactivité, aucun frais d'administration sur les cartes vendues aux consommateurs.** L'application ne propose **aucune** configuration d'expiration, de frais de dormance ou d'extinction des soldes abandonnés (« breakage ») qui contreviendrait au droit québécois : le solde non échangé demeure un **passif du marchand envers son client**, présenté comme tel dans la vue comptable. Le « breakage » est chez nous un **sujet de rapport statistique** (soldes dormants, taux d'échange), **jamais un revenu promis** ni un mécanisme d'annulation de solde.
>
> Le marchand demeure responsable de ses obligations envers les détenteurs de cartes (y compris en cas de cessation d'activité) ; REW4RD fournit la technologie et le registre, pas les fonds. Ces textes sont un brouillon de travail, pas un avis juridique.

## Permissions Clover demandées

| Permission | Justification |
|---|---|
| Commandes (Orders) — lecture | Lire les commandes de vente de cartes (activation après paiement), les commandes où une carte est échangée (rapprochement avec le registre) et les remboursements/annulations qui doivent désactiver ou contre-passer une carte. |
| Commandes (Orders) — écriture | Créer la commande de vente de carte au comptoir et sur le site, et appliquer le montant échangé en carte-cadeau à la commande du client avant sa clôture. Sans écriture, la carte ne peut ni se vendre dans le flux de commande ni payer. |
| Paiements (Payments) — lecture | Vérifier qu'un achat ou une recharge est réellement payé avant d'activer ou de créditer la carte (aucune activation sur commande impayée) et rapprocher les montants d'échange enregistrés. |
| Paiements (Payments) — écriture | Enregistrer le paiement en carte-cadeau contre la commande au moment de l'échange (mécanisme de tender), y compris en montant partiel, afin que la commande Clover reflète exactement comment elle a été payée. |
| Clients (Customers) — lecture | Retrouver le client unique par son numéro de téléphone pour rattacher ses cartes à son compte (soldes visibles avec ses points et son historique). Lecture seule : la création/mise à jour du client appartient au parcours Fidélité Reward ; REW4RD ne fait que lire et lier dans son propre registre. |
| Marchand (Merchant) — lecture | Identifier le marchand et ses emplacements : portée du registre (groupe), solde partagé multi-emplacements et ventilation comptable par emplacement. |

Aucune autre permission n'est demandée (aucun accès à l'inventaire, aux employés, ni aux numéros de carte bancaire).

## Tarification

> **PRIX DÉCIDÉ PAR MATT LE 2026-10-26 — 50 $ CAD/mois. Ce prix est final, ce n'est pas une proposition.**

- **50 $ CAD par mois**, facturés par la facturation du Clover App Market.
- Période d'essai : à décider par Matt (non tranché — voir « Points qui relèvent de Matt uniquement »).
- Structure exacte du plan au portail (par marchand ou par emplacement, paliers, part de revenus Clover/Fiserv) : voir « À CONFIRMER AU PORTAIL ». Si le portail impose un choix de structure, appliquer : un seul plan à 50 $ CAD/mois.

## Soutien

- Courriel : takatak.ca@gmail.com
- Téléphone : +1 450-999-4999
- URL de soutien (placeholder, hébergement à confirmer) : https://takatak.ca/apps/rew4rd/soutien
- URL politique de confidentialité (placeholder) : https://takatak.ca/apps/rew4rd/confidentialite
- URL conditions d'utilisation (placeholder) : https://takatak.ca/apps/rew4rd/conditions

## Instructions de test pour l'équipe de révision Clover

*Personnes fictives de test (réservées aux essais) : « Sophie Aubry », téléphone fictif 514-555-0110, courriel fictif sophie.aubry@exemple.ca. Cartes et codes de test : émis par le marchand sandbox pendant la revue ; aucun code réel n'est utilisé.*

1. Installer l'application sur le marchand sandbox et la connecter (flux OAuth proposé par l'application).
2. **Achat numérique sur le site** : depuis le site de démonstration du marchand sandbox, acheter une carte-cadeau numérique de 25 $ pour sophie.aubry@exemple.ca et payer par le checkout hébergé avec une carte de test Clover. Vérifier : une commande Clover de 25 $ existe, et le courriel de la carte (code + QR) n'arrive **qu'après** la confirmation du paiement.
3. **Consultation de solde** : sur la page de solde, saisir le code reçu : solde affiché = 25,00 $, statut « active ».
4. **Achat physique au comptoir** : vendre une carte physique de 50 $ dans une commande Clover du marchand sandbox, payer comptant (tender natif). Vérifier que la carte n'est utilisable qu'après le paiement complété.
5. **Échange partiel au comptoir** : nouvelle commande de 40 $. Appliquer la carte physique de 50 $ (étape 4) : vérifier que la commande est close, que la commande Clover montre le paiement en carte-cadeau de 40 $, et que le **solde restant de la carte est de 10,00 $**.
6. **Échange au checkout site** : commander pour 10 $ sur le site de démonstration et appliquer le solde restant de la carte physique (10 $) au complet avant le checkout : aucun montant n'est demandé à la carte bancaire, la commande est marquée payée par carte-cadeau, solde de la carte = 0 $.
7. **Recharge** : recharger cette même carte de 15 $ sur le site (paiement test) ; solde = 15,00 $ après confirmation du paiement seulement.
8. **Solde partagé (si le sandbox a deux emplacements)** : échanger 5 $ de la carte rechargée dans le second emplacement ; solde = 10,00 $ des deux côtés.
9. **Vue comptable** : ouvrir le tableau de bord REW4RD : total crédité = 90 $ (ventes 25 $ + 50 $, recharge de 15 $ distinguée des ventes), échangé = 55 $ (40 + 10 + 5), passif en circulation = 35 $ (25 $ de la carte numérique intacte + 10 $ restants sur la carte physique). Le principe à vérifier : crédité − échangé = passif, au cent près.
10. **Cas de contrôle A** : créer une commande de vente de carte et l'annuler **avant** paiement : la carte ne doit jamais s'activer.
11. **Cas de contrôle B** : saisir un code inexistant à répétition : après le seuil de vélocité, les tentatives sont bloquées temporairement et l'événement est journalisé.
12. **Cas de contrôle C (Québec)** : dans la configuration d'un marchand du Québec, vérifier qu'**aucune** option de date d'expiration ni de frais d'inactivité n'est proposée pour les cartes vendues aux consommateurs.

*(Numéros et courriels en 555/exemple.ca : fictifs, réservés aux tests. Aucune donnée réelle n'est utilisée.)*

## Liste de contrôle de soumission

| Élément | État |
|---|---|
| Nom + accroche + description FR/EN | ✅ Prêt (ce document) |
| Spécification des fonctionnalités | ✅ Prêt (ce document) |
| Liste des permissions + justifications | ✅ Prêt (ce document) |
| Plan tarifaire | ✅ **50 $ CAD/mois — décidé par Matt le 2026-10-26** (structure du plan au portail : à confirmer) |
| Politique de confidentialité FR + EN | ✅ Brouillon prêt (`legal/`) — à approuver par Matt |
| Conditions d'utilisation FR + EN | ✅ Brouillon prêt (`legal/`) — à approuver par Matt |
| Script de vidéo de démonstration | ✅ Prêt (`video-script.md`) |
| Visuel de couverture premium 1080×216 | ✅ Produit (`assets-premium/cover-rew4rd-1080x216.png` + visuel source) |
| Vidéo de démonstration (fichier) | ⏳ À tourner depuis le prototype, puis valider format/durée au portail |
| Icône de l'application | ⏳ À produire — dimensions et format à confirmer au portail |
| Captures d'écran marketplace | ⏳ À capturer du produit (écrans : vente de carte au comptoir, courriel de carte numérique, échange partiel, vue comptable) — nombre/format à confirmer au portail |
| URL publique de la politique de confidentialité | ⏳ Brouillon prêt, hébergement à mettre en ligne |
| URL publique des conditions | ⏳ Brouillon prêt, hébergement à mettre en ligne |
| Marchand sandbox + accès réviseur | ⏳ En attente du compte développeur (voir ci-dessous) |
| Application créée dans le Developer Dashboard | ⏳ À créer (backend registre + app : voir le pack d'instructions Claude Code, « Projet — REW4RD by TAKATAK ») |

## À CONFIRMER AU PORTAIL

- **Existence d'un tender cartes-cadeaux natif Clover accessible aux applications tierces** — l'audit n'en établit aucun ; REW4RD est conçu pour s'en passer (registre maison + tender personnalisé). Si un tel tender existe, évaluer la bascule sans changer le registre.
- Mécanisme exact d'enregistrement d'un paiement par tender personnalisé selon le plan du marchand (Station/Register vs Payments Plus — paiements partiels) et permission Payments en écriture correspondante dans la liste du portail.
- Comportement de l'échange partiel à la borne libre-service (paiements partiels natifs non supportés selon l'audit) — À PROUVER EN SANDBOX.
- Liste exacte des catégories disponibles pour une application de cartes-cadeaux.
- Dimensions, format et poids exigés pour l'icône, la couverture et les captures d'écran.
- Exigences de la vidéo de démonstration (obligatoire ou non, format, durée maximale, hébergement).
- Structure exacte des plans tarifaires acceptés (abonnement mensuel, par appareil ou par emplacement) et part de revenus éventuelle de Clover/Fiserv — le prix, lui, est décidé : 50 $ CAD/mois.
- Exigences de l'équipe de révision : marchand sandbox dédié, identifiants de test, délais de revue.
- Champs obligatoires exacts de la fiche (courriel de soutien, URL de soutien, pays desservis).
- Disponibilité et nom exact des permissions Orders / Payments (lecture + écriture), Customers (lecture) et Merchant (lecture) dans la liste du portail.

## Points qui relèvent de Matt uniquement

- ~~Approuver le prix~~ — **fait : 50 $ CAD/mois, décidé par Matt le 2026-10-26**
- Décider la période d'essai éventuelle (aucune, 14 jours, 30 jours)
- Approuver les textes légaux avant publication (idéalement avec un avis juridique) — attention particulière à la section « Droit du Québec » : aucune expiration ni frais interdits ne doivent jamais être promis à un marchand québécois
- Choisir l'hébergement des pages publiques (politique, conditions, soutien)
- Fournir l'accès au compte développeur Clover pour créer l'application et le marchand sandbox
