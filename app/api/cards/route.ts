import { isCtx, requireMerchantOrDevice } from '@/lib/core/guard';
import { fail, ok, readJson } from '@/lib/core/http';
import { issueCard, liability } from '@/lib/domain/giftcards';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const c = await requireMerchantOrDevice(req);
  if (!isCtx(c)) return c;
  return ok({ liability: await liability(c.merchantId) });
}

// Issue (sell) a card: { amountCents, phone?, orderId? } → the code, shown ONCE.
export async function POST(req: Request) {
  const c = await requireMerchantOrDevice(req);
  if (!isCtx(c)) return c;
  const b = await readJson(req);
  if (!b) return fail('JSON body required');
  const r = await issueCard(c.merchantId, Number(b.amountCents), { phone: b.phone, orderId: typeof b.orderId === 'string' ? b.orderId : null, by: String(b.by ?? 'Tableau de bord') });
  return r.ok ? ok({ code: r.code, qr: `REW4RDS:${r.code}`, balanceCents: r.card.balanceCents }) : fail(r.error);
}
