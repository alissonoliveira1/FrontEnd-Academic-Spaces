import { useCreateAcademicSpace } from "@/api/mutations/create-academic-space.ts";
import { getAcademicSpacesQueryKey } from "@/api/queries/get-paginated-academics-spaces";
import { useAuth } from "@/components/contexts/auth-context.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog.tsx";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Building2, LoaderCircle, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { NumberInputField } from "../common/number-input-field";

const createAcademicSpaceSchema = z.object({
	name: z.string().nonempty(),
	description: z.string().nonempty(),
	capacity: z.number().int().positive(),
	acronym: z.coerce
		.string()
		.transform((vl) => vl.replace(" ", "-").normalize("NFC")),
});

type CreateAcademicSpaceForm = z.infer<typeof createAcademicSpaceSchema>;

export function CreateAcademicSpaceModal() {
	const client = useQueryClient();
	const search = useSearch({ from: "/(app)/dashboard/admin/spaces" });
	const navigate = useNavigate();

	const { ability } = useAuth();
	const [modal, setModal] = useState(false);

	const academicSpacesQueryKey = getAcademicSpacesQueryKey(search);

	const form = useForm<CreateAcademicSpaceForm>({
		resolver: zodResolver(createAcademicSpaceSchema),
		values: {
			name: "",
			description: "",
			capacity: 1,
			acronym: "",
		},
	});

	const { mutate, isPending } = useCreateAcademicSpace({
		async onSuccess() {
			toast.success("Usuário criado com sucesso");
			setModal(false);
			form.reset();

			await client.invalidateQueries({ queryKey: academicSpacesQueryKey });

			void navigate({
				to: ".",
				search: {
					page: 1,
				},
			});
		},
		onError(error) {
			if (error.errorCode === "DUPLICATE_FOUND") {
				toast.error("Espaço acadêmico já existe");
			} else {
				toast.error("Erro ao criar usuário");
			}
		},
	});

	async function onSubmit(data: CreateAcademicSpaceForm) {
		if (ability?.can("create", "spaces")) {
			mutate({
				name: data.name,
				description: data.description,
				capacity: data.capacity,
				acronym: data.acronym,
			});
		} else {
			toast.error("Você não tem permissão para criar um usuário");
		}
	}

	function handleOpenChange(open: boolean) {
		setModal(open);
	}

	return (
		<Dialog onOpenChange={handleOpenChange} open={modal}>
			<DialogTrigger asChild>
				<Button variant="outline" size="lg">
					<Plus className="size-4" />
					Espaço Acadêmico
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-xl mx-auto">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold flex  gap-2">
						<Building2 />
						Novo Espaço Acadêmico
					</DialogTitle>

					<DialogDescription>
						Preencha os campos abaixo para criar um novo espaço acadêmico.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
						<FormField
							render={({ field }) => (
								<FormItem>
									<FormLabel>Sigla</FormLabel>
									<FormControl>
										<Input placeholder="Codigo" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
							name="acronym"
						/>

						<FormField
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome da sala</FormLabel>
									<FormControl>
										<Input placeholder="Nome" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
							name="name"
						/>

						<FormField
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descrição</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
							name="description"
						/>
						<FormField
							render={({ field }) => (
								<FormItem>
									<FormLabel>Capacidade</FormLabel>
									<FormControl>
										<NumberInputField
											onChange={(vl) => field.onChange(vl)}
											value={field.value}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
							name="capacity"
						/>

						<DialogFooter>
							<Button
								variant="ghost"
								type="button"
								onClick={() => setModal(false)}
							>
								Cancelar
							</Button>

							<Button
								disabled={isPending}
								type="submit"
								className="bg-emerald-700 text-gray-200 hover:bg-emerald-500"
							>
								{isPending ? (
									<LoaderCircle className="animate-spin" />
								) : (
									"Criar"
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
