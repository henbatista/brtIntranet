import type { TVisit } from "@/types/visit";
import { getUserToken } from "@/hooks/getToken";
const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

export const getVisit = async (
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
        const response = await useFetch(`${apiBaseUrl}/suporte/visita/listar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body,
        });
        if (response?.data?.value?.success) {
            let res = response.data.value;
            return res;
        } else {
            throw new Error("Falha ao buscar Visitas!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const saveVisit = async (body: TVisit) => {
    try {
        const { token } = getUserToken();

        const { data } = await useFetch(
            `${apiBaseUrl}/suporte/visita/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body,
            }
        );
        if ((data?.value as any)?.success) {
            return data.value;
        } else {
            throw new Error("Falha ao cadastrar visita!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const updateVisit = async (body: TVisit) => {
    try {
        const { token } = getUserToken();

        const { data } = await useFetch(
            `${apiBaseUrl}/suporte/visita/atualizar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body,
            }
        );

        if ((data?.value as any)?.success) {
            return data.value;
        } else {
            throw new Error("Falha ao atualizar visita!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const deleteVisit = async (body: TVisit) => {
    try {
        const { token } = getUserToken();

        const { data } = await useFetch(
            `${apiBaseUrl}/suporte/visita/desativar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    visit_id: body.visit_id,
                },
            }
        );

        if ((data?.value as any)?.success) {
            return data.value;
        } else {
            throw new Error("Falha ao atualizar visita!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
