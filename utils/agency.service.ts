const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;
import { getUserToken } from "@/hooks/getToken";
import type { Agency } from "@/types/frontend";

export const getAgency = async (
    search = "",
    page = 1,
    per_page = 20,
    field = "agency_name"
) => {
    const access_token = localStorage.getItem("authToken");

    try {
        const response = await fetch(`${apiBaseUrl}/suporte/agencia/listar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify({ search, page, per_page, field }),
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar agências");
        }

        const data = await response.json();

        if (data.success) {
            return data;
        } else {
            throw new Error(data.message || "Falha ao buscar agências");
        }
    } catch (error) {
        throw new Error(
            error.message || "Erro desconhecido ao buscar agências"
        );
    }
};

export const getAgencyDetails = async (agency_id: number) => {
    const access_token = localStorage.getItem("authToken");

    try {
        const response = await fetch(`${apiBaseUrl}/suporte/agencia/buscar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify({ agency_id }),
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar agência");
        }

        const data = await response.json();

        if (data.success) {
            return data.data;
        } else {
            throw new Error(data.message || "Falha ao buscar agência");
        }
    } catch (error) {
        throw new Error(error.message || "Erro desconhecido ao buscar agência");
    }
};

export const saveAgency = async (body: Agency) => {
    try {
        const { token } = getUserToken();

        const response = await useFetch(
            `${apiBaseUrl}/suporte/agencia/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body,
            }
        );
        if ((response?.data?.value as any)?.success) {
            let agencyResponse = response.data.value;
            return agencyResponse;
        } else {
            throw new Error("Falha ao cadastrar Agência!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const updateAgency = async (body: Agency) => {
    try {
        const { token } = getUserToken();

        const response = await useFetch(
            `${apiBaseUrl}/suporte/agencia/atualizar`,
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
export const deleteAgency = async (body: Agency) => {
    try {
        const { token } = getUserToken();

        const response = await useFetch(
            `${apiBaseUrl}/suporte/agencia/desativar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    agency_id: body.agency_id,
                },
            }
        );
        if ((response?.data?.value as any)?.success) {
            let branchResponse = response.data.value;
            return branchResponse;
        } else {
            throw new Error("Falha ao desativar Agência!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
