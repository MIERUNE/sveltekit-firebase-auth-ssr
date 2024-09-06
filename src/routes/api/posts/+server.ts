import { error, json } from '@sveltejs/kit';

/**
 * てきとうなデモAPI
 */
export const GET = async ({ locals: { currentUser } }) => {
	if (!currentUser) {
		error(401, 'Unauthorized');
	}

	const posts = [];
	for (let i = 0; i < 10; i++) {
		posts.push({
			title: 'ようこそ',
			author: currentUser.name || ''
		});
	}

	return json({
		posts
	});
};
