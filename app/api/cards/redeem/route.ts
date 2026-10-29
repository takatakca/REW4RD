import { isCtx, requireMerchantOrDevice } from '@/lib/core/guard';
import { fail, ok, readJson } from '@/lib/core/http';
import { redeemCard } from '@/lib/domain/giftcards';

export const dynamic = 'force-dynamic';

// { code, amountCents, orderId? } → partial redemption allowed; once per (card, order, amount).
export async function POST(req: Request) {
  const c = await requireMerchantOrDevice(req, 'base', { action: 'cards.redeem' });
  if (!isCtx(c)) return c;
  const b = await readJson(req);
  if (!b) return fail('JSON body required');
  // Who: the signed-in person, or the device plus the cashier's name it sends.
  const by = c.device && typeof b.by === 'string' && b.by.trim() ? `${b.by.trim().slice(0, 40)} (${c.actor})` : c.actor;
  const r = await redeemCard(c.merchantId, b.code, Number(b.amountCents), { orderId: typeof b.orderId === 'string' ? b.orderId : null, by });
  return r.ok ? ok(r) : fail(r.error, 422);
}
