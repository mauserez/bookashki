import axios, { AxiosInstance } from "axios";

axios.defaults.baseURL = "http://localhost:3001";

const API: AxiosInstance = axios.create({
	baseURL: `http://localhost:3000`,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

export default API;
