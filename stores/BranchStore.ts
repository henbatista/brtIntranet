import { defineStore } from "pinia";
import { useAlertStore } from "./AlertStore";
import branchService from "../utils/branch.service";
import type { TBranch } from "@/types/branch";

const blankBranch = {
    branch_id: "",
    branch_name: "",
    branch_phone: "",
    branch_alias: "",
    branch_status: false,
    branch_city: {
        city_id: "",
        city_name: "",
        city_federation_unit: "",
        city_federation_unit_name: "",
        city_country: "",
        city_iata: "",
        city_country_id: "",
    },
    region: {
        region_id: "",
        region_name: "",
        region_status: false,
    },
};

export const useBranchStore = defineStore(
    "BranchStore",
    () => {
        const alertStore = useAlertStore();
        // state
        const branches = ref<TBranch[]>([]);

        const branch = ref<TBranch>(blankBranch);
        const branchesPagination = ref({});

        // actions
        const $reset = (): void => {
            branches.value = [];
            branch.value = blankBranch;

            branchesPagination.value = [];
        };

        const getBranches = async (
            search: string,
            page: number,
            per_page: number,
            field: string
        ) => {
            try {
                const branchList: any = await branchService.getBranches(
                    search,
                    page,
                    per_page,
                    field
                );
                branches.value = branchList.data.data;
                branchesPagination.value = branchList.data;
                return branchList.data.data;
            } catch (error: any) {
                alertStore.success = false;
                alertStore.message = `Erro ao retornar filiais: ${error.message}`;
                return [];
            }
        };

        const saveBranch = async (data: any) => {
            alertStore.loading = true;
            try {
                await branchService.saveBranch(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Filial salva com sucesso!";
                branch.value = blankBranch;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const updateBranch = async (data: any) => {
            alertStore.loading = true;
            try {
                await branchService.updateBranch(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Filial atualizada com sucesso!";
                branch.value = blankBranch;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const deleteBranch = async (data: any) => {
            alertStore.loading = true;
            try {
                await branchService.deleteBranch(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Filial deletada com sucesso!";
                branch.value = blankBranch;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        return {
            branches,
            branch,
            branchesPagination,
            $reset,
            getBranches,
            saveBranch,
            updateBranch,
            deleteBranch,
        };
    },
    {
        persist: {
            storage: persistedState.localStorage,
        },
    }
);
