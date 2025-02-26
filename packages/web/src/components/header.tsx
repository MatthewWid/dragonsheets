import { Link } from "@tanstack/react-router";
import { Button, Group, Image } from "@mantine/core";
import logo from "../assets/d20.svg";
import { useAuth } from "../hooks/use-auth";

type Link = {
	text: string;
	to: string;
};

const LINKS: Link[] = [
	{ text: "Home", to: "/" },
	{ text: "About", to: "/about" },
	{ text: "Cards", to: "/cards" },
];

export const Header = () => {
	const { userQuery, logoutMutation, loginMutation } = useAuth();

	return (
		<Group justify="space-between" h="100%" px="md">
			<Link to="/">
				<Image src={logo} h={35} pl="xs" />
			</Link>
			<div>
				{LINKS.map(({ text, to }) => (
					<Link to={to} key={to}>
						<Button variant="subtle">{text}</Button>
					</Link>
				))}
			</div>
			<div>
				{userQuery.data ? (
					<Button
						variant="subtle"
						onClick={() => logoutMutation.mutate()}
						loading={logoutMutation.isPending}
					>
						Log out
					</Button>
				) : (
					<Button
						variant="subtle"
						onClick={() => loginMutation.mutate()}
						loading={loginMutation.isPending}
					>
						Log in
					</Button>
				)}
			</div>
		</Group>
	);
};
