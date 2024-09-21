import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
	if (!locals.currentIdToken) {
		redirect(303, '/login?next=' + encodeURIComponent(url.pathname + url.search));
	}
}
