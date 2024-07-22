import { defineStore } from "pinia";
import { useAlertStore } from "./AlertStore";
import permissionService from "../utils/permission.service";
import type { Permission } from "@/types/frontend";

export const usePermissionStore = defineStore(
    "PermissionStore",
    () => {
        const alertStore = useAlertStore();
        // state
        const permissions = ref<Permission[]>([]);
        const permission = ref({
            product_name: "",
            guard_name: "sanctum",
            description: "",
            id: "",
        });
        const permissionsPagination = ref({});

        // actions
        const $reset = (): void => {
            permissions.value = [];
            permission.value = {};
            permissionsPagination.value = {};
        };

        const getPermissions = async (
            search: string,
            page: number,
            per_page: number,
            field: string
        ): Promise<Permission[]> => {
            alertStore.loading = true;
            try {
                let permissionList: any =
                    await permissionService.getPermissions(
                        search,
                        page,
                        per_page,
                        field
                    );
                alertStore.loading = false;
                permissions.value = permissionList.data.data;
                permissionsPagination.value = permissionList.data;
                return permissionList.data.data;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = `Erro ao retornar permissões: ${error.message}`;
                return [];
            }
        };

        const savePermission = async (data: any) => {
            alertStore.loading = true;
            try {
                await permissionService.savePermission(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Permissão salva com sucesso!";
                permission.value = {};
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const updatePermission = async (data: any) => {
            alertStore.loading = true;
            try {
                await permissionService.updatePermission(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Permissão atualizada com sucesso!";
                permission.value = {};
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const deletePermission = async (data: any) => {
            alertStore.loading = true;
            try {
                await permissionService.deletePermission(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Permissão deletada com sucesso!";
                permission.value = {};
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        return {
            permissions,
            permission,
            permissionsPagination,
            $reset,
            getPermissions,
            savePermission,
            updatePermission,
            deletePermission,
        };
    },
    {
        persist: {
            storage: persistedState.localStorage,
        },
    }
);
