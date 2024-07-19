import { getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
	initializeApp({
		credential: applicationDefault()
	});
}

export async function createSessionCookie(idToken: string, days: number) {
	return await getAuth().createSessionCookie(idToken, {
		expiresIn: 1000 * 60 * 60 * 24 * days
	});
}

export async function verifySessionCookie(session: string) {
	const checkRevoked = false;
	return await getAuth().verifySessionCookie(session, checkRevoked);
}

export async function getUser(uid: string) {
	return await getAuth().getUser(uid);
}
