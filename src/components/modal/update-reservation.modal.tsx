import { useUpdateReservation } from "@/api/mutations/update-reservation.ts";
import { useGetAllAcademicSpaces } from "@/api/queries/get-all-academic-spaces.ts";
import {
	ReservationForm,
	type ReservationFormSchema,
	type ReservationFormState,
} from "@/components/form/reservation-form.tsx";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog.tsx";
import { format, formatISO, parseISO } from "date-fns";
import { toast } from "sonner";

export interface UpdateReservationModalProps {
	reservation: {
		id: string;
		spaceId: string;
		startDateTime: string;
		endDateTime: string;
	};
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function UpdateReservationModal({
	reservation,
	onOpenChange,
	open,
}: UpdateReservationModalProps) {
	const updateReservation = useUpdateReservation({
		onSuccess() {
			toast.success("Reserva alterada com sucesso");
			onOpenChange(false);
		},
		onError(ex) {
			switch (ex.errorCode) {
				case "SPACE_NOT_AVAILABLE":
					toast.error("Espaço não disponível");
					break;
				case "RESERVATION_INTERVAL_OVERLAP":
					toast.error("Sobreposição de horários");
					break;
				case "SPACE_NOT_FOUND":
					toast.error("Espaço não encontrado");
					break;
				default:
					toast.error("Erro ao alterar reserva");
			}
		},
	});

	const { data: spaces = [] } = useGetAllAcademicSpaces();

	const parsedStartDateTime = parseISO(reservation.startDateTime);
	const parsedEndDateTime = parseISO(reservation.endDateTime);

	const formattedReservation = {
		spaceId: reservation.spaceId,
		startDateTime: parsedStartDateTime,
		endtime: format(parsedEndDateTime, "HH:MM"),
		startTime: format(parsedStartDateTime, "HH:MM"),
	} satisfies ReservationFormState;

	async function onSubmit(data: ReservationFormSchema) {
		await updateReservation.mutateAsync({
			academicSpaceId: data.spaceId,
			startDateTime: formatISO(data.startDateTime),
			endDateTime: formatISO(data.endDateTime),
			reservationId: reservation.id,
		});
	}

	const spaceOptions = spaces.map((space) => ({
		label: `${space.acronym} - ${space.roomName}`,
		value: space.id,
	}));

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Alterar Reserva</DialogTitle>
					<DialogDescription>Alterar os dados da reserva</DialogDescription>
				</DialogHeader>

				<ReservationForm
					spaceOptions={spaceOptions}
					onSubmit={onSubmit}
					reservation={formattedReservation}
					onCancel={() => onOpenChange(false)}
				/>
			</DialogContent>
		</Dialog>
	);
}
