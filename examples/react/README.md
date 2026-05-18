# Verdocs React Examples

Reference application for integrating [`VerdocsBuild`](https://developers.verdocs.com/embeds/index.html) and [`VerdocsSign`](https://developers.verdocs.com/embeds/index.html) from `@verdocs/web-sdk-react`. Use the **Build** tab for the template builder workflow; use the **Sign** tab for the envelope signing experience.

The Build page walks through upload → recipients/workflow → fields → send, demonstrates white-label styling via CSS variables, and logs SDK events including recipient **sequence** and **order**.

## Prerequisites

- Node.js LTS
- A [Verdocs](https://verdocs.com) account (username/password for API auth)

## Quick start

```bash
cd examples/react/verdocs-build-example
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
```

Open http://localhost:5173 (default route: `#/build`). Use `#/sign` for the signing demo.

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_VERDOCS_USERNAME` | Build tab | Verdocs login email |
| `VITE_VERDOCS_PASSWORD` | Build tab | Verdocs login password |
| `VITE_VERDOCS_TEMPLATE_ID` | No | Skip creation; open an existing template in the builder |

Signing credentials (`envelopeId`, `roleId`, `inviteCode`) are entered on the **Sign** tab in the app — not via environment variables.

## Four-step workflow

1. **Upload** — `VerdocsTemplateCreate` uploads a PDF or Word file and creates a template.
2. **Recipients / workflow** — `VerdocsBuild` step `roles`: add signers, approvers, CC roles; drag to set signing order.
3. **Fields** — step `fields`: place signature, initial, date, dropdown, and other fields per recipient (each recipient needs at least one field).
4. **Preview & send** — step `preview`: assign contacts and send the envelope.

> **Note:** `VerdocsBuild` alone does not mount the initial upload UI when `templateId` is omitted. This example composes `VerdocsTemplateCreate` first, then passes the new `templateId` into `VerdocsBuild` — a common integration pattern until greenfield upload is wired inside the embed.

## React integration

```tsx
import { VerdocsBuild } from '@verdocs/web-sdk-react';
import '@verdocs/web-sdk-react/dist/globals.css';

<VerdocsBuild
  templateId={templateId}
  step="attachments"
  onStepChanged={(e) => console.log('step', e.detail)}
  onTemplateUpdated={(e) => console.log('template', e.detail)}
  onSend={(e) => console.log('sent', e.detail)}
  onSdkError={(e) => console.error(e.detail)}
/>
```

Authenticate once with `@verdocs/js-sdk` before rendering (see `src/lib/verdocsAuth.ts`):

```typescript
import { authenticate, VerdocsEndpoint } from '@verdocs/js-sdk';

const endpoint = VerdocsEndpoint.getDefault();
const { access_token } = await authenticate(endpoint, {
  grant_type: 'password',
  username,
  password,
});
endpoint.setToken(access_token);
endpoint.loadSession();
```

## Sequence vs order

Recipients are modeled as template **roles** with two ordering fields:

| Field | Meaning |
|-------|---------|
| `sequence` | Workflow level (1, 2, 3…). Roles sharing a sequence sign in **parallel**. |
| `order` | Position within that level (1, 2, 3…). Adjust by dragging roles in the **Workflow** tab. |

At send time, `verdocs-send` groups roles by `sequence` so signers at level 2 receive the envelope only after level 1 completes.

The example event log prints roles sorted by `(sequence, order)` whenever `onTemplateUpdated` fires.

## White-label styling

Field components do not accept a `theme` prop. Customize appearance with CSS variables on `:root` (or a scoped wrapper).

Import defaults, then your overrides:

```ts
import '@verdocs/web-sdk-react/dist/globals.css';
import './styles/verdocs-custom-theme.css';
```

Toggle the `verdocs-custom-theme` class on `<html>` (see `ThemeToggle.tsx`). Key variables:

| Variable | Affects |
|----------|---------|
| `--verdocs-field-background` | Signing field fill |
| `--verdocs-field-border` | Field outline |
| `--verdocs-field-radius` | Corner radius |
| `--verdocs-field-text-color` | Labels, inputs, chevrons |
| `--verdocs-required-field-border` | Required state |
| `--signer-1-color` … `--signer-10-color` | Recipient highlight (`.signer-N`) |
| `--signer-N-color-faded` | Default background for signer N |
| `--verdocs-primary-color` | Buttons, links, accents |
| `--verdocs-primary-font` | Typography |
| `--adp-accent-color` | Date picker calendar (on `.air-datepicker`) |

See `src/styles/verdocs-custom-theme.css` and the Field styling gallery section in the running app.

## `VerdocsBuild` props & events

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `templateId` | `string \| null` | `null` | Template to edit |
| `step` | `'attachments' \| 'roles' \| 'fields' \| 'preview'` | `'preview'` | Active wizard step |
| `endpoint` | `VerdocsEndpoint` | default | Advanced: custom API endpoint |

### Events

| React prop | When |
|------------|------|
| `onStepChanged` | User changes wizard tab |
| `onTemplateUpdated` | Attachments, fields, or roles changed |
| `onSend` | User sent from preview (`{ recipients, name, template_id }`) |
| `onSdkError` | Auth or API error |
| `onCancel` | Cancel on attachments/roles |
| `onTemplateCreated` | Declared on embed but not emitted by current build tree |
| `onRolesUpdated` | Declared but not forwarded; use `onTemplateUpdated` for role changes |

`onSend` fires after `verdocs-send` creates the envelope via the API. The example saves `envelope_id` and the first signer’s `role_name` to `sessionStorage` so the **Sign** tab can pre-fill context (invite code must still come from the invitation if the API does not return it).

## Sign page (`VerdocsSign`)

Unlike `VerdocsBuild`, the signing embed does **not** use your builder username/password. It creates its own signing session from `envelopeId`, `roleId`, and `inviteCode`.

```tsx
import { VerdocsSign } from '@verdocs/web-sdk-react';
import '@verdocs/web-sdk-react/dist/globals.css';

<VerdocsSign
  envelopeId={envelopeId}
  roleId={roleId}
  inviteCode={inviteCode}
  headerTargetId="verdocs-sign-header-host"
  toolbarStyle="menu"
  onEnvelopeLoaded={(e) => console.log('loaded', e.detail)}
  onEnvelopeUpdated={(e) => console.log('updated', e.detail.event, e.detail.envelope)}
  onSdkError={(e) => console.error(e.detail)}
/>
```

### Build → Sign handoff

1. Send an envelope from the **Build** tab.
2. Open the **Sign** tab — envelope ID and role are pre-filled from `sessionStorage`.
3. Enter the invite code from the signer invitation email or URL, then click **Start signing**.

The Sign tab includes the same **White-label styling** banner as Build; toggle it to apply `verdocs-custom-theme.css` to the signing embed.

### `VerdocsSign` props & events

| Prop | Type | Description |
|------|------|-------------|
| `envelopeId` | `string` | Envelope to sign |
| `roleId` | `string` | Recipient role (e.g. `Recipient 1`) |
| `inviteCode` | `string` | Signer invite code |
| `headerTargetId` | `string` | Optional DOM id to host the toolbar |
| `toolbarStyle` | `'menu' \| 'controls'` | Toolbar layout |

| React prop | When |
|------------|------|
| `onEnvelopeLoaded` | Envelope loaded for signing |
| `onEnvelopeUpdated` | Envelope state changed |
| `onSdkError` | Invalid invite, auth failure, etc. |

## Monorepo development

To test against local packages without publishing:

1. Build `verdocs-web-sdk` (generates React wrappers).
2. In this example’s `package.json`, temporarily set:
   ```json
   "@verdocs/web-sdk-react": "file:../../../verdocs-web-sdk-react"
   ```
3. Run `npm install` and `npm run dev`.

## Project structure

```
src/
  App.tsx                 # Hash router + nav shell
  pages/
    BuildPage.tsx         # Builder auth + VerdocsBuild demo
    SignPage.tsx          # VerdocsSign demo
  components/
    BuildWorkflow.tsx     # VerdocsTemplateCreate → VerdocsBuild
    VerdocsBuildPanel.tsx # VerdocsBuild + event wiring
    SignPanel.tsx         # VerdocsSign embed
    SigningCredentialsForm.tsx
    FieldStyleGallery.tsx # Field CSS variable demos
    ThemeToggle.tsx       # verdocs-custom-theme class
    EventLog.tsx
  lib/
    verdocsAuth.ts
    signingSession.ts     # Types + sessionStorage after send
    useHashRoute.ts
    formatRoles.ts
  styles/
    verdocs-custom-theme.css
    app.css
```
