# Luuba Connect

A mobile-first social media MVP for Uganda, combining:

- Phone-number sign-in UI (+256)
- Photo and video posts
- Social feed with likes and comments
- Direct messaging interface
- WhatsApp sharing
- TikTok and YouTube profile/publish hand-off links
- Local browser persistence for demo data

## Run locally

Open `index.html` in a modern browser, or serve the folder with any static web server.

## Important production notes

This MVP stores demo accounts, posts, and messages in browser localStorage. Before public launch, replace this with:

1. Firebase or Supabase phone authentication (real SMS OTP).
2. Object storage for uploaded photos/videos.
3. A database and realtime service for accounts, posts, comments, and chats.
4. Server-side moderation and reporting.
5. Official TikTok Content Posting API and YouTube Data API OAuth integrations.
6. WhatsApp sharing/deep links or WhatsApp Business Cloud API where appropriate.

Direct access to a user's WhatsApp, TikTok, or YouTube account requires their consent and the official platform APIs; an application cannot safely bypass those permissions.
