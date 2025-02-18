import { Container, List, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Container>
			<Title order={1} mb="md">
				About
			</Title>
			<Title order={2}>Attributions</Title>
			<List>
				<List.Item>
					Character sheets sourced from{" "}
					<a
						href="https://www.dndbeyond.com/characters/premade"
						target="_blank"
					>
						D&amp;D Beyond
					</a>
				</List.Item>
			</List>
		</Container>
	);
}
