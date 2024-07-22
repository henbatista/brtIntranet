import { defineStore } from "pinia";
import { useAlertStore } from "./AlertStore";
import profileService from "../utils/profile.service";
import type { Profile } from "@/types/frontend";

export const useProfileStore = defineStore(
    "ProfileStore",
    () => {
        const alertStore = useAlertStore();
        // state
        const profiles = ref([]);
        const profile = ref({});
        const operationType = ref("");
        const profilesPagination = ref({});

        // actions
        const $reset = (): void => {
            profiles.value = [];
            profile.value = {};
            operationType.value = "";
            profilesPagination.value = {};
        };

        const getProfiles = async (
            search: string,
            page: number,
            per_page: number,
            field: string
        ) => {
            alertStore.loading = true;
            try {
                let profileList: any = await profileService.getProfiles(
                    search,
                    page,
                    per_page,
                    field
                );
                alertStore.loading = false;
                profiles.value = profileList.data.data;
                profilesPagination.value = profileList.data;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = `Erro ao retornar perfis: ${error.message}`;
            }
        };

        const saveProfile = async (data: any) => {
            alertStore.loading = true;
            try {
                await profileService.saveProfile(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Perfil salvo com sucesso!";
                profile.value = {};
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const updateProfile = async (data: any) => {
            alertStore.loading = true;
            try {
                await profileService.updateProfile(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Perfil atualizado com sucesso!";
                profile.value = {};
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const deleteProfile = async (data: any) => {
            alertStore.loading = true;
            try {
                await profileService.deleteProfile(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Perfil deletado com sucesso!";
                profile.value = {};
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        return {
            profiles,
            profile,
            operationType,
            profilesPagination,
            $reset,
            getProfiles,
            saveProfile,
            updateProfile,
            deleteProfile,
        };
    },
    {
        persist: {
            storage: persistedState.localStorage,
        },
    }
);
