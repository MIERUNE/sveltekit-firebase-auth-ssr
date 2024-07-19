import { GoogleAuthProvider } from 'firebase/auth';
import { getAuth, signInWithPopup, type User } from 'firebase/auth';
import { browser } from '$app/environment';
import { invalidate } from '$app/navigation';
import { initializeApp } from 'firebase/app';

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
}

export async function login() {
	const auth = getAuth();
	const provider = new GoogleAuthProvider();
	await signInWithPopup(auth, provider);
	updateSession(auth.currentUser);
}

export async function logout() {
	const auth = getAuth();
	await auth.signOut();
	updateSession(auth.currentUser);
}

export async function getUser() {
	const auth = getAuth();
	await auth.authStateReady();
}

function updateSession(user: User | null) {
	if (user) {
		user.getIdToken().then((idToken) => {
			fetch('/session', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ idToken: idToken })
			}).then(() => {
				invalidate('auth:session');
			});
		});
	} else {
		fetch('/session', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({})
		}).then(() => {
			invalidate('auth:session');
		});
	}
}
