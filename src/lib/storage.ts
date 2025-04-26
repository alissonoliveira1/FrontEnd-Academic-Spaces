import { useSyncExternalStore } from "react";

export const storageKeys = {
	token: "ea@token",
} as const;

type StorageKey = keyof typeof storageKeys;

export const storage = {
	getItem(key: StorageKey) {
		const value = localStorage.getItem(storageKeys[key]);

		if (!value) return null;

		try {
			return JSON.parse(value);
		} catch {
			return value;
		}
	},
	setItem(key: StorageKey, value: unknown) {
		localStorage.setItem(
			storageKeys[key],
			typeof value === "string" ? value : JSON.stringify(value),
		);
	},
	deleteItem(key: StorageKey) {
		localStorage.removeItem(storageKeys[key]);
	},
};

type SetActionFunction = <Value>(value: Value) => void;

export type UseLocalStorageType = [string | null, SetActionFunction];

export function useLocalStorage(key: StorageKey): UseLocalStorageType {
	const ac = new AbortController();

	const getCurrentValue = () => storage.getItem(key);
	const setValue: SetActionFunction = (value) => storage.setItem(key, value);

	const handleStorageChange = (callback: () => void) => {
		window.addEventListener(
			"storage",
			(event) => {
				if (event.key === storageKeys[key]) {
					callback();
				}
			},
			{
				signal: ac.signal,
			},
		);

		return () => {
			ac.abort();
		};
	};

	return [useSyncExternalStore(handleStorageChange, getCurrentValue), setValue];
}
