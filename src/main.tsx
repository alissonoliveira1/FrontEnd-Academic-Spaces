import { StrictMode } from "react";

import reportWebVitals from "./reportWebVitals.ts";
import "./styles.css";

import { AutProvider, useAuth } from "@/components/contexts/auth-context.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { queryClient } from "@/lib/react-query.ts";
import { routeTree } from "@/routeTree.gen.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

export const router = createRouter({
	routeTree,
	context: {
		queryClient,
		auth: undefined!,
	},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Render the app
const rootElement = document.getElementById("app");

const AppRouter = () => {
	const auth = useAuth();

	return <RouterProvider router={router} context={{ queryClient, auth }} />;
};

if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<AutProvider>
					<AppRouter />
				</AutProvider>
				<ReactQueryDevtools />
				<Toaster richColors />
			</QueryClientProvider>
		</StrictMode>,
	);
}

reportWebVitals();
