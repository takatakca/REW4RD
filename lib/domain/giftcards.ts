// REW4RDS — gift cards. The card code is a bearer secret: only its SHA-256 is stored (and its last 4 characters for
// display); the full code is shown once, when the card is issued. Every change is a ledger line.
// Québec law (Consumer Protection Act, s. 187.3–187.4): no expiry date and no inactivity fees — there is neither here.
//  - Issue (sale): 5 $ to 1000 $. Redeem: partial allowed, never more than the balance. Reload: up to 1000 $ per time.
//  - At the counter the card is a custom Clover tender, "Carte-cadeau REW4RDS", created when the merchant connects.
import crypto from 'node:crypto';
import { cloverGetAll, cloverPost, mpath } from '../clover/api';
import { customerRef, normalizePhone } from '../core/phone';
import { getStore } from '../core/store';
import { emitSuite } from '../suite';

export const CARDS = 'cards';
export const GIFT_LEDGER = 'giftledger';
export const TENDER_KEY = 'com.takatak.rew4rds.giftcard';
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // Crockford base32: no I, L, O, U
export const MIN_CENTS = 500;
export const MAX_CENTS = 100_000;

export interface Card { last4: string; balanceCents: number; initialCents: number; issuedAt: string; status: 'active' | 'disabled'; customerRef: string | null; cloverOrderId: string | null }
export interface GiftEntry { cardId: string; last4: string; type: 'issue' | 'redeem' | 'reload' | 'adjust'; amountCents: number; balanceAfter: number; orderId: string | null; by: string }

