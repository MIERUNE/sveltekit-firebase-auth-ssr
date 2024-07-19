import { sequence } from '@sveltejs/kit/hooks';
import { type Handle, redirect } from '@sveltejs/kit';
import { verifySessionCookie } from '$lib/firebase/server';

/**
 * セッションクッキーの検証
 */
const verifySessionToken: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');
	if (session) {
		try {
			const decoded = await verifySessionCookie(session);
			event.locals.uid = decoded.uid;
		} catch {
			// ignore
		}
	}
	return resolve(event);
};

/**
 * 認証ガード
 */
const authGuard: Handle = async ({ event, resolve }) => {
	const uid = event.locals.uid;

	if (!uid && event.url.pathname.startsWith('/private')) {
		return redirect(303, '/login?next=' + encodeURIComponent(event.url.pathname));
	}
	if (uid && event.url.pathname === '/login') {
		const next = event.url.searchParams.get('next');
		const url = next ? decodeURIComponent(next) : '/private';
		return redirect(303, url);
	}

	return resolve(event);
};

export const handle: Handle = sequence(verifySessionToken, authGuard);
