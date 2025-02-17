import {
	Button,
	Center,
	Container,
	Image,
	Loader,
	SimpleGrid,
	Text,
	Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getProductById } from "../api/getProductById";
import { formatToCurrency } from "../utils/formatToCurrency";

export const Route = createFileRoute("/products/$productId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { productId } = Route.useParams();

	const {
		isPending,
		error,
		data: product,
	} = useQuery({
		queryKey: ["products", productId],
		queryFn: () => getProductById({ productId }),
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
			{product && (
				<Container>
					<SimpleGrid cols={2}>
						<div>
							<Image src={product.imageUrl} alt={`Image of ${product.name}`} />
						</div>
						<div>
							<Title mb="md">{product.name}</Title>
							<Text mb="md">{product.description}</Text>
							<Button variant="outline" color="blue" fullWidth>
								{`Buy for ${formatToCurrency(product.price)}`}
							</Button>
						</div>
					</SimpleGrid>
				</Container>
			)}
		</>
	);
}
