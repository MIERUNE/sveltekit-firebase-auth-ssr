export const load = async ({ data, depends }) => {
	const currentUser = data.user;

	depends('auth:session');

	return {
		currentUser
	};
};
