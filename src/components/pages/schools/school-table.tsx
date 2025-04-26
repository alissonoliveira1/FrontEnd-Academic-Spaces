"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Trash, Users } from "lucide-react";
import { useEffect, useState } from "react";

import type { School } from "@/api/queries/get-schools";
import { DeleteSchoolUnitModal } from "@/components/modal/delete-school-unit.modal.tsx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { eaApi } from "@/lib/axios";
import { useModal } from "@/store/modal.ts";
import { TeachersModal } from "./teachers-modal";

interface SchoolsTableProps {
	schools: School[];
}

export function SchoolsTable({ schools }: SchoolsTableProps) {
	const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
	const [showTeachersModal, setShowTeachersModal] = useState(false);
	const [teacherCounts, setTeacherCounts] = useState<Record<string, number>>(
		{},
	);

	const [deleteModal, setDeleteModal] = useModal("delete-school-unit-modal");

	useEffect(() => {
		async function fetchTeacherCounts() {
			const counts: Record<string, number> = {};

			for (const school of schools) {
				try {
					// Fetch all teachers to get the count
					const { data } = await eaApi.get(
						`/school-units/${school.id}/teachers`,
					);

					// If data is an array, use its length as the count
					if (Array.isArray(data)) {
						counts[school.id] = data.length;
					}
				} catch (error) {
					console.error(
						`Error fetching teacher count for school ${school.id}:`,
						error,
					);
				}
			}

			setTeacherCounts(counts);
		}

		if (schools.length > 0) {
			void fetchTeacherCounts();
		}
	}, [schools]);

	const handleViewTeachers = (school: School) => {
		setSelectedSchool(school);
		setShowTeachersModal(true);
	};

	return (
		<>
			{deleteModal.schoolUnit && (
				<DeleteSchoolUnitModal
					onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
					open={deleteModal.open}
					schoolUnit={deleteModal.schoolUnit}
				/>
			)}

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Nome</TableHead>
						<TableHead>Endereço</TableHead>
						<TableHead>Cidade</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Professores</TableHead>
						<TableHead>Data de Criação</TableHead>
						<TableHead className="text-right">Ações</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{schools.length === 0 ? (
						<TableRow>
							<TableCell colSpan={7} className="h-24 text-center">
								Nenhuma escola encontrada.
							</TableCell>
						</TableRow>
					) : (
						schools.map((school) => (
							<TableRow key={school.id}>
								<TableCell className="font-medium">{school.name}</TableCell>
								<TableCell>{school.address}</TableCell>
								<TableCell>{school.city}</TableCell>
								<TableCell>{school.state}</TableCell>
								<TableCell>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleViewTeachers(school)}
										className="flex items-center gap-2"
									>
										<Users className="h-4 w-4" />
										{teacherCounts[school.id] !== undefined && (
											<Badge variant="secondary" className="ml-1">
												{teacherCounts[school.id]}
											</Badge>
										)}
										<span className="sr-only">Ver professores</span>
									</Button>
								</TableCell>
								<TableCell>
									{format(school.createdAt, "dd/MM/yyyy", { locale: ptBR })}
								</TableCell>
								<TableCell className="text-right">
									<div className="flex justify-end gap-2">
										<Button
											variant="outline"
											size="icon"
											onClick={() => {
												setDeleteModal({
													open: true,
													schoolUnit: {
														name: `${school.name} - ${school.address}`,
														id: school.id,
													},
												});
											}}
										>
											<Trash className="h-4 w-4" />
											<span className="sr-only">Excluir</span>
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

			{selectedSchool && (
				<TeachersModal
					schoolUnit={selectedSchool}
					open={showTeachersModal}
					onOpenChange={setShowTeachersModal}
				/>
			)}
		</>
	);
}
