const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;
import { getUserToken } from "@/hooks/getToken";
import type { TFinance } from "@/types/finance";

export const getFinancesFreeRoute = async (search = "nacional") => {
    try {
        const { data } = await useFetch(`${apiBaseUrl}/financiamentos`, {
            method: "POST",
            body: {
                field: "finance_type",
                search,
            },
        });

        if ((data?.value as any)?.success) {
            return data.value;
        } else {
            throw new Error("Falha ao listar Financiamentos!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const saveFinance = async (body: TFinance) => {
    try {
        const { token } = getUserToken();

        const response = await useFetch(
            `${apiBaseUrl}/suporte/financiamento/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body,
            }
        );
        if ((response?.data?.value as any)?.success) {
            let financeRes = response.data.value;
            return financeRes;
        } else {
            throw new Error("Falha ao cadastrar Financiamento!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const updateFinance = async (body: TFinance) => {
    try {
        const { token } = getUserToken();

        const response = await useFetch(
            `${apiBaseUrl}/suporte/financiamento/atualizar`,
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
            throw new Error("Falha ao atualizar Agência!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const deleteFinance = async (body: TFinance) => {
    try {
        const { token } = getUserToken();

        const response = await useFetch(
            `${apiBaseUrl}/suporte/financiamento/deletar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    finance_id: body.finance_id,
                },
            }
        );
        if ((response?.data?.value as any)?.success) {
            let branchResponse = response.data.value;
            return branchResponse;
        } else {
            throw new Error("Falha ao atualizar Agência!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
