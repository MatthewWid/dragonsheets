import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { getMe } from "../api/getMe";
import { postLogin } from "../api/postLogin";
import { postExchange } from "../api/postExchange";
import { postLogout } from "../api/postLogout";

type lsOidcContents = {
	codeVerifier: string;
	state: string;
};

const LS_KEY_OIDC = "oidc-session";
const CO_KEY_HAS_ACCESS_TOKEN = "has_access_token";

export const useAuth = () => {
	const userQuery = useQuery({
		queryKey: ["me"],
		queryFn: getMe,
		enabled: () => {
			const hasAccessToken = Cookies.get(CO_KEY_HAS_ACCESS_TOKEN);

			if (!hasAccessToken) {
				return false;
			}

			return JSON.parse(hasAccessToken);
		},
		retry: 0,
	});

	useEffect(() => {
		if (userQuery.isError) {
			Cookies.remove(CO_KEY_HAS_ACCESS_TOKEN);
		}
	}, [userQuery.isError]);

	const loginMutation = useMutation({
		mutationFn: postLogin,
		onSuccess: ({ loginUrl, codeVerifier, state }) => {
			const contents: lsOidcContents = { codeVerifier, state };

			localStorage.setItem(LS_KEY_OIDC, JSON.stringify(contents));

			window.location.href = loginUrl;
		},
	});

	const exchangeMutation = useMutation({
		mutationFn: async () => {
			const rawContents = localStorage.getItem(LS_KEY_OIDC);

			if (!rawContents) {
				throw new Error("Login credentials are not saved in local storage.");
			}

			const { codeVerifier, state }: lsOidcContents = JSON.parse(rawContents);

			const currentUrl = window.location.href;

			return postExchange({ currentUrl, codeVerifier, state });
		},
		onSuccess: async () => {
			localStorage.removeItem(LS_KEY_OIDC);

			await userQuery.refetch();

			window.location.href = "/";
		},
	});

	const logoutMutation = useMutation({
		mutationFn: postLogout,
		onSuccess: ({ logoutUrl }) => {
			window.location.href = logoutUrl;
		},
	});

	return {
		userQuery,
		loginMutation,
		exchangeMutation,
		logoutMutation,
	};
};
