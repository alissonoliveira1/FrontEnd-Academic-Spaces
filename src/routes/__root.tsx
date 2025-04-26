import type { useAuth } from "@/components/contexts/auth-context.tsx";
import { ThemeProvider } from "@/components/contexts/theme.context.tsx";
import type { QueryClient } from "@tanstack/react-query";
import {
	HeadContent,
	Outlet,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Provider as JotaiProvider } from "jotai";

export type RootRouteContext = {
	queryClient: QueryClient;
	auth: ReturnType<typeof useAuth>;
};

export const Route = createRootRouteWithContext<RootRouteContext>()({
	component() {
		return (
			<ThemeProvider defaultTheme="dark">
				<HeadContent />
				<JotaiProvider>
					<Outlet />
				</JotaiProvider>
				<TanStackRouterDevtools />
			</ThemeProvider>
		);
	},
});
