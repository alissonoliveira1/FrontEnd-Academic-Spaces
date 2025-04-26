import type { Space } from "@/api/queries/get-paginated-academics-spaces";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import {
	EditAcademicSpaceModal,
	type EditAcademicSpaceModalProps,
} from "@/components/modal/edit-academic-space.modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, MoreVerticalIcon, Users, XCircle } from "lucide-react";
import { useState } from "react";
import { ToggleSpaceStatusButton } from "./toggle-space-status-button";

export interface SpacesTableProps {
	spaces: Space[];
}

const spaceStatusMapper: Record<Space["status"], string> = {
	AVAILABLE: "Disponível",
	UNAVAILABLE: "Indisponível",
};

interface EditModalState {
	open: boolean;
	academicSpace: EditAcademicSpaceModalProps["academicSpace"] | null;
}

export function SpacesTable({ spaces }: SpacesTableProps) {
	const [modal, setModal] = useState<EditModalState>({
		academicSpace: null,
		open: false,
	});
	const formattedSpaces = spaces.map((space) => ({
		...space,
		formattedStatus: spaceStatusMapper[space.status] ?? space.status,
	}));

	return (
		<>
			{modal?.academicSpace && (
				<EditAcademicSpaceModal
					academicSpace={modal.academicSpace}
					onChange={(open) => setModal({ ...modal, open })}
					open={modal.open}
				/>
			)}

			<Table>
				<TableHeader className="sticky top-0 z-10 bg-muted">
					<TableRow>
						<TableHead>Sigla</TableHead>
						<TableHead>Nome da sala</TableHead>
						<TableHead>Descrição</TableHead>
						<TableHead>Capacidade</TableHead>
						<TableHead>Status</TableHead>
						<TableHead />
					</TableRow>
				</TableHeader>

				<TableBody>
					{formattedSpaces?.map((space) => (
						<TableRow key={space.id}>
							<TableCell className="font-medium">{space.acronym}</TableCell>
							<TableCell className="text-muted-foreground ">
								{space.roomName}
							</TableCell>
							<TableCell className="text-muted-foreground ">
								{space.description}
							</TableCell>
							<TableCell className="text-foreground ">
								<div className="flex items-center gap-1">
									<Users className="size-4 mr-1" />
									{space.capacity}
								</div>
							</TableCell>
							<TableCell>
								<Badge variant="secondary">
									{space.status === "AVAILABLE" ? (
										<Check className="mr-2 h-4 w-4 text-emerald-500" />
									) : (
										<XCircle className="mr-2 h-4 w-4 text-red-500" />
									)}

									{space.formattedStatus}
								</Badge>
							</TableCell>
							<TableCell>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
											size="icon"
										>
											<MoreVerticalIcon />
											<span className="sr-only">Abrir menu</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-32">
										<DropdownMenuItem
											onClick={() => {
												setModal({
													open: true,
													academicSpace: {
														acronym: space.acronym,
														capacity: space.capacity,
														description: space.description,
														id: space.id,
														name: space.roomName,
													},
												});
											}}
										>
											Editar
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem>
											<ToggleSpaceStatusButton
												space={{
													status: space.status,
													id: space.id,
												}}
											/>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}
