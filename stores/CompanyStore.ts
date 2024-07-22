import { defineStore } from "pinia";
import companyService from "../utils/company.service";
import { useAlertStore } from "./AlertStore";
import type { Company } from "@/types/frontend";

export const useCompanyStore = defineStore(
    "CompanyStore",
    () => {
        const alertStore = useAlertStore();
        const blankCompany = undefined;

        // state
        const companies = ref<Company[]>([]);
        const company = ref<Company>();
        const CompanyPagination = ref({});

        // actions
        const $reset = (): void => {
            companies.value = [];
            company.value = undefined;
            CompanyPagination.value = [];
        };

        const getCompanies = async (
            search: string,
            page: number,
            per_page: number,
            field: string
        ) => {
            try {
                let companyList: any = await companyService.getCompanies(
                    search,
                    page,
                    per_page,
                    field
                );
                alertStore.loading = false;
                companies.value = companyList.data.data;
                CompanyPagination.value = companyList.data;
                return companyList.data.data;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = `Erro ao retornar companhias: ${error.message}`;
            }
        };

        const saveCompany = async (data: any) => {
            alertStore.loading = true;
            try {
                await companyService.saveCompany(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Companhia salva com sucesso!";
                company.value = blankCompany;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const updateCompany = async (data: any) => {
            alertStore.loading = true;
            try {
                await companyService.updateCompany(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Companhia atualizada com sucesso!";
                company.value = blankCompany;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const deleteCompany = async (data: any) => {
            alertStore.loading = true;
            try {
                await companyService.deleteCompany(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Companhia desativada com sucesso!";
                company.value = blankCompany;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        return {
            company,
            companies,
            blankCompany,
            CompanyPagination,
            getCompanies,
            saveCompany,
            updateCompany,
            deleteCompany,
            $reset,
        };
    },
    { persist: true }
);
