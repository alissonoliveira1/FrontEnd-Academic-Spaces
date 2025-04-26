import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export function SpaceTableLoading() {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>
						<div className="flex items-center space-x-2">
							<Skeleton className="h-4 w-4 rounded-sm" />
							<Skeleton className="h-4 w-24 rounded-sm" />
						</div>
					</TableHead>
					<TableHead>
						<div className="flex items-center space-x-2">
							<Skeleton className="h-4 w-4 rounded-sm" />
							<Skeleton className="h-4 w-24 rounded-sm" />
						</div>
					</TableHead>
					<TableHead>
						<div className="flex items-center space-x-2">
							<Skeleton className="h-4 w-4 rounded-sm" />
							<Skeleton className="h-4 w-24 rounded-sm" />
						</div>
					</TableHead>
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
