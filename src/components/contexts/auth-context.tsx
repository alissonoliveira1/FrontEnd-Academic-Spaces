import { useCreateSessionMutation } from "@/api/mutations/create-session.ts";
import {
	type User,
	useGetCurrentUser,
} from "@/api/queries/get-current-user.ts";
import { storage, useLocalStorage } from "@/lib/storage.ts";

import { type UserAbilities, defineAbilityForUser } from "@/lib/permissions";
import {
	type PropsWithChildren,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
} from "react";

type SignInParams = {
	email: string;
	password: string;
};

interface AuthContextTypeProps {
	signIn: (params: SignInParams) => Promise<void>;
	signOut: () => void;
	isLoading: boolean;
}

interface AuthContextTypeAuthenticated extends AuthContextTypeProps {
	isAuthenticated: true;
	user: User;
	ability: UserAbilities;
}
interface AuthContextTypeNoAuthenticated extends AuthContextTypeProps {
	isAuthenticated: false;
	user: null;
	ability: UserAbilities;
}

type AuthContextType =
	| AuthContextTypeAuthenticated
	| AuthContextTypeNoAuthenticated;

export const AuthContext = createContext<AuthContextType>(
	{} as AuthContextType,
);

export function AutProvider({ children }: PropsWithChildren) {
	const [authToken, setToken] = useLocalStorage("token");

	const isAuthenticated = useMemo(() => !!authToken, [authToken]);

	const {
		data: user = null,
		isPending: isPendingUser,
		error,
		refetch,
	} = useGetCurrentUser({
		enabled: isAuthenticated,
	});
	const { mutateAsync, isPending } = useCreateSessionMutation({
		onError(error) {
			if (error.status === 401) {
				setToken(null);
			}
		},
	});

	const logout = useCallback(() => {
		storage.deleteItem("token");
	}, []);

	const signIn = useCallback(
		async (data: SignInParams) => {
			const { token } = await mutateAsync({
				email: data.email,
				password: data.password,
			});

			setToken(token);

			await refetch();
		},
		[mutateAsync, setToken, refetch],
	);

	const isLoading = isPending || isPendingUser;

	const ability = defineAbilityForUser(user ?? undefined);

	useEffect(() => {
		if (error?.status === 401) {
			logout();
		}
	}, [error, logout]);

	return (
		<AuthContext.Provider
			value={
				{
					isAuthenticated,
					isLoading,
					signIn,
					signOut: logout,
					user: user,
					ability,
				} as AuthContextType
			}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
