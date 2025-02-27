import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../../hooks/use-auth";
import { useEffect } from "react";
import { Container, Loader, Stack, Title } from "@mantine/core";

export const Route = createFileRoute("/auth/logout-success")({
	component: RouteComponent,
});

function RouteComponent() {
	const { logoutSuccessMutation } = useAuth();

	useEffect(() => {
		const timeout = setTimeout(() => logoutSuccessMutation.mutate(), 0);
		return () => clearTimeout(timeout);
	}, [logoutSuccessMutation.mutate]);

	return (
		<Container>
			<Stack align="center">
				<Title>You have been logged out.</Title>
				{logoutSuccessMutation.isPending && <Loader />}
			</Stack>
		</Container>
	);
}
