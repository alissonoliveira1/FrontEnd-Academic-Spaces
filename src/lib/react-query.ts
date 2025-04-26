import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

export const queryCache = new QueryCache();
export const mutationCache = new MutationCache();

export const queryClient = new QueryClient({
	queryCache,
	mutationCache,
	defaultOptions: {
		queries: {
			networkMode: "online",
		},
	},
});
