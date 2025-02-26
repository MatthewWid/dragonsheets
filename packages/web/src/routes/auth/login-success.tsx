import { Container, Loader, Stack, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../../hooks/use-auth";
import { useEffect } from "react";

export const Route = createFileRoute("/auth/login-success")({
	component: RouteComponent,
});

function RouteComponent() {
	const { exchangeMutation } = useAuth();

	useEffect(() => {
		/**
		 * Calling mutations in useEffect is fine: https://github.com/TanStack/query/discussions/986#discussioncomment-547655
		 *
		 * According to the React Query devs there is no situation where anyone would need to fire a mutation once on page load, so for the rest of us we must use this workaround to avoid double-firing: https://github.com/TanStack/query/issues/5341
		 */
		const timeout = setTimeout(() => exchangeMutation.mutate(), 0);
		return () => clearTimeout(timeout);
	}, [exchangeMutation.mutate]);

	return (
		<Container>
			<Stack align="center">
				<Title>Logging you in...</Title>
				{exchangeMutation.isPending && <Loader />}
			</Stack>
		</Container>
	);
}
