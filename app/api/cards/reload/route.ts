import { isCtx, requireMerchantOrDevice } from '@/lib/core/guard';
import { fail, ok, readJson } from '@/lib/core/http';
import { reloadCard } from '@/lib/domain/giftcards';

export const dynamic = 'force-dynamic';

// { code, amountCents } → reload (Premium: "recharges partout"; Base can reload at the counter too).
export async function POST(req: Request) {
  const c = await requireMerchantOrDevice(req);
  if (!isCtx(c)) return c;
  const b = await readJson(req);
  if (!b) return fail('JSON body required');
  const r = await reloadCard(c.merchantId, b.code, Number(b.amountCents), String(b.by ?? 'Tableau de bord'));
  return r.ok ? ok(r) : fail(r.error, 422);
}
