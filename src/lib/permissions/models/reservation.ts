import { z } from "zod";

export const reservationTypeName = z
	.literal("Reservation")
	.default("Reservation");

export const reservationSchema = z.object({
	__typename: reservationTypeName,
	id: z.string(),
	status: z.enum([
		"CONFIRMED_BY_THE_USER",
		"CONFIRMED_BY_THE_ENTERPRISE",
		"CANCELED",
		"SCHEDULED",
	]),
	userId: z.string(),
});

export const reservationSubject = z.union([
	reservationTypeName,
	reservationSchema,
]);

export type Reservation = z.infer<typeof reservationSchema>;
export type ReservationSubject = z.infer<typeof reservationSubject>;
export type ReservationTypeName = z.infer<typeof reservationTypeName>;
