import { Button, Group, Image } from "@mantine/core";
import { Link } from "@tanstack/react-router";
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

export const Header = () => (
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
);
