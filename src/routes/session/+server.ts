import type { RequestHandler } from './$types';
import { createSessionCookie } from '$lib/firebase/server';

export const POST: RequestHandler = async ({ request, cookies }) => {
	return request
		.json()
		.then(async (data) => {
			const idToken = data.idToken;
			const days = 14;
			if (typeof idToken === 'string') {
				const cookie = await createSessionCookie(idToken, days);
				cookies.set('session', cookie, {
					path: '/',
					maxAge: 60 * 60 * 24 * days,
					sameSite: 'strict'
				});
			} else {
				cookies.delete('session', { path: '/' });
			}
			return new Response('ok');
		})
		.catch(() => {
			return new Response('Invalid JSON', { status: 400 });
		});
};
