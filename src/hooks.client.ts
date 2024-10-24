import { initializeApp } from 'firebase/app';
import { setupAuthClient } from '$lib/firebase-auth/client';
import {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_AUTH_EMULATOR_HOST
} from '$env/static/public';

// 許可されたドメインでのみ、そのドメインを authDomain として使ってリダイレクト方式によるサインインを行う。
// それ以外の場合はデフォルトの authDomain を使ってポップアップ方式によるサインインを行う。
const defaultAuthDomain = `${PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`;
const allowedAuthDomains = ['sveltekit-firebaseauth-ssr-stripe-demo.pages.dev', defaultAuthDomain];
let authDomain = defaultAuthDomain;
if (location.protocol === 'https:' && allowedAuthDomains.includes(location.host)) {
	authDomain = location.host;
}

// Firebase の公式クライアントの初期化
initializeApp({
	apiKey: PUBLIC_FIREBASE_API_KEY,
	authDomain,
	projectId: PUBLIC_FIREBASE_PROJECT_ID
});

// 認証ライブラリのセットアップ
setupAuthClient({ emulatorHost: PUBLIC_FIREBASE_AUTH_EMULATOR_HOST });
