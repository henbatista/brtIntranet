const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

const getRegions = async (search = "", page = 1, per_page, field = "") => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(`${apiBaseUrl}/suporte/regiao/listar`, {
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
        });
        if (response?.data?.value?.success) {
            let regionsResponse = response.data.value;
            return regionsResponse;
        } else {
            throw new Error("Falha ao buscar regiões!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const regionSave = async (region) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/regiao/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: region,
            }
        );
        if (response?.data?.value?.success) {
            let countryResponse = response.data.value;
            return countryResponse;
        } else {
            throw new Error("Falha ao cadastrar região!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateRegion = async (region) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/regiao/atualizar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: region,
            }
        );
        if (response?.data?.value?.success) {
            let countryResponse = response.data.value;
            return countryResponse;
        } else {
            throw new Error("Falha ao atualizar região!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteRegion = async (region) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/regiao/desativar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body:{
                    region_id: region.region_id
                },
            }
        );
        if (response?.data?.value?.success) {
            let countryResponse = response.data.value;
            return countryResponse;
        } else {
            throw new Error("Falha ao atualizar região!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

export default {
    getRegions,
    regionSave,
    updateRegion,deleteRegion
};
