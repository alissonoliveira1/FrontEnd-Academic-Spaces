import { Button } from "@/components/ui/button.tsx";
import { Form, FormField } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const reservationsFiltersColumns = [
	{ label: "Status", value: "status" },
	{ label: "Professor", value: "teacher" },
	{ label: "Espaço", value: "space" },
];

const formFiltersSchema = z.object({
	filterType: z.string().nullable(),
	filterValue: z.string().trim().min(1),
});

const reservationsStatusOptions = [
	{
		label: "Confirmado",
		value: "CONFIRMED_BY_THE_USER",
	},
	{
		label: "Cancelado",
		value: "CANCELED",
	},
	{
		label: "Agendado",
		value: "SCHEDULED",
	},
	{
		label: "Confirmado pelo professor",
		value: "CONFIRMED_BY_THE_ENTERPRISE",
	},
];

export type FormFilters = z.infer<typeof formFiltersSchema>;

export function ReservationFilters() {
	const search = useSearch({ from: "/(app)/dashboard/admin/reservations" });
	const navigate = useNavigate({ from: "/dashboard/admin/reservations" });

	const form = useForm<FormFilters>({
		values: {
			filterType: search.nmFilterColumn ?? null,
			filterValue: search.nmFilterValue ?? "",
		},
		resolver: zodResolver(formFiltersSchema),
		reValidateMode: "onChange",
	});

	function applyFilters(values: FormFilters) {
		console.log(values);

		void navigate({
			to: ".",
			search: (prv) => ({
				...prv,
				page: 1,
				nmFilterColumn: values.filterType || undefined,
				nmFilterValue: values.filterValue || undefined,
			}),
		});
	}

	function clearFilters() {
		form.reset();
		void navigate({
			to: ".",
			search: (prv) => ({
				...prv,
				nmFilterColumn: undefined,
				nmFilterValue: undefined,
				page: 1,
			}),
		});
	}

	const filterType = form.watch("filterType");

	useEffect(() => {
		if (filterType) {
			form.setValue("filterValue", "");
		}
	}, [filterType, form.setValue]);

	return (
		<Form {...form}>
			<form
				className="flex gap-2 items-center"
				onSubmit={form.handleSubmit(applyFilters)}
			>
				<FormField
					name="filterType"
					control={form.control}
					render={({ field }) => (
						<Select value={field.value ?? ""} onValueChange={field.onChange}>
							<SelectTrigger className="w-[230px]">
								<SelectValue placeholder="Filtrar por" />
							</SelectTrigger>
							<SelectContent>
								{reservationsFiltersColumns.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				/>

				<FormField
					render={({ field }) => {
						return filterType === "status" ? (
							<Select value={field.value ?? ""} onValueChange={field.onChange}>
								<SelectTrigger className="w-[230px]">
									<SelectValue placeholder="Selecione o status" />
								</SelectTrigger>
								<SelectContent>
									{reservationsStatusOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						) : (
							<Input
								className="max-w-[200px]"
								{...field}
								placeholder="Filtro"
								disabled={!filterType}
							/>
						);
					}}
					name="filterValue"
				/>

				<Button
					variant="outline"
					type="submit"
					disabled={!form.formState.isValid}
				>
					<Search className="size-4" />
					Filtrar
				</Button>
				<Button type="button" onClick={clearFilters} variant="ghost">
					Limpar
				</Button>
			</form>
		</Form>
	);
}
