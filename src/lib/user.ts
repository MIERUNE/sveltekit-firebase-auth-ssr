export type PublicUserInfo = {
	uid: string;
	displayName: string;
};

export type BasicPrivateUserInfo = {
	email?: string;
} & PublicUserInfo;
