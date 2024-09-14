import { makeClient } from '$lib/api';

export const load = async ({ fetch }) => {
	const client = makeClient(fetch);
	const res = await client.api.posts.$get();
	if (!res.ok) {
		return {
			posts: []
		};
	}
	const posts = await res.json();
	return {
		posts
	};
};
