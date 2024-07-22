const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

const getBranches = async (
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
        const response = await useFetch(`${apiBaseUrl}/admin/filial/listar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body,
        });
        if (response?.data?.value?.success) {
            let branchsResponse = response.data.value;
            return branchsResponse;
        } else {
            throw new Error("Falha ao buscar filiais!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const saveBranch = async (branch: any) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/admin/filial/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: branch,
            }
        );
        if (response?.data?.value?.success) {
            let branchResponse = response.data.value;
            return branchResponse;
        } else {
            throw new Error("Falha ao cadastrar filial!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const updateBranch = async (branch: any) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/admin/filial/atualizar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: branch,
            }
        );
        if (response?.data?.value?.success) {
            let branchResponse = response.data.value;
            return branchResponse;
        } else {
            throw new Error("Falha ao atualizar filial  !");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const deleteBranch = async (branch: any) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(`${apiBaseUrl}/admin/filial/deletar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body: {
                branch_id: branch.branch_id,
            },
        });
        if (response?.data?.value?.success) {
            let branchResponse = response.data.value;
            return branchResponse;
        } else {
            throw new Error("Falha ao atualizar filial  !");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export default {
    getBranches,
    saveBranch,
    updateBranch,
    deleteBranch,
};
