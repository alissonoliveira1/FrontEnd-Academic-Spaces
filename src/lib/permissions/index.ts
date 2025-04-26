import type { User } from "@/api/queries/get-current-user.ts";
import {
	AbilityBuilder,
	type MongoAbility,
	createMongoAbility,
} from "@casl/ability";
import type { ReservationSubject } from "./models/reservation";

export type USER_ROLE = "ADMIN" | "TEACHER";

export type UserAbilityDetails = User;

export type Actions = "show" | "create" | "update" | "manage" | "delete";
export type Subject =
	| "users"
	| ReservationSubject
	| "spaces"
	| "all"
	| "metrics"
	| "my-reservations"
	| "schools";

export type UserAbilities = MongoAbility<[Actions, Subject]>;

type PermissionsByRole = (
	user: UserAbilityDetails,
	builder: AbilityBuilder<UserAbilities>,
) => void;

export const permissions: Record<USER_ROLE, PermissionsByRole> = {
	ADMIN(_, { can }) {
		can("manage", "all");
	},

	TEACHER(currentUser, { can }) {
		can("update", "Reservation", {
			userId: { $eq: currentUser.id },
			status: { $eq: "SCHEDULED" },
		});

		can("show", "my-reservations");
	},
};

export function defineAbilityForUser(user?: UserAbilityDetails) {
	const builder = new AbilityBuilder<UserAbilities>(createMongoAbility);

	if (!user) {
		return builder.build();
	}

	const hasPermissions = typeof permissions[user.role] === "function";

	if (hasPermissions) {
		permissions[user.role](user, builder);
	}

	const ability = builder.build({
		detectSubjectType(subject) {
			return subject.__typename;
		},
	});

	ability.can = ability.can.bind(ability);
	ability.cannot = ability.cannot.bind(ability);

	return ability;
}
