import {
	getDeleteSchoolUnitMutationKey,
	useDeleteSchoolUnitMutation,
} from "@/api/mutations/delete-school-unit.ts";
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

export interface DeleteSchoolUnitModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	schoolUnit: {
		id: string;
		name: string;
	};
}

export function DeleteSchoolUnitModal({
	schoolUnit,
	open,
	onOpenChange,
}: DeleteSchoolUnitModalProps) {
	const client = useQueryClient();

	const { mutate: deleteSchoolUnit, isPending } = useDeleteSchoolUnitMutation({
		mutationKey: getDeleteSchoolUnitMutationKey(schoolUnit.id),
		onSuccess() {
			toast.success("Unidade escolar excluída com sucesso");
			onOpenChange(false);
			void client.invalidateQueries({
				predicate: (query) => query.queryKey.includes("schools"),
			});
		},
		onError() {
			toast.error("Erro ao excluir a unidade escolar");
		},
	});

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Excluir o usuário</DialogTitle>

					<DialogDescription>
						Tem certeza que deseja excluir a unidade escolar "{schoolUnit.name}"
						? Esta ação não pode ser revertida
					</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<Button variant="ghost" onClick={() => onOpenChange(false)}>
						Cancelar
					</Button>
					<Button
						disabled={isPending}
						variant="destructive"
						onClick={() => deleteSchoolUnit({ id: schoolUnit.id })}
					>
						{isPending ? <Loader className="animate-spin size-4" /> : "Excluir"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
