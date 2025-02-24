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
	Badge,
	Button,
} from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Product } from "../../types/Product";
import { formatToCurrency } from "../../utils/formatToCurrency";
import { getCheckoutSessionResult } from "../../api/getCheckoutSessionResult";
import { getPurchasedProductAssets } from "../../api/getPurchasedProductAssets";

type PurchasedSearchParams = {
	checkout_session_id: string | null;
};

export const Route = createFileRoute("/checkout/result")({
	component: RouteComponent,
	validateSearch: (
		search: Record<string, string | null>
	): PurchasedSearchParams => ({
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

type CheckoutResultComponentProps = {
	product: Product;
	sessionId: string;
};

function CheckoutResultComponent({
	product: { id, name, description, priceValue, imageUrl },
	sessionId,
}: CheckoutResultComponentProps) {
	const downloadMutation = useMutation({
		mutationFn: async (productId: string) =>
			await getPurchasedProductAssets({
				sessionId,
				productId,
			}),
		onSuccess: (blob) => {
			const fileName = `${name.trim().replace(/ /g, "_")}.pdf`;

			const url = URL.createObjectURL(blob);

			const a = document.createElement("a");
			a.href = url;
			a.download = fileName;
			a.click();

			URL.revokeObjectURL(url);
		},
	});

	return (
		<Card key={id}>
			<Group align="start">
				<Image src={imageUrl} alt={`Preview of ${name}`} mah={260} />
				<Box p="md">
					<Title order={3}>{name}</Title>
					<Text>{description}</Text>
					<Badge display="block" mt="sm" mb="md" bg="gray">
						{formatToCurrency(priceValue)}
					</Badge>
					<Button
						onClick={() => downloadMutation.mutate(id)}
						loading={downloadMutation.isPending}
						fullWidth
					>
						Download
					</Button>
				</Box>
			</Group>
		</Card>
	);
}

function RouteComponent() {
	const { checkout_session_id } = Route.useSearch();

	const { isPending, error, data } = useQuery({
		queryKey: ["checkout-result", checkout_session_id],
		queryFn: () =>
			getCheckoutSessionResult({ sessionId: checkout_session_id as string }),
		enabled: Boolean(checkout_session_id),
	});

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
					{data.products.map((product) => (
						<CheckoutResultComponent
							product={product}
							sessionId={checkout_session_id!}
							key={product.id}
						/>
					))}
				</>
			)}
		</Container>
	);
}
