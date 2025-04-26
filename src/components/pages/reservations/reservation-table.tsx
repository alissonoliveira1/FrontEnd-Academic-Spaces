import type { Reservation } from "@/api/queries/get-reservations.ts";
import { CancelReservationModal } from "@/components/modal/cancel-reservation.modal.tsx";
import { UpdateReservationModal } from "@/components/modal/update-reservation.modal.tsx";
import { ReservationStatusIndicator } from "@/components/pages/reservations/reservation-status-indicator.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table.tsx";
import { formatDateToPtBR } from "@/lib/utils.ts";
import { useModal } from "@/store/modal.ts";
import { Edit, Trash } from "lucide-react";
import { useMemo } from "react";

interface ReservationTableProps {
	reservations: Reservation[];
}

const reservationMap: Record<string, string> = {
	CONFIRMED_BY_THE_USER: "Confirmado pelo usuário",
	CONFIRMED_BY_THE_ENTERPRISE: "Confirmado pela instituição",
	CANCELED: "Cancelado",
	SCHEDULED: "Agendado",
};

interface FormattedReservation extends Reservation {
	eventDate: string;
	eventTimeInterval: string;
	status: string;
}

export function ReservationTable({ reservations }: ReservationTableProps) {
	const [cancelReservationModal, setCancelReservationModal] = useModal(
		"cancel-reservation-modal",
	);
	const [updateModal, setUpdateModal] = useModal("update-reservation-modal");

	const formattedReservations = useMemo<FormattedReservation[]>(() => {
		return reservations.map((reservation) => {
			try {
				return {
					...reservation,
					eventDate: formatDateToPtBR(reservation.startDateTime, "dd/MM/yyyy"),
					eventTimeInterval: `Das ${formatDateToPtBR(reservation.startDateTime, "HH:MM")} até ${formatDateToPtBR(`${reservation.endDateTime}`, "HH:MM")}`,
					status: reservationMap[reservation.status] || reservation.status,
				};
			} catch (error) {
				return {
					...reservation,
					eventTimeInterval: "Data inválida",
					eventDate: "Data inválida",
					status: "Desconhecido",
				};
			}
		});
	}, [reservations]);

	if (reservations.length === 0) {
		return (
			<div className="p-8 text-center text-muted-foreground">
				Nenhuma reserva encontrada.
			</div>
		);
	}

	return (
		<>
			{cancelReservationModal.reservationId && (
				<CancelReservationModal
					open={cancelReservationModal.open}
					onOpenChange={(open) => setCancelReservationModal({ open })}
					reservationId={cancelReservationModal.reservationId}
				/>
			)}

			{updateModal.reservation && (
				<UpdateReservationModal
					open={updateModal.open}
					onOpenChange={(open) => setUpdateModal({ open })}
					reservation={updateModal.reservation}
				/>
			)}

			<Table>
				<TableHeader className="sticky top-0 z-10 bg-muted">
					<TableRow>
						<TableHead>Espaço</TableHead>
						<TableHead>Professor</TableHead>
						<TableHead>Data do evento</TableHead>
						<TableHead>Horário do evento</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="text-right">Ações</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{formattedReservations?.map((reservation) => (
						<TableRow key={reservation.id}>
							<TableCell className="font-medium">
								{`${reservation.academicSpace?.acronym || "?"} - ${reservation.academicSpace?.roomName || "Espaço não disponível"}`}
							</TableCell>
							<TableCell className="text-muted-foreground">
								{reservation.user?.name || "Usuário não disponível"}
							</TableCell>
							<TableCell className="text-muted-foreground">
								{reservation.eventDate}
							</TableCell>
							<TableCell className="text-muted-foreground">
								{reservation.eventTimeInterval}
							</TableCell>
							<TableCell>
								<ReservationStatusIndicator reservation={reservation} />
							</TableCell>

							<TableCell className="text-right">
								<div className="flex justify-end gap-2">
									{!reservation.confirmed && !reservation.canceled && (
										<Button
											onClick={() => {
												setUpdateModal({
													open: true,
													reservation: {
														spaceId: reservation.academicSpace.id,
														startDateTime: reservation.startDateTime,
														endDateTime: reservation.endDateTime,
														id: reservation.id,
													},
												});
											}}
											variant="outline"
											size="icon"
										>
											<Edit className="h-4 w-4" />
											<span className="sr-only">Editar</span>
										</Button>
									)}

									{reservation.status === "Agendado" && (
										<Button
											onClick={() => {
												setCancelReservationModal({
													open: true,
													reservationId: reservation.id,
												});
											}}
											variant="outline"
											size="icon"
										>
											<Trash className="h-4 w-4" />
											<span className="sr-only">Excluir</span>
										</Button>
									)}
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}
