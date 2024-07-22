const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

const getProducts = async (
    search = "",
    page = 1,
    per_page = 10,
    field = ""
) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/produto/listar`,
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
            throw new Error("Falha ao buscar Produto!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const saveProduct = async (Product) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/produto/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: Product,
            }
        );
        if (response?.data?.value?.success) {
            let productResponse = response.data.value;
            return productResponse;
        } else {
            throw new Error("Falha ao cadastrar Produto!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateProduct = async (Product) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/produto/atualizar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: Product,
            }
        );
        if (response?.data?.value?.success) {
            let productResponse = response.data.value;
            return productResponse;
        } else {
            throw new Error("Falha ao atualizar Produto!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteProduct = async (Product: any) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/suporte/produto/desativar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: {
                    product_id: Product.product_id,
                },
            }
        );
        if (response?.data?.value?.success) {
            let productResponse = response.data.value;
            return productResponse;
        } else {
            throw new Error("Falha ao atualizar Produto!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

export default {
    getProducts,
    saveProduct,
    updateProduct,
    deleteProduct,
};
