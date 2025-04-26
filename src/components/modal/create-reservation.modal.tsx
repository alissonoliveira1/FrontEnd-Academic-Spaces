import { useCreateReservation } from "@/api/mutations/create-reservation.ts";
import { useGetAvailableAcademicSpaces } from "@/api/queries/get-available-academic-spaces.ts";
import { getUserReservationsQueryKey } from "@/api/queries/get-user-reservations.ts";
import {
	ReservationForm,
	type ReservationFormSchema,
} from "@/components/form/reservation-form.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { formatISO } from "date-fns";
import { CalendarPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const errorActionMapper = {
	RESERVATION_INTERVAL_OVERLAP: "Já existe uma reserva nesse intervalo",
	USER_HAS_PENDING_RESERVATIONS: "Você possui reserva pendente",
} as const;

export function CreateReservationModal() {
	const [open, setOpen] = useState(false);

	const { data: spaces = [] } = useGetAvailableAcademicSpaces();

	const search = useSearch({
		from: "/(app)/dashboard/teacher/my-reservations",
	});

	const navigate = useNavigate({ from: "/dashboard/teacher/my-reservations" });

	const client = useQueryClient();

	const createReservationMutation = useCreateReservation({
		onError(error) {
			toast.error(
				errorActionMapper[error.errorCode as keyof typeof errorActionMapper] ??
					"Erro ao criar reserva",
			);
		},
		async onSuccess() {
			toast.success("Reserva criada com sucesso");

			await client.invalidateQueries({
				queryKey: getUserReservationsQueryKey({
					...search,
					page: 1,
				}),
			});

			await navigate({
				to: ".",
				search: (old) => ({ ...old, page: 1 }),
			});

			setOpen(false);
		},
	});

	function onChange(open: boolean) {
		setOpen(open);
	}

	async function onSubmit(data: ReservationFormSchema) {
		console.log(data);

		await createReservationMutation.mutateAsync({
			academicSpaceId: data.spaceId,
			startDateTime: formatISO(data.startDateTime),
			endDateTime: formatISO(data.endDateTime),
		});
	}

	const spaceOptions = spaces.map((space) => ({
		label: `${space.acronym} - ${space.roomName}`,
		value: space.id,
	}));

	return (
		<Dialog onOpenChange={onChange} open={open}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<CalendarPlus />
					Nova Reserva
				</Button>
			</DialogTrigger>

			<DialogContent className="max-w-3xl mx-auto">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold flex  gap-2">
						<CalendarPlus />
						Criar nova reserva
					</DialogTitle>

					<DialogDescription>
						Preencha os campos abaixo para criar uma nova reserva
					</DialogDescription>
				</DialogHeader>

				<ReservationForm
					spaceOptions={spaceOptions}
					onSubmit={onSubmit}
					reservation={null}
					onCancel={() => onChange(false)}
				/>
			</DialogContent>
		</Dialog>
	);
}
