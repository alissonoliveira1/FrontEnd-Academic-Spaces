import { useAuth } from "@/components/contexts/auth-context.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
	ArrowRight,
	Building2,
	Calendar,
	CheckCircle,
	ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	const { isAuthenticated } = useAuth();

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
			<header className="container mx-auto px-4 py-6">
				<nav className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<Building2 className="h-6 w-6 text-primary" />
						<span className="text-xl font-bold tracking-tighter">
							Academic Space
						</span>
					</div>
					{isAuthenticated ? (
						<Link to="/dashboard">
							<Button variant="outline">Dashboard</Button>
						</Link>
					) : (
						<Link to="/auth/sign-in">
							<Button variant="outline">Entrar</Button>
						</Link>
					)}
				</nav>
			</header>

			<section className="flex justify-center">
				<Building2 className="size-20 text-primary animate-pulse" />
			</section>

			<section className="container mx-auto px-4 py-20 text-center">
				<h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
					<span className="tracking-tighter">EA</span>{" "}
					<span className="text-primary">Espaços Acadêmicos</span>
				</h1>
				<p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
					Simplifique o processo de reserva e gerenciamento de salas e espaços
					em sua instituição acadêmica. Uma solução completa para
					administradores e professores.
				</p>
				<div className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
					<Link to="/auth/sign-in">
						<Button size="lg" className="h-12 px-8">
							Acessar o Sistema
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</Link>
					<Link to="/auth/sign-in" href="#features">
						<Button variant="outline" size="lg" className="h-12 px-8">
							Conhecer Recursos
						</Button>
					</Link>
				</div>
			</section>

			<section id="features" className="container mx-auto px-4 py-20">
				<h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
					Recursos Principais
				</h2>
				<div className="mt-16 grid gap-8 md:grid-cols-3">
					<div className="flex flex-col items-center text-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
							<Building2 className="h-8 w-8 text-primary" />
						</div>
						<h3 className="mt-6 text-xl font-medium">
							Gerenciamento de Espaços
						</h3>
						<p className="mt-2 text-muted-foreground">
							Cadastre e gerencie todos os espaços acadêmicos disponíveis em sua
							instituição com facilidade.
						</p>
					</div>
					<div className="flex flex-col items-center text-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
							<Calendar className="h-8 w-8 text-primary" />
						</div>
						<h3 className="mt-6 text-xl font-medium">Reservas Simplificadas</h3>
						<p className="mt-2 text-muted-foreground">
							Processo intuitivo de reserva para professores, com visualização
							clara de disponibilidade.
						</p>
					</div>
					<div className="flex flex-col items-center text-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
							<CheckCircle className="h-8 w-8 text-primary" />
						</div>
						<h3 className="mt-6 text-xl font-medium">Confirmação de Uso</h3>
						<p className="mt-2 text-muted-foreground">
							Sistema de confirmação que garante o uso eficiente dos espaços e
							evita reservas não utilizadas.
						</p>
					</div>
				</div>
			</section>

			<section className="container mx-auto px-4 py-20">
				<h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
					Para Quem é o Sistema?
				</h2>
				<div className="mt-16 grid gap-8 md:grid-cols-2">
					<div className="rounded-lg border bg-card p-8 shadow-sm">
						<h3 className="text-2xl font-bold">Administradores</h3>
						<ul className="mt-4 space-y-3">
							<li className="flex items-start">
								<ShieldCheck className="mr-2 h-5 w-5 text-primary" />
								<span>Gerenciamento completo de espaços acadêmicos</span>
							</li>
							<li className="flex items-start">
								<ShieldCheck className="mr-2 h-5 w-5 text-primary" />
								<span>Cadastro e controle de professores autorizados</span>
							</li>
							<li className="flex items-start">
								<ShieldCheck className="mr-2 h-5 w-5 text-primary" />
								<span>Visualização e aprovação de todas as reservas</span>
							</li>
							<li className="flex items-start">
								<ShieldCheck className="mr-2 h-5 w-5 text-primary" />
								<span>Relatórios de utilização de espaços</span>
							</li>
						</ul>
					</div>
					<div className="rounded-lg border bg-card p-8 shadow-sm">
						<h3 className="text-2xl font-bold">Professores</h3>
						<ul className="mt-4 space-y-3">
							<li className="flex items-start">
								<ShieldCheck className="mr-2 h-5 w-5 text-primary" />
								<span>Visualização de espaços disponíveis</span>
							</li>
							<li className="flex items-start">
								<ShieldCheck className="mr-2 h-5 w-5 text-primary" />
								<span>Reserva simplificada de salas e auditórios</span>
							</li>
							<li className="flex items-start">
								<ShieldCheck className="mr-2 h-5 w-5 text-primary" />
								<span>Gerenciamento das próprias reservas</span>
							</li>
							<li className="flex items-start">
								<ShieldCheck className="mr-2 h-5 w-5 text-primary" />
								<span>Confirmação de utilização dos espaços</span>
							</li>
						</ul>
					</div>
				</div>
			</section>

			<footer className="border-t bg-background">
				<div className="container mx-auto px-4 py-10">
					<div className="flex flex-col items-center justify-between gap-6 md:flex-row">
						<div className="flex items-center space-x-2">
							<Building2 className="h-6 w-6 text-primary" />
							<span className="text-xl font-bold">Academic Space</span>
						</div>
						<p className="text-center text-sm text-muted-foreground md:text-left">
							&copy; {new Date().getFullYear()} Academic Space Management. Todos
							os direitos reservados.
						</p>
						<div className="flex space-x-4">
							<p className="text-sm text-muted-foreground hover:text-foreground">
								Termos
							</p>
							<p className="text-sm text-muted-foreground hover:text-foreground">
								Privacidade
							</p>
							<p className="text-sm text-muted-foreground hover:text-foreground">
								Contato
							</p>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
