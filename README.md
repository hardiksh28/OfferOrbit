# OfferOrbit

**Big ambitions. Next moves.** A personal command center for an early-career remote job search.

Dark charcoal surfaces, electric lime accents, orbital graphics, responsive layouts, keyboard-accessible dialogs and reduced-motion support.

## Included

- Dashboard, searchable companies and contacts, application pipeline with editable stages
- Follow-up schedule and completion tracking (in-app reminders only)
- LinkedIn and email templates, editable drafts, clipboard copying
- Skills, matching evidence, gaps, company problems and proposed solutions
- Interview and assessment notes, target roles and profile editing
- Email/password accounts, per-user saved workspaces and private resume storage
- Opt-in fictional demo mode and JSON backup export

## Run locally

Use Node.js 24 LTS (see `.nvmrc`).

```sh
npm install
cp .env.example .env.local
npm run dev
```

Without Supabase variables, the interface still loads and offers an example workspace. Demo changes are not persisted. Never enter real information in demo mode expecting it to save.

## Connect Supabase

1. Create a Supabase project.
2. Run `supabase/setup.sql` **once** in its SQL Editor. It creates the workspace table, enables row-level security, and creates a private resumes bucket with owner-specific policies. Do not skip this step. If modifying an existing installation, apply reviewed migrations instead of rerunning policy creation.
3. Copy your project URL and publishable/anon key into `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

Use only the publishable/anon key. Never place a service-role or secret key in a `NEXT_PUBLIC_` variable.

4. Enable email/password authentication. Set Authentication → URL Configuration → Site URL to your production URL, and add your local development URL to allowed redirects if testing confirmation there. Configure an email provider if required by your usage.
5. Create an account from the app. If confirmation is enabled, confirm your email before signing in. Each account has its own workspace and resume objects, protected by database/storage policies.

Uploads go directly to Supabase Storage; there is no Vercel upload endpoint or function-size bottleneck. Accepted resumes: PDF, DOCX, TXT, maximum 10 MB. Resume content is not automatically parsed.

## Push to GitHub

The repository root must contain `package.json`, `app`, `lib`, and `supabase` (the contents of this folder).

```sh
git init
git add .
git commit -m "Build OfferOrbit career workspace"
git branch -M main
git remote add origin https://github.com/hardiksh28/OfferOrbit.git
git push -u origin main
```

For an existing repository, inspect and merge its current content first. Do not force-push. The `.gitignore` excludes credentials, dependencies, and generated builds.

## Deploy on Vercel

1. Import `hardiksh28/OfferOrbit` in Vercel.
2. Framework: **Next.js**. Root directory: the directory containing this `package.json`.
3. Node.js: **24.x**. Install: `npm install`. Build: `npm run build`. Keep the default Next.js output directory.
4. Add both Supabase environment variables above for Production (and Preview if needed), then deploy.
5. Set Supabase's Site URL to the final Vercel URL. Redeploy after changing public environment variables because they are included in the client build.

No Cloudflare, ChatGPT authentication, Sites runtime, server secrets or database service key is required.

## Checks

```sh
npm test
npm run typecheck
npm run build
```

Before real use, create two test accounts and verify each can only read its own workspace and files. Check create/edit/delete, stage changes, follow-up completion, reload persistence, sign-out, resume upload/download, and the mobile layout.

## Current verification and limitations

Validation unit tests and TypeScript syntax checks can run with installed tooling. Dependency installation, full typechecking, production build, browser checks and live Supabase authorization checks have not completed in the authoring environment because external hosts fail DNS resolution. Do not treat the source package as a verified production build.

The workspace is saved as a single JSON document per user. Editing from multiple tabs/devices at once can overwrite older changes; use one active editing tab. Follow-ups are in-app reminders, not email/push notifications. Outreach drafts are never sent automatically. There is no AI scoring or resume parsing. Account recovery UI is not included; account administration remains in Supabase. Export backup downloads records, not resume file bytes. A newly uploaded resume with a different extension does not remove older stored versions.

No lockfile is included because package resolution was unavailable. After a successful `npm install`, commit the generated `package-lock.json` for reproducible deployments.
