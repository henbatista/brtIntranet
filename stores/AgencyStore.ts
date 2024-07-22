import { defineStore } from "pinia";
import { useAlertStore } from "./AlertStore";
import { Agency } from "types/frontend";

export const useAgencyStore = defineStore(
    "agencyStore",
    () => {
        const alertStore = useAlertStore();

        const saveAgency = async (data: Agency) => {
            alertStore.loading = true;
            try {
                await saveAgency(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Agência salva com sucesso!";
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const updateBranch = async (data: any) => {
            alertStore.loading = true;
            try {
                await updateAgency(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Agência atualizada com sucesso!";
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        return {
            saveAgency,
            updateBranch,
        };
    },
    {
        persist: {
            storage: persistedState.localStorage,
        },
    }
);
