import { defineStore } from "pinia";
import { useAlertStore } from "./AlertStore";
import userService from "../utils/user.service";
import type { User } from "@/types/frontend";

export const useUserStore = defineStore(
    "UserStore",
    () => {
        const alertStore = useAlertStore();
        // state
        const userReset = {
            id: "",
            user_branch_id: 0,
            user_department_id: 0,
            user_position_id: 0,
            user_name: "",
            email: "",
            user_email_verified_at: "",
            user_status: false,
            user_username: "",
            user_google: "",
            user_birth_date: "",
            user_cpf: "",
            branch: {
                branch_id: "",
                branch_city_id: 0,
                branch_name: "",
                branch_region: "",
                branch_phone: "",
                branch_alias: "",
                branch_status: false,
            },
            position: {
                position_id: "",
                position_name: "",
                position_default_permission: "",
                position_status: false,
            },
            department: {
                department_id: "",
                department_name: "",
                department_status: false,
            },
            roles: [
                {
                    id: 0,
                    name: "",
                    description: "",
                    guard_name: "sanctum",
                },
            ],
        };
        const users = ref([]);
        const user = ref({});
        const operationType = ref("");
        const usersPagination = ref({});

        // actions
        const $reset = (): void => {
            users.value = [];
            user.value = {
                id: "",
                user_branch_id: 0,
                user_department_id: 0,
                user_position_id: 0,
                user_name: "",
                email: "",
                user_email_verified_at: "",
                user_status: false,
                user_username: "",
                user_google: "",
                user_birth_date: "",
                user_cpf: "",
                branch: {
                    branch_id: "",
                    branch_city_id: 0,
                    branch_name: "",
                    branch_region: "",
                    branch_phone: "",
                    branch_alias: "",
                    branch_status: false,
                },
                position: {
                    position_id: "",
                    position_name: "",
                    position_default_permission: "",
                    position_status: false,
                },
                department: {
                    department_id: "",
                    department_name: "",
                    department_status: false,
                },
                roles: [
                    {
                        id: 0,
                        name: "",
                        description: "",
                        guard_name: "sanctum",
                    },
                ],
            };
            usersPagination.value = {};
            operationType.value = "";
        };

        const getUsers = async (
            search: string,
            page: number,
            per_page: number,
            field: string
        ) => {
            alertStore.loading = true;
            try {
                let userList: any = await userService.getUsers(
                    search,
                    page,
                    per_page,
                    field
                );
                alertStore.loading = false;
                users.value = userList.data.data;
                usersPagination.value = userList.data;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = `Erro ao retornar usuários: ${error.message}`;
            }
        };

        const saveUser = async (data: any) => {
            alertStore.loading = true;
            try {
                await userService.saveUser(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Usuário salvo com sucesso!";
                user.value = userReset;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const updateUser = async (data: any) => {
            alertStore.loading = true;
            try {
                await userService.updateUser(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Usuário atualizado com sucesso!";
                user.value = userReset;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const deleteUser = async (data: User) => {
            alertStore.loading = true;
            try {
                await userService.deleteUser(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Usuário deletado com sucesso!";
                user.value = userReset;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        return {
            users,
            user,
            usersPagination,
            operationType,
            $reset,
            getUsers,
            saveUser,
            updateUser,
            deleteUser,
        };
    },
    {
        persist: {
            storage: persistedState.localStorage,
        },
    }
);

interface ImplementPermission {
    userPermissions: string[];
}

export const ImplementPermissionStore = defineStore("position_name", {
    state: (): ImplementPermission => ({
        userPermissions: [],
    }),
    actions: {
        setUserPermissions(permissions: string[]) {
            this.userPermissions = permissions;
            return {
                hasPermission: true,
            };
        },
    },
    getters: {
        hasPermission: (state) => (permission: string) => {
            return state.userPermissions.includes(permission);
        },
    },
});
