// Firebase Authentication のブラウザ側用のコード

import {
	GoogleAuthProvider,
	getAuth,
	signInWithPopup,
	signInWithRedirect,
	getRedirectResult,
	connectAuthEmulator,
	type UserCredential,
	type AuthProvider
} from 'firebase/auth';
import { invalidate } from '$app/navigation';
import { getApp } from 'firebase/app';
import { env } from '$env/dynamic/public';

let redirectResultPromise: Promise<UserCredential | null>;

export function setupAuthClient() {
	const auth = getAuth();

	// PUBLIC_FIREBASE_AUTH_EMULATOR_HOST をセットすることで Firebase Auth Emulator を利用できる
	if (env.PUBLIC_FIREBASE_AUTH_EMULATOR_HOST) {
		connectAuthEmulator(auth, `http://${env.PUBLIC_FIREBASE_AUTH_EMULATOR_HOST}`);
	}

	// リダイレクト方式によるサインイン結果を処理するハンドラをセットする
	resetRedirectResultHandler();

	// idToken が変わったらセッションクッキーを更新する
	auth.onIdTokenChanged(async (user) => {
		if (user) {
			updateSession(await user.getIdToken());
		}
	});
}

/**
 * リダイレクト方式によるサインインの結果を待機する
 */
export async function waitForRedirectResult() {
	return redirectResultPromise;
}

export async function signInWithGoogle() {
	const provider = new GoogleAuthProvider();
	await signInWithProvider(provider);
}

export async function signInWithProvider(provider: AuthProvider, withRedirect = true) {
	const auth = getAuth();
	const app = getApp();
	if (withRedirect && location.host === app.options.authDomain) {
		// リダイレクト方式によるサインイン (モバイル環境などでのポップアップブロック対策)
		signInWithRedirect(auth, provider);
	} else {
		// authDomain と location.host が異なる場合はポップアップ方式によるサインインにフォールバックする
		const cred = await signInWithPopup(auth, provider);
		await updateSession(await cred.user.getIdToken());
		invalidate('auth:session');
	}
}

export async function signOut() {
	await updateSession(undefined);
	invalidate('auth:session');
	await getAuth().signOut();
	resetRedirectResultHandler();
}

let previousIdToken: string | undefined = undefined;

async function updateSession(idToken: string | undefined) {
	if (idToken === previousIdToken) {
		return;
	}
	await fetch('/session', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ idToken })
	});
	previousIdToken = idToken;
}

function resetRedirectResultHandler() {
	redirectResultPromise = getRedirectResult(getAuth());
	redirectResultPromise.then(async (result) => {
		if (result) {
			await updateSession(await result.user.getIdToken());
			invalidate('auth:session');
		}
	});
}
