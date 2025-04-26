import {
	getConfirmReservationMutationKey,
	useConfirmReservationMutation,
} from "@/api/mutations/confirm-reservation.ts";
import { queryKey as UserReservationQueryKey } from "@/api/queries/get-user-reservations.ts";
import { Button } from "@/components/ui/button.tsx";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { toast } from "sonner";

export interface ConfirmReservationButtonProps {
	reservationId: string;
}

export function ConfirmReservationButton({
	reservationId,
}: ConfirmReservationButtonProps) {
	const client = useQueryClient();

	const { mutate: confirmReservation, isPending } =
		useConfirmReservationMutation({
			mutationKey: getConfirmReservationMutationKey({ reservationId }),
			onSuccess() {
				toast.success("Reserva confirmada com sucesso");
				void client.invalidateQueries({
					predicate: (query) =>
						query.queryKey.includes(UserReservationQueryKey),
				});
			},
			onError() {
				toast.error("Erro ao confirmar reserva");
			},
		});

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					disabled={isPending}
					size="icon"
					variant="outline"
					onClick={() => confirmReservation({ reservationId })}
				>
					<Check />
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>Confirmar Reserva</p>
			</TooltipContent>
		</Tooltip>
	);
}
