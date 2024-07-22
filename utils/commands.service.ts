const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

const getCommands = async (
    search = "",
    page = 1,
    per_page = 10,
    field = ""
) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/comando/listar`,
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
            throw new Error("Falha ao buscar Comando!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const saveCommand = async (Command) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/comando/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: Command,
            }
        );
        if (response?.data?.value?.success) {
            let commandResponse = response.data.value;
            return commandResponse;
        } else {
            throw new Error("Falha ao cadastrar Comando!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateCommand = async (Command) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/comando/atualizar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: Command,
            }
        );
        if (response?.data?.value?.success) {
            let commandResponse = response.data.value;
            return commandResponse;
        } else {
            throw new Error("Falha ao atualizar Comando!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};
const deleteCommand = async (Command: any) => {
    try {
        const access_token = localStorage.getItem("authToken");

        const response = await useFetch(
            `${apiBaseUrl}/suporte/comando/desativar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: {
                    command_id: Command.command_id,
                },
            }
        );
        if (response?.data?.value?.success) {
            let commandResponse = response.data.value;
            return commandResponse;
        } else {
            throw new Error("Falha ao desativar Comando!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

export default {
    getCommands,
    saveCommand,
    updateCommand,
    deleteCommand,
};
