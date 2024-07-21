export const load = async ({ fetch }) => {
	const res = await fetch('/api/posts');
	const posts = (await res.json())['posts'];
	return {
		posts
	};
};
