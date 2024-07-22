const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

const getContactTypes = async (
    search = "",
    page = 1,
    per_page = 10,
    field = ""
) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/formasDeContato/listar`,
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
            throw new Error("Falha ao buscar Tipos de Serviço!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const saveContactType = async (ContactType) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/formasDeContato/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: ContactType,
            }
        );
        if (response?.data?.value?.success) {
            let contyactTypeResponse = response.data.value;
            return contyactTypeResponse;
        } else {
            throw new Error("Falha ao cadastrar Forma de Contato!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateContactType = async (ContactType) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/formasDeContato/atualizar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: ContactType,
            }
        );
        if (response?.data?.value?.success) {
            let contactTypeResponse = response.data.value;
            return contactTypeResponse;
        } else {
            throw new Error("Falha ao atualizar Forma de Contato!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteContactType = async (ContactType: any) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/formasDeContato/desativar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: {
                    contact_type_id: ContactType.contact_type_id,
                },
            }
        );
        if (response?.data?.value?.success) {
            let contactTypeResponse = response.data.value;
            return contactTypeResponse;
        } else {
            throw new Error("Falha ao atualizar Forma de Contato!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

export default {
    getContactTypes,
    saveContactType,
    updateContactType,
    deleteContactType,
};
