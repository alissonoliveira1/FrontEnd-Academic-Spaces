import type { AxiosError } from "axios";
import { z } from "zod";

export const DomainExceptionCode = z.enum([
	"DOMAIN_ERROR",
	"SPACE_ALREADY_EXISTS",
	"SPACE_NOT_FOUND",
	"DUPLICATE_FOUND",
	"RESERVATION_INTERVAL_OVERLAP",
	"USER_HAS_PENDING_RESERVATIONS",
	"SPACE_NOT_AVAILABLE",
]);

export type DomainExceptionCode = z.infer<typeof DomainExceptionCode>;

export class EaApiException extends Error {
	public status: number;
	public data: { message: string; code: DomainExceptionCode } | undefined;

	public errorCode: DomainExceptionCode;

	constructor(
		error: AxiosError<{ message: string; code: DomainExceptionCode }>,
	) {
		super(error.message);
		this.name = "EaApiException";
		this.status = error.response?.status || 500;
		this.data = error.response?.data;

		console.log({ data: this.data });

		const results = DomainExceptionCode.safeParse(this.data?.code);

		this.errorCode = results?.success
			? results.data
			: DomainExceptionCode.parse("DOMAIN_ERROR");
	}
}
