import { storage } from "@/lib/storage.ts";
import axios from "axios";

export const eaApi = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

eaApi.interceptors.request.use((request) => {
	const token = storage.getItem("token");

	if (token && request.headers) {
		request.headers.Authorization = `Bearer ${token}`;
	}

	return request;
});
