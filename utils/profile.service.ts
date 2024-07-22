const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

const getProfiles = async (search = "", page = 1, per_page, field = "") => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {
            search: search,
            page: page,
            per_page: per_page,
            field: field,
        };
        const response = await useFetch(`${apiBaseUrl}/admin/perfil/listar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body,
        });
        if (response?.data?.value?.success) {
            let profilesResponse = response.data.value;
            return profilesResponse;
        } else {
            throw new Error("Falha ao buscar perfis!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const saveProfile = async (profile) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/admin/perfil/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: profile,
            }
        );
        if (response?.data?.value?.success) {
            let profileResponse = response.data.value;
            return profileResponse;
        } else {
            throw new Error("Falha ao cadastrar perfil!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateProfile = async (profile) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/admin/perfil/atualizar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: profile,
            }
        );
        if (response?.data?.value?.success) {
            let profileResponse = response.data.value;
            return profileResponse;
        } else {
            throw new Error("Falha ao atualizar perfil!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteProfile = async (profile) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(`${apiBaseUrl}/admin/perfil/deletar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body: profile,
        });
        if (response?.data?.value?.success) {
            let profileResponse = response.data.value;
            return profileResponse;
        } else {
            throw new Error("Falha ao deletar perfil!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

export default {
    getProfiles,
    saveProfile,
    updateProfile,
    deleteProfile,
};
