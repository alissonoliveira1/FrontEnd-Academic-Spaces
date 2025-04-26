import { Charts } from "@/components/pages/dashboard/charts";
import { CountCardSection } from "@/components/pages/dashboard/count-card-section.tsx";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/(app)/dashboard/admin/")({
	component: DashboardAdminContent,
	head: () => ({
		meta: [
			{
				title: "Dashboard | Admin",
			},
		],
	}),
	beforeLoad({ context }) {
		const { auth } = context;
		if (auth.isAuthenticated && auth.ability.cannot("show", "metrics")) {
			throw redirect({
				to: "/dashboard",
				replace: true,
			});
		}
	},
});

function DashboardAdminContent() {
	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<Breadcrumb className="px-6">
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link to="/dashboard/admin">Dashboard</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator>
								<ChevronRight />
							</BreadcrumbSeparator>
						</BreadcrumbList>
					</Breadcrumb>
					<CountCardSection />
					<Charts />
				</div>
			</div>
		</div>
	);
}
