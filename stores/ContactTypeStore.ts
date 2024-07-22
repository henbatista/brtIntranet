import { defineStore } from "pinia";
import ContactTypeService from "../utils/contactType.service";
import { useAlertStore } from "./AlertStore";

export const useContactTypeStore = defineStore(
    "ContactTypeStore",
    () => {
        const alertStore = useAlertStore();

        // state
        const ContactTypes = ref([]);
        const ContactType = ref({});
        const ContactTypePagination = ref({});

        // actions
        const $reset = (): void => {
            ContactType.value = [];
        };

        const getContactTypes = async (
            search: string,
            page: number,
            per_page: number,
            field: string
        ) => {
            let ContactTypeList: any = await ContactTypeService.getContactTypes(
                search,
                page,
                per_page,
                field
            );
            alertStore.loading = false;
            ContactTypes.value = ContactTypeList.data.data;
            ContactTypePagination.value = ContactTypeList.data;
        };

        const saveContactType = async (data: any) => {
            alertStore.loading = true;
            try {
                await ContactTypeService.saveContactType(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Forma de Contato salvo com sucesso!";
                ContactType.value = {};
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const updateContactType = async (data: any) => {
            alertStore.loading = true;
            try {
                await ContactTypeService.updateContactType(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Forma de Contato atualizado com sucesso!";
                ContactType.value = {};
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const deleteContactType = async (data: any) => {
            alertStore.loading = true;
            try {
                await ContactTypeService.deleteContactType(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Forma de Contato deletada com sucesso!";
                ContactType.value = {};
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        return {
            ContactTypePagination,
            ContactTypes,
            ContactType,
            $reset,
            getContactTypes,
            saveContactType,
            updateContactType,
            deleteContactType,
        };
    },
    { persist: true }
);
