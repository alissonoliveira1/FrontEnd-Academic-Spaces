import { useAuth } from "@/components/contexts/auth-context.tsx";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card.tsx";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/auth/sign-in")({
	component: SignInPage,
});

const formSignInSchema = z.object({
	email: z.string().email("Informe um email válido"),
	password: z
		.string({ message: "Informe um E-mail válido" })
		.min(4, "Informe uma senha com no mínimo 6 caracteres"),
});

type SignInForm = z.infer<typeof formSignInSchema>;

function SignInPage() {
	const { signIn } = useAuth();
	const router = useRouter();
	const navigate = Route.useNavigate();
	const form = useForm<SignInForm>({
		resolver: zodResolver(formSignInSchema),
		values: {
			email: "",
			password: "",
		},
	});

	async function handleSignIn(values: SignInForm) {
		try {
			await signIn({ email: values.email, password: values.password });

			toast.success("Login efetuado com sucesso");

			void navigate({
				to: "/dashboard",
			});

			void router.invalidate();
		} catch (e) {
			toast.error("Credenciais inválidas");
		}
	}

	return (
		<div className="w-full flex min-h-screen items-center justify-center bg-background px-4 py-12">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-2 text-center">
					<div className="flex justify-center mb-2">
						<Building2 className="h-10 w-10 text-primary" />
					</div>
					<CardTitle className="text-2xl font-bold">
						Faça login na sua conta
					</CardTitle>
					<CardDescription>
						Insira seu email e senha para acessar o Sistema de Gestão de Espaço
						Acadêmico
					</CardDescription>
				</CardHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSignIn)}>
						<CardContent className="space-y-4">
							<FormField
								render={({ field }) => (
									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											placeholder="admin@university.edu"
											{...field}
										/>
										<FormMessage />
									</div>
								)}
								name="email"
							/>

							<FormField
								render={({ field }) => (
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<Label htmlFor="password">Password</Label>
											<Link
												className="text-sm text-primary hover:underline"
												to={"/auth/sign-in"}
											>
												Esqueceu sua senha ?
											</Link>
										</div>
										<Input
											id="password"
											type="password"
											placeholder="password"
											{...field}
										/>

										<FormMessage />
									</div>
								)}
								name="password"
							/>
						</CardContent>
						<CardFooter className="flex flex-col mt-3">
							<Button type="submit" className="w-full" disabled={false}>
								{form.formState.isSubmitting ? "Entrando..." : "Entrar"}
							</Button>
							<p className="mt-4 text-center text-sm text-muted-foreground">
								Não tem uma conta?{" "}
								<Link
									to="/auth/sign-in"
									className="text-primary hover:underline"
								>
									Contate o administrador
								</Link>
							</p>
						</CardFooter>
					</form>
				</Form>
			</Card>
		</div>
	);
}
