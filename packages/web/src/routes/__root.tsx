import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
	component: () => (
		<>
			<div>
				<ul>
					<li>Home</li>
					<li>About</li>
				</ul>
			</div>
			<hr />
			<Outlet />
			<TanStackRouterDevtools />
		</>
	),
});
