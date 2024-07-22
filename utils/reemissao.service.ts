import { getUserToken } from "@/hooks/getToken";
import { onPromisseError } from "@/hooks/useError";
import type { TReemissao } from "types/reemissao";
const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

export const getReemissao = async (
    search = "",
    page = 1,
    per_page = 10,
    field = ""
) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {
            page: page,
            per_page: per_page,
        };
        const response = await useFetch(
            `${apiBaseUrl}/suporte/inforeemissao/listar${search}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body,
            }
        );
        if (response?.data?.value?.success) {
            let res = response.data.value;
            return res;
        } else {
            throw new Error("Falha ao buscar Companhias!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const saveReemissao = async (body: TReemissao) => {
    try {
        const { token } = getUserToken();

        const { data } = await useFetch(
            `${apiBaseUrl}/suporte/inforeemissao/cadastrar`,
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
            const message = (data?.value as any)?.message;
            onPromisseError(data?.value, message);

            throw new Error(message || "Falha ao cadastrar inforeemissao!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const updateReemissao = async (body: TReemissao) => {
    try {
        const { token } = getUserToken();

        const { data } = await useFetch(
            `${apiBaseUrl}/suporte/inforeemissao/atualizar`,
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
            throw new Error("Falha ao atualizar inforeemissao!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const deleteReemissao = async (body: TReemissao) => {
    try {
        const { token } = getUserToken();

        const { data } = await useFetch(
            `${apiBaseUrl}/suporte/inforeemissao/desativar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    info_reissuance_id: body.info_reissuance_id,
                },
            }
        );

        if ((data?.value as any)?.success) {
            return data.value;
        } else {
            throw new Error("Falha ao atualizar inforeemissao!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
