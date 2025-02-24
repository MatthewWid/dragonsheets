import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AppShell, Container } from "@mantine/core";
import { Header } from "./header";

export const Shell = () => (
	<AppShell header={{ height: 60 }}>
		<AppShell.Header>
			<Header />
		</AppShell.Header>
		<AppShell.Main>
			<Container p="md">
				<Outlet />
			</Container>
		</AppShell.Main>
		<TanStackRouterDevtools />
	</AppShell>
);
