import {
	Button,
	Card,
	Container,
	CopyButton,
	SimpleGrid,
	Title,
} from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cards")({
	component: RouteComponent,
});

type Cards = {
	name: string;
	brand: string;
	number: string;
	cvc: string;
	expiry: string;
};

const CARDS: Cards[] = [
	{
		name: "Zachery Faulkner",
		brand: "Visa (Credit)",
		number: "4242 4242 4242 4242",
		cvc: "424",
		expiry: "06 / 26",
	},
	{
		name: "Saira Mcconnel",
		brand: "Visa (Debit)",
		number: "4000 0566 5566 5556",
		cvc: "400",
		expiry: "08 / 27",
	},
	{
		name: "Ethel Ware",
		brand: "Mastercard (Credit)",
		number: "5555 5555 5555 4444",
		cvc: "555",
		expiry: "03 / 26",
	},
	{
		name: "Tiana Nash",
		brand: "Mastercard (Debit)",
		number: "5200 8282 8282 8210",
		cvc: "520",
		expiry: "05 / 29",
	},
];

function RouteComponent() {
	return (
		<Container>
			<Title mb="lg">Test Cards</Title>
			<SimpleGrid cols={2}>
				{CARDS.map(({ name, brand, number, cvc, expiry }) => (
					<Card shadow="sm" padding="lg" withBorder key={brand}>
						<Title order={2} mb="md">
							{brand}
						</Title>
						<CopyButton value={name}>
							{({ copied, copy }) => (
								<Button
									variant="outline"
									mb="md"
									color={copied ? "teal" : "blue"}
									onClick={copy}
								>
									{copied ? "Copied!" : `Copy name: ${name}`}
								</Button>
							)}
						</CopyButton>
						<CopyButton value={number}>
							{({ copied, copy }) => (
								<Button
									variant="outline"
									mb="md"
									color={copied ? "teal" : "blue"}
									onClick={copy}
								>
									{copied ? "Copied!" : `Copy number: ${number}`}
								</Button>
							)}
						</CopyButton>
						<CopyButton value={cvc}>
							{({ copied, copy }) => (
								<Button
									variant="outline"
									mb="md"
									color={copied ? "teal" : "blue"}
									onClick={copy}
								>
									{copied ? "Copied!" : `Copy CVC: ${cvc}`}
								</Button>
							)}
						</CopyButton>
						<CopyButton value={expiry}>
							{({ copied, copy }) => (
								<Button
									variant="outline"
									color={copied ? "teal" : "blue"}
									onClick={copy}
								>
									{copied ? "Copied!" : `Copy expiry: ${expiry}`}
								</Button>
							)}
						</CopyButton>
					</Card>
				))}
			</SimpleGrid>
		</Container>
	);
}
