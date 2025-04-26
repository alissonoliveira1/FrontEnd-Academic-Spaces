import { LockIcon, User2 } from "lucide-react";
import type * as React from "react";
import { useMemo } from "react";

import { useAuth } from "@/components/contexts/auth-context.tsx";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar.tsx";
import { NavMain } from "./nav-main.tsx";
import { NavUser } from "./nav-user.tsx";
import { TeamSwitcher } from "./team-switcher.tsx";

// This is sample data.

const adminActions = [
	{
		title: "Administração",
		url: "/dashboard/admin/",
		icon: LockIcon,
		isActive: true,
		items: [
			{
				title: "Usuários",
				url: "/dashboard/admin/users",
			},
			{
				title: "Reservas",
				url: "/dashboard/admin/reservations",
			},
			{
				title: "Unidade escolar",
				url: "/dashboard/admin/schools",
			},
			{
				title: "Espaços acadêmicos",
				url: "/dashboard/admin/spaces",
			},
		],
	},
];
const professorActions = [
	{
		title: "Professor",
		url: "#",
		icon: User2,
		isActive: true,
		items: [
			{
				title: "Minhas Reservas",
				url: "/dashboard/teacher/my-reservations",
			},
		],
	},
];

const mapper = {
	ADMIN: adminActions.concat(professorActions),
	TEACHER: professorActions,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { user } = useAuth();

	if (!user?.role) return;

	const currentActions = useMemo(() => mapper[user.role], [user.role]);

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={currentActions} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
