import { getUser } from '$lib/firebase/server';
import type { BasicPrivateUserInfo } from '../lib/user';

export const load = async ({ locals, depends }) => {
	const { uid } = locals;

	depends('auth:session');

	let user: BasicPrivateUserInfo | undefined = undefined;
	if (uid) {
		const userRecord = await getUser(uid); // TODO: Use our very own user backend instead
		user = {
			uid: userRecord.uid,
			displayName: userRecord.displayName || uid,
			email: userRecord.email || ''
		};
	}
	return {
		user
	};
};
