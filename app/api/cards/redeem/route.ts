import { isCtx, requireMerchantOrDevice } from '@/lib/core/guard';
import { fail, ok, readJson } from '@/lib/core/http';
import { redeemCard } from '@/lib/domain/giftcards';

export const dynamic = 'force-dynamic';

// { code, amountCents, orderId? } → partial redemption allowed; once per (card, order, amount).
export async function POST(req: Request) {
  const c = await requireMerchantOrDevice(req);
  if (!isCtx(c)) return c;
  const b = await readJson(req);
  if (!b) return fail('JSON body required');
  const r = await redeemCard(c.merchantId, b.code, Number(b.amountCents), { orderId: typeof b.orderId === 'string' ? b.orderId : null, by: String(b.by ?? 'Tableau de bord') });
  return r.ok ? ok(r) : fail(r.error, 422);
}
