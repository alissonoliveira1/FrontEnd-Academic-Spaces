import {
	getReservationsParamsSchema,
	getReservationsQueryOptions,
	useGetReservationsQuery,
} from "@/api/queries/get-reservations.ts";
import { Pagination } from "@/components/common/pagination.tsx";
import { ReservationTable } from "@/components/pages/reservations/reservation-table";
import { ReservationTableLoading } from "@/components/pages/reservations/reservation-table-loading";
import { ReservationFilters } from "@/components/pages/reservations/reservations-filters";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardHeader } from "@/components/ui/card.tsx";
import { withAuth } from "@/lib/utils.ts";
import { Link, createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/(app)/dashboard/admin/reservations")({
	component: RouteComponent,
	validateSearch: zodValidator(getReservationsParamsSchema),
	async beforeLoad({ context, search }) {
		const { auth, queryClient } = context;

		withAuth(auth, (ability) => ability.can("show", "Reservation"));

		await queryClient.ensureQueryData(getReservationsQueryOptions(search));
	},
});

function RouteComponent() {
	const params = Route.useSearch();
	const navigate = Route.useNavigate();

	const {
		data: reservations,
		isLoading,

		isError,
	} = useGetReservationsQuery(params);

	const canShowContent = !isLoading && !!reservations?.content;

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
							<BreadcrumbPage>Reservas</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>

			<section className="flex-col items-center justify-center md:flex-row flex flex-1 md:justify-between gap-2">
				<h1 className="text-center text-3xl font-bold tracking-tighter md:text-left">
					Controle de Reservas
				</h1>
			</section>

			<Card className="rounded-sm border shadow-xs">
				<CardHeader>
					<ReservationFilters />
				</CardHeader>

				<div className="overflow-hidden rounded-lg border mx-6">
					{isError ? (
						<div className="p-8 text-center">
							<p className="text-muted-foreground mb-4">
								Erro ao carregar reservas. Pode haver um problema com os dados.
							</p>
							<Button
								onClick={() => navigate({ to: ".", search: params })}
								className="bg-primary text-primary-foreground"
							>
								Tentar novamente
							</Button>
						</div>
					) : canShowContent ? (
						<ReservationTable reservations={reservations.content} />
					) : (
						<ReservationTableLoading />
					)}
				</div>

				<div className="px-6">
					{reservations && (
						<Pagination
							pageSize={reservations?.pageSize ?? 0}
							page={reservations?.page ?? 0}
							totalPages={reservations?.totalOfPages ?? 0}
						/>
					)}
				</div>
			</Card>
		</section>
	);
}
