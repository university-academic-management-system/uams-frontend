export interface UserState {
    name: string;
    email: string;
    password: string;
}

export interface UserActions {
    setUser: (user: UserState) => void;
    clearUser: () => void;
}

export type UserStoreType = UserState & UserActions;