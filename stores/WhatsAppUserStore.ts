import { defineStore } from "pinia";
import { useAlertStore } from "./AlertStore";
import whatsAppUserService from "../utils/whatsAppUser.service";

export const useWhatsAppUserStore = defineStore(
    "WhatsAppUserStore",
    () => {
        const alertStore = useAlertStore();
        const whatsAppUsers = ref([]);
        const blankWhatsAppUser = {
            whatsapp_user_id: 0,
            whatsapp_user_agency: "",
            whatsapp_user_cnpj: "",
            whatsapp_user_base: "",
            whatsapp_user_api_username: "",
            whatsapp_user_api_user_password: "",
            whatsapp_user_api_user_password_confirmed: "",
            whatsapp_user_status: 0,
        };

        const whatsAppUser = ref(blankWhatsAppUser);
        const whatsAppUsersPagination = ref({});

        const $reset = (): void => {
            whatsAppUsers.value = [];
            whatsAppUser.value = {
                whatsapp_user_id: 1,
                whatsapp_user_agency: "",
                whatsapp_user_cnpj: "",
                whatsapp_user_base: "",
                whatsapp_user_api_username: "",
                whatsapp_user_api_user_password: "",
                whatsapp_user_api_user_password_confirmed: "",
                whatsapp_user_status: 0,
            };
            whatsAppUsersPagination.value = [];
        };

        const getWhatsAppUsers = async (
            search: string,
            page: number,
            per_page: number,
            field: string
        ) => {
            alertStore.loading = true;
            try {
                let whatsAppUserList: any =
                    await whatsAppUserService.getWhatsAppUsers(
                        search,
                        page,
                        per_page,
                        field
                    );
                alertStore.loading = false;
                whatsAppUsers.value = whatsAppUserList.data.data;
                whatsAppUsersPagination.value = whatsAppUserList.data;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = `Erro ao retornar Usuário WhatsApp: ${error.message}`;
            }
        };

        const saveWhatsAppUser = async (data: any) => {
            alertStore.loading = true;
            try {
                await whatsAppUserService.saveWhatsAppUser(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Usuário WhatsApp salva com sucesso!";
                whatsAppUser.value = blankWhatsAppUser;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const updateWhatsAppUser = async (data: any) => {
            alertStore.loading = true;
            try {
                await whatsAppUserService.updateWhatsAppUser(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Usuário WhatsApp atualizado com sucesso!";
                whatsAppUser.value = blankWhatsAppUser;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };
        const deleteWhatsAppUser = async (data: any) => {
            alertStore.loading = true;
            try {
                await whatsAppUserService.deleteWhatsAppUser(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Usuário WhatsApp deletado com sucesso!";
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        return {
            whatsAppUsers,
            whatsAppUser,
            whatsAppUsersPagination,
            $reset,
            getWhatsAppUsers,
            saveWhatsAppUser,
            updateWhatsAppUser,
            deleteWhatsAppUser,
        };
    },
    {
        persist: {
            storage: persistedState.localStorage,
        },
    }
);
