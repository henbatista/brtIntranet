const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

const getPermissions = async (search = "", page = 1, per_page, field = "") => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {
            search: search,
            page: page,
            per_page: per_page,
            field: field,
        };
        const response = await useFetch(
            `${apiBaseUrl}/admin/permissao/listar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body,
            }
        );
        if (response?.data?.value?.success) {
            let permissionsResponse = response.data.value;
            return permissionsResponse;
        } else {
            throw new Error("Falha ao buscar permissões!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const savePermission = async (permission) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(
            `${apiBaseUrl}/admin/permissao/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: permission,
            }
        );
        if (response?.data?.value?.success) {
            let permissionResponse = response.data.value;
            return permissionResponse;
        } else {
            // Lança um erro com a mensagem recebida do backend
            throw new Error(
                response?.data?.value?.message ||
                    "Falha ao cadastrar permissão!"
            );
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const updatePermission = async (permission) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(
            `${apiBaseUrl}/admin/permissao/atualizar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: permission,
            }
        );
        if (response?.data?.value?.success) {
            let permissionResponse = response.data.value;
            return permissionResponse;
        } else {
            // Lança um erro com a mensagem recebida do backend
            throw new Error(
                response?.data?.value?.message ||
                    "Falha ao atualizar permissão!"
            );
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const deletePermission = async (permission) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/admin/permissao/deletar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: permission,
            }
        );
        if (response?.data?.value?.success) {
            let permissionResponse = response.data.value;
            return permissionResponse;
        } else {
            throw new Error("Falha ao deletar permissão!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

export default {
    getPermissions,
    savePermission,
    updatePermission,
    deletePermission,
};
