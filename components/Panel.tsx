import { money, pick } from '@/lib/core/i18n';
import type { PageCtx } from '@/lib/core/page';
import { liability, recentEntries } from '@/lib/domain/giftcards';
import { ApiForm } from './ApiForm';
import { DeviceKeys } from './DeviceKeys';
import { Card, Stat } from './ui';

// REW4RDS dashboard: liability, sell a card (code shown once), balance, redeem, reload, recent activity.
export async function Panel({ ctx }: { ctx: PageCtx }) {
  const { lang, merchantId } = ctx;
  if (!merchantId) return null;
  const [l, entries] = await Promise.all([liability(merchantId), recentEntries(merchantId)]);
  const TYPE: Record<string, [string, string]> = { issue: ['Vente', 'Sale'], redeem: ['Échange', 'Redeemed'], reload: ['Recharge', 'Reload'], adjust: ['Ajustement', 'Adjustment'] };
  return (
    <>
      <div className="grid">
        <Stat label={pick(lang, 'Passif (soldes à honorer)', 'Liability (balances owed)')} value={money(l.liabilityCents, lang)} note={`${l.activeCards} ${pick(lang, 'cartes avec solde', 'cards with a balance')}`} />
        <Stat label={pick(lang, 'Cartes émises', 'Cards issued')} value={l.cards} note={money(l.issuedCents, lang)} />
      </div>
      <p className="muted">{pick(lang, 'Loi du Québec : aucune date d’expiration, aucuns frais d’inactivité.', 'Québec law: no expiry date, no inactivity fees.')}</p>
      <Card title={pick(lang, 'Vendre une carte', 'Sell a card')}>
        <ApiForm action="/api/cards" fields={[{ name: 'amountCents', label: pick(lang, 'Montant ($)', 'Amount ($)'), type: 'money', required: true }, { name: 'phone', label: pick(lang, 'Téléphone du client (facultatif)', 'Customer phone (optional)'), type: 'tel' }, { name: 'orderId', label: pick(lang, 'Commande Clover (facultatif)', 'Clover order (optional)') }]}
          submit={pick(lang, 'Émettre', 'Issue')} onResult={(j) => `${pick(lang, 'Code (remettez-le au client, il ne sera plus affiché) :', 'Code (give it to the customer, it will not be shown again):')}\n${j.code}`} />
      </Card>
      <Card title={pick(lang, 'Solde', 'Balance')}>
        <ApiForm action="/api/cards/balance" fields={[{ name: 'code', label: 'Code', required: true }]} submit={pick(lang, 'Vérifier', 'Check')} onResult={(j) => `•••• ${j.last4} : ${money(j.balanceCents, lang)}`} />
      </Card>
      <Card title={pick(lang, 'Échanger', 'Redeem')}>
        <ApiForm action="/api/cards/redeem" fields={[{ name: 'code', label: 'Code', required: true }, { name: 'amountCents', label: pick(lang, 'Montant ($)', 'Amount ($)'), type: 'money', required: true }, { name: 'orderId', label: pick(lang, 'Commande Clover', 'Clover order') }]}
          submit={pick(lang, 'Échanger', 'Redeem')} onResult={(j) => `${pick(lang, 'Utilisé', 'Used')} ${money(j.usedCents, lang)} · ${pick(lang, 'reste', 'left')} ${money(j.balanceCents, lang)}`} />
      </Card>
      <Card title={pick(lang, 'Recharger', 'Reload')}>
        <ApiForm action="/api/cards/reload" fields={[{ name: 'code', label: 'Code', required: true }, { name: 'amountCents', label: pick(lang, 'Montant ($)', 'Amount ($)'), type: 'money', required: true }]}
          submit={pick(lang, 'Recharger', 'Reload')} onResult={(j) => `${pick(lang, 'Nouveau solde', 'New balance')} ${money(j.balanceCents, lang)}`} />
      </Card>
      <Card title={pick(lang, 'Activité récente', 'Recent activity')}>
        {entries.length === 0 ? <p className="muted">—</p> : (
          <table><thead><tr><th>{pick(lang, 'Carte', 'Card')}</th><th>{pick(lang, 'Quoi', 'What')}</th><th>{pick(lang, 'Montant', 'Amount')}</th><th>{pick(lang, 'Solde', 'Balance')}</th></tr></thead>
            <tbody>{entries.map((e, i) => <tr key={i}><td>•••• {e.last4}</td><td>{pick(lang, ...TYPE[e.type])}</td><td>{money(e.amountCents, lang)}</td><td>{money(e.balanceAfter, lang)}</td></tr>)}</tbody></table>
        )}
      </Card>
      <DeviceKeys merchantId={merchantId} lang={lang} kind="giftcard" title={pick(lang, 'Appareils (caisse, borne)', 'Devices (register, kiosk)')}
        hint={pick(lang, 'Une clé par appareil qui vend ou échange des cartes (C4ISSE, T4CTILE).', 'One key per device that sells or redeems cards (C4ISSE, T4CTILE).')} />
    </>
  );
}
