import type { User } from "@/api/queries/get-users";
import { DeleteUserModal } from "@/components/modal/delete-user.modal.tsx";
import { UpdateUserModal } from "@/components/modal/update-user.modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useModal } from "@/store/modal.ts";
import { Pen, Trash } from "lucide-react";

export interface UsersTableProps {
	users: User[];
}

const userRoleMap: Record<User["role"], string> = {
	ADMIN: "ADMINISTRADOR",
	TEACHER: "PROFESSOR",
};

export function UsersTable({ users }: UsersTableProps) {
	const [updateModal, setUpdateModal] = useModal("update-user-modal");
	const [deleteModal, setDeleteModal] = useModal("delete-user-modal");

	const formattedTeachers = users.map((item) => {
		return {
			...item,
			formattedRole: userRoleMap[item.role],
			formattedSchoolUnit: item.schoolUnit
				? `${item.schoolUnit?.name} - ${item.schoolUnit?.address}`
				: "Não possui",
		};
	});

	return (
		<>
			{updateModal.userDetails && (
				<UpdateUserModal
					user={updateModal.userDetails}
					open={updateModal.open}
					onOpenChange={(open) => setUpdateModal({ ...updateModal, open })}
				/>
			)}

			{deleteModal.user && (
				<DeleteUserModal
					onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
					user={{ name: deleteModal.user.name, id: deleteModal.user.id }}
					open={deleteModal.open}
				/>
			)}

			<Table>
				<TableHeader className="sticky top-0 z-10 bg-muted">
					<TableRow>
						<TableHead>Nome</TableHead>
						<TableHead>E-mail</TableHead>
						<TableHead>Tipo de Usuário</TableHead>
						<TableHead>Unidade Escolar</TableHead>
						<TableHead className="text-right">Ações</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{formattedTeachers.map((user) => (
						<TableRow key={user.id}>
							<TableCell className="font-medium">{user.name}</TableCell>
							<TableCell className="text-muted-foreground ">
								{user.email}
							</TableCell>
							<TableCell>
								<Badge variant="secondary">{user.formattedRole}</Badge>
							</TableCell>
							<TableCell>{user.formattedSchoolUnit}</TableCell>
							<TableCell className="space-x-2  text-right">
								<Button
									size="icon"
									variant="outline"
									onClick={() =>
										setUpdateModal({ open: true, userDetails: user })
									}
								>
									<Pen />
								</Button>

								<Button
									size="icon"
									variant="outline"
									onClick={() => setDeleteModal({ open: true, user })}
								>
									<Trash />
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}
