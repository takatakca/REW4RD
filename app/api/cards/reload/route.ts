import { isCtx, requireMerchantOrDevice } from '@/lib/core/guard';
import { fail, ok, readJson } from '@/lib/core/http';
import { reloadCard } from '@/lib/domain/giftcards';

export const dynamic = 'force-dynamic';

// { code, amountCents } → reload (Premium: "recharges partout"; Base can reload at the counter too).
export async function POST(req: Request) {
  const c = await requireMerchantOrDevice(req, 'base', { action: 'cards.reload' });
  if (!isCtx(c)) return c;
  const b = await readJson(req);
  if (!b) return fail('JSON body required');
  // Who: the signed-in person, or the device plus the cashier's name it sends.
  const by = c.device && typeof b.by === 'string' && b.by.trim() ? `${b.by.trim().slice(0, 40)} (${c.actor})` : c.actor;
  const r = await reloadCard(c.merchantId, b.code, Number(b.amountCents), by);
  return r.ok ? ok(r) : fail(r.error, 422);
}
