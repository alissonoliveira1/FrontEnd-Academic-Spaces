import type { useAuth } from "@/components/contexts/auth-context.tsx";
import type { UserAbilities } from "@/lib/permissions";
import { redirect } from "@tanstack/react-router";
import { type ClassValue, clsx } from "clsx";
import { format, parseISO, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { flow } from "lodash";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDateToPtBR(
	date: Date | string,
	formatString = "dd/MM/yyyy",
) {
	const parsedDate = typeof date === "string" ? parseISO(date) : date;

	return format(parsedDate, formatString, {
		locale: ptBR,
	});
}

export function withAuth(
	auth: ReturnType<typeof useAuth>,
	can?: (can: UserAbilities) => boolean,
) {
	if (auth.isAuthenticated && !auth.isLoading) {
		if (typeof can === "function" && !can(auth.ability)) {
			throw redirect({
				to: "/dashboard",
				replace: true,
			});
		}
	}
}

export function isValidTimeString(value: unknown): value is string {
	if (typeof value !== "string") {
		return false;
	}

	const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;

	return regex.test(value);
}

export function transformTimeStringToDate(
	time: string,
	dateReference = new Date(),
): Date {
	const [hours, minutes] = time.split(":").map(Number);

	return flow(
		(date) => setHours(date, hours),
		(date) => setMinutes(date, minutes),
	)(dateReference);
}

export function setDateTime(date: Date, time: string): Date {
	const [hours, minutes] = time.split(":").map(Number);

	return flow(
		(date) => setHours(date, hours),
		(date) => setMinutes(date, minutes),
	)(date);
}
