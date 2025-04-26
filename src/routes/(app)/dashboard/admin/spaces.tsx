import {
	getAcademicSpacesQueryOptions,
	spaceFiltersSchema,
	useGetAcademicSpaces,
} from "@/api/queries/get-paginated-academics-spaces";
import { Pagination } from "@/components/common/pagination";
import { CreateAcademicSpaceModal } from "@/components/modal/create-academic-space.modal.tsx";
import { SpaceFilters } from "@/components/pages/spaces/space-filters";
import { SpaceTableLoading } from "@/components/pages/spaces/space-table-loading";
import { SpacesTable } from "@/components/pages/spaces/spaces-table";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import { Card, CardHeader } from "@/components/ui/card.tsx";
import { withAuth } from "@/lib/utils.ts";
import { Link, createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/(app)/dashboard/admin/spaces")({
	component: RouteComponent,
	validateSearch: zodValidator(spaceFiltersSchema),
	async beforeLoad({ context, search }) {
		const { auth } = context;
		withAuth(auth, (ab) => ab.can("show", "spaces"));

		const query = getAcademicSpacesQueryOptions(search);

		await context.queryClient.ensureQueryData(query);
	},
});

function RouteComponent() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	const { data: spaces, isLoading, isError } = useGetAcademicSpaces(search);

	const canShowContent = !!spaces && !isLoading;

	if (isError) {
		toast.error("Houve um erro nas busca de dados");

		void navigate({
			to: "/dashboard",
		});
	}

	return (
		<section className="p-5 space-y-5">
			<header className="flex flex-1 justify-between">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link to="/dashboard/admin">Dashboard</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator>
							<ChevronRight />
						</BreadcrumbSeparator>
						<BreadcrumbItem>
							<BreadcrumbPage>Espaços acadêmicos</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>

			<section className="flex-col items-center justify-center md:flex-row flex flex-1 md:justify-between gap-2">
				<h1 className="text-center text-3xl font-bold tracking-tighter md:text-left">
					Controle de Espaços acadêmicos
				</h1>

				<div className="flex gap-4 items-center" />
				<CreateAcademicSpaceModal />
			</section>
			<Card className="rounded-sm border shadow-xs ">
				<CardHeader>
					<SpaceFilters />
				</CardHeader>

				<div className="overflow-hidden rounded-lg border mx-6">
					{canShowContent ? (
						<SpacesTable spaces={spaces.content} />
					) : (
						<SpaceTableLoading />
					)}
				</div>

				<div className="px-6">
					<Pagination
						pageSize={spaces?.pageSize ?? 0}
						page={spaces?.page ?? 0}
						totalPages={spaces?.totalOfPages ?? 0}
					/>
				</div>
			</Card>
		</section>
	);
}
