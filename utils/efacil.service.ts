import type { TourCode } from "~/types/tourCode";

const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

const getCompaniesEfacil = async () => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/admin/efacil/companhia/atualizar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );
        if (response?.data?.value?.success) {
            let companiesEfacilResponse = response.data.value;
            return companiesEfacilResponse;
        } else {
            throw new Error("Falha ao buscar companhias Efacil!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const getUnitsEfacil = async (
    field = "name",
    search = "",
    condition = "contain"
) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(
            `${apiBaseUrl}/admin/efacil/unidade/listar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: {
                    field: field,
                    search: search,
                    condition: condition,
                },
            }
        );
        if (response?.data?.value?.success) {
            let unitsEfacilResponse = response.data.value;
            return unitsEfacilResponse;
        } else {
            throw new Error("Falha ao buscar unidades Efacil!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
const updateEntities = async () => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/admin/efacil/tourcode/entidades/sincronizar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );
        if (response?.data?.value?.success) {
            let entitiesResponse = response.data.value;
            return entitiesResponse;
        } else {
            throw new Error("Falha ao atualizar entidades!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
const updateTourCodes = async () => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/admin/efacil/tourcode/tourcode/sincronizar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );
        if (response?.data?.value?.success) {
            let entitiesResponse = response.data.value;
            return entitiesResponse;
        } else {
            throw new Error("Falha ao atualizar TourCodes!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
const getTourCodes = async (): Promise<{ data: TourCode[] }> => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(
            `${apiBaseUrl}/admin/efacil/tourcode/efacil`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );
        if (response?.data?.value?.success) {
            let tourCodesResponse = response.data.value;
            return tourCodesResponse;
        } else {
            throw new Error("Falha ao buscar TourCodes!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const createRebates = async (payload: any) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(
            `${apiBaseUrl}/suporte/rebate/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }
        );

        if (response?.data?.value?.success) {
            return response.data.value;
        } else {
            throw new Error("Falha ao cadastrar rebates!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const getRebateDetails = async (rebate_template_id: string) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await $fetch(`${apiBaseUrl}/suporte/rebate/buscar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ rebate_template_id }),
        });

        if (response?.success) {
            return response.data;
        } else {
            throw new Error("Falha ao buscar detalhes do rebate!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const deactivateRebate = async (rebate_template_id: string) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await $fetch(
            `${apiBaseUrl}/suporte/rebate/desativar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rebate_template_id }),
            }
        );

        if (response?.success) {
            return response.data;
        } else {
            throw new Error("Falha ao desativar rebate!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const getClientsByAgencyId = async (agencyEfacilId: string) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(
            `${apiBaseUrl}/admin/efacil/cliente/listar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: {
                    field: "agencia",
                    search: agencyEfacilId,
                    condition: "contain",
                },
            }
        );
        if (response?.data?.value?.success) {
            return response.data.value.data;
        } else {
            throw new Error("Falha ao buscar clientes da agência!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const getRebateTemplates = async () => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(`${apiBaseUrl}/suporte/rebate/listar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        if (response?.data?.value?.success) {
            return response.data.value.data;
        } else {
            throw new Error("Falha ao buscar templates de rebate!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export default {
    updateEntities,
    getCompaniesEfacil,
    getUnitsEfacil,
    updateTourCodes,
    getTourCodes,
    createRebates,
    getRebateDetails,
    deactivateRebate,
    getClientsByAgencyId,
    getRebateTemplates,
};
