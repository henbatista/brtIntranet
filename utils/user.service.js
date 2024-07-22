const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

const getUsers = async (search = "", page = 1, per_page, field = "") => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {
            search: search,
            page: page,
            per_page: per_page,
            field: field,
        };
        const response = await useFetch(`${apiBaseUrl}/admin/usuario/listar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body,
        });
        if (response?.data?.value?.success) {
            let usersResponse = response.data.value;
            return usersResponse;
        } else {
            throw new Error("Falha ao buscar usuários!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const saveUser = async (user) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/admin/usuario/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: user,
            }
        );
        if (response?.data?.value?.success) {
            let userResponse = response.data.value;
            return userResponse;
        } else {
            throw new Error("Falha ao cadastrar usuário!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateUser = async (user) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/admin/usuario/atualizar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: user,
            }
        );
        if (response?.data?.value?.success) {
            let userResponse = response.data.value;
            return userResponse;
        } else {
            throw new Error("Falha ao atualizar usuário!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteUser = async (user) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(
            `${apiBaseUrl}/admin/usuario/deletar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: {
                    id:user.id
                },
            }
        );
        if (response?.data?.value?.success) {
            let userResponse = response.data.value;
            return userResponse;
        } else {
            throw new Error("Falha ao atualizar usuário!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

export default {
    getUsers,
    saveUser,
    updateUser,deleteUser
};
