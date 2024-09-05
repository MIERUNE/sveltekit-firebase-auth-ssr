// Firebase Authentication のサーバ側のコード

import { Auth, type KeyStorer, ServiceAccountCredential } from 'firebase-auth-cloudflare-workers';

import { GOOGLE_SERVICE_ACCOUNT_KEY } from '$env/static/private';

function getAuth(keys: KeyStorer) {
	return Auth.getOrInitialize(
		'fukada-delete-me',
		keys,
		new ServiceAccountCredential(GOOGLE_SERVICE_ACCOUNT_KEY)
	);
}

export async function createSessionCookie(keys: KeyStorer, idToken: string, days: number) {
	return await getAuth(keys).createSessionCookie(idToken, {
		expiresIn: 1000 * 60 * 60 * 24 * days
	});
}

export async function verifySessionCookie(keys: KeyStorer, session: string) {
	const checkRevoked = false;
	return await getAuth(keys).verifySessionCookie(session, checkRevoked);
}

export async function getUser(keys: KeyStorer, uid: string) {
	return await getAuth(keys).getUser(uid);
}
