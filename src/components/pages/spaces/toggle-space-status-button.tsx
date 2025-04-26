import {
	getChangeSpaceStatusMutationKey,
	useChangeSpaceStatus,
} from "@/api/mutations/change-space-status.ts";
import {
	type AcademicSpace,
	type GetAcademicSpacesResponse,
	getAcademicSpacesQueryKey,
} from "@/api/queries/get-paginated-academics-spaces";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";

export interface ToggleSpaceStatusButtonProps {
	space: {
		id: string;
		status: AcademicSpace["status"];
	};
}

export function ToggleSpaceStatusButton({
	space,
}: ToggleSpaceStatusButtonProps) {
	const search = useSearch({ from: "/(app)/dashboard/admin/spaces" });
	const client = useQueryClient();

	const queryKey = getAcademicSpacesQueryKey(search);

	const { mutate: changeStatus } = useChangeSpaceStatus({
		onMutate: (values) => {
			const oldQueryCache =
				client.getQueryData<GetAcademicSpacesResponse>(queryKey);

			client.setQueryData(queryKey, (cache: GetAcademicSpacesResponse) => {
				return {
					...cache,
					content: cache?.content?.map((space) => ({
						...space,
						status: space.id === values.id ? values.status : space.status,
					})),
				};
			});

			return oldQueryCache;
		},
		onError(_, __, oldCache) {
			client.setQueryData(queryKey, oldCache);
		},
		mutationKey: getChangeSpaceStatusMutationKey(space.id),
	});

	return (
		<div className="flex items-center space-x-2">
			<Switch
				id="toggle-space-status"
				className="my-2"
				onCheckedChange={() =>
					changeStatus({
						status: space.status === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE",
						id: space.id,
					})
				}
				checked={space.status === "AVAILABLE"}
			/>
			<Label htmlFor="toggle-space-status">
				{space.status === "AVAILABLE" ? "Desativar" : "Ativar"}
			</Label>
		</div>
	);
}
