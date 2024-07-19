export const load = async ({ locals, depends }) => {
	depends('auth:session');

	return {
		currentUser: locals.currentUser
	};
};
