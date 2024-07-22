const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

const getDepartments = async (search = "", page = 1, per_page, field = "") => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {
            search: search,
            page: page,
            per_page: per_page,
            field: field,
        };
        const response = await useFetch(
            `${apiBaseUrl}/admin/departamento/listar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body,
            }
        );
        if (response?.data?.value?.success) {
            let departmentsResponse = response.data.value;
            return departmentsResponse;
        } else {
            throw new Error("Falha ao buscar departamentos!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const departmentSave = async (department: any) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/admin/departamento/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: department,
            }
        );
        if (response?.data?.value?.success) {
            let departmentsResponse = response.data.value;
            return departmentsResponse;
        } else {
            throw new Error("Falha ao cadastrar departamento!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateDepartment = async (department: any) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {};
        const response = await useFetch(
            `${apiBaseUrl}/admin/departamento/atualizar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: department,
            }
        );
        if (response?.data?.value?.success) {
            let departmentsResponse = response.data.value;
            return departmentsResponse;
        } else {
            throw new Error("Falha ao atualizar departamento!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteDepartment = async (department: any) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(
            `${apiBaseUrl}/admin/departamento/desativar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body: {
                    department_id: department.department_id,
                },
            }
        );
        if (response?.data?.value?.success) {
            let departmentsResponse = response.data.value;
            return departmentsResponse;
        } else {
            throw new Error("Falha ao atualizar departamento!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

export default {
    getDepartments,
    departmentSave,
    updateDepartment,
    deleteDepartment,
};
