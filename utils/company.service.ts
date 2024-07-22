const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

const getCompanies = async (
    search = "",
    page = 1,
    per_page = 10,
    field = ""
) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/companhia/listar`,
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
            let companiesResponse = response.data.value;
            return companiesResponse;
        } else {
            throw new Error("Falha ao buscar Companhias!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
const saveCompany = async (company: any) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/companhia/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: company,
            }
        );
        if (response?.data?.value?.success) {
            let companyResponse = response.data.value;
            return companyResponse;
        } else {
            throw new Error("Falha ao cadastrar companhia!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
const updateCompany = async (company: any) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/companhia/atualizar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: company,
            }
        );
        if (response?.data?.value?.success) {
            let companyResponse = response.data.value;
            return companyResponse;
        } else {
            throw new Error("Falha ao atualizar companhia !");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const deleteCompany = async (company: any) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(
            `${apiBaseUrl}/suporte/companhia/desativar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: {
                    company_id: company.company_id,
                },
            }
        );
        if (response?.data?.value?.success) {
            let companyResponse = response.data.value;
            return companyResponse;
        } else {
            throw new Error("Falha ao atualizar companhia !");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export default {
    getCompanies,
    saveCompany,
    updateCompany,
    deleteCompany,
};
