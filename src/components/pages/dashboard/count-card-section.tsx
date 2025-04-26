import { useMetricsQuery } from "@/api/queries/get-count-metrics.ts";

import { AnimatedCounter } from "@/components/ui/aniamted-counter.tsx";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card.tsx";
import { TrendingUpIcon } from "lucide-react";

export function CountCardSection() {
	const { data: countMetrics } = useMetricsQuery();

	return (
		<div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
			<Card className="@container/card">
				<CardHeader className="relative">
					<CardDescription>Total de Reservas</CardDescription>
					<CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
						<AnimatedCounter value={countMetrics?.reservations ?? 0} />
					</CardTitle>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Ultimo meses <TrendingUpIcon className="size-4" />
					</div>
				</CardFooter>
			</Card>
			<Card className="@container/card">
				<CardHeader className="relative">
					<CardDescription>Total de Espaços</CardDescription>
					<CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
						<AnimatedCounter value={countMetrics?.academicSpaces ?? 0} />
					</CardTitle>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Ultimo meses <TrendingUpIcon className="size-4" />
					</div>
				</CardFooter>
			</Card>
			<Card className="@container/card">
				<CardHeader className="relative">
					<CardDescription>Total de Usuários</CardDescription>
					<CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
						<AnimatedCounter value={countMetrics?.users ?? 0} />
					</CardTitle>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Ultimo meses <TrendingUpIcon className="size-4" />
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
