import {
	getUpdateAcademicSpaceMutationKey,
	useUpdateAcademicSpace,
} from "@/api/mutations/update-academic-space";
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
import { Building2, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { NumberInputField } from "../common/number-input-field";

const editAcademicSpaceSchema = z.object({
	name: z.string().nonempty(),
	description: z.string().nonempty(),
	capacity: z.number().int().positive(),
	acronym: z.coerce
		.string()
		.transform((vl) => vl.replace(" ", "-").normalize("NFC")),
});

type EditAcademicSpaceForm = z.infer<typeof editAcademicSpaceSchema>;

export interface EditAcademicSpaceModalProps {
	academicSpace: {
		id: string;
		description: string;
		capacity: number;
		acronym: string;
		name: string;
	};
	open: boolean;
	onChange: (open: boolean) => void;
}

export function EditAcademicSpaceModal({
	academicSpace,
	onChange,
	open,
}: EditAcademicSpaceModalProps) {
	const client = useQueryClient();
	const search = useSearch({ from: "/(app)/dashboard/admin/spaces" });
	const navigate = useNavigate();

	const { ability } = useAuth();

	const academicSpacesQueryKey = getAcademicSpacesQueryKey(search);

	const form = useForm<EditAcademicSpaceForm>({
		resolver: zodResolver(editAcademicSpaceSchema),
		values: {
			name: academicSpace.name,
			description: academicSpace.description,
			capacity: academicSpace.capacity,
			acronym: academicSpace.acronym,
		},
	});

	const { mutate, isPending } = useUpdateAcademicSpace({
		mutationKey: getUpdateAcademicSpaceMutationKey(academicSpace.id),
		async onSuccess() {
			toast.success("Usuário editado com sucesso");
			onChange(false);
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
				toast.error("Erro ao editar o espaço acadêmico");
			}
		},
	});

	async function onSubmit(data: EditAcademicSpaceForm) {
		if (ability?.can("update", "spaces")) {
			mutate({
				id: academicSpace.id,
				data: {
					name: data.name,
					description: data.description,
					capacity: data.capacity,
					acronym: data.acronym,
				},
			});
		} else {
			toast.error("Você não tem permissão para editar um espaço acadêmico");
		}
	}

	return (
		<Dialog onOpenChange={onChange} open={open}>
			<DialogContent className="max-w-xl mx-auto">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold flex  gap-2">
						<Building2 />
						Editar Espaço Acadêmico
					</DialogTitle>

					<DialogDescription>
						Edite os campos abaixo para atualizar um espaço acadêmico.
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
									<FormLabel>Nome</FormLabel>
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
								onClick={() => onChange(false)}
							>
								Cancelar
							</Button>

							<Button disabled={isPending} type="submit" variant="secondary">
								{isPending ? (
									<LoaderCircle className="animate-spin" />
								) : (
									"Editar"
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
