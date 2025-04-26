import {
	getUserUpdateMutationKey,
	useUpdateUserMutation,
} from "@/api/mutations/update-user.ts";
import { getUsersQueryKey } from "@/api/queries/get-users.ts";
import { useAuth } from "@/components/contexts/auth-context.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
	Dialog,
	DialogClose,
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const updateUserSchema = z.object({
	email: z.string().email().optional(),
	name: z.string().optional(),
	role: z.string().optional(),
});

export interface UserDetails {
	id: string;
	email: string;
	name: string;
	role: string;
}

export interface UpdateUseModalProps {
	user: UserDetails;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export function UpdateUserModal({
	user,
	open,
	onOpenChange,
}: UpdateUseModalProps) {
	const { ability } = useAuth();
	const search = useSearch({ from: "/(app)/dashboard/admin/users" });
	const navigate = useNavigate();
	const client = useQueryClient();

	const form = useForm<UpdateUserSchema>({
		resolver: zodResolver(updateUserSchema),
		values: user,
	});

	const getUsersQueryKeyToInvalidate = getUsersQueryKey({
		page: 1,
		pageSize: search.pageSize,
	});

	const updateUserMutation = useUpdateUserMutation({
		mutationKey: getUserUpdateMutationKey(user.id),
		async onSuccess() {
			toast.success("Usuário editado com sucesso");
			form.reset();
			onOpenChange(false);

			await client.invalidateQueries({
				queryKey: getUsersQueryKeyToInvalidate,
			});

			void navigate({
				to: ".",
				search: {
					page: 1,
				},
			});
		},
		onError() {
			toast.error("Erro ao editar usuário");
		},
	});

	async function onSubmit(data: UpdateUserSchema) {
		if (ability?.can("update", "users")) {
			updateUserMutation.mutate({
				email: data.email,
				name: data.name,
				id: user.id,
				role: data.role,
			});
		} else {
			toast.error("Você não tem permissão para editar um usuário");
		}
	}

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="max-w-xl mx-auto">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">
						Editar usuário
					</DialogTitle>

					<DialogDescription>
						Altere os campos abaixo para atualizar um usuário.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
									<FormLabel>E-mail</FormLabel>
									<FormControl>
										<Input placeholder="user@email.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
							name="email"
						/>

						<FormField
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tipo de Acesso</FormLabel>
									<FormControl>
										<Select
											value={field.value}
											onValueChange={(value) => field.onChange(value)}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Tipo de Acesso" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="ADMIN">Administrador</SelectItem>
												<SelectItem value="TEACHER">Professor</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
							name="role"
						/>

						<DialogFooter>
							<DialogClose asChild>
								<Button variant="ghost" type="button">
									Cancelar
								</Button>
							</DialogClose>

							<Button
								disabled={updateUserMutation.isPending}
								type="submit"
								className="bg-emerald-700 text-gray-200 hover:bg-emerald-500"
							>
								{updateUserMutation.isPending ? (
									<LoaderCircle className="animate-spin" />
								) : (
									"Salvar"
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
