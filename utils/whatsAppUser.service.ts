import { getUserToken } from "@/hooks/getToken";

const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

const getWhatsAppUsers = async (
    search = "",
    page = 1,
    per_page = 10,
    field = ""
) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {
            search: search,
            page: page,
            per_page: per_page,
            field: field,
        };
        const response = await useFetch(
            `${apiBaseUrl}/suporte/apiwhatsapp/listar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body,
            }
        );
        if (response?.data?.value?.success) {
            let whatsAppUsersResponse = response.data.value;
            return whatsAppUsersResponse;
        } else {
            throw new Error("Falha ao buscar Usuários WhatsApp!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const saveWhatsAppUser = async (whatsAppUser: any) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/apiwhatsapp/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: whatsAppUser,
            }
        );
        if (response?.data?.value?.success) {
            let whatsAppUserResponse = response.data.value;
            return whatsAppUserResponse;
        } else {
            throw new Error("Falha ao cadastrar Usuários WhatsApp!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const updateWhatsAppUser = async (whatsAppUser: any) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/apiwhatsapp/atualizar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: whatsAppUser,
            }
        );
        if (response?.data?.value?.success) {
            let whatsAppUserResponse = response.data.value;
            return whatsAppUserResponse;
        } else {
            throw new Error("Falha ao atualizar Usuários WhatsApp!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const deleteWhatsAppUser = async (body: TVisit) => {
    try {
        const { token } = getUserToken();

        const { data } = await useFetch(
            `${apiBaseUrl}/suporte/apiwhatsapp/desativar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    whatsapp_user_id: body.whatsapp_user_id,
                },
            }
        );

        if ((data?.value as any)?.success) {
            return data.value;
        } else {
            throw new Error("Falha ao atualizar usuário whatsapp!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export default {
    getWhatsAppUsers,
    saveWhatsAppUser,
    updateWhatsAppUser,
    deleteWhatsAppUser,
};
