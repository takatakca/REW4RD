import { isCtx, requireMerchantOrDevice } from '@/lib/core/guard';
import { fail, ok, readJson } from '@/lib/core/http';
import { cardByCode } from '@/lib/domain/giftcards';

export const dynamic = 'force-dynamic';

// { code } → balance (POST so the code never lands in an address or a log).
export async function POST(req: Request) {
  const c = await requireMerchantOrDevice(req);
  if (!isCtx(c)) return c;
  const b = await readJson(req);
  const found = b ? await cardByCode(c.merchantId, b.code) : null;
  if (!found) return fail('Unknown card.', 404);
  return ok({ last4: found.card.last4, balanceCents: found.card.balanceCents, status: found.card.status });
}
