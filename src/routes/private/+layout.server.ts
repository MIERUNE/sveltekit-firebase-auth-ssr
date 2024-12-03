import { redirect } from '@sveltejs/kit';

export async function load({ locals, url, depends }) {
	depends('auth:session');
	if (!locals.currentIdToken) {
		redirect(307, '/login?next=' + encodeURIComponent(url.pathname + url.search));
	}
}
