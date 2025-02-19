import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
	Badge,
	Button,
	Card,
	Center,
	Image,
	Loader,
	SimpleGrid,
	Text,
	Title,
} from "@mantine/core";
import { getAllProducts } from "../api/getAllProducts";
import { formatToCurrency } from "../utils/formatToCurrency";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { isPending, error, data } = useQuery({
		queryKey: ["products"],
		queryFn: getAllProducts,
	});

	return (
		<>
			<Title mb="md">Character Sheets</Title>
			{isPending && (
				<Center>
					<Loader />
				</Center>
			)}
			{error && (
				<Center>
					<Text c="red">{error.message}</Text>
				</Center>
			)}
			{data && (
				<SimpleGrid cols={3}>
					{data.map(({ id, name, description, priceValue, imageUrl }) => (
						<Link
							to={`/products/$productId`}
							params={{ productId: id }}
							style={{ textDecoration: "none" }}
							key={id}
						>
							<Card shadow="sm" padding="lg" withBorder>
								<Card.Section>
									<Center>
										<Image
											src={imageUrl}
											alt={`Preview of ${name}`}
											maw={260}
										/>
									</Center>
								</Card.Section>
								<Text mt="md" fw={500}>
									{name}
								</Text>
								<Text my="xs" size="sm">
									{description}
								</Text>
								<Badge mb="md">{formatToCurrency(priceValue)}</Badge>
								<Button variant="outline" color="blue">
									More details
								</Button>
							</Card>
						</Link>
					))}
				</SimpleGrid>
			)}
		</>
	);
}
