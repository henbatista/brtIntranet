const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;
import { getUserToken } from "@/hooks/getToken";
import type { TCreditStatus } from "@/types/creditStatus";

export const getStatusCredits = async (
    search = "",
    page = 1,
    per_page = 15,
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
        const response: any = await useFetch(
            `${apiBaseUrl}/suporte/statuscredito/listar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body,
            }
        );
        if (response?.data?.value?.success) {
            return response.data.value;
        } else {
            throw new Error("Falha ao buscar Status de Créditos!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const saveCreditStatus = async (body: TCreditStatus) => {
    try {
        const { token } = getUserToken();

        const response = await useFetch(
            `${apiBaseUrl}/suporte/statuscredito/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body,
            }
        );
        if ((response?.data?.value as any)?.success) {
            let creditStatusResponse = response.data.value;
            return creditStatusResponse;
        } else {
            throw new Error("Falha ao cadastrar Crédito!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const updateCreditStatus = async (body: TCreditStatus) => {
    try {
        const { token } = getUserToken();

        const response = await useFetch(
            `${apiBaseUrl}/suporte/statuscredito/atualizar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body,
            }
        );
        if ((response?.data?.value as any)?.success) {
            let branchResponse = response.data.value;
            return branchResponse;
        } else {
            throw new Error("Falha ao atualizar Crédito!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const deleteCreditStatus = async (body: TCreditStatus) => {
    try {
        const { token } = getUserToken();

        const response = await useFetch(
            `${apiBaseUrl}/suporte/statuscredito/deletar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    credit_status_id: body.credit_status_id,
                },
            }
        );
        if ((response?.data?.value as any)?.success) {
            let branchResponse = response.data.value;
            return branchResponse;
        } else {
            throw new Error("Falha ao atualizar Crédito!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
