import {
	Card,
	Center,
	Container,
	Group,
	Loader,
	Text,
	Title,
	Image,
	Box,
	Flex,
	Badge,
	Button,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { getCheckoutSessionResult } from "../api/getCheckoutSessionResult";
import { formatToCurrency } from "../utils/formatToCurrency";

type SuccessSearchParams = {
	checkout_session_id: string | null;
};

export const Route = createFileRoute("/success")({
	component: RouteComponent,
	validateSearch: (
		search: Record<string, string | null>
	): SuccessSearchParams => ({
		checkout_session_id: search.checkout_session_id || null,
	}),
	loaderDeps: ({ search: { checkout_session_id } }) => ({
		checkout_session_id,
	}),
	loader: ({ deps: { checkout_session_id } }) => {
		if (!checkout_session_id) {
			throw redirect({
				to: "/",
			});
		}
	},
});

function RouteComponent() {
	const { checkout_session_id } = Route.useSearch();
	const { isPending, error, data } = useQuery({
		queryKey: ["checkout-session-result", checkout_session_id],
		queryFn: () =>
			getCheckoutSessionResult({ sessionId: checkout_session_id as string }),
		enabled: Boolean(checkout_session_id),
	});

	console.log({ data });

	return (
		<Container>
			<Title mb="md">Thank you for your purchase!</Title>
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
			{data?.products && (
				<>
					<Text mb="sm">Your items are now available for download.</Text>
					{data.products.map(
						({ id, name, description, priceValue, imageUrl }) => (
							<Card key={id}>
								<Group align="start">
									<Image src={imageUrl} alt={`Preview of ${name}`} mah={260} />
									<Box p="md">
										<Title order={3}>{name}</Title>
										<Text>{description}</Text>
										<Badge display="block" mt="sm" mb="md" bg="gray">
											{formatToCurrency(priceValue)}
										</Badge>
										<Button fullWidth>Download</Button>
									</Box>
								</Group>
							</Card>
						)
					)}
				</>
			)}
		</Container>
	);
}
