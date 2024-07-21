export type PublicUserInfo = {
	uid: string;
	name: string;
};

export type BasicPrivateUserInfo = {
	email?: string;
} & PublicUserInfo;
