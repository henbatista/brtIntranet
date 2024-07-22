const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

const getTourCodes = async (
    iata = "",
    dataEmissao = "",
    rebates = false,
    unidadeId = "",
    unidadeNome = ""
) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(`${apiBaseUrl}/suporte/tourcode/html`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body: {
                iata: iata,
                dataEmissao: dataEmissao,
                rebates: rebates,
                unidadeId: unidadeId,
                unidadeNome: unidadeNome,
            },
        });
        if (response?.data) {
            let TourCodeResponse = response.data.value;
            return TourCodeResponse;
        } else {
            throw new Error("Falha ao buscar TourCode!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
const listTourCodes = async (body) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(
            `${apiBaseUrl}/suporte/tourcode/listar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body,
            }
        );
        if (response?.data) {
            let TourCodeResponse = response.data.value;
            return TourCodeResponse;
        } else {
            throw new Error("Falha ao buscar TourCode!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export default {
    getTourCodes,
    listTourCodes,
};
