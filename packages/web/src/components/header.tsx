import { Link } from "@tanstack/react-router";
import { Avatar, Button, Group, Image, Menu } from "@mantine/core";
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
	const { userQuery, logoutInitMutation, loginMutation } = useAuth();

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
					<Menu shadow="md">
						<Menu.Target>
							<Avatar
								key={userQuery.data.displayName}
								name={userQuery.data.displayName}
								color="initials"
								style={{ cursor: "pointer" }}
							/>
						</Menu.Target>
						<Menu.Dropdown>
							<Menu.Item
								onClick={() => logoutInitMutation.mutate()}
								disabled={logoutInitMutation.isPending}
							>
								Logout
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
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
