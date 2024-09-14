import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { updateSession } from '$lib/firebase/client';
import { PUBLIC_FIREBASE_API_KEY, PUBLIC_FIREBASE_PROJECT_ID } from '$env/static/public';

export const firebaseConfig = {
	apiKey: PUBLIC_FIREBASE_API_KEY, // これは秘匿情報ではない
	authDomain: `${PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
	projectId: PUBLIC_FIREBASE_PROJECT_ID
};

initializeApp({
	...firebaseConfig,
	authDomain: location.protocol === 'https:' ? location.host : firebaseConfig.authDomain
});

// idToken が変わったら、サーバ側を介してセッショントークンを Set-Cookie させる
getAuth().onIdTokenChanged(async (user) => {
	if (user) {
		updateSession(await user.getIdToken());
	}
});
