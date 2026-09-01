# Luuba TV 256

The official web experience for Luuba TV 256: Ugandan media, a priced Haojue motorcycle catalogue, WhatsApp sales and loan enquiries, and a server-side OpenAI sales assistant.

## Features

- Responsive motorcycle catalogue with verified listed prices
- YouTube and media/editorial section
- Loan enquiry form that hands off to WhatsApp
- AI sales assistant with a safe catalogue fallback when no API key is configured
- Search and social metadata for `www.luubatv256.com`

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and add the server-only OpenAI key:

```bash
OPENAI_API_KEY=your_project_key
OPENAI_MODEL=gpt-5.5
```

Without the key, the assistant still answers from the verified catalogue. Never prefix the key with `NEXT_PUBLIC_`.

## Deployment

Deploy the project to Vercel, add `OPENAI_API_KEY` to the project environment, then attach both `luubatv256.com` and `www.luubatv256.com`. GitHub Pages is not used because it cannot run the server-side `/api/assistant` route.

Before launch, confirm every price and financing offer with the sales team.
