import app from '../../../api';
import type { RequestHandler } from './$types';
import type { ExecutionContext } from 'hono';

const handler: RequestHandler = async ({ request, platform }) => {
	// Hono に API リクエストを処理させる
	const pl = (platform || {}) as { env?: object; context?: ExecutionContext };
	return app.fetch(request, pl.env, pl.context);
};

export const GET = handler;
export const HEAD = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
