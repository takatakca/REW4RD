// REW4RDS hooks: the gift-card tender is created in the merchant's Clover at connect time.
import type { AppHooks } from '../hooks';
import { ensureTender } from './giftcards';

export const hooks: AppHooks = {
  async onConnect(merchantId) { await ensureTender(merchantId); },
};
