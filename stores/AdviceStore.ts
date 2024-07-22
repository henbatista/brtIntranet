import { defineStore } from "pinia";
import { useAlertStore } from "./AlertStore";

export const useAdviceStore = defineStore(
    "AdviceStore",
    () => {
        const alertStore = useAlertStore();
        // state
        const advices = ref([]);
        const blankAdvice = {
            advice_branch_id: 0,
            advice_department_id: 0,
            advice_user_id: 0,
            advice_title: "",
            advice_description: "",
            advice_attach_name: "",
            advice_original_name: "",
            advice_start_date: "",
            advice_end_date: "",
            advice_start_event: "",
            advice_end_event: "",
            advice_status: 0,
        };

        const advice = ref(blankAdvice);
        const advicesPagination = ref({});

        // actions
        const $reset = (): void => {
            advices.value = [];
            advice.value = {
                advice_branch_id: 1,
                advice_department_id: 1,
                advice_user_id: 1,
                advice_title: "",
                advice_description: "",
                advice_attach_name: "",
                advice_original_name: "",
                advice_start_date: "",
                advice_end_date: "",
                advice_start_event: "",
                advice_end_event: "",
                advice_status: 0,
            };
            advicesPagination.value = [];
        };

        const getAdvices = async (
            search: string,
            page: number,
            per_page: number,
            field: string
        ) => {
            alertStore.loading = true;
            try {
                let adviceList: any = await adviceService.getAdvices(
                    search,
                    page,
                    per_page,
                    field
                );
                alertStore.loading = false;
                advices.value = adviceList.data.data;
                advicesPagination.value = adviceList.data;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = `Erro ao retornar aviso: ${error.message}`;
            }
        };

        return {
            advices,
            advice,
            advicesPagination,
            $reset,
            getAdvices,
            saveAdvice,
            updateAdvice,
        };
    },
    {
        persist: {
            storage: persistedState.localStorage,
        },
    }
);
