import type { Reservation } from "@/api/queries/get-reservations.ts";
import { ReservationStatusIndicator } from "@/components/pages/reservations/reservation-status-indicator.tsx";
import { ConfirmReservationButton } from "@/components/pages/teacher/confirm-reservation-button.tsx";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table.tsx";
import { formatDateToPtBR } from "@/lib/utils.ts";
import { useMemo } from "react";

export interface TeacherReservationsTableProps {
	reservations: Reservation[];
}

const reservationMap: Record<Reservation["status"], string> = {
	CONFIRMED_BY_THE_USER: "Confirmado",
	CONFIRMED_BY_THE_ENTERPRISE: "Confirmado",
	CANCELED: "Cancelado",
	SCHEDULED: "Agendado",
};

interface FormattedReservation extends Reservation {
	eventDate: string;
	eventTimeInterval: string;
	status: string;
}

export function TeacherReservationsTable({
	reservations,
}: TeacherReservationsTableProps) {
	const formattedReservations = useMemo<FormattedReservation[]>(() => {
		return reservations.map((reservation) => {
			try {
				return {
					...reservation,
					eventDate: formatDateToPtBR(reservation.startDateTime, "dd/MM/yyyy"),
					eventTimeInterval: `Das ${formatDateToPtBR(reservation.startDateTime, "HH:mm")} até ${formatDateToPtBR(`${reservation.endDateTime}`, "HH:mm")}`,
					status: reservationMap[reservation.status] || reservation.status,
				};
			} catch (error) {
				console.error("Error formatting reservation:", error, reservation);

				return {
					...reservation,
					eventTimeInterval: "Data inválida",
					eventDate: "Data inválida",
					status: "Desconhecido",
				};
			}
		});
	}, [reservations]);

	return (
		<Table>
			<TableHeader className="sticky top-0 z-10 bg-muted">
				<TableRow>
					<TableHead>Espaço</TableHead>
					<TableHead>Data do evento</TableHead>
					<TableHead>Horário do evento</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Ações</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{formattedReservations?.map((reservation) => (
					<TableRow key={reservation.id}>
						<TableCell className="font-medium">
							{`${reservation.academicSpace.acronym} - ${reservation.academicSpace.roomName}`}
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

						<TableCell>
							{reservation.status === "Agendado" && (
								<ConfirmReservationButton reservationId={reservation.id} />
							)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
