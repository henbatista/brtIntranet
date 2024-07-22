const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;
import { onPromisseError } from "@/hooks/useError";
import { getUserToken } from "@/hooks/getToken";
import type { TCredit } from "@/types/credit";

export const getCredits = async (
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
            `${apiBaseUrl}/suporte/credito/listar`,
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
            throw new Error("Falha ao buscar Créditos!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const saveCredit = async (body: TCredit) => {
    try {
        const { token } = getUserToken();

        const { data } = await useFetch(
            `${apiBaseUrl}/suporte/credito/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body,
            }
        );
        if ((data?.value as any)?.success) {
            let creditResponse = data.value;
            return creditResponse;
        } else {
            const message = (data?.value as any)?.message;
            onPromisseError(data?.value, message);
            throw new Error("Falha ao cadastrar Crédito!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const fetchCreditData = async (url: string, options: any) => {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Erro ao buscar dados");
        }
        return data;
    } catch (error) {
        console.error("Erro na requisição:", error);
        throw error;
    }
};

export const getCredit = async (creditId: string) => {
    const access_token = localStorage.getItem("authToken");
    if (!access_token) {
        throw new Error("Token de autenticação não encontrado");
    }

    const url = `${apiBaseUrl}/suporte/credito/buscar/${creditId}`;
    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    };

    return await fetchCreditData(url, options);
};

interface updateCreditType {
    credit_id: number;
    credit_status_id: number;
    user_id: number;
    description?: string;
}

export const updateCredit = async (body: updateCreditType) => {
    try {
        const { token } = getUserToken();

        const { data } = await useFetch(
            `${apiBaseUrl}/suporte/credito/update-status`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body,
            }
        );
        if ((data?.value as any)?.success) {
            let branchResponse = data.value;
            return branchResponse;
        } else {
            const message = (data?.value as any)?.message;
            onPromisseError(data?.value, message);
            throw new Error("Falha ao atualizar Crédito!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const deleteCredit = async (body: TCredit) => {
    try {
        const { token } = getUserToken();

        const response = await useFetch(
            `${apiBaseUrl}/suporte/credito/deletar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    credit_id: body.credit_id,
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

type creditActionsType = {
    credit_id: number;
    description: string;
};

// se for aprovado pelo gestor, cai para analise
export const approveCredit = async (body: creditActionsType) => {
    try {
        const { token } = getUserToken();

        const { data } = await useFetch(
            `${apiBaseUrl}/suporte/credito/update-status`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    credit_id: body.credit_id,
                    description: body.description,
                    credit_status_id: 6,
                },
            }
        );
        if ((data?.value as any)?.success) {
            let branchResponse = data.value;
            return branchResponse;
        } else {
            const message = (data?.value as any)?.message;
            onPromisseError(data?.value, message);
            throw new Error("Falha ao atualizar Crédito!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// se for aprovado pelo Analista, cai para aprovado
export const approveCreditAnalyst = async (body: creditActionsType) => {
    try {
        const { token } = getUserToken();

        const { data } = await useFetch(
            `${apiBaseUrl}/suporte/credito/update-status`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    credit_id: body.credit_id,
                    description: body.description,
                    credit_status_id: 3,
                },
            }
        );
        if ((data?.value as any)?.success) {
            let branchResponse = data.value;
            return branchResponse;
        } else {
            const message = (data?.value as any)?.message;
            onPromisseError(data?.value, message);
            throw new Error("Falha ao atualizar Crédito!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const reproveCredit = async (body: creditActionsType) => {
    try {
        const { token } = getUserToken();

        const { data } = await useFetch(
            `${apiBaseUrl}/suporte/credito/update-status`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    credit_id: body.credit_id,
                    description: body.description,
                    credit_status_id: 8,
                },
            }
        );
        if ((data?.value as any)?.success) {
            let branchResponse = data.value;
            return branchResponse;
        } else {
            const message = (data?.value as any)?.message;
            onPromisseError(data?.value, message);
            throw new Error("Falha ao atualizar Crédito!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const reproveCreditAnalyst = async (body: creditActionsType) => {
    try {
        const { token } = getUserToken();

        const { data } = await useFetch(
            `${apiBaseUrl}/suporte/credito/update-status`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    credit_id: body.credit_id,
                    description: body.description,
                    credit_status_id: 7,
                },
            }
        );
        if ((data?.value as any)?.success) {
            let branchResponse = data.value;
            return branchResponse;
        } else {
            const message = (data?.value as any)?.message;
            onPromisseError(data?.value, message);
            throw new Error("Falha ao atualizar Crédito!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const reproveCreditManager = async (body: creditActionsType) => {
    try {
        const { token } = getUserToken();

        const { data } = await useFetch(
            `${apiBaseUrl}/suporte/credito/update-status`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    credit_id: body.credit_id,
                    description: body.description,
                    credit_status_id: 4,
                },
            }
        );
        if ((data?.value as any)?.success) {
            let branchResponse = data.value;
            return branchResponse;
        } else {
            const message = (data?.value as any)?.message;
            onPromisseError(data?.value, message);
            throw new Error("Falha ao atualizar Crédito!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const cancelCredit = async (body: creditActionsType) => {
    try {
        const { token } = getUserToken();

        const { data } = await useFetch(
            `${apiBaseUrl}/suporte/credito/update-status`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    credit_id: body.credit_id,
                    description: body.description,
                    credit_status_id: 2,
                },
            }
        );
        if ((data?.value as any)?.success) {
            let branchResponse = data.value;
            return branchResponse;
        } else {
            const message = (data?.value as any)?.message;
            onPromisseError(data?.value, message);
            throw new Error("Falha ao atualizar Crédito!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
