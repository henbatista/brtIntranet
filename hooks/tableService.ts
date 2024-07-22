import { getUserToken } from "./getToken";
const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

export async function fetchData(url: string, params: string = "") {
    const { token } = getUserToken();
    return useFetch(`${apiBaseUrl}/${url}${params}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
}
