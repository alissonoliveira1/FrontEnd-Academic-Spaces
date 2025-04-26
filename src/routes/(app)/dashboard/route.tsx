import { EaApiException } from "@/api/exeception/EaApiExeception.ts";
import { useAuth } from "@/components/contexts/auth-context.tsx";
import { AppSidebar } from "@/components/layouts/app-bar/app-sidebar.tsx";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar.tsx";
import { eaApi } from "@/lib/axios.ts";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useLayoutEffect } from "react";

export const Route = createFileRoute("/(app)/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const match = Route.useMatch();

	const auth = useAuth();

	useLayoutEffect(() => {
		if (auth.isAuthenticated && !auth.isLoading) {
			if (window.location.pathname === match.fullPath) {
				void navigate({
					to:
						auth.user.role === "ADMIN"
							? "/dashboard/admin"
							: "/dashboard/teacher/my-reservations",
					replace: true,
				});
			}
		}

		const interceptor = eaApi.interceptors.response.use(
			(response) => response,
			(error) => {
				if (error.response?.status === 401) {
					void navigate({
						to: "/auth/sign-in",
						replace: true,
					});
					auth.signOut();
				}
				return Promise.reject(new EaApiException(error));
			},
		);

		return () => {
			eaApi.interceptors.response.eject(interceptor);
		};
	}, [navigate, auth, match]);

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<SidebarTrigger className="-ml-1" />
				<main className="px-2">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
