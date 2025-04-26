import { useNavigate } from "@tanstack/react-router";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
} from "lucide-react";
import { useMemo } from "react";
import { z } from "zod";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

export interface PaginationProps {
	page: number;
	totalPages: number;
	pageSize: number;
}

export function Pagination({ pageSize, page, totalPages }: PaginationProps) {
	const navigate = useNavigate();

	const validPage = useMemo(
		() => z.number().int().positive().min(1).max(totalPages),
		[totalPages],
	);

	function handleChangePage(page: number) {
		if (validPage.safeParse(page).success) {
			void navigate({
				to: ".",
				search: (state) => ({ ...state, page }),
			});
		}
	}

	return (
		<div className="flex items-center justify-between">
			<div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
				{pageSize} registros por página
			</div>
			<div className="flex w-full items-center gap-8 lg:w-fit">
				<div className="hidden items-center gap-2 lg:flex">
					<Label htmlFor="rows-per-page" className="text-sm font-medium">
						Registros por pagina
					</Label>
					<Select
						value={pageSize.toString()}
						onValueChange={(value) => {
							void navigate({
								to: ".",
								search: (state) => ({
									...state,
									pageSize: Number(value),
									page: 1,
								}),
							});
						}}
					>
						<SelectTrigger className="w-20" id="rows-per-page">
							<SelectValue placeholder={pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 30].map((pageOption) => (
								<SelectItem key={pageOption} value={String(pageOption)}>
									{pageOption}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex w-fit items-center justify-center text-sm font-medium">
					Página {page} de {totalPages}
				</div>
				<div className="ml-auto flex items-center gap-2 lg:ml-0">
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => handleChangePage(1)}
						disabled={false}
					>
						<span className="sr-only">Ir para a primeira página</span>
						<ChevronsLeftIcon />
					</Button>
					<Button
						variant="outline"
						className="size-8"
						size="icon"
						onClick={() => handleChangePage(page - 1)}
						disabled={false}
					>
						<span className="sr-only">Ir para a pagina anterior</span>
						<ChevronLeftIcon />
					</Button>
					<Button
						variant="outline"
						className="size-8"
						size="icon"
						onClick={() => handleChangePage(page + 1)}
						disabled={false}
					>
						<span className="sr-only">Ir para a próxima página</span>
						<ChevronRightIcon />
					</Button>
					<Button
						variant="outline"
						className="hidden size-8 lg:flex"
						size="icon"
						onClick={() => handleChangePage(totalPages)}
						disabled={false}
					>
						<span className="sr-only">ir para ultima página</span>
						<ChevronsRightIcon />
					</Button>
				</div>
			</div>
		</div>
	);
}
