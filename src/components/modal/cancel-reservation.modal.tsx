import {
	getCancelReservationMutationKey,
	useCancelReservationMutation,
} from "@/api/mutations/cancel-reservation.ts";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface CancelReservationModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	reservationId: string;
}

export function CancelReservationModal({
	reservationId,
	onOpenChange,
	open,
}: CancelReservationModalProps) {
	const client = useQueryClient();

	const { mutate: cancelReservation, isPending } = useCancelReservationMutation(
		{
			mutationKey: getCancelReservationMutationKey(reservationId),
			onSuccess() {
				onOpenChange(false);
				toast.success("Reserva cancelada com sucesso");
				void client.invalidateQueries({
					predicate: (query) => query.queryKey.includes("reservations"),
				});
			},
			onError() {
				toast.error("Erro ao cancelar a reserva");
			},
		},
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Cancelar Reserva</DialogTitle>
					<DialogDescription>A reserva será cancelada.</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<Button onClick={() => onOpenChange(false)} variant="ghost">
						Voltar
					</Button>
					<Button
						onClick={() => cancelReservation({ reservationId })}
						disabled={isPending}
						variant="destructive"
					>
						{isPending ? (
							<Loader2 className="animate-spin size-4" />
						) : (
							"Cancelar Reserva"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
