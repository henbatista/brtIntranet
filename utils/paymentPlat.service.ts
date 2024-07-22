import { TPaymentPlan } from "types/paymentPlan";

const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

export const getPaymentPlans = async (company_id: number) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {
            company_id: company_id,
        };
        const response = await useFetch(
            `${apiBaseUrl}/suporte/configuracao-parcelamento/lista-tratada`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body,
            }
        );
        if (response?.data?.value?.length) {
            return response.data.value;
        } else {
            throw new Error("Falha ao buscar Planos de Pagamento!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

export const savePaymentPlan = async (body: TPaymentPlan) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(
            `${apiBaseUrl}/suporte/configuracao-parcelamento/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body,
            }
        );
        if (response?.data?.value?.success) {
            let profileResponse = response.data.value;
            return profileResponse;
        } else {
            throw new Error("Falha ao cadastrar Plano de Pagamento!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

export const updatePaymentPlan = async (body: TPaymentPlan) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(
            `${apiBaseUrl}/suporte/configuracao-parcelamento/atualizar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body,
            }
        );

        console.log(response);
        if (response?.data?.value?.success) {
            let profileResponse = response.data.value;
            return profileResponse;
        } else {
            throw new Error("Falha ao atualizar Plano de Pagamento!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deletePaymentPlan = async (body: TPaymentPlan) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(
            `${apiBaseUrl}/suporte/configuracao-parcelamento/deletar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: {
                    payment_config_id: body.payment_config_id,
                },
            }
        );
        if (response?.data?.value?.success) {
            let profileResponse = response.data.value;
            return profileResponse;
        } else {
            throw new Error("Falha ao deletar perfil!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};
