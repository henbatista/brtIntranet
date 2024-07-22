const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

const getRoles = async (search = "", page = 1, per_page, field = "") => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {
            search: search,
            page: page,
            per_page: per_page,
            field: field,
        };
        const response = await useFetch(`${apiBaseUrl}/admin/funcao/listar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body,
        });
        if (response?.data?.value?.success) {
            let rolesResponse = response.data.value;
            return rolesResponse;
        } else {
            throw new Error("Falha ao buscar funções!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const saveRole = async (role) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/admin/funcao/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: role,
            }
        );
        if (response?.data?.value?.success) {
            let roleResponse = response.data.value;
            return roleResponse;
        } else {
            throw new Error("Falha ao cadastrar função!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateRole = async (role) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/admin/funcao/atualizar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: role,
            }
        );
        if (response?.data?.value?.success) {
            let roleResponse = response.data.value;
            return roleResponse;
        } else {
            throw new Error("Falha ao atualizar função!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteRole = async (role) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(`${apiBaseUrl}/admin/funcao/deletar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body: role,
        });
        if (response?.data?.value?.success) {
            let roleResponse = response.data.value;
            return roleResponse;
        } else {
            throw new Error("Falha ao deletar função!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const listPermissionsRole = async (role) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/admin/funcao/permissao/listar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: role,
            }
        );
        if (response?.data?.value?.success) {
            let roleResponse = response.data.value;
            return roleResponse;
        } else {
            throw new Error("Falha ao buscar funções!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

export default {
    getRoles,
    saveRole,
    updateRole,
    deleteRole,
    listPermissionsRole,
};
