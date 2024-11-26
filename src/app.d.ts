import type { BasicPrivateUserInfo } from './lib/user';
import type { FirebaseIdToken } from 'firebase-auth-cloudflare-workers-x509';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
	interface Env {
		KV: KVNamespace;
	}

	namespace App {
		// interface Error {}
		interface Locals {
			currentIdToken?: FirebaseIdToken;
		}
		interface PageData {
			currentIdToken?: FirebaseIdToken;
			currentUser?: BasicPrivateUserInfo;
		}
		// interface PageState {}
		interface Platform {
			env?: Env;
		}
	}
}

export {};
