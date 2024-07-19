// Firebase Authentication のブラウザ側用のコード

import { GoogleAuthProvider } from 'firebase/auth';
import { getAuth, signInWithPopup, type User } from 'firebase/auth';
import { browser } from '$app/environment';
import { invalidate } from '$app/navigation';
import { initializeApp } from 'firebase/app';

// これらは秘匿情報ではない
const firebaseConfig = {
	apiKey: 'AIzaSyCqkxdTAOegNHszt2gHJp8Jkss2v9IZ71c',
	authDomain: 'fukada-delete-me.firebaseapp.com',
	projectId: 'fukada-delete-me',
	storageBucket: 'fukada-delete-me.appspot.com',
	messagingSenderId: '115012131679',
	appId: '1:115012131679:web:07da28782c877808d474ea'
};

if (browser) {
	initializeApp(firebaseConfig);

	const auth = getAuth();
	auth.onIdTokenChanged((user) => {
		if (user) {
			user.getIdToken().then((idToken) => {
				updateSession(idToken);
			});
		}
	});
}

export async function login() {
	const auth = getAuth();
	const provider = new GoogleAuthProvider();
	const cred = await signInWithPopup(auth, provider);
	await updateSession(await cred.user.getIdToken());
	invalidate('auth:session');
}

export async function logout() {
	const auth = getAuth();
	await auth.signOut();
	await updateSession(undefined);
	invalidate('auth:session');
}

async function updateSession(idToken: string | undefined) {
	await fetch('/session', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ idToken })
	});
}
