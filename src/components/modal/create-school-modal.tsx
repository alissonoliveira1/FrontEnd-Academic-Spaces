"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useCreateSchoolMutation } from "@/api/mutations/create-school";
import { getSchoolsQueryKey } from "@/api/queries/get-schools";
import { useAuth } from "@/components/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";

const createSchoolSchema = z.object({
	name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
	contactNumber: z
		.string()
		.min(9, "O número de contato deve ter pelo menos 9 caracteres"),
	address: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres"),
	city: z.string().min(2, "A cidade deve ter pelo menos 2 caracteres"),
	state: z.string().length(2, "O estado deve ter 2 caracteres").toUpperCase(),
	type: z.enum(["PUBLICA", "PRIVADA"], {
		required_error: "Selecione o tipo de instituição",
	}),
});

type CreateSchool = z.infer<typeof createSchoolSchema>;

export function CreateSchoolModal() {
	const { ability } = useAuth();
	const [modal, setModal] = useState(false);
	const queryClient = useQueryClient();
	const search = useSearch({ from: "/(app)/dashboard/admin/schools" });
	const navigate = useNavigate();

	const form = useForm<CreateSchool>({
		resolver: zodResolver(createSchoolSchema),
		defaultValues: {
			name: "",
			address: "",
			city: "",
			state: "",
			contactNumber: "",
		},
	});

	const createSchoolMutation = useCreateSchoolMutation({
		async onSuccess(data) {
			console.log("School created successfully:", data);
			toast.success("Escola criada com sucesso");
			setModal(false);
			form.reset();

			// Invalidate the schools query to refresh the list
			await queryClient.invalidateQueries({
				queryKey: getSchoolsQueryKey({ ...search, page: 1 }),
			});

			// Navigate to the first page to see the new school
			void navigate({
				to: ".",
				search: {
					...search,
					page: 1,
				},
			});
		},
		onError(error) {
			console.error("Error creating school:", error);

			// Check for specific error types
			if (error.status === 400) {
				toast.error("Erro de validação: Verifique os dados e tente novamente");
			} else if (error.errorCode === "DUPLICATE_FOUND") {
				toast.error("Esta escola já existe");
			} else {
				toast.error(
					`Erro ao criar escola: ${error.message || "Verifique os dados e tente novamente"}`,
				);
			}
		},
	});

	async function onSubmit(data: CreateSchool) {
		if (ability?.can("create", "schools")) {
			try {
				const formattedData = {
					...data,
					state: data.state.toUpperCase(),
					type: data.type, // Default to "PUBLICA" if type is null
				};

				console.log("Submitting school data:", formattedData);
				createSchoolMutation.mutate(formattedData);
			} catch (error) {
				console.error("Error in form submission:", error);
				toast.error("Erro ao processar o formulário");
			}
		} else {
			toast.error("Você não tem permissão para criar uma escola");
		}
	}

	function handleOpenChange(open: boolean) {
		if (!open) {
			form.reset();
		}
		setModal(open);
	}

	return (
		<Dialog onOpenChange={handleOpenChange} open={modal}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Nova Escola
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Criar Nova Escola</DialogTitle>
					<DialogDescription>
						Preencha os dados abaixo para criar uma nova escola.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome</FormLabel>
									<FormControl>
										<Input placeholder="Nome da escola" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="contactNumber"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Telefone</FormLabel>
									<FormControl>
										<Input placeholder="numero da escola" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Endereço</FormLabel>
									<FormControl>
										<Input placeholder="Endereço da escola" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="city"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Cidade</FormLabel>
										<FormControl>
											<Input placeholder="Cidade" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="state"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Estado</FormLabel>
										<FormControl>
											<Input
												placeholder="UF"
												maxLength={2}
												{...field}
												onChange={(e) =>
													field.onChange(e.target.value.toUpperCase())
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tipo de instituição</FormLabel>
										<FormControl>
											<Select
												value={field.value}
												onValueChange={(value) => field.onChange(value)}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Tipo de instituição" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="PUBLICA">Publica</SelectItem>
													<SelectItem value="PRIVADA">Privada</SelectItem>
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setModal(false)}
							>
								Cancelar
							</Button>
							<Button type="submit" disabled={createSchoolMutation.isPending}>
								{createSchoolMutation.isPending ? (
									<>
										<LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
										Criando...
									</>
								) : (
									"Criar Escola"
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
