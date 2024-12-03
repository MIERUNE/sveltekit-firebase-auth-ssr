# @mierune/sveltekit-firebase-auth-ssr

![NPM Version](https://img.shields.io/npm/v/%40mierune%2Fsveltekit-firebase-auth-ssr)

[WIP]

A package for integrating Firebase Authentication into SvelteKit, designed specifically for Server-Side Rendering (SSR).

It works not only in Node.js but also on Cloudflare Workers/Pages ([MIERUNE/firebase-auth-cloudflare-workers-x509](https://github.com/MIERUNE/firebase-auth-cloudflare-workers-x509)).

Demo: https://sveltekit-firebaseauth-ssr-stripe-demo.pages.dev/

## Installation

```bash
npm install -D @mierune/sveltekit-firebase-auth-ssr
```

## Usage

1. **Prerequisites**:
   - Project ID of the Firebase project
   - API Key of the Firebase project
   - Firebase Service Account Key (from Google Cloud)
2. **Add the necessary code to the following files**:
   - `src/hooks.client.ts` ([Example](./src/hooks.client.ts))
   - `src/hooks.server.ts` ([Example](./src/hooks.server.ts))
   - `src/app.d.ts` ([Example](./src/app.d.ts))
   - `src/routes/+layout.server.ts` ([Example](./src/routes/+layout.server.ts))
3. **Implement sign-in and sign-out functionality** in your application. ([Example](./src/routes/login/+page.svelte))
4. Use the user information and implement database integration if needed.
5. Ensure that the required environment variables are set in the execution environment.


## Development

```bash
direnv allow
pnpm dev-in-emulator
```