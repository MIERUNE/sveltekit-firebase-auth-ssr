import { Hono } from 'hono';
import { authMiddleware, ensureUser, type AuthVariables } from './auth';

export type Post = {
	title: string;
	author: string;
};

const app = new Hono<{ Bindings: Env; Variables: AuthVariables }>()
	.use(authMiddleware)
	.get('/api/posts', async (c) => {
		const currentUser = ensureUser(c);
		const posts: Post[] = [];
		for (let i = 0; i < 20; i++) {
			posts.push({
				title: '素晴しい記事',
				author: currentUser.name
			});
		}
		return c.json(posts);
	});

export default app;

export type AppType = typeof app;
