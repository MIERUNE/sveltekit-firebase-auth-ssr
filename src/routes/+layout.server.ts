export const load = async ({ locals, depends }) => {
	// hooks.server.ts で得たユーザ情報を locals 経由で受けとって、配下のレイアウトおよびページに data として渡す
	depends('auth:session');
	return {
		currentIdToken: locals.currentIdToken,
		currentUser: locals.currentIdToken && {
			uid: locals.currentIdToken.uid,
			email: locals.currentIdToken.email,
			email_verified: locals.currentIdToken.email_verified
		}
	};
};
