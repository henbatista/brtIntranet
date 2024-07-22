const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

const handleResponse = (response) => {
    if (response?.data?.value?.success) {
        return response.data.value;
    } else {
        throw new Error(
            response?.data?.value?.message || "Falha ao processar a requisição!"
        );
    }
};

export const getFaqs = async (
    search = "",
    page = 1,
    per_page = 10,
    field = ""
) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(`${apiBaseUrl}/suporte/faq/listar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body: {
                search,
                page,
                per_page,
                field,
            },
        });
        return handleResponse(response);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const saveFaq = async (body) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(`${apiBaseUrl}/suporte/faq/cadastrar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body,
        });
        return handleResponse(response);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const updateFaq = async (body) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(`${apiBaseUrl}/suporte/faq/atualizar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body,
        });
        return handleResponse(response);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteFaq = async (body) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(`${apiBaseUrl}/suporte/faq/desativar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body: {
                faq_id: body.faq_id,
            },
        });
        return handleResponse(response);
    } catch (error) {
        throw new Error(error.message);
    }
};
