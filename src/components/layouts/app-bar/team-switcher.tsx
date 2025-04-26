"use client";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar.tsx";
import { Building2 } from "lucide-react";

export function TeamSwitcher() {
	return (
		<SidebarMenu>
			<SidebarMenuItem className="flex items-center space-x-2 justify-center">
				<div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
					<Building2 className="size-5" />
				</div>
				<div className="grid flex-1 text-left text-sm leading-tight">
					<span className="truncate font-semibold text-md">
						Espaços Academicos
					</span>
					<span className="truncate text-xs">EA Spaces</span>
				</div>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
