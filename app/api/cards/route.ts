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
  const c = await requireMerchantOrDevice(req, 'base', { action: 'cards.issue' });
  if (!isCtx(c)) return c;
  const b = await readJson(req);
  if (!b) return fail('JSON body required');
  // Who: the signed-in person, or the device plus the cashier's name it sends.
  const by = c.device && typeof b.by === 'string' && b.by.trim() ? `${b.by.trim().slice(0, 40)} (${c.actor})` : c.actor;
  const r = await issueCard(c.merchantId, Number(b.amountCents), { phone: b.phone, orderId: typeof b.orderId === 'string' ? b.orderId : null, by });
  return r.ok ? ok({ code: r.code, qr: `REW4RDS:${r.code}`, balanceCents: r.card.balanceCents }) : fail(r.error);
}
