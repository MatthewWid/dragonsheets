import { AppShell, Button, Container, Group, Image } from "@mantine/core";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import logo from "../assets/d20.svg";

type Link = {
	text: string;
	to: string;
};

const LINKS: Link[] = [
	{ text: "Home", to: "/" },
	{ text: "About", to: "/about" },
	{ text: "Cards", to: "/cards" },
];

export const Route = createRootRoute({
	component: () => (
		<AppShell header={{ height: 60 }}>
			<AppShell.Header>
				<Group px="md" h="100%" gap="md">
					<Link to="/">
						<Image src={logo} h={35} pl="xs" />
					</Link>
					{LINKS.map(({ text, to }) => (
						<Link to={to} key={to}>
							<Button variant="subtle">{text}</Button>
						</Link>
					))}
				</Group>
			</AppShell.Header>
			<AppShell.Main>
				<Container p="md">
					<Outlet />
				</Container>
			</AppShell.Main>
			<TanStackRouterDevtools />
		</AppShell>
	),
});
