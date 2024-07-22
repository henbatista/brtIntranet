import { defineStore } from "pinia";
import efacilService from "../utils/efacil.service";
import { useAlertStore } from "./AlertStore";
import type { TourCode } from "~/types/tourCode";
import type { RebatesPayload } from "~/types/rebates.js";

export const useEfacilStore = defineStore(
    "EfacilStore",
    () => {
        const alertStore = useAlertStore();

        // state
        const companiesEfacil = ref<Record<string, any>>({});
        const unitsEfacil = ref<any[]>([]);
        const entitiesEfacil = ref<any[]>([]);
        const tourCodesEfacil = ref<TourCode[]>([]);
        const rebatesEfacil = ref<RebatesPayload[]>([]);
        const rebateDetails = ref<RebatesPayload | null>(null); // Novo estado

        // actions
        const $reset = (): void => {
            companiesEfacil.value = {};
            unitsEfacil.value = [];
            entitiesEfacil.value = [];
            tourCodesEfacil.value = [];
        };

        const getCompaniesEfacil = async () => {
            try {
                let companiesEfacilList: any =
                    await efacilService.getCompaniesEfacil();
                alertStore.loading = false;
                companiesEfacil.value = companiesEfacilList.data.data;
                alertStore.success = true;
                alertStore.message = "Base atualizada com sucesso";
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = `Erro ao retornar companhias efacil: ${error.message}`;
            }
        };

        const getUnitsEfacil = async (
            field: string,
            search: string,
            condition: string
        ) => {
            try {
                let unitsEfacilList: any = await efacilService.getUnitsEfacil(
                    field,
                    search,
                    condition
                );
                alertStore.loading = false;
                unitsEfacil.value = unitsEfacilList.data;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = `Erro ao retornar unidades do E-facil: ${error.message}`;
            }
        };

        const updateEntities = async () => {
            try {
                let entitiesEfacilList: any =
                    await efacilService.updateEntities();
                alertStore.loading = false;
                entitiesEfacil.value = entitiesEfacilList.data;
                alertStore.success = true;
                alertStore.message = "Entidades atualizadas com sucesso!";
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = `Erro ao atualizar entidades: ${error.message}`;
            }
        };

        const updateTourCodes = async () => {
            try {
                let TourCodesEfacilList: any =
                    await efacilService.updateTourCodes();
                alertStore.loading = false;
                tourCodesEfacil.value = TourCodesEfacilList.data;
                alertStore.success = true;
                alertStore.message = "TourCodes atualizado com sucesso!";
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = `Erro ao atualizar TourCodes: ${error.message}`;
            }
        };

        const getTourCodes = async () => {
            try {
                let tourCodesList: { data: TourCode[] } =
                    await efacilService.getTourCodes();
                alertStore.loading = false;
                tourCodesEfacil.value = tourCodesList.data || [];
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = `Erro ao retornar TourCodes: ${error.message}`;
            }
        };

        const createRebates = async (
            templateName: string,
            templateComments: string
        ) => {
            try {
                const rebates = tourCodesEfacil.value
                    .filter(
                        (tour) =>
                            tour.rebate_repasse_preset &&
                            tour.rebate_repasse_preset !== 0
                    )
                    .map((tour) => ({
                        hash: tour.hash,
                        rebate_repasse_preset: tour.rebate_repasse_preset,
                    }));

                const payload = {
                    rebate_template_name: templateName,
                    rebate_template_comments: templateComments,
                    rebates: rebates,
                };

                await efacilService.createRebates(payload);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Rebates cadastrados com sucesso!";
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = `Erro ao cadastrar rebates: ${error.message}`;
            }
        };

        const getRebateDetails = async (rebate_template_id: string) => {
            try {
                let rebateDetailsResponse: RebatesPayload =
                    await efacilService.getRebateDetails(rebate_template_id);
                alertStore.loading = false;
                rebateDetails.value = rebateDetailsResponse.data;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = `Erro ao buscar detalhes do rebate: ${error.message}`;
            }
        };

        return {
            companiesEfacil,
            unitsEfacil,
            entitiesEfacil,
            tourCodesEfacil,
            rebatesEfacil,
            rebateDetails,
            getCompaniesEfacil,
            getUnitsEfacil,
            updateEntities,
            updateTourCodes,
            getTourCodes,
            createRebates,
            getRebateDetails,
        };
    },
    { persist: true }
);
