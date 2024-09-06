import { getAuthWithKV } from '$lib/firebase/server';

/**
 * access_token (id_token) をセッションクッキーに変換してユーザに持たせるためのエンドポイント
 *
 * Note: FormによるCSRFは、SvleteKitのCSRF対策によって防がれる。
 */
export const POST = async ({ request, cookies, platform }) => {
	const auth = getAuthWithKV(platform?.env?.KV);

	return request
		.json()
		.then(async (data) => {
			const idToken = (data as { idToken?: string }).idToken;
			const days = 14; // 5 min - 14 days
			if (typeof idToken === 'string') {
				const cookie = await auth.createSessionCookie(idToken, {
					expiresIn: 1000 * 60 * 60 * 24 * days
				});
				cookies.set('session', cookie, {
					path: '/',
					maxAge: 60 * 60 * 24 * days,
					sameSite: 'lax'
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
