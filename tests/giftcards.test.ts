// REW4RDS: codes stored hashed, partial redemption, reloads, liability, Québec rules, Clover tender.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cardByCode, cleanCode, ensureTender, issueCard, liability, redeemCard, reloadCard, TENDER_KEY } from '@/lib/domain/giftcards';
import { getStore } from '@/lib/core/store';
import { connect, fakeClover, MID } from './helpers';

let tenders: any[] = [];
let calls: ReturnType<typeof fakeClover>;
beforeEach(async () => {
  tenders = [];
  calls = fakeClover([(u, init) => (u.pathname.endsWith('/tenders') ? (init?.method === 'POST' ? { id: 'TENDER000001' } : { elements: tenders }) : undefined)]);
  await connect();
});
afterEach(() => vi.unstubAllGlobals());

describe('gift cards', () => {
  it('issues a 16-character code, stores only its hash, no expiry', async () => {
    expect(await issueCard(MID, 100)).toMatchObject({ ok: false });
    const r = await issueCard(MID, 5000, { phone: '514 555 0101' });
    if (!r.ok) throw new Error(r.error);
    expect(r.code).toMatch(/^[0-9A-HJKMNP-TV-Z]{4}(-[0-9A-HJKMNP-TV-Z]{4}){3}$/);
    const stored = JSON.stringify(await getStore().list('cards'));
    expect(stored).not.toContain(cleanCode(r.code));
    expect(stored).not.toMatch(/expir/i);
    expect((await cardByCode(MID, r.code.toLowerCase().replace(/-/g, ' ')))?.card.balanceCents).toBe(5000);
    expect(await cardByCode('OTHERMERCHANT', r.code)).toBeNull();
  });

  it('redeems partially, never below zero, once per order; reloads', async () => {
    const r = await issueCard(MID, 2000);
    if (!r.ok) throw new Error(r.error);
    expect(await redeemCard(MID, r.code, 1500, { orderId: 'ORDER0000001' })).toEqual({ ok: true, usedCents: 1500, balanceCents: 500 });
    expect(await redeemCard(MID, r.code, 1500, { orderId: 'ORDER0000001' })).toMatchObject({ ok: false });
    expect(await redeemCard(MID, r.code, 1500, { orderId: 'ORDER0000002' })).toEqual({ ok: true, usedCents: 500, balanceCents: 0 });
    expect(await redeemCard(MID, r.code, 100)).toMatchObject({ ok: false, error: 'The card is empty.' });
    expect(await reloadCard(MID, r.code, 2500)).toEqual({ ok: true, balanceCents: 2500 });
    expect(await redeemCard(MID, 'WRONG-CODE', 100)).toMatchObject({ ok: false });
    expect(await liability(MID)).toMatchObject({ cards: 1, liabilityCents: 2500, issuedCents: 2000 });
  });

  it('two redemptions at the same time cannot spend the same balance twice', async () => {
    const r = await issueCard(MID, 1000);
    if (!r.ok) throw new Error(r.error);
    const [a, b] = await Promise.all([redeemCard(MID, r.code, 800), redeemCard(MID, r.code, 800)]);
    expect([a, b].map((x) => (x.ok ? x.usedCents : 0)).sort()).toEqual([200, 800]);
    expect((await cardByCode(MID, r.code))?.card.balanceCents).toBe(0);
  });

  it('creates the Clover tender once', async () => {
    expect(await ensureTender(MID)).toBe('created');
    expect(calls.find((c) => c.method === 'POST' && c.path.endsWith('/tenders'))?.body).toMatchObject({ labelKey: TENDER_KEY, label: 'Carte-cadeau REW4RDS' });
    tenders = [{ labelKey: TENDER_KEY }];
    expect(await ensureTender(MID)).toBe('exists');
  });
});
