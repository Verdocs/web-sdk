# Verdocs React Examples

Reference Vite + React + TypeScript app for [`@verdocs/web-sdk-react`](https://www.npmjs.com/package/@verdocs/web-sdk-react) embeds.

| Example | Route | Embed |
|---------|-------|-------|
| **Build** (primary) | `#/build` | `VerdocsBuild` — template builder workflow |
| **Sign** | `#/sign` | `VerdocsSign` — envelope signing (invite credentials) |

## Prerequisites

- Node.js LTS
- A [Verdocs](https://verdocs.com) account

## Quick start

```bash
cd examples/react
npm install
npm run dev
```

Open http://localhost:5173 — default route is `#/build`.

## Authentication (Build)

The **Build** example uses [`VerdocsAuth`](https://developers.verdocs.com/embeds/index.html) for login. When authentication succeeds, the JS SDK persists your session in **localStorage** (via `VerdocsEndpoint`), so reloads keep you signed in until you click **Sign out**.

No `.env` file is required for builder auth.

## White-label styling

All example chrome and SDK overrides live in one file:

**[`src/styles/example-theme.css`](src/styles/example-theme.css)**

1. Edit `--example-*` tokens at the top (colors, spacing, radius, font).
2. Toggle **Custom white-label theme** to add `.verdocs-custom-theme` on `<html>`, which maps those tokens onto Verdocs CSS variables (`--verdocs-primary-color`, `--signer-N-color`, field chrome, etc.).
3. Use the **Color palette** panel on the auth and build screens to preview resolved values.

Import order in [`src/main.tsx`](src/main.tsx):

```ts
import '@verdocs/web-sdk-react/dist/globals.css';
import './styles/example-theme.css';
```

## Build workflow (`VerdocsBuild`)

1. **Upload** — `VerdocsTemplateCreate` (PDF/Word) creates a template.
2. **Recipients / workflow** — `roles` step: add signers; drag to set **sequence** (parallel levels) and **order** (within a level).
3. **Fields** — place signature, initial, date, dropdown, etc. (each recipient needs at least one field).
4. **Preview & send** — assign contacts and send.

Use the **Template ID** and **Step** controls above the embed to open an existing template or jump to a wizard step.

> `VerdocsBuild` does not mount the initial upload UI without a `templateId`. This example composes `VerdocsTemplateCreate` first, then passes the new ID into `VerdocsBuild`.

### Props & events

| Prop | Description |
|------|-------------|
| `templateId` | Template to edit (set via UI or after create) |
| `step` | `attachments` \| `roles` \| `fields` \| `preview` |

| Event | When |
|-------|------|
| `onStepChanged` | Tab or Next navigation |
| `onTemplateUpdated` | Attachments, fields, or roles changed (use for sequence/order logging) |
| `onSend` | Envelope sent from preview |
| `onSdkError` | API or auth error |
| `onCancel` | Cancel on attachments/roles |

## Sign example (`#/sign`)

Uses `envelopeId`, `roleId`, and `inviteCode` from the signer invitation — not builder login. After sending from Build, envelope ID and role may be pre-filled via `sessionStorage`.

## Project structure

```
src/
  pages/
    AuthPage.tsx          # VerdocsAuth (shown when Build has no session)
    BuildPage.tsx         # Build demo
    SignPage.tsx          # Sign demo
  components/
    build/                # VerdocsBuild-specific
    shared/               # Theme, palette, field gallery
    sign/                 # VerdocsSign-specific
  lib/
    authSession.ts        # Session + templateId localStorage helpers
    buildStorage.ts
  styles/
    example-theme.css     # Single theme stylesheet
```

## Monorepo development

1. Build `verdocs-web-sdk` (regenerates React wrappers).
2. In `package.json`, temporarily: `"@verdocs/web-sdk-react": "file:../../verdocs-web-sdk-react"`.
3. `npm install && npm run dev`.
