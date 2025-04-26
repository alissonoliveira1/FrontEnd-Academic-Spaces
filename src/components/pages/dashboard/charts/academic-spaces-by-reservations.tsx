import { useGetReservationByAcademicSpacesMetricQuery } from "@/api/queries/get-reservation-by-academic-spaces-metric.ts";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart.tsx";

import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	XAxis,
	YAxis,
} from "recharts";

const chartConfig = {
	roomName: {
		label: "Nome",
		color: "hsl(var(--chart-4))",
	},
	count: {
		label: "Total de reservas",
		color: "hsl(var(--chart-4))",
	},
} satisfies ChartConfig;

export function AcademicSpacesByReservations() {
	const { data: reservations = [] } =
		useGetReservationByAcademicSpacesMetricQuery();

	const parsedReservations = reservations
		.map((reservation) => ({
			roomName: `${reservation.acronym} - ${reservation.roomname}`,
			count: reservation.count,
		}))
		.slice();

	return (
		<ChartContainer
			config={chartConfig}
			className="aspect-auto h-[400px] w-full"
		>
			<BarChart
				accessibilityLayer
				data={parsedReservations}
				layout="vertical"
				margin={{
					right: 16,
				}}
			>
				<CartesianGrid horizontal={false} />
				<YAxis
					dataKey="roomName"
					type="category"
					tickLine={false}
					tickMargin={10}
					axisLine={false}
					tickFormatter={(value) => value.slice(0, 3)}
					hide
				/>
				<XAxis dataKey="count" type="number" hide />
				<ChartTooltip
					cursor={false}
					labelClassName="fill-[--color-muted-foreground]"
					content={<ChartTooltipContent indicator="line" />}
				/>
				<Bar
					className="shadow-sm"
					dataKey="count"
					layout="vertical"
					fill="var(--color-chart-1)"
					radius={4}
				>
					<LabelList
						dataKey="roomName"
						position="insideLeft"
						offset={8}
						className="fill-foreground"
						fontSize={12}
					/>
					<LabelList
						dataKey="count"
						position="right"
						offset={8}
						className="fill-foreground"
						fontSize={12}
					/>
				</Bar>
			</BarChart>
		</ChartContainer>
	);
}
