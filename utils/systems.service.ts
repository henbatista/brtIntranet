const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

const getSystems = async (search = "", page = 1, per_page = 10, field = "") => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/sistema/listar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: {
                    search: search,
                    page: page,
                    per_page: per_page,
                    field: field,
                },
            }
        );
        if (response?.data?.value?.success) {
            let usersResponse = response.data.value;
            return usersResponse;
        } else {
            throw new Error("Falha ao buscar Sistema!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const saveSystem = async (System) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/sistema/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: System,
            }
        );
        if (response?.data?.value?.success) {
            let systemResponse = response.data.value;
            return systemResponse;
        } else {
            throw new Error("Falha ao cadastrar Sistema!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateSystem = async (System) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/sistema/atualizar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: System,
            }
        );
        if (response?.data?.value?.success) {
            let systemResponse = response.data.value;
            return systemResponse;
        } else {
            throw new Error("Falha ao atualizar Sistema!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteSystem = async (System: any) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(
            `${apiBaseUrl}/suporte/sistema/desativar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: { system_id: System.system_id },
            }
        );
        if (response?.data?.value?.success) {
            let systemResponse = response.data.value;
            return systemResponse;
        } else {
            throw new Error("Falha ao atualizar Sistema!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

export default {
    getSystems,
    saveSystem,
    updateSystem,
    deleteSystem,
};
