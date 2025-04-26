"use client";

import {
	getSchoolsQueryOptions,
	getSchoolsQueryParamsSchema,
	useGetSchoolsQuery,
} from "@/api/queries/get-schools.ts";
import { Pagination } from "@/components/common/pagination";
import { CreateSchoolModal } from "@/components/modal/create-school-modal";
import { SchoolFilters } from "@/components/pages/schools/school-filters";
import { SchoolsTable } from "@/components/pages/schools/school-table";
import { SchoolTableLoading } from "@/components/pages/schools/school-table-loading";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardHeader } from "@/components/ui/card";
import { withAuth } from "@/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import axios from "axios";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/(app)/dashboard/admin/schools")({
	component: RouteComponent,
	validateSearch: zodValidator(getSchoolsQueryParamsSchema),
	async beforeLoad({ context, search }) {
		const { auth, queryClient } = context;

		withAuth(auth, (ab) => ab.can("show", "schools"));

		await queryClient.prefetchQuery(getSchoolsQueryOptions(search));
	},
});

function RouteComponent() {
	const search = Route.useSearch();

	const {
		data: schools,
		isLoading,
		isError,
		error,
		refetch,
	} = useGetSchoolsQuery(search);

	if (isError && error && !axios.isCancel(error as Error)) {
		toast.error("Houve um erro na busca de dados");
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
							<BreadcrumbPage>Escolas</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>

			<section className="flex-col items-center justify-center md:flex-row flex flex-1 md:justify-between gap-2">
				<h1 className="text-center text-3xl font-bold tracking-tighter md:text-left">
					Controle de Escolas
				</h1>

				<div className="flex gap-4 items-center">
					<CreateSchoolModal />
				</div>
			</section>
			<Card className="rounded-sm border shadow-xs">
				<CardHeader>
					<SchoolFilters />
				</CardHeader>

				<div className="overflow-hidden rounded-lg border mx-6">
					{isLoading ? (
						<SchoolTableLoading />
					) : isError && error && !axios.isCancel(error as Error) ? (
						<div className="p-8 text-center">
							<p className="text-muted-foreground mb-4">
								Erro ao carregar escolas
							</p>
							<button
								type="button"
								onClick={() => refetch()}
								className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
							>
								Tentar novamente
							</button>
						</div>
					) : schools && schools.content.length > 0 ? (
						<SchoolsTable schools={schools.content} />
					) : (
						<div className="p-8 text-center text-muted-foreground">
							Nenhuma escola encontrada. Crie uma nova escola para começar.
						</div>
					)}
				</div>

				<div className="px-6 py-4">
					{schools && (
						<Pagination
							pageSize={schools.pageSize}
							page={schools.page}
							totalPages={schools.totalOfPages}
						/>
					)}
				</div>
			</Card>
		</section>
	);
}
