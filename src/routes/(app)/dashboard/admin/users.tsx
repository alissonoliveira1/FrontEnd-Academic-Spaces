import {
	getUsersQueryParamsSchema,
	useGetUsersQuery,
} from "@/api/queries/get-users.ts";
import { Pagination } from "@/components/common/pagination";
import { CreateNewUserModal } from "@/components/modal/create-new-user.modal.tsx";
import { UsersTable } from "@/components/pages/users/users-table";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card.tsx";

import { withAuth } from "@/lib/utils.ts";
import { Link, createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/(app)/dashboard/admin/users")({
	component: RouteComponent,
	validateSearch: zodValidator(getUsersQueryParamsSchema),
	beforeLoad({ context }) {
		const { auth } = context;
		withAuth(auth, (ab) => ab.can("show", "users"));
	},
});

function RouteComponent() {
	const search = Route.useSearch();

	const { data: users } = useGetUsersQuery(search);

	if (!users) {
		return null;
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
							<BreadcrumbPage>Usuários</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>

			<section className="flex-col items-center justify-center md:flex-row flex flex-1 md:justify-between gap-2">
				<h1 className="text-center text-3xl font-bold tracking-tighter md:text-left">
					Controle de Usuários
				</h1>
				<div className="flex gap-4 items-center">
					<CreateNewUserModal />
				</div>
			</section>
			<Card className="rounded-sm border shadow-xs ">
				<CardHeader>
					<CardTitle>Usuários</CardTitle>
					<CardDescription>Veja e controle os usuários</CardDescription>
				</CardHeader>
				<div className="overflow-hidden rounded-lg border mx-6">
					<UsersTable users={users.content ?? []} />
				</div>

				<div className="px-6">
					<Pagination
						pageSize={users?.pageSize ?? 0}
						page={users?.page ?? 0}
						totalPages={users?.totalOfPages ?? 0}
					/>
				</div>
			</Card>
		</section>
	);
}
