import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
	Badge,
	Button,
	Card,
	Center,
	Group,
	Image,
	Loader,
	SimpleGrid,
	Text,
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
				<SimpleGrid>
					{data.map(({ id, name, description, price, imageUrl }) => (
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
								<Group>
									<Text mt="md" mb="xs" fw={500}>
										{name}
									</Text>
									<Badge>{formatToCurrency(price)}</Badge>
								</Group>
								<Text mb="xs" size="sm">
									{description}
								</Text>
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
