import { AcademicSpacesByReservations } from "@/components/pages/dashboard/charts/academic-spaces-by-reservations.tsx";
import { ReservationsChartMetric } from "@/components/pages/dashboard/charts/reservations-chart-metric.tsx";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card.tsx";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { useIsMobile } from "@/hooks/use-mobile.ts";
import * as React from "react";

const chartsMap = {
	per_reservations: {
		title: "Curva de Reservas",
		description: "Total de reservas nos últimos 7 dias",
		chart: <ReservationsChartMetric />,
	},
	per_academic_saces: {
		title: "Espaços Acadêmicos por Reservas",
		description: "10 espaços acadêmicos com mais reservas nos últimos 7 dias",
		chart: <AcademicSpacesByReservations />,
	},
};

export function Charts() {
	const isMobile = useIsMobile();
	const [timeRange, setTimeRange] = React.useState("7d");
	const [chartType, setChartType] =
		React.useState<keyof typeof chartsMap>("per_reservations");

	React.useEffect(() => {
		if (isMobile) {
			setTimeRange("7d");
		}
	}, [isMobile]);

	const currentChart = chartsMap[chartType];

	return (
		<Card className="@container/card lg:mx-6">
			<CardHeader className="relative">
				<CardTitle>{currentChart.title}</CardTitle>
				<CardDescription>
					<span className="@[540px]/card:block hidden">
						{currentChart.description}
					</span>
					<span className="@[540px]/card:hidden">Last 3 months</span>
				</CardDescription>
				<div className="absolute right-4 top-4 flex items-center justify-end w-full gap-4">
					<Select
						onValueChange={(value) =>
							setChartType(value as keyof typeof chartsMap)
						}
						value={chartType}
					>
						<SelectTrigger>
							<SelectValue placeholder="Relação" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="per_reservations">Por Reserva</SelectItem>
							<SelectItem value="per_academic_saces">
								Por espaço acadêmico
							</SelectItem>
						</SelectContent>
					</Select>

					<ToggleGroup
						type="single"
						value={timeRange}
						onValueChange={setTimeRange}
						variant="outline"
						className="@[767px]/card:flex hidden"
					>
						<ToggleGroupItem value="7d" className="h-8 px-2.5">
							Últimos 7 dias
						</ToggleGroupItem>
					</ToggleGroup>
				</div>
			</CardHeader>
			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
				{currentChart.chart}
			</CardContent>
		</Card>
	);
}
