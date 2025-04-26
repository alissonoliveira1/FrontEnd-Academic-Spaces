import { Badge } from "@/components/ui/badge.tsx";
import { cn } from "@/lib/utils.ts";

export interface ReservationStatusIndicatorProps {
	reservation: {
		status: string;
		confirmedByTheUser?: boolean;
		confirmedVyEnterprise?: boolean;
		isScheduled?: boolean;
	};
}

export function ReservationStatusIndicator({
	reservation,
}: ReservationStatusIndicatorProps) {
	return (
		<Badge
			variant="outline"
			className={cn([
				"uppercase shadow-xs",
				{
					"text-cyan-600": reservation.status === "Agendado",
					"text-green-600":
						reservation.confirmedByTheUser || reservation.confirmedVyEnterprise,
					"text-red-600": reservation.status === "Cancelado",
				},
			])}
		>
			{reservation.status}
		</Badge>
	);
}
