import { defineStore } from "pinia";
import { useAlertStore } from "./AlertStore";
import roleService from "../utils/role.service";
import type { Role } from "@/types/frontend";

export const useRoleStore = defineStore(
    "RoleStore",
    () => {
        const alertStore = useAlertStore();
        // state
        const roles = ref<Role[]>([]);
        const role = ref({
            name: "",
            guard_name: "sanctum",
            description: "",
            permissions: [
                {
                    name: "",
                    guard_name: "sanctum",
                    description: "",
                },
            ],
        });
        const operationType = ref("");
        const rolesPagination = ref({});

        // actions
        const $reset = (): void => {
            roles.value = [];
            role.value = {
                name: "",
                guard_name: "sanctum",
                description: "",
                permissions: [],
            };
            operationType.value = "";
            rolesPagination.value = {};
        };

        const $resetRole = (): void => {
            role.value = {
                name: "",
                guard_name: "sanctum",
                description: "",
                permissions: [],
            };
        };

        const getRoles = async (
            search: string,
            page: number,
            per_page: number,
            field: string
        ) => {
            try {
                let roleList: any = await roleService.getRoles(
                    search,
                    page,
                    per_page,
                    field
                );
                roles.value = roleList.data.data;
                rolesPagination.value = roleList.data;
            } catch (error: any) {
                alertStore.success = false;
                alertStore.message = `Erro ao retornar funções: ${error.message}`;
            }
        };

        const saveRole = async (data: any) => {
            alertStore.loading = true;
            try {
                await roleService.saveRole(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Função salva com sucesso!";
                $resetRole;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const updateRole = async (data: any) => {
            alertStore.loading = true;
            try {
                await roleService.updateRole(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Função atualizada com sucesso!";
                $resetRole;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const deleteRole = async (data: any) => {
            alertStore.loading = true;
            try {
                await roleService.deleteRole(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Função deletada com sucesso!";
                $resetRole;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const listPermissionsRole = async (data: any) => {
            alertStore.loading = true;
            try {
                let roleResponse = await roleService.listPermissionsRole(data);
                alertStore.loading = false;
                role.value = roleResponse.data;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        return {
            roles,
            role,
            operationType,
            rolesPagination,
            $reset,
            getRoles,
            saveRole,
            updateRole,
            deleteRole,
            listPermissionsRole,
        };
    },
    {
        persist: {
            storage: persistedState.localStorage,
        },
    }
);