export function newCode(): string {
  const bytes = crypto.randomBytes(16);
  const chars = [...bytes].map((b) => ALPHABET[b % 32]).join('');
  return chars.match(/.{4}/g)!.join('-');
}
export const cleanCode = (raw: unknown) => String(raw ?? '').toUpperCase().replace(/[^0-9A-Z]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1');
const cardId = (mid: string, code: string) => crypto.createHash('sha256').update(`${mid}:${cleanCode(code)}`).digest('hex');

const locks = new Map<string, Promise<unknown>>();
async function withCard<T>(id: string, fn: () => Promise<T>): Promise<T> {
  const run = (locks.get(id) ?? Promise.resolve()).catch(() => undefined).then(fn);
  locks.set(id, run.finally(() => { if (locks.get(id) === run) locks.delete(id); }));
  return run;
}

async function ledger(mid: string, e: GiftEntry) {
  await getStore().put<GiftEntry>(GIFT_LEDGER, crypto.randomUUID(), mid, e);
}

const amountOk = (c: number) => Number.isInteger(c) && c >= 1 && c <= MAX_CENTS;

export async function issueCard(mid: string, amountCents: number, opts: { phone?: unknown; orderId?: string | null; by?: string } = {}): Promise<{ ok: true; code: string; card: Card } | { ok: false; error: string }> {
  if (!Number.isInteger(amountCents) || amountCents < MIN_CENTS || amountCents > MAX_CENTS) return { ok: false, error: 'Amount: 5 $ to 1000 $.' };
  const phone = opts.phone ? normalizePhone(opts.phone) : null;
  if (opts.phone && !phone) return { ok: false, error: 'Phone number is not valid.' };
  const code = newCode();
  const id = cardId(mid, code);
  const card: Card = { last4: cleanCode(code).slice(-4), balanceCents: amountCents, initialCents: amountCents, issuedAt: new Date().toISOString(), status: 'active', customerRef: phone ? customerRef(mid, phone) : null, cloverOrderId: opts.orderId ?? null };
  await getStore().put(CARDS, id, mid, card, card.issuedAt);
  await ledger(mid, { cardId: id, last4: card.last4, type: 'issue', amountCents, balanceAfter: amountCents, orderId: opts.orderId ?? null, by: (opts.by ?? 'Comptoir').slice(0, 60) });
  await emitSuite('card_issued', { merchantId: mid, amountCents, customerRef: card.customerRef }, `${mid}-issue-${id.slice(0, 16)}`);
  return { ok: true, code, card };
}

export async function cardByCode(mid: string, code: unknown): Promise<{ id: string; card: Card } | null> {
  if (cleanCode(code).length !== 16) return null;
  const id = cardId(mid, String(code));
  const d = await getStore().get<Card>(CARDS, id);
  return d && d.merchantId === mid ? { id, card: d.data } : null;
}

export async function redeemCard(mid: string, code: unknown, amountCents: number, opts: { orderId?: string | null; by?: string } = {}): Promise<{ ok: true; usedCents: number; balanceCents: number } | { ok: false; error: string }> {
  if (!amountOk(amountCents)) return { ok: false, error: 'Amount is not valid.' };
  const found = await cardByCode(mid, code);
  if (!found) return { ok: false, error: 'Unknown card.' };
  return withCard(found.id, async () => {
    const card = (await getStore().get<Card>(CARDS, found.id))!.data;
    if (card.status !== 'active') return { ok: false as const, error: 'This card is disabled.' };
    if (card.balanceCents <= 0) return { ok: false as const, error: 'The card is empty.' };
    if (opts.orderId && !(await getStore().claim(`m:${mid}:gift:${found.id}:${opts.orderId}:${amountCents}`, Date.now()))) return { ok: false as const, error: 'Already redeemed on this order.' };
    const used = Math.min(amountCents, card.balanceCents); // partial redemption: the rest is paid another way
    const next = { ...card, balanceCents: card.balanceCents - used };
    await getStore().put(CARDS, found.id, mid, next, card.issuedAt);
    await ledger(mid, { cardId: found.id, last4: card.last4, type: 'redeem', amountCents: -used, balanceAfter: next.balanceCents, orderId: opts.orderId ?? null, by: (opts.by ?? 'Comptoir').slice(0, 60) });
    await emitSuite('card_redeemed', { merchantId: mid, amountCents: used, customerRef: card.customerRef }, `${mid}-redeem-${crypto.randomUUID()}`);
    return { ok: true as const, usedCents: used, balanceCents: next.balanceCents };
  });
}

export async function reloadCard(mid: string, code: unknown, amountCents: number, by = 'Comptoir'): Promise<{ ok: true; balanceCents: number } | { ok: false; error: string }> {
  if (!Number.isInteger(amountCents) || amountCents < MIN_CENTS || amountCents > MAX_CENTS) return { ok: false, error: 'Reload: 5 $ to 1000 $.' };
  const found = await cardByCode(mid, code);
  if (!found) return { ok: false, error: 'Unknown card.' };
  return withCard(found.id, async () => {
    const card = (await getStore().get<Card>(CARDS, found.id))!.data;
    if (card.status !== 'active') return { ok: false as const, error: 'This card is disabled.' };
    const next = { ...card, balanceCents: card.balanceCents + amountCents };
    await getStore().put(CARDS, found.id, mid, next, card.issuedAt);
    await ledger(mid, { cardId: found.id, last4: card.last4, type: 'reload', amountCents, balanceAfter: next.balanceCents, orderId: null, by: by.slice(0, 60) });
    return { ok: true as const, balanceCents: next.balanceCents };
  });
}

/** Outstanding balances = what the merchant owes its customers (for 4CCOUNTING and the accountant). */
export async function liability(mid: string): Promise<{ cards: number; activeCards: number; liabilityCents: number; issuedCents: number }> {
  const cards = (await getStore().list<Card>(CARDS, { merchantId: mid, limit: 100_000 })).map((d) => d.data);
  return {
    cards: cards.length, activeCards: cards.filter((c) => c.status === 'active' && c.balanceCents > 0).length,
    liabilityCents: cards.filter((c) => c.status === 'active').reduce((s, c) => s + c.balanceCents, 0), issuedCents: cards.reduce((s, c) => s + c.initialCents, 0),
  };
}

export async function recentEntries(mid: string, limit = 25): Promise<GiftEntry[]> {
  return (await getStore().list<GiftEntry>(GIFT_LEDGER, { merchantId: mid, limit })).map((d) => d.data);
}

/** On connect: the "Carte-cadeau REW4RDS" tender exists in the merchant's Clover (created once). */
export async function ensureTender(mid: string): Promise<'exists' | 'created' | 'failed'> {
  const t = await cloverGetAll<any>(mid, mpath(mid, '/tenders'));
  if (t.ok && t.items.some((x) => x.labelKey === TENDER_KEY)) return 'exists';
  const r = await cloverPost(mid, mpath(mid, '/tenders'), { label: 'Carte-cadeau REW4RDS', labelKey: TENDER_KEY, enabled: true, visible: true, opensCashDrawer: false });
  return r.ok ? 'created' : 'failed';
}
