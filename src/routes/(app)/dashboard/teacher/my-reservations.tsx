import {
	getUserReservationsParamsSchema,
	useGetUserReservations,
} from "@/api/queries/get-user-reservations.ts";
import { Pagination } from "@/components/common/pagination.tsx";
import { CreateReservationModal } from "@/components/modal/create-reservation.modal.tsx";
import { SpaceTableLoading } from "@/components/pages/spaces/space-table-loading.tsx";
import { TeacherReservationsTable } from "@/components/pages/teacher/teacher-reservations-table.tsx";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { withAuth } from "@/lib/utils.ts";
import { Link, createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute(
	"/(app)/dashboard/teacher/my-reservations",
)({
	validateSearch: zodValidator(getUserReservationsParamsSchema),
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "EA | Minhas Reservas",
			},
		],
	}),
	async beforeLoad({ context }) {
		const { auth } = context;
		withAuth(auth, (ab) => ab.can("show", "my-reservations"));
	},
});

function RouteComponent() {
	const search = Route.useSearch();

	const {
		data: reservations,
		isLoading,
		isError,
	} = useGetUserReservations(search);

	const canShowContent = !isLoading && !!reservations?.content;

	if (isError) {
		toast.error("Houve um erro nas busca de dados");
	}

	return (
		<section className="p-5 space-y-5">
			<header className="flex flex-1 justify-between">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link to="/dashboard/teacher/my-reservations">Reservas</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator>
							<ChevronRight />
						</BreadcrumbSeparator>
						<BreadcrumbItem>
							<BreadcrumbPage>Minhas Reservas</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>

			<section className="flex-col items-center justify-center md:flex-row flex flex-1 md:justify-between gap-2">
				<h1 className="text-center text-3xl font-bold tracking-tighter md:text-left">
					Minhas Reservas
				</h1>

				<CreateReservationModal />
			</section>

			<Card className="rounded-sm border shadow-xs">
				<CardHeader>
					<CardTitle>Minha reservas</CardTitle>
					<CardDescription>
						Visualize e gerencie suas reservas de espaços acadêmicos.
					</CardDescription>
				</CardHeader>

				<div className="overflow-hidden rounded-lg border mx-6">
					{canShowContent ? (
						<TeacherReservationsTable
							reservations={reservations?.content ?? []}
						/>
					) : (
						<SpaceTableLoading />
					)}
				</div>

				<div className="px-6">
					<Pagination
						pageSize={reservations?.pageSize ?? 0}
						page={reservations?.page ?? 0}
						totalPages={reservations?.totalOfPages ?? 0}
					/>
				</div>
			</Card>
		</section>
	);
}
