import { Skeleton } from "@/components/ui/skeleton.tsx";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table.tsx";

export function ReservationTableLoading() {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Espaço</TableHead>
					<TableHead>Professor</TableHead>
					<TableHead>Data de inicio</TableHead>
					<TableHead>Data de termino</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Ações</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{Array.from({
					length: 4,
				}).map(() => (
					<TableRow key={Date.now().toString()}>
						<TableCell colSpan={6}>
							<div className="shadow-xs w-full  space-y-10">
								<Skeleton className="h-4 mb-2 rounded-sm" />
								<Skeleton className="h-4  mb-2 mt-5 rounded-sm" />
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
