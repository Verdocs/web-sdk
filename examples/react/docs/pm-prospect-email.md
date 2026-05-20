# PM prospect email template

Copy, replace placeholders, and send. Pair with the HTML version in [`pm-prospect-email.html`](./pm-prospect-email.html) for preview or export.

## Placeholders

| Placeholder | Description |
|-------------|-------------|
| `{{first_name}}` | Prospect first name |
| `{{company_name}}` | Company display name |
| `{{company_slug}}` | Filename-safe slug (e.g. `acme-corp`) |
| `{{demo_url}}` | Demo / example app URL |
| `{{login_email}}` | Demo account email |
| `{{temporary_password}}` | One-time or initial password |
| `{{sender_name}}` | Your name |
| `{{sender_title}}` | Your title |
| `{{sender_email}}` | Reply-to email |
| `{{sender_phone}}` | Optional phone |

---

## Subject

Your Verdocs demo is ready — {{company_name}}

---

## Body (plain text)

Hi {{first_name}},

Thank you for your interest in Verdocs. We're glad you took the time to explore how agreements can look and feel inside your own product—not a generic template.

YOUR DEMO ACCOUNT

We've set up a demo account for {{company_name}} with your brand theme already applied from your company website. You can sign in, walk through Build and Sign with your colors and styling in place, and adjust the white-label preset further whenever you like.

HOW TO SIGN IN

1. Open your demo: {{demo_url}}
2. Sign in with:
   Email: {{login_email}}
   Temporary password: {{temporary_password}}
3. On first login, you'll be prompted to set a new password (if your environment requires it).
4. From the dashboard, use the Dashboard, Build, and Sign tabs to explore the flows we discussed.

If anything doesn't load or you need access reset, reply to this email and we'll help right away.

FOR YOUR DEVELOPMENT TEAM

See the attached quick-start package for your engineers. It includes source, integration notes, and a short guided walkthrough so they can run the examples locally and start embedding Verdocs in your stack.

We're happy to schedule a short walkthrough if that would be useful—just reply with a few times that work for you.

Best regards,
{{sender_name}}
{{sender_title}}
Verdocs
{{sender_email}} | {{sender_phone}}

Attachment: Verdocs_Quick_Start_{{company_slug}}.zip
