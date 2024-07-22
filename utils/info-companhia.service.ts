import { getUserToken } from "@/hooks/getToken";
import type { TInfoCompanhias } from "types/info-companhias";
const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

export const getInfoCompanhia = async (
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
        const response: any = await useFetch(
            `${apiBaseUrl}/suporte/companhiaareainfo/listar${search}`,
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

export const saveInfoCompanhia = async (body: TInfoCompanhias) => {
    try {
        const { token } = getUserToken();

        const { data } = await useFetch(
            `${apiBaseUrl}/suporte/companhiaareainfo/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body,
            }
        );

        if ((data?.value as any)?.sucess) {
            return data.value;
        } else {
            throw new Error("Falha ao cadastrar companhiaareainfo!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const updateInfoCompanhia = async (body: TInfoCompanhias) => {
    try {
        const { token } = getUserToken();

        const { data } = await useFetch(
            `${apiBaseUrl}/suporte/companhiaareainfo/atualizar`,
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
            throw new Error("Falha ao atualizar companhiaareainfo!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const deleteInfoCompanhia = async (body: TInfoCompanhias) => {
    try {
        const { token } = getUserToken();

        const { data } = await useFetch(
            `${apiBaseUrl}/suporte/companhiaareainfo/desativar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    air_company_info_id: body.air_company_info_id,
                },
            }
        );

        if ((data?.value as any)?.success) {
            return data.value;
        } else {
            throw new Error("Falha ao atualizar companhiaareainfo!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
