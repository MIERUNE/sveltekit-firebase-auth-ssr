// Firebase Authentication for client-side

import {
	GoogleAuthProvider,
	TwitterAuthProvider,
	getAuth,
	signInWithPopup,
	signInWithRedirect,
	getRedirectResult,
	connectAuthEmulator,
	type UserCredential,
	type AuthProvider
} from 'firebase/auth';
import { invalidate } from '$app/navigation';
import { getApp } from 'firebase/app';

/** re-export the official firebase/auth for convenience */
export * from 'firebase/auth';

let redirectResultPromise: Promise<UserCredential | null>;

export function setupAuthClient(options: { emulatorHost?: string }) {
	const auth = getAuth();

	// You can use the Firebase Auth Emulator by setting the emulatorHost option
	if (options.emulatorHost) {
		connectAuthEmulator(auth, `http://${options.emulatorHost}`);
	}

	// Set up the handler to process the sign-in result by redirect method
	resetRedirectResultHandler();

	// Update the session cookie when the idToken changes
	auth.onIdTokenChanged(async (user) => {
		if (user) {
			updateSession(await user.getIdToken());
		}
	});
}

/**
 * Wait for the result of sign-in by redirect method
 */
export async function waitForRedirectResult() {
	return redirectResultPromise;
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
	const provider = new GoogleAuthProvider();
	await signInWithProvider(provider);
}

/**
 * Sign in with Twitter
 */
export async function signInWithTwitter() {
	const provider = new TwitterAuthProvider();
	await signInWithProvider(provider);
}

export async function signInWithProvider(provider: AuthProvider, withRedirect = true) {
	const auth = getAuth();
	const app = getApp();
	if (withRedirect && location.host === app.options.authDomain) {
		// Sign-in with redirect (to prevent popup blocking especially on mobile)
		signInWithRedirect(auth, provider);
	} else {
		// Fall back to sign-in by popup method if authDomain is different from location.host
		const cred = await signInWithPopup(auth, provider);
		await updateSession(await cred.user.getIdToken());
		invalidate('auth:session');
	}
}

/**
 * Sign out
 */
export async function signOut() {
	await updateSession(undefined);
	invalidate('auth:session');
	await getAuth().signOut();
	resetRedirectResultHandler();
}

let previousIdToken: string | undefined = undefined;

async function updateSession(idToken: string | undefined) {
	if (idToken === previousIdToken) {
		return;
	}
	await fetch('/session', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ idToken })
	});
	previousIdToken = idToken;
}

function resetRedirectResultHandler() {
	redirectResultPromise = getRedirectResult(getAuth());
	redirectResultPromise.then(async (result) => {
		if (result) {
			await updateSession(await result.user.getIdToken());
			invalidate('auth:session');
		}
	});
}
