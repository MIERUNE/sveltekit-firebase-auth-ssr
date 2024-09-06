// Firebase Authentication のサーバ側用のコード

import {
	Auth,
	ServiceAccountCredential,
	WorkersKVStoreSingle,
	type KeyStorer
} from 'firebase-auth-cloudflare-workers-x509';

import { firebaseConfig } from './client';

import { GOOGLE_SERVICE_ACCOUNT_KEY } from '$env/static/private';

export const projectId = firebaseConfig.projectId;
export const serviceAccountCredential = new ServiceAccountCredential(GOOGLE_SERVICE_ACCOUNT_KEY);

export function getAuthWithKV(kv: KVNamespace) {
	const storer = WorkersKVStoreSingle.getOrInitialize('pubkeys', kv);
	return getAuthWithStorer(storer);
}

export function getAuthWithStorer(keys: KeyStorer) {
	return Auth.getOrInitialize(projectId, keys, serviceAccountCredential);
}
