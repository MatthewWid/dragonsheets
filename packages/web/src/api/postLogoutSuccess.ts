import { api } from "../lib/ky";

export const postLogoutSuccess = () => api.post("auth/logout-success");
