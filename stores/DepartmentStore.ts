import { defineStore } from "pinia";
import { useAlertStore } from "./AlertStore";
import departmentService from "../utils/department.service";
import type { TDepartament } from "@/types/departament";

export const useDepartmentStore = defineStore(
    "DepartmentStore",
    () => {
        const alertStore = useAlertStore();
        // state
        const departments = ref<TDepartament[]>([]);
        const department = ref<TDepartament>();
        const departmentsPagination = ref({});

        // actions
        const $reset = (): void => {
            departments.value = [];
            department.value = undefined;
            departmentsPagination.value = {};
        };

        const getDepartments = async (
            search: string,
            page: number,
            per_page: number,
            field: string
        ) => {
            try {
                let departmentList: any =
                    await departmentService.getDepartments(
                        search,
                        page,
                        per_page,
                        field
                    );
                departments.value = departmentList.data.data;
                departmentsPagination.value = departmentList.data;
            } catch (error: any) {
                alertStore.success = false;
                alertStore.message = `Erro ao retornar departamentos: ${error.message}`;
            }
        };

        const departmentSave = async (data: any) => {
            alertStore.loading = true;
            try {
                await departmentService.departmentSave(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Departamento cadastrado com sucesso!";
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const updateDepartment = async (data: any) => {
            alertStore.loading = true;
            try {
                await departmentService.updateDepartment(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Departamento atualizado com sucesso!";
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const deleteDepartment = async (data: any) => {
            alertStore.loading = true;
            try {
                await departmentService.deleteDepartment(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Departamento deletado com sucesso!";
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        return {
            departments,
            department,
            departmentsPagination,
            $reset,
            getDepartments,
            departmentSave,
            updateDepartment,
            deleteDepartment,
        };
    },
    {
        persist: {
            storage: persistedState.localStorage,
        },
    }
);
