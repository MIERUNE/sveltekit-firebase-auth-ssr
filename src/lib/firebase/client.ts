// Firebase Authentication のブラウザ側用のコード

import {
	GoogleAuthProvider,
	getAuth,
	signInWithPopup,
	signInWithRedirect,
	getRedirectResult
} from 'firebase/auth';
import { invalidate } from '$app/navigation';

export async function waitForRedirectResult() {
	// リダイレクト方式によるサインイン結果があるときは、それを処理する
	const auth = getAuth();
	const result = await getRedirectResult(auth);
	if (result) {
		const idToken = await result.user.getIdToken();
		await updateSession(idToken);
		invalidate('auth:session');
		return idToken;
	}
	return null;
}

export async function login() {
	const auth = getAuth();
	const provider = new GoogleAuthProvider();
	if (location.protocol === 'https:') {
		// 通常はリダイレクト方式によるサインインを行う
		// (モバイル環境などでのポップアップブロック対策)
		signInWithRedirect(auth, provider);
	} else {
		// HTTP環境 (i.e. ローカル開発環境) ではポップアップ方式でログインする
		// signInWithRedirect は HTTPS でしか機能しないため
		const cred = await signInWithPopup(auth, provider);
		await updateSession(await cred.user.getIdToken());
		invalidate('auth:session');
	}
}

export async function logout() {
	await updateSession(undefined);
	invalidate('auth:session');
	await getAuth().signOut();
}

export async function updateSession(idToken: string | undefined) {
	await fetch('/session', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ idToken })
	});
}
