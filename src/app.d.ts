import type { BasicPrivateUserInfo } from './lib/user';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
	interface Env {
		KV: KVNamespace;
	}

	namespace App {
		// interface Error {}
		interface Locals {
			currentUser?: BasicPrivateUserInfo;
		}
		interface PageData {
			currentUser?: BasicPrivateUserInfo;
		}
		// interface PageState {}
		interface Platform {
			env?: Env;
		}
	}
}

export {};
