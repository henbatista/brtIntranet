const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

const getCards = async (search = "", page = 1, per_page = 10, field = "") => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(`${apiBaseUrl}/suporte/cartao/listar`, {
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
        });
        if (response?.data?.value?.success) {
            let cardsResponse = response.data.value;
            return cardsResponse;
        } else {
            throw new Error("Falha ao buscar cartões!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
const saveCard = async (card: any) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/cartao/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: card,
            }
        );
        if (response?.data?.value?.success) {
            let cardResponse = response.data.value;
            return cardResponse;
        } else {
            throw new Error("Falha ao cadastrar cartão!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const updateCard = async (card: any) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/cartao/atualizar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: card,
            }
        );
        if (response?.data?.value?.success) {
            let cardResponse = response.data.value;
            return cardResponse;
        } else {
            throw new Error("Falha ao atualizar cartão !");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const deleteCard = async (card: any) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(
            `${apiBaseUrl}/suporte/cartao/deletar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: {
                    credit_card_id: card.credit_card_id,
                },
            }
        );
        if (response?.data?.value?.success) {
            let cardResponse = response.data.value;
            return cardResponse;
        } else {
            throw new Error("Falha ao atualizar cartão !");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export default {
    getCards,
    saveCard,
    deleteCard,
    updateCard,
};
