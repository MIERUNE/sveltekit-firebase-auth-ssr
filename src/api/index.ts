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
		const posts = Array.from({ length: 20 }, () => ({
			title: 'Great Article',
			author: currentUser.name
		}));
		return c.json(posts);
	});

export default app;

export type AppType = typeof app;
