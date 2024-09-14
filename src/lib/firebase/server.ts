// Firebase Authentication のサーバ側用のコード

import {
	Auth,
	ServiceAccountCredential,
	WorkersKVStoreSingle,
	type KeyStorer
} from 'firebase-auth-cloudflare-workers-x509';
import { type Handle, redirect } from '@sveltejs/kit';
import { firebaseConfig } from './client';
import { GOOGLE_SERVICE_ACCOUNT_KEY } from '$env/static/private';

const projectId = firebaseConfig.projectId;
const serviceAccountCredential = new ServiceAccountCredential(GOOGLE_SERVICE_ACCOUNT_KEY);

export function getAuth(kv?: KVNamespace) {
	const storer = kv ? WorkersKVStoreSingle.getOrInitialize('pubkeys', kv) : makeMemoryStorer();
	return getAuthWithStorer(storer);
}

function getAuthWithStorer(keys: KeyStorer) {
	return Auth.getOrInitialize(projectId, keys, serviceAccountCredential);
}

// Cloudflare 以外の環境では公開鍵をメモリにキャッシュする
function makeMemoryStorer() {
	let val: string | null = null;
	let expireAt: number = 0;
	return {
		async get() {
			if (Date.now() > expireAt) {
				val = null;
			}
			return val ? JSON.parse(val) : null;
		},
		async put(value: string, expirationTtl: number) {
			expireAt = Date.now() + expirationTtl * 1000;
			val = value;
		}
	} satisfies KeyStorer;
}

/**
 * 認証ミドルウェア
 */
export function createAuthHook({ guardPath }: { guardPath?: RegExp }): Handle {
	return async ({ event, resolve }) => {
		// "firebaseapp.com へのプロキシ認証リクエスト" を行うためのプロキシ
		// https://firebase.google.com/docs/auth/web/redirect-best-practices?hl=ja#proxy-requests
		if (event.url.pathname.startsWith('/__/auth')) {
			const newUrl = new URL(event.request.url);
			newUrl.protocol = 'https';
			newUrl.host = `${projectId}.firebaseapp.com`;
			newUrl.port = '';
			const newRequest = new Request(newUrl.toString(), event.request);
			return event.fetch(newRequest);
		}

		// Verify session cookie
		const auth = getAuth(event.platform?.env?.KV);
		const session = event.cookies.get('session');
		if (session) {
			try {
				const decodedToken = await auth.verifySessionCookie(session, false);
				event.locals.currentUser = {
					uid: decodedToken.uid,
					name: decodedToken.name || '',
					email: decodedToken.email
				};
			} catch {
				// ignore
			}
		}

		// 認証ガード
		const currentUser = event.locals.currentUser;
		if (!currentUser && guardPath) {
			const path = event.url.pathname;
			if (path.match(guardPath)) {
				redirect(303, '/login?next=' + encodeURIComponent(event.url.pathname));
			}
		}
		if (currentUser && event.url.pathname === '/login') {
			const next = event.url.searchParams.get('next');
			const url = next ? decodeURIComponent(next) : '/';
			redirect(303, url);
		}

		return resolve(event);
	};
}
