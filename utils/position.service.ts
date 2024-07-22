import { TPosition } from "types/position";

const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

const getPositions = async (search = "", page = 1, per_page, field = "") => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {
            search: search,
            page: page,
            per_page: per_page,
            field: field,
        };
        const response = await useFetch(`${apiBaseUrl}/admin/cargo/listar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body,
        });
        if (response?.data?.value?.success) {
            let usersResponse = response.data.value;
            return usersResponse;
        } else {
            throw new Error("Falha ao buscar cargo!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const savePosition = async (body: TPosition) => {
    try {
        const access_token = localStorage.getItem("authToken");

        const response = await useFetch(`${apiBaseUrl}/admin/cargo/cadastrar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body,
        });
        if (response?.data?.value?.success) {
            let usersResponse = response.data.value;
            return usersResponse;
        } else {
            throw new Error("Falha ao cadastrar cargo!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
const updatePosition = async (body: TPosition) => {
    try {
        const access_token = localStorage.getItem("authToken");

        const response = await useFetch(`${apiBaseUrl}/admin/cargo/atualizar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body,
        });
        if (response?.data?.value?.success) {
            let usersResponse = response.data.value;
            return usersResponse;
        } else {
            throw new Error("Falha ao atualizar cargo!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
const deletePosition = async (body: TPosition) => {
    try {
        const access_token = localStorage.getItem("authToken");

        const response = await useFetch(`${apiBaseUrl}/admin/cargo/desativar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            body: {
                position_id: body.position_id,
            },
        });
        if (response?.data?.value?.success) {
            let usersResponse = response.data.value;
            return usersResponse;
        } else {
            throw new Error("Falha ao deletar cargo!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export default {
    getPositions,
    savePosition,
    updatePosition,
    deletePosition,
};
