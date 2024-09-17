import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
	if (locals.currentUser) {
		const next = url.searchParams.get('next');
		const nextHref = next ? decodeURIComponent(next) : '/';
		redirect(303, nextHref);
	}
};
