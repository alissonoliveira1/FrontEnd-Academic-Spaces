import { atom, useAtom } from "jotai";
import { atomFamily } from "jotai/utils";

import deepEqual from "fast-deep-equal";
import { useCallback } from "react";
import { z } from "zod";

const defaultModalSchema = z.object({
	open: z.boolean(),
});

const modalStoreSchema = z.object({
	"update-reservation-modal": defaultModalSchema.extend({
		reservation: z
			.object({
				id: z.string(),
				spaceId: z.string(),
				startDateTime: z.string(),
				endDateTime: z.string(),
			})
			.nullable(),
	}),

	"cancel-reservation-modal": defaultModalSchema.extend({
		reservationId: z.string().uuid().nullable(),
	}),

	"update-user-modal": defaultModalSchema.extend({
		userDetails: z
			.object({
				id: z.string(),
				email: z.string(),
				name: z.string(),
				role: z.string(),
			})
			.nullable(),
	}),

	"create-user-modal": defaultModalSchema,
	"delete-user-modal": defaultModalSchema.extend({
		user: z
			.object({
				name: z.string(),
				id: z.string().uuid(),
			})
			.nullable(),
	}),

	"delete-school-unit-modal": defaultModalSchema.extend({
		schoolUnit: z
			.object({
				name: z.string(),
				id: z.string().uuid(),
			})
			.nullable(),
	}),
});

export type StorageSchema = z.infer<typeof modalStoreSchema>;
export type ModalStoreSchema = StorageSchema[keyof StorageSchema];
export type ModalStorageKey = keyof StorageSchema;

export const modalStorageAtom = atom<StorageSchema>({
	"update-reservation-modal": {
		open: false,
		reservation: null,
	},
	"cancel-reservation-modal": {
		open: false,
		reservationId: null,
	},
	"update-user-modal": {
		open: false,
		userDetails: null,
	},
	"create-user-modal": {
		open: false,
	},

	"delete-user-modal": {
		user: null,
		open: false,
	},
	"delete-school-unit-modal": {
		schoolUnit: null,
		open: false,
	},
});

export const modalStorageFamily = atomFamily(
	(key: ModalStorageKey) =>
		atom(
			(get) => get(modalStorageAtom)[key],
			(get, set, args: ModalStoreSchema) => {
				const currentState = get(modalStorageAtom);

				set(modalStorageAtom, {
					...currentState,
					[key]: {
						...currentState[key],
						...args,
					},
				});
			},
		),
	deepEqual,
);

export function useModal<Key extends keyof StorageSchema>(
	key: Key,
): [
	modalState: StorageSchema[Key],
	setModalState: (vl: Partial<StorageSchema[Key]>) => void,
] {
	const [modal, setAtom] = useAtom(modalStorageFamily(key));

	const setModal = useCallback(
		(newState: Partial<StorageSchema[Key]>) => {
			console.log({ newState });

			setAtom(newState as StorageSchema[Key]);
		},
		[setAtom],
	);

	return [
		modal as StorageSchema[Key],
		setModal as unknown as (vl: Partial<StorageSchema[Key]>) => void,
	];
}
