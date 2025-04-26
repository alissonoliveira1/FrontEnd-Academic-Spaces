"use client";

import {
	type SchoolTeacher,
	useGetSchoolTeachers,
} from "@/api/queries/get-school-teachers";
import type { School } from "@/api/queries/get-schools";
import { Pagination } from "@/components/common/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	BookOpen,
	Calendar,
	Info,
	Mail,
	Phone,
	Search,
	User,
	X,
} from "lucide-react";
import { useState } from "react";

interface TeachersModalProps {
	schoolUnit: School | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function TeachersModal({
	schoolUnit,
	open,
	onOpenChange,
}: TeachersModalProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [page] = useState(1);
	const pageSize = 10;
	const [selectedTeacher, setSelectedTeacher] = useState<SchoolTeacher | null>(
		null,
	);
	const [detailsOpen, setDetailsOpen] = useState(false);

	const { data: teachersData, isLoading } = useGetSchoolTeachers(
		{
			schoolId: schoolUnit?.id || "",
			page,
			pageSize,
		},
		{
			enabled: !!schoolUnit?.id && open,
			queryKey: ["school-teachers", schoolUnit?.id, page, pageSize],
		},
	);

	const filteredTeachers =
		teachersData?.content.filter(
			(teacher) =>
				teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(teacher.course
					? teacher.course.toLowerCase().includes(searchTerm.toLowerCase())
					: false),
		) || [];

	const handleTeacherClick = (teacher: SchoolTeacher) => {
		setSelectedTeacher(teacher);
		setDetailsOpen(true);
	};

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-3xl">
					<DialogHeader>
						<DialogTitle>Professores - {schoolUnit?.name}</DialogTitle>
						<DialogDescription>
							Lista de professores vinculados a esta escola.
						</DialogDescription>
					</DialogHeader>

					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							onChange={(e) => setSearchTerm(e.target.value)}
							value={searchTerm}
							placeholder="Buscar professor por nome, email ou disciplina..."
							className="pl-8 pr-10"
						/>
						{searchTerm && (
							<button
								type="button"
								onClick={() => setSearchTerm("")}
								className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
							>
								<X className="h-4 w-4" />
								<span className="sr-only">Limpar busca</span>
							</button>
						)}
					</div>

					{isLoading ? (
						<div className="space-y-2">
							{Array.from({ length: 3 }).map((_, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<div key={index} className="flex items-center space-x-4 p-2">
									<Skeleton className="h-12 w-12 rounded-full" />
									<div className="space-y-2">
										<Skeleton className="h-4 w-[250px]" />
										<Skeleton className="h-4 w-[200px]" />
									</div>
								</div>
							))}
						</div>
					) : filteredTeachers.length > 0 ? (
						<>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Nome</TableHead>
										<TableHead>Contato</TableHead>
										<TableHead>Disciplina</TableHead>
										<TableHead className="text-right">Detalhes</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredTeachers.map((teacher) => (
										<TableRow
											key={teacher.id}
											className="cursor-pointer hover:bg-muted/50"
											onClick={() => handleTeacherClick(teacher)}
										>
											<TableCell className="font-medium">
												{teacher.name}
											</TableCell>
											<TableCell>
												<div className="flex flex-col gap-1">
													<div className="flex items-center gap-1 text-sm">
														<Mail className="h-3 w-3" />
														<span>{teacher.email}</span>
													</div>
													{teacher.contactNumber && (
														<div className="flex items-center gap-1 text-sm">
															<Phone className="h-3 w-3" />
															<span>{teacher.contactNumber}</span>
														</div>
													)}
												</div>
											</TableCell>
											<TableCell>
												{teacher.course ? (
													<div className="flex items-center gap-1">
														<BookOpen className="h-4 w-4 text-muted-foreground" />
														<span>{teacher.course}</span>
													</div>
												) : (
													<span className="text-muted-foreground text-sm italic">
														Não informado
													</span>
												)}
											</TableCell>
											<TableCell className="text-right">
												<Button variant="ghost" size="sm">
													<Info className="h-4 w-4" />
													<span className="sr-only">Ver detalhes</span>
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

							{teachersData && teachersData.totalOfPages > 1 && (
								<div className="mt-4">
									<Pagination
										page={teachersData.page}
										pageSize={teachersData.pageSize}
										totalPages={teachersData.totalOfPages}
									/>
								</div>
							)}
						</>
					) : (
						<div className="py-6 text-center text-muted-foreground">
							{searchTerm
								? "Nenhum professor encontrado com os critérios de busca."
								: "Nenhum professor vinculado a esta escola."}
						</div>
					)}
				</DialogContent>
			</Dialog>

			<Drawer open={detailsOpen} onOpenChange={setDetailsOpen}>
				<DrawerContent className="px-4 sm:px-6">
					<div className="mx-auto w-full max-w-md">
						<DrawerHeader>
							<DrawerTitle className="text-xl">
								Detalhes do Professor
							</DrawerTitle>
							<DrawerDescription>
								Informações completas sobre o professor
							</DrawerDescription>
						</DrawerHeader>
						{selectedTeacher && (
							<div className="px-1 pb-6">
								<Card className="overflow-hidden">
									<CardHeader className="pb-3">
										<CardTitle className="text-xl">
											{selectedTeacher.name}
										</CardTitle>
										<CardDescription className="pt-1">
											<Badge
												variant={
													selectedTeacher.role === "TEACHER"
														? "default"
														: "secondary"
												}
											>
												{selectedTeacher.role === "TEACHER"
													? "Professor"
													: "Administrador"}
											</Badge>
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div className="space-y-3">
											<h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
												<Mail className="h-4 w-4" />
												Contato
											</h4>
											<div className="grid gap-2 pl-6">
												<div className="flex items-center gap-2">
													<span className="text-sm">
														{selectedTeacher.email}
													</span>
												</div>
												{selectedTeacher.contactNumber && (
													<div className="flex items-center gap-2">
														<Phone className="h-3 w-3 text-muted-foreground" />
														<span className="text-sm">
															{selectedTeacher.contactNumber}
														</span>
													</div>
												)}
											</div>
										</div>

										<div className="space-y-3">
											<h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
												<BookOpen className="h-4 w-4" />
												Disciplina
											</h4>
											<div className="pl-6">
												{selectedTeacher.course ? (
													<span>{selectedTeacher.course}</span>
												) : (
													<span className="text-muted-foreground text-sm italic">
														Não informado
													</span>
												)}
											</div>
										</div>

										<div className="space-y-3">
											<h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
												<Info className="h-4 w-4" />
												Informações adicionais
											</h4>
											<div className="grid gap-2 pl-6">
												<div className="flex items-center gap-2">
													<User className="h-3 w-3 text-muted-foreground" />
													<span className="text-sm">
														ID: {selectedTeacher.id}
													</span>
												</div>
												<div className="flex items-center gap-2">
													<Calendar className="h-3 w-3 text-muted-foreground" />
													<span className="text-sm">
														Registrado em:{" "}
														{selectedTeacher.createdAt.toLocaleDateString()}
													</span>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						)}
						<DrawerFooter>
							<DrawerClose asChild>
								<Button variant="outline" className="w-full sm:w-auto">
									Fechar
								</Button>
							</DrawerClose>
						</DrawerFooter>
					</div>
				</DrawerContent>
			</Drawer>
		</>
	);
}
