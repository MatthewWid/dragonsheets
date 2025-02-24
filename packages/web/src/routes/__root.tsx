import { createRootRoute } from "@tanstack/react-router";
import { Shell } from "../components/shell";

export const Route = createRootRoute({
	component: () => <Shell />,
});
