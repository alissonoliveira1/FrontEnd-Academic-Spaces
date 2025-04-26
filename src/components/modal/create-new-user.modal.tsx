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

import {
	type CreateUserParams,
	useCreateUserMutation,
} from "@/api/mutations/create-user.ts";
import { useGetSchoolsQuery } from "@/api/queries/get-schools.ts";

import { SelectWithSearch } from "@/components/common/select-with-search.tsx";
import { useAuth } from "@/components/contexts/auth-context.tsx";
import type { USER_ROLE } from "@/lib/permissions";
import { useModal } from "@/store/modal.ts";

import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { LoaderCircle, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const baseUserSchema = z.object({
	email: z.string().email(),
	name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
	password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
	confirmPassword: z.string(),
	contactNumber: z
		.string()
		.min(9, "Número de contato deve ter pelo menos 9 caracteres"),
});

const adminUserSchema = baseUserSchema.extend({
	role: z.literal("ADMIN"),
});

const teacherUserSchema = baseUserSchema.extend({
	role: z.literal("TEACHER"),
	course: z.string().min(2, "Disciplina deve ter pelo menos 2 caracteres"),
	schoolUnitId: z.string().min(1, "Selecione uma instituição"),
});

const createUserSchema = z
	.discriminatedUnion("role", [adminUserSchema, teacherUserSchema])
	.refine((vl) => vl.password === vl.confirmPassword, {
		path: ["confirmPassword"],
		message: "Senhas não coincidem",
	});

type CreateUser = z.infer<typeof createUserSchema>;

export function CreateNewUserModal() {
	const [modal, setModal] = useModal("create-user-modal");
	const navigate = useNavigate({ from: "/dashboard/admin/users" });
	const client = useQueryClient();
	const { ability } = useAuth();

	const form = useForm<CreateUser>({
		resolver: zodResolver(createUserSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
			name: "",
			role: "ADMIN",
		},
	});
	const watchedRole = form.watch("role");

	const { data: schoolsData } = useGetSchoolsQuery(
		{
			page: 1,
			pageSize: 100,
		},
		{
			enabled: watchedRole === "TEACHER",
			queryKey: ["schools"],
		},
	);

	const schools = schoolsData?.content || [];

	const createUserMutation = useCreateUserMutation({
		onSuccess() {
			toast.success("Usuário criado com sucesso");
			setModal({ open: false });
			form.reset();
			void client.invalidateQueries({
				predicate: (query) => query.queryKey.includes("users"),
			});

			void navigate({
				to: ".",
				search: (props) => ({ ...props, page: 1 }),
			});
		},
		onError(e) {
			console.log(e);
			toast.error("Erro ao criar usuário");
		},
	});

	async function onSubmit(data: CreateUser) {
		if (ability.cannot("create", "users")) {
			toast.error("Você não tem permissão para criar um usuário");
			return;
		}

		let userData = {} as CreateUserParams;

		if (data.role === "ADMIN") {
			userData = {
				email: data.email,
				password: data.password,
				role: data.role,
				name: data.name,
				contactNumber: data.contactNumber,
			};
		}

		if (data.role === "TEACHER") {
			userData = {
				email: data.email,
				password: data.password,
				role: data.role,
				name: data.name,
				course: data.course,
				contactNumber: data.contactNumber,
				schoolUnitId: data.schoolUnitId,
			};
		}

		createUserMutation.mutate(userData);
	}

	function handleOpenChange(open: boolean) {
		setModal({ open });
		if (!open) {
			form.reset();
		}
	}

	const schoolsUnitsOptions = schools?.map((school) => ({
		label: `${school.name} - ${school.state}/${school.city}`,
		value: school.id,
	}));

	const titlePredicate =
		watchedRole === "ADMIN" ? "Administrador" : "Professor";

	return (
		<Dialog onOpenChange={handleOpenChange} open={modal.open}>
			<DialogTrigger asChild>
				<Button variant="outline" size="lg">
					<UserPlus className="size-4" />
					Adicionar Usuário
				</Button>
			</DialogTrigger>

			<DialogContent className="max-w-2xl mx-auto">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">{`Novo ${titlePredicate}`}</DialogTitle>
					<DialogDescription>
						Preencha os campos abaixo para criar um novo {titlePredicate}.
					</DialogDescription>
				</DialogHeader>

				<Tabs
					value={watchedRole}
					onValueChange={(value) => form.setValue("role", value as USER_ROLE)}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-2 mb-4">
						<TabsTrigger value="ADMIN">Administrador</TabsTrigger>
						<TabsTrigger value="TEACHER">Professor</TabsTrigger>
					</TabsList>
				</Tabs>

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
									<FormLabel>Número para contato</FormLabel>
									<FormControl>
										<Input placeholder="(00) 00000-0000" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
							name="contactNumber"
						/>

						{watchedRole === "TEACHER" && (
							<>
								<FormField
									render={({ field }) => (
										<FormItem>
											<FormLabel>Disciplina</FormLabel>
											<FormControl>
												<Input placeholder="Ex: Matemática" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
									name="course"
								/>

								<FormField
									control={form.control}
									name="schoolUnitId"
									render={({ field }) => (
										<FormItem className="flex flex-col">
											<FormLabel>Instituição</FormLabel>
											<SelectWithSearch
												options={schoolsUnitsOptions}
												value={field.value}
												onChange={field.onChange}
												placeholder="Selecione uma instituição"
											/>

											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}

						<FormField
							render={({ field }) => (
								<FormItem>
									<FormLabel>Senha</FormLabel>
									<FormControl>
										<Input type="password" placeholder="*****" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
							name="password"
						/>

						<FormField
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirmar senha</FormLabel>
									<FormControl>
										<Input type="password" placeholder="*****" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
							name="confirmPassword"
						/>

						<input type="hidden" {...form.register("role")} />

						<DialogFooter>
							<Button
								variant="ghost"
								type="button"
								onClick={() => setModal({ open: false })}
							>
								Cancelar
							</Button>

							<Button
								disabled={createUserMutation.isPending}
								type="submit"
								className="bg-emerald-700 text-gray-200 hover:bg-emerald-500"
							>
								{createUserMutation.isPending ? (
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
