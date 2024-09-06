import { Hono } from 'hono';

export type Post = {
	title: string;
	author: string;
};

const app = new Hono().get('/api/posts', async (c) => {
	const posts: Post[] = [];
	for (let i = 0; i < 20; i++) {
		posts.push({
			title: '素晴しい記事',
			author: '名無し'
		});
	}
	return c.json(posts);
});

export default app;

export type AppType = typeof app;
