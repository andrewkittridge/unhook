# Unhook

They built a maze. We drew the exit.

Search a company. Get the real cancel path, the retention-call script, a certified-mail letter, and a cancel-by date. Bleed list tracks what you still pay — locally, no bank login.

The shareable part is the point:

- **Unhooked cards** — mark a bleed item done. Get a receipt: company, yearly back, date. No name, no account ID. Native share, PNG, copy link, or post on X.
- **Bleed receipts** — the yearly leak and a count. Company names stay on this device.
- **Playbook links** — send Planet Fitness, SiriusXM, Adobe, Xfinity, or any hard-list map to someone still paying.
- **Missing-playbook requests** — if search misses, share the request. Three people asking is how a company hits the list.

A friend who opens a card link sees the card, then the playbook. Cards live in the URL hash. Nothing is uploaded.

## Why

- 60% of surveyed users say cancel options are hidden or missing.
- People close bank accounts to stop gym drafts.
- Rocket Money-class apps take a cut and want Plaid. This does not.
- People do not share a settings page. They share a number that hurts, a script that worked, a card that says they got out.

## Stack

Static HTML / CSS / JS. No build step. No backend. `localStorage` for the bleed list.

```bash
python3 -m http.server 4173
# open http://127.0.0.1:4173
npm test   # node --test
```

Not legal advice. Club, plan, and state rules move. Screenshot every confirmation.
