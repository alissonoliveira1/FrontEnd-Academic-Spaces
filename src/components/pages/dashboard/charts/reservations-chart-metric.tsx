import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useGetReservationInWeekCountMetricQuery } from "@/api/queries/get-reservation-week-metric.ts";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart.tsx";
import { setDay } from "date-fns";

const chartConfig = {
	count: {
		label: "Reservas",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

export function ReservationsChartMetric() {
	const { data: reservations } = useGetReservationInWeekCountMetricQuery();

	return (
		<ChartContainer
			config={chartConfig}
			className="aspect-auto h-[400px] w-full"
		>
			<AreaChart data={reservations}>
				<defs>
					<linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
						<stop
							offset="5%"
							stopColor="var(--color-desktop)"
							stopOpacity={1.0}
						/>
						<stop
							offset="95%"
							stopColor="var(--color-desktop)"
							stopOpacity={0.1}
						/>
					</linearGradient>
					<linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
						<stop
							offset="5%"
							stopColor="var(--color-mobile)"
							stopOpacity={0.8}
						/>
						<stop
							offset="95%"
							stopColor="var(--color-mobile)"
							stopOpacity={0.1}
						/>
					</linearGradient>
				</defs>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey="dayofweek"
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					minTickGap={32}
					tickFormatter={(value) => {
						const date = setDay(new Date(), value);
						return date.toLocaleDateString("pt-BR", {
							month: "short",
							day: "numeric",
						});
					}}
				/>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent indicator="dot" />}
				/>
				<Area
					dataKey="count"
					label="Reservas"
					type="natural"
					fill="url(#fillMobile)"
					stroke="var(--color-mobile)"
					stackId="a"
				/>
			</AreaChart>
		</ChartContainer>
	);
}
