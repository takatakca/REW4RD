// REW4RDS's side of the shared shell: hooks, menu sections, authorized actions, device kinds, what each plan adds.
// The gift-card tender is created in the merchant's Clover at connect time.
import type { AppHooks } from '../hooks';
import type { AppAction, AppSection, DeviceKind, TierFeatures } from '../nav';
import { ensureTender } from './giftcards';

export const hooks: AppHooks = {
  async onConnect(merchantId) { await ensureTender(merchantId); },
};

export const sections: AppSection[] = [
  { slug: '', fr: 'Vue d’ensemble', en: 'Overview', icon: 'gift', hintFr: 'Ce que vous devez encore (passif), les cartes vendues, l’activité.', hintEn: 'What you still owe (liability), cards sold, activity.' },
  { slug: 'counter', fr: 'Au comptoir', en: 'At the counter', icon: 'register', hub: true, hintFr: 'Vendre, vérifier, échanger et recharger une carte.', hintEn: 'Sell, check, redeem and reload a card.' },
  { slug: 'sell', parent: 'counter', fr: 'Vendre une carte', en: 'Sell a card', icon: 'plus', view: 'cards.issue', hintFr: 'Le code s’affiche une seule fois : remettez-le au client.', hintEn: 'The code shows once: give it to the customer.' },
  { slug: 'balance', parent: 'counter', fr: 'Vérifier un solde', en: 'Check a balance', icon: 'search', hintFr: 'Avec le code de la carte.', hintEn: 'With the card code.' },
  { slug: 'redeem', parent: 'counter', fr: 'Échanger', en: 'Redeem', icon: 'card', view: 'cards.redeem', hintFr: 'Échange partiel permis ; une fois par commande.', hintEn: 'Partial redemption allowed; once per order.' },
  { slug: 'reload', parent: 'counter', fr: 'Recharger', en: 'Reload', icon: 'repeat', view: 'cards.reload', hintFr: 'Ajouter un montant à une carte existante.', hintEn: 'Add an amount to an existing card.' },
  { slug: 'devices', fr: 'Appareils', en: 'Devices', icon: 'device', hintFr: 'Une clé par caisse ou borne qui vend ou échange des cartes.', hintEn: 'One key per register or kiosk that sells or redeems cards.' },
];

export const actions: AppAction[] = [
  { key: 'cards.issue', fr: 'Vendre une carte-cadeau', en: 'Sell a gift card', min: 'employee' },
  { key: 'cards.redeem', fr: 'Échanger une carte-cadeau', en: 'Redeem a gift card', min: 'employee' },
  { key: 'cards.reload', fr: 'Recharger une carte-cadeau', en: 'Reload a gift card', min: 'employee' },
];

export const deviceKinds: DeviceKind[] = [{ kind: 'giftcard', fr: 'Caisse ou borne (cartes-cadeaux)', en: 'Register or kiosk (gift cards)' }];

export const tierFeatures: TierFeatures = {
  base: [
    ['Vente de cartes : code unique affiché une seule fois, gardé sous forme d’empreinte', 'Card sales: unique code shown once, stored as a fingerprint'],
    ['Échange partiel et recharges, au comptoir et sur les appareils', 'Partial redemption and reloads, at the counter and on devices'],
    ['Passif à jour : ce que vous devez encore', 'Up-to-date liability: what you still owe'],
    ['Mode de paiement « Carte-cadeau » créé dans Clover', '“Gift card” tender created in Clover'],
  ],
  premium: [
    ['Bientôt : vente en ligne (Ecommerce Clover), solde par téléphone (même client que LOY4LTY)', 'Coming: online sales (Clover Ecommerce), balance by phone (same customer as LOY4LTY)'],
  ],
  vip: [
    ['Bientôt : registre multi-succursales, passif vers 4CCOUNTING, API Cartes-cadeaux Clover', 'Coming: multi-location register, liability to 4CCOUNTING, Clover Gift Cards API'],
  ],
};
