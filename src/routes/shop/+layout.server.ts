import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
	if (!locals.currentIdToken) {
		redirect(307, '/login?next=' + encodeURIComponent(url.pathname + url.search));
	} else if (locals.currentIdToken.email_verified === false) {
		redirect(307, '/verify_email');
	}
}
