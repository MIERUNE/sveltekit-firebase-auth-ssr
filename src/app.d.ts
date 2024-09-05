// See https://kit.svelte.dev/docs/types#app

import type { BasicPrivateUserInfo } from './lib/user';

// for information about these interfaces
declare global {
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
			env?: {
				KV: KVNamespace;
			};
		}
	}
}

export {};
