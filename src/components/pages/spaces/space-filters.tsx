import { spaceFiltersSchema } from "@/api/queries/get-paginated-academics-spaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

const filtersColumns = [
	{
		label: "Sigla",
		value: "acronym",
	},
	{
		label: "Nome",
		value: "roomName",
	},
];

const filtersSchema = spaceFiltersSchema.pick({
	nmFilterColumn: true,
	nmFilterValue: true,
});

type FiltersSchema = z.infer<typeof filtersSchema>;

export function SpaceFilters() {
	const { nmFilterValue, nmFilterColumn } = useSearch({
		from: "/(app)/dashboard/admin/spaces",
	});

	const navigate = useNavigate({
		from: "/dashboard/admin/spaces",
	});

	const {
		register,
		setValue,
		handleSubmit,
		reset,
		watch,
		formState: { isValid },
	} = useForm<FiltersSchema>({
		mode: "onChange",

		resolver: zodResolver(filtersSchema),
		values: {
			nmFilterColumn: nmFilterColumn ?? "",
			nmFilterValue: nmFilterValue ?? "",
		},
	});

	function applyFilters(filters: FiltersSchema) {
		void navigate({
			to: ".",
			search: (state) => ({
				...state,
				nmFilterColumn: filters.nmFilterColumn as string,
				nmFilterValue: filters.nmFilterValue,
			}),
		});
	}

	function clearFilters() {
		reset();

		void navigate({
			to: ".",
			search: {
				nmFilterColumn: undefined,
				nmFilterValue: undefined,
			},
		});
	}

	const nmFilterColumnValue = watch("nmFilterColumn");

	return (
		<form
			className="flex gap-2 items-center"
			onSubmit={handleSubmit(applyFilters)}
		>
			<Select
				value={nmFilterColumnValue}
				onValueChange={(vl) =>
					setValue("nmFilterColumn", vl as FiltersSchema["nmFilterColumn"])
				}
			>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Filtrar por" />
				</SelectTrigger>
				<SelectContent>
					{filtersColumns.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Input
				placeholder="Valor"
				className="max-w-[230px]"
				{...register("nmFilterValue")}
			/>

			<Button variant="outline" type="submit" disabled={!isValid}>
				<Search className="size-4" />
				Filtrar
			</Button>
			<Button type="button" onClick={clearFilters} variant="ghost">
				Limpar
			</Button>
		</form>
	);
}
