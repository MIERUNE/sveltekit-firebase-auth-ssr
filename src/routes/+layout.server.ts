export const load = async ({ locals, depends }) => {
	// hooks.server.ts で得たユーザ情報を locals 経由で受けとり、data として配下のレイアウトおよびページに渡す
	depends('auth:session');
	return {
		currentUser: locals.currentUser
	};
};
