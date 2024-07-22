const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

const getCities = async (
    search = "",
    page = "1",
    per_page = "10",
    field = ""
) => {
    try {
        const access_token = localStorage.getItem("authToken");

        const queryParams = new URLSearchParams({
            search,
            page,
            per_page,
            field,
        });

        const url = `${apiBaseUrl}/suporte/cidades/buscar`;

        const response = await useFetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body: {
                city_name: search,
            },
        });
        if (response) {
            const data = await response.data.value;
            return data;
        } else {
            throw new Error("Request failed");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export default {
    getCities,
};
