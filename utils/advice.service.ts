import type { TWarnings } from "@/types/warnings";
import type { onPromisseError } from "@/hooks/useError";

const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

export const getAdvices = async (
    search = "",
    page = 1,
    per_page = 10,
    field = ""
) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {
            search: search,
            page: page,
            per_page: per_page,
            field: field,
        };
        const response = await useFetch(`${apiBaseUrl}/suporte/avisos/listar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body,
        });
        if (response?.data?.value?.success) {
            let advicesResponse = response.data.value;
            return advicesResponse;
        } else {
            throw new Error("Falha ao buscar Avisos!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const saveAdvice = async (body: any) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(
            `${apiBaseUrl}/suporte/avisos/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body,
            }
        );
        if (response?.data?.value?.success) {
            let adviceResponse = response.data.value;
            return adviceResponse;
        } else {
            onPromisseError(response.data.value, "Falha ao cadastrar Avisos!");
            throw new Error("Falha ao cadastrar Avisos!");
        }
    } catch (error: any) {
        onPromisseError(error);
        throw new Error(error.message);
    }
};

export const updateAdvice = async (body: Partial<TWarnings>) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(
            `${apiBaseUrl}/suporte/avisos/atualizar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body,
            }
        );
        if (response?.data?.value?.success) {
            let adviceResponse = response.data.value;
            return adviceResponse;
        } else {
            throw new Error("Falha ao atualizar Avisos!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const deleteAdvice = async (body: Partial<TWarnings>) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(
            `${apiBaseUrl}/suporte/avisos/desativar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: {
                    advice_id: body.advice_id,
                },
            }
        );
        if (response?.data?.value?.success) {
            let adviceResponse = response.data.value;
            return adviceResponse;
        } else {
            throw new Error("Falha ao desativar Avisos!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
