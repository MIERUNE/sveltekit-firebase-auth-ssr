export type PublicUserInfo = {
	uid: string;
};

export type BasicPrivateUserInfo = {
	name: string;
	email?: string;
} & PublicUserInfo;
