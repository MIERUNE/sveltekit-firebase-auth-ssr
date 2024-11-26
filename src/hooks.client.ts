import { initializeApp } from 'firebase/app';
import { setupAuthClient } from '$lib/firebase-auth/client';
import {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_AUTH_EMULATOR_HOST
} from '$env/static/public';

// If the current domain is allowed in Firebase, use it as the authDomain for sign-in by redirect method.
// Otherwise, use the default authDomain for sign-in by popup method.
const defaultAuthDomain = `${PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`;
const allowedAuthDomains = ['sveltekit-firebaseauth-ssr-stripe-demo.pages.dev', defaultAuthDomain];
let authDomain = defaultAuthDomain;
if (location.protocol === 'https:' && allowedAuthDomains.includes(location.host)) {
	authDomain = location.host;
}

// Initialize the official Firebase client
initializeApp({
	apiKey: PUBLIC_FIREBASE_API_KEY,
	authDomain,
	projectId: PUBLIC_FIREBASE_PROJECT_ID
});

// Set up the authentication library
setupAuthClient({ emulatorHost: PUBLIC_FIREBASE_AUTH_EMULATOR_HOST });
