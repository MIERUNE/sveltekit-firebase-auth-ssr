// See https://kit.svelte.dev/docs/types#app

import type { BasicPrivateUserInfo } from './lib/user';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			uid?: string;
		}
		interface PageData {
			currentUser?: BasicPrivateUserInfo;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
