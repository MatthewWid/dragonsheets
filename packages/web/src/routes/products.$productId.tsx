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
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getProductById } from "../api/getProductById";
import { formatToCurrency } from "../utils/formatToCurrency";
import { createCheckoutSession } from "../api/createCheckoutSession";

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

	const checkoutMutation = useMutation({
		mutationFn: (priceId: string) => createCheckoutSession({ priceId }),
		onSuccess: ({ redirectUrl }) => (window.location.href = redirectUrl),
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
							<Button
								variant="outline"
								color="blue"
								fullWidth
								onClick={() => checkoutMutation.mutate(product.priceId)}
								loading={checkoutMutation.isPending}
							>
								{`Buy for ${formatToCurrency(product.priceValue)}`}
							</Button>
							{checkoutMutation.isError && (
								<Text c="red">{checkoutMutation.error.message}</Text>
							)}
						</div>
					</SimpleGrid>
				</Container>
			)}
		</>
	);
}
