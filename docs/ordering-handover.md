# Online ordering — how it works and how to hand it over

## How an order reaches the kitchen

1. The customer builds an order on /order and checks out on /checkout.
2. The server re-prices the order from the menu (never trusting the browser),
   checks the pickup time and that ordering isn't paused, saves it as
   `pending_payment`, and sends the customer to Stripe Checkout.
3. Stripe tells the site the payment succeeded (`/api/stripe/webhook`). The
   order becomes `new`, and the kitchen is alerted:
   - **Tablet board** (`/kitchen`): flashes and chimes every few seconds until
     someone taps *Accept & start*.
   - **Phone push**: every phone that tapped *Alerts on this phone*.
   - **SMS**: to `KITCHEN_SMS_TO`, if Twilio is configured.
4. The kitchen moves the order New → Preparing → Ready → Picked up. The
   customer's page (`/order/<id>`) follows along.

An order is only ever shown to the kitchen once it is paid.

## Running costs

| What | Cost |
|---|---|
| Card payments (Stripe) | 2.9% + 30¢ per order, no monthly fee |
| Database (Neon) | free tier |
| Hosting (Vercel Pro — required for a business) | ~US$20 / month |
| Tablet board, phone push | free |
| SMS (Twilio, optional) | ~1–2¢ per order |
| Tablet | ~$100 once |

## Setting up the kitchen

- **Tablet:** open `https://<site>/kitchen`, sign in with the staff PIN, tap
  *Start shift* (browsers only allow sound after a tap). Leave it plugged in;
  the board keeps the screen awake.
- **Phones:** open `/kitchen`, sign in, tap *Alerts on this phone* and allow
  notifications. On iPhone, first use Share → *Add to Home Screen*, open the
  board from the home screen icon, then tap the button.
- **Busy?** *Pause online orders* stops new orders until it is tapped again.

## Stripe: what the restaurant does

1. Create a Stripe account at stripe.com (country: Canada, the business's legal
   name) and complete verification: business number, address, the owner's
   details and ID if Stripe asks, the website and a one-line description
   ("Restaurant — online pickup orders").
2. Add the payout bank account in Stripe — never send banking details to the
   developer.
3. Settings → Public details: statement descriptor (`7 NOODLES`), support
   phone and email. Settings → Branding: logo, colour `#862218`.
4. Settings → Customer emails: turn on receipts for payments and refunds.
5. Settings → Team: invite the developer with the **Developer** role (keys and
   webhooks; no access to payouts or bank details).

## Stripe: what the developer does

1. In the restaurant's account, **test mode**: copy the secret key into
   `STRIPE_SECRET_KEY`, and for local testing run
   `stripe listen --forward-to localhost:3000/api/stripe/webhook` and use the
   `whsec_…` it prints as `STRIPE_WEBHOOK_SECRET`.
2. Test: pay with `4242 4242 4242 4242` (any future date, any CVC) — the
   ticket appears on `/kitchen`; `4000 0000 0000 0002` is declined; closing
   the payment page leaves no ticket.
3. For the deployed site: Developers → Webhooks → add endpoint
   `https://<site>/api/stripe/webhook` with `checkout.session.completed` and
   `checkout.session.expired`; put its signing secret in Vercel as
   `STRIPE_WEBHOOK_SECRET`.
4. Launch: repeat 1 and 3 with **live** keys, place a real $1 order, refund it.

## Before launch

1. Vercel Pro, and move the project to the restaurant's team (or keep it and
   bill them).
2. Set `NEXT_PUBLIC_SITE_URL` to the real domain.
3. Change `KITCHEN_PIN` (and tell staff). Changing `KITCHEN_SECRET` signs
   every device out.
4. Optional SMS: add `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM`
   and `KITCHEN_SMS_TO`.
5. Replace the placeholder cancellation line (`orderPolicy` in
   `src/content/contact.ts`) with the restaurant's own.

## Refunds and problems

Refunds are made in the Stripe dashboard. To cancel an order on the board, tap
*Cancel* twice. Orders are stored in the Neon database (`orders` table).

## For developers

- Schema: `db/migrations/*.sql`, applied with `pnpm db:migrate`.
- Code: `src/lib/orders/` (repository, notifications, status rules),
  `src/app/kitchen/` (board), `src/proxy.ts` (PIN guard),
  `src/app/order/[id]/` (customer status).
