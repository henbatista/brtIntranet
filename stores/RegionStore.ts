import { defineStore } from "pinia";
import regionService from "../utils/region.service";
import { useAlertStore } from "./AlertStore";
import type { TRegion } from "@/types/branch";

export const useRegionStore = defineStore(
    "CountryStore",
    () => {
        const alertStore = useAlertStore();

        // state
        const regions = ref<TRegion[]>([]);
        const region = ref<TRegion>();
        const regionPagination = ref({});

        // actions
        const $reset = (): void => {
            regions.value = [];
            region.value = undefined;
            regionPagination.value = {};
        };

        const getRegions = async (
            search: string,
            page: number,
            per_page: number,
            field: string
        ) => {
            try {
                let regionList: any = await regionService.getRegions(
                    search,
                    page,
                    per_page,
                    field
                );
                alertStore.loading = false;
                regions.value = regionList.data.data;
                regionPagination.value = regionList.data;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = `Erro ao retornar Regiões: ${error.message}`;
            }
        };

        const regionSave = async (data: any) => {
            alertStore.loading = true;
            try {
                await regionService.regionSave(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Região salva com sucesso!";
                region.value = undefined;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const updateRegion = async (data: any) => {
            alertStore.loading = true;
            try {
                await regionService.updateRegion(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Região atualizada com sucesso!";
                region.value = undefined;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const deleteRegion = async (data: any) => {
            alertStore.loading = true;
            try {
                await regionService.deleteRegion(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Região deletada com sucesso!";
                region.value = undefined;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        return {
            regionPagination,
            regions,
            region,
            $reset,
            getRegions,
            regionSave,
            updateRegion,
            deleteRegion,
        };
    },
    { persist: true }
);
