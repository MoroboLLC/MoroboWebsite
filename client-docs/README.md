# Morobo — Client Document Templates

Reusable master templates for client onboarding (proposals, agreements, onboarding).
Customize a copy per client by filling in the `{{PLACEHOLDERS}}`.

## ⚠️ Important

- **This folder is NOT published.** It's excluded from the live site in
  `.github/workflows/deploy.yml` (the `--exclude='client-docs'` line). Nothing here
  appears on morobo.org.
- **These are generic templates only — never commit filled-in client copies here.**
  This repo is **public**, so a client's real name, pricing, or signature must not
  live in it. Filled/signed copies go in **Google Drive (morobo.llc@gmail.com)**.
- These drafts are **not legal advice.** Have counsel review the agreement before
  relying on it, especially as Morobo scales to more clients.

## How to use

1. Copy a template's contents into a new doc (Google Docs / Word) for the client.
2. Replace every `{{PLACEHOLDER}}` (see list below).
3. Export to PDF for review; save the working copy in Google Drive.
4. When the client is ready to sign, use the agreed signing method.

## Placeholders

| Placeholder | Meaning |
|---|---|
| `{{CLIENT_BUSINESS}}` | Client's business name (e.g., Yogi's Deli & Grill) |
| `{{CLIENT_CONTACT}}` | Primary contact name |
| `{{CLIENT_TITLE}}` | Their title (e.g., Owner) |
| `{{CLIENT_EMAIL}}` | Their email |
| `{{PROJECT_SUMMARY}}` | One-line description of the app |
| `{{CLIENT_GOAL_QUOTE}}` | The client's goal in their own words |
| `{{SCOPE_ROWS}}` | The itemized module/price table |
| `{{STANDARD_VALUE}}` | Standard build value (e.g., $7,050) |
| `{{DISCOUNT}}` | Discount applied (e.g., –$3,550) |
| `{{TOTAL_ONE_TIME}}` | Final one-time price (e.g., $3,500) |
| `{{MONTHLY}}` | Monthly plan (e.g., $60/mo) |
| `{{DEPOSIT}}` / `{{BALANCE}}` | 50% deposit / 50% balance amounts |
| `{{EFFECTIVE_DATE}}` | Date of last signature |
| `{{MOROBO_ADDRESS}}` | Morobo LLC business mailing address |
| `{{SIGNATORY_NAME}}` / `{{SIGNATORY_TITLE}}` | Morobo signer (e.g., Robert McCarthy, Founder) |
| `{{GOVERNING_STATE}}` | Governing-law state (default: Texas) |

## Files

- `templates/statement-of-work.template.md` — itemized scope + pricing (review + sign)
- `templates/app-development-agreement.template.md` — the contract (review + sign)
- `templates/onboarding-welcome.template.md` — welcome + checklist (review)
