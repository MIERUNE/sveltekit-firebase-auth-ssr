import { hc } from 'hono/client';
import type { AppType } from '../api';

export function makeClient(fetch: typeof global.fetch) {
	return hc<AppType>('', { fetch });
}
