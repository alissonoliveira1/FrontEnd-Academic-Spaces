import {
	getDeleteUserMutationKey,
	useDeleteUserMutation,
} from "@/api/mutations/delete-user.ts";
import { Button } from "@/components/ui/button.tsx";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { toast } from "sonner";

export interface DeleteUserModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: {
		id: string;
		name: string;
	};
}

export function DeleteUserModal({
	user,
	open,
	onOpenChange,
}: DeleteUserModalProps) {
	const client = useQueryClient();

	const { mutate: deleteUser, isPending } = useDeleteUserMutation({
		mutationKey: getDeleteUserMutationKey(user.id),
		onSuccess() {
			toast.success("Usuário excluído com sucesso");
			onOpenChange(false);
			void client.invalidateQueries({
				predicate: (query) => query.queryKey.includes("users"),
			});
		},
		onError() {
			toast.error("Erro ao excluir o usuário");
		},
	});

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Excluir o usuário</DialogTitle>

					<DialogDescription>
						Tem certeza que deseja excluir o usuário "{user.name}" ? Esta ação
						não pode ser revertida
					</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<Button variant="ghost" onClick={() => onOpenChange(false)}>
						Cancelar
					</Button>
					<Button
						disabled={isPending}
						variant="destructive"
						onClick={() => deleteUser({ id: user.id })}
					>
						{isPending ? <Loader className="animate-spin size-4" /> : "Excluir"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
