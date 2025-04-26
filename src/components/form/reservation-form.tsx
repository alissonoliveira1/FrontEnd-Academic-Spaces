import { SelectWithSearch } from "@/components/common/select-with-search.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import { DialogFooter } from "@/components/ui/dialog.tsx";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form.tsx";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { TimeInput } from "@/components/ui/time-input.tsx";
import {
	cn,
	isValidTimeString,
	setDateTime,
	transformTimeStringToDate,
} from "@/lib/utils.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const today = new Date();

const createReservationSchema = z
	.object({
		spaceId: z.string().uuid("Informe um espaço acadêmico válido"),
		startDateTime: z.date().min(today),
		startTime: z
			.string()
			.refine(isValidTimeString, { message: "Informe um horário valido" }),
		endTime: z
			.string()
			.refine(isValidTimeString, { message: "Informe um horário valido" }),
	})
	.refine(
		(values) => {
			return isAfter(
				transformTimeStringToDate(values.startTime, values.startDateTime),
				new Date(),
			);
		},
		{
			message: "Horário de inicio deve ser maior que o horário atual",
			path: ["startTime"],
		},
	)
	.refine(
		(values) => {
			return isAfter(
				transformTimeStringToDate(values.endTime, values.startDateTime),
				transformTimeStringToDate(values.startTime, values.startDateTime),
			);
		},
		{
			message: "Horário de finalização deve ser maior que o horário de inicio",
			path: ["endTime"],
		},
	)
	.transform((values) => {
		return {
			...values,
			startDateTime: setDateTime(values.startDateTime, values.startTime),
			endDateTime: setDateTime(values.startDateTime, values.endTime),
		};
	});

export type ReservationFormSchema = z.infer<typeof createReservationSchema>;

export interface ReservationFormState {
	endtime: string;
	startTime: string;
	startDateTime: Date;
	spaceId: string;
}

export interface ReservationFormProps {
	onSubmit: (data: ReservationFormSchema) => void;
	reservation: ReservationFormState | null;
	spaceOptions: Array<{ label: string; value: string }>;
	onCancel?: () => void;
}

export function ReservationForm({
	onSubmit,
	reservation,
	onCancel,
	spaceOptions,
}: ReservationFormProps) {
	const form = useForm<ReservationFormSchema>({
		values: {
			endTime: reservation?.endtime ?? "",
			startTime: reservation?.startTime ?? "",
			startDateTime: reservation?.startDateTime || today,
			endDateTime: reservation?.startDateTime || today,
			spaceId: reservation?.spaceId || "",
		},
		resolver: zodResolver(createReservationSchema),
	});

	function handleCancel() {
		form.reset();
		onCancel?.();
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
				<FormField
					control={form.control}
					render={({ field }) => (
						<FormItem className="w-full space-y-2">
							<FormLabel>Selecione o espaço Acadêmico</FormLabel>
							<SelectWithSearch
								placeholder="Selecione um espaço acadêmico"
								options={spaceOptions}
								value={field.value}
								onChange={field.onChange}
							/>
							<FormMessage />
						</FormItem>
					)}
					name="spaceId"
				/>

				<FormField
					control={form.control}
					name="startDateTime"
					render={({ field }) => (
						<FormItem className="flex flex-col w-full">
							<FormLabel className="mb-2">Data do Evento</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											className={cn(
												"pl-3 text-left font-normal w-full",
												!field.value && "text-muted-foreground",
											)}
										>
											{field.value ? (
												format(field.value, "dd/MM/yyyy")
											) : (
												<span>Selecione uma data</span>
											)}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>

								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										locale={ptBR}
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										disabled={(date) => date <= today}
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex items-center gap-4">
					<FormField
						control={form.control}
						name="startTime"
						render={({ field }) => (
							<FormItem className="flex flex-col w-full">
								<FormLabel className="mb-2">Horário de inicio</FormLabel>
								<TimeInput {...field} />
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="endTime"
						render={({ field }) => (
							<FormItem className="flex flex-col w-full">
								<FormLabel className="mb-2">Horário de finalização</FormLabel>
								<TimeInput {...field} />
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<DialogFooter>
					<Button variant="ghost" type="button" onClick={handleCancel}>
						Cancelar
					</Button>

					<Button
						disabled={form.formState.isSubmitting}
						type="submit"
						variant="secondary"
					>
						{form.formState.isSubmitting ? (
							<LoaderCircle className="animate-spin" />
						) : (
							"Salvar Reserva"
						)}
					</Button>
				</DialogFooter>
			</form>
		</Form>
	);
}
