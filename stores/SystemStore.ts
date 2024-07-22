import { defineStore } from "pinia";
import SystemService from "../utils/systems.service";
import { useAlertStore } from "./AlertStore";
import type { TSistem } from "@/types/sistem";

export const useSystemStore = defineStore(
    "SystemStore",
    () => {
        const alertStore = useAlertStore();

        // state
        const blankSystem = {
            system_name: " ",
            system_logo: " ",
            system_type: " ",
            system_status: 1,
        };

        const Systems = ref<TSistem[]>([]);
        const System = ref<TSistem>();
        const SystemPagination = ref({});

        // actions
        const $reset = (): void => {
            System.value = undefined;
        };

        const getSystems = async (
            search: string,
            page: number,
            per_page: number,
            field: string
        ) => {
            let SystemList: any = await SystemService.getSystems(
                search,
                page,
                per_page,
                field
            );
            alertStore.loading = false;
            Systems.value = SystemList.data.data;
            SystemPagination.value = SystemList.data;
        };

        const saveSystem = async (data: any) => {
            alertStore.loading = true;
            try {
                await SystemService.saveSystem(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Sistema salvo com sucesso!";
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const updateSystem = async (data: any) => {
            alertStore.loading = true;
            try {
                await SystemService.updateSystem(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Sistema atualizado com sucesso!";
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const deleteSystem = async (data: any) => {
            alertStore.loading = true;
            try {
                await SystemService.deleteSystem(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Sistema deletado com sucesso!";
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        return {
            SystemPagination,
            Systems,
            System,
            $reset,
            getSystems,
            saveSystem,
            updateSystem,
            blankSystem,
            deleteSystem,
        };
    },
    { persist: true }
);
