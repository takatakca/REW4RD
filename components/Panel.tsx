import { money, pick } from '@/lib/core/i18n';
import type { PageCtx } from '@/lib/core/page';
import { liability, recentEntries } from '@/lib/domain/giftcards';
import { ApiForm } from './ApiForm';
import { DeviceKeys } from './DeviceKeys';
import { Badge, Banner, Card, Empty, Stat } from './ui';

// REW4RDS screens (lib/domain `sections`): overview (liability), sell, balance, redeem, reload, devices.
// Québec law: no expiry date, no inactivity fees.
export async function Panel({ ctx, section }: { ctx: PageCtx; section: string; query?: Record<string, string> }) {
  const { lang, merchantId } = ctx;
  switch (section) {
    case '': return <Overview ctx={ctx} />;
    case 'sell': return (
      <Card title={pick(lang, 'Vendre une carte', 'Sell a card')} icon="plus" sub={pick(lang, 'Encaissez d’abord le montant dans Clover, puis émettez la carte.', 'Ring up the amount in Clover first, then issue the card.')}>
        <ApiForm action="/api/cards" lang={lang} fields={[{ name: 'amountCents', label: pick(lang, 'Montant ($)', 'Amount ($)'), type: 'money', required: true }, { name: 'phone', label: pick(lang, 'Téléphone du client (facultatif)', 'Customer phone (optional)'), type: 'tel' }, { name: 'orderId', label: pick(lang, 'Commande Clover (facultatif)', 'Clover order (optional)') }]}
          submit={pick(lang, 'Émettre', 'Issue')} result={pick(lang, 'Code (remettez-le au client, il ne sera plus affiché) :\n{code}\nSolde : {balanceCents|money}', 'Code (give it to the customer, it will not be shown again):\n{code}\nBalance: {balanceCents|money}')} />
      </Card>
    );
    case 'balance': return (
      <Card title={pick(lang, 'Vérifier un solde', 'Check a balance')} icon="search">
        <ApiForm action="/api/cards/balance" lang={lang} fields={[{ name: 'code', label: 'Code', required: true }]} submit={pick(lang, 'Vérifier', 'Check')} result="•••• {last4} : {balanceCents|money}" />
      </Card>
    );
    case 'redeem': return (
      <Card title={pick(lang, 'Échanger', 'Redeem')} icon="card" sub={pick(lang, 'Dans Clover, payez la commande avec le mode « Carte-cadeau » pour le montant utilisé.', 'In Clover, pay the order with the “Gift card” tender for the amount used.')}>
        <ApiForm action="/api/cards/redeem" lang={lang} fields={[{ name: 'code', label: 'Code', required: true }, { name: 'amountCents', label: pick(lang, 'Montant ($)', 'Amount ($)'), type: 'money', required: true }, { name: 'orderId', label: pick(lang, 'Commande Clover', 'Clover order') }]}
          submit={pick(lang, 'Échanger', 'Redeem')} confirm={pick(lang, 'Retirer ce montant de la carte ?', 'Take this amount off the card?')} result={pick(lang, 'Utilisé {usedCents|money} · reste {balanceCents|money}', 'Used {usedCents|money} · left {balanceCents|money}')} />
      </Card>
    );
    case 'reload': return (
      <Card title={pick(lang, 'Recharger', 'Reload')} icon="repeat" sub={pick(lang, 'Encaissez d’abord le montant dans Clover.', 'Ring up the amount in Clover first.')}>
        <ApiForm action="/api/cards/reload" lang={lang} fields={[{ name: 'code', label: 'Code', required: true }, { name: 'amountCents', label: pick(lang, 'Montant ($)', 'Amount ($)'), type: 'money', required: true }]}
          submit={pick(lang, 'Recharger', 'Reload')} result={pick(lang, 'Nouveau solde {balanceCents|money}', 'New balance {balanceCents|money}')} />
      </Card>
    );
    case 'devices': return <DeviceKeys merchantId={merchantId!} lang={lang} kind="giftcard" title={pick(lang, 'Appareils (caisse, borne)', 'Devices (register, kiosk)')}
      hint={pick(lang, 'Une clé par appareil qui vend ou échange des cartes (C4ISSE, T4CTILE).', 'One key per device that sells or redeems cards (C4ISSE, T4CTILE).')} canManage={ctx.can('account.devices')} />;
    default: return null;
  }
}

async function Overview({ ctx }: { ctx: PageCtx }) {
  const { lang, merchantId } = ctx;
  const [l, entries] = await Promise.all([liability(merchantId!), recentEntries(merchantId!, 40)]);
  const TYPE: Record<string, [string, string, 'ok' | 'brand' | 'plain' | 'warn']> = { issue: ['Vente', 'Sale', 'ok'], redeem: ['Échange', 'Redeemed', 'brand'], reload: ['Recharge', 'Reload', 'ok'], adjust: ['Ajustement', 'Adjustment', 'warn'] };
  return (
    <>
      <div className="grid">
        <Stat label={pick(lang, 'Passif (soldes à honorer)', 'Liability (balances owed)')} value={money(l.liabilityCents, lang)} note={`${l.activeCards} ${pick(lang, 'cartes avec solde', 'cards with a balance')}`} />
        <Stat label={pick(lang, 'Cartes émises', 'Cards issued')} value={l.cards} note={money(l.issuedCents, lang)} />
        <Stat label={pick(lang, 'Déjà échangé', 'Already redeemed')} value={money(Math.max(0, l.issuedCents - l.liabilityCents), lang)} />
      </div>
      <Banner tone="info">{pick(lang, 'Loi du Québec : aucune date d’expiration, aucuns frais d’inactivité. Le passif reste dû tant que la carte a un solde.', 'Québec law: no expiry date, no inactivity fees. The liability stays owed while the card has a balance.')}</Banner>
      <Card title={pick(lang, 'Activité récente', 'Recent activity')} icon="log">
        {entries.length === 0 ? <Empty icon="gift">{pick(lang, 'Aucune carte vendue pour l’instant.', 'No card sold yet.')}</Empty> : (
          <div className="table-wrap"><table><thead><tr><th>{pick(lang, 'Carte', 'Card')}</th><th>{pick(lang, 'Quoi', 'What')}</th><th className="right">{pick(lang, 'Montant', 'Amount')}</th><th className="right">{pick(lang, 'Solde', 'Balance')}</th><th>{pick(lang, 'Par', 'By')}</th></tr></thead>
            <tbody>{entries.map((e, i) => { const [fr, en, tone] = TYPE[e.type] ?? TYPE.adjust; return <tr key={i}><td>•••• {e.last4}</td><td><Badge tone={tone}>{pick(lang, fr, en)}</Badge></td><td className="right">{money(e.amountCents, lang)}</td><td className="right">{money(e.balanceAfter, lang)}</td><td className="muted small">{e.by}</td></tr>; })}</tbody></table></div>
        )}
      </Card>
    </>
  );
}
