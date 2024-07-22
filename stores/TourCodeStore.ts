import { defineStore } from "pinia";
import { useAlertStore } from "./AlertStore";
import tourCodeService from "../utils/tourCode.service";

export const useTourCodeStore = defineStore(
    "TourCodeStore",
    () => {
        const alertStore = useAlertStore();

        // state
        const tourcodes = ref({});
        const tourcode = ref("");

        // actions
        const $reset = (): void => {
            tourcodes.value = "";
            tourcode.value = "";
        };

        const getTourCodes = async (
            iata: string,
            dataEmissao: string,
            rebates: boolean,
            unidadeId: string,
            unidadeNome: string
        ) => {
            try {
                let tourCodeList: any = await tourCodeService.getTourCodes(
                    iata,
                    dataEmissao,
                    rebates,
                    unidadeId,
                    unidadeNome
                );
                alertStore.loading = false;
                tourcode.value = tourCodeList;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = `Erro ao retornar Tour Code: ${error.message}`;
            }
        };
        const listTourCodes = async (body) => {
            try {
                let tourCodeList: any = await tourCodeService.listTourCodes(
                    body
                );
                alertStore.loading = false;
                return tourCodeList;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = `Erro ao retornar Tour Code: ${error.message}`;
            }
        };
        return {
            tourcodes,
            tourcode,
            getTourCodes,
            listTourCodes,
            $reset,
        };
    },
    {
        persist: {
            storage: persistedState.localStorage,
        },
    }
);
