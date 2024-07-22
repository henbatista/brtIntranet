import { defineStore } from "pinia";
import { useAlertStore } from "./AlertStore";

export const useFaqStore = defineStore(
    "FaqStore",
    () => {
        const alertStore = useAlertStore();

        // state
        const faqs = ref({});
        const faq = ref({});
        const faqPagination = ref({});

        // actions
        const $reset = () => {
            faqs.value = {};
            faq.value = {};
            faqPagination.value = {};
        };

        const fetchFaq = async (search, page, per_page, field) => {
            alertStore.loading = true;
            try {
                let faqList = await getFaqs(search, page, per_page, field);
                faqs.value = faqList.data.data;
                faqPagination.value = faqList.data;
                alertStore.loading = false;
                return faqList.data.data;
            } catch (error) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = `Erro ao retornar FAQs: ${error.message}`;
                return {};
            }
        };

        const onSaveFaq = async (data) => {
            alertStore.loading = true;
            try {
                await saveFaq(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "FAQ salva com sucesso!";
                faq.value = {};
            } catch (error) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = `Erro ao salvar FAQ: ${error.message}`;
            }
        };

        const onUpdateFaq = async (data) => {
            alertStore.loading = true;
            try {
                await updateFaq(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "FAQ atualizada com sucesso!";
                faq.value = {};
            } catch (error) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = `Erro ao atualizar FAQ: ${error.message}`;
            }
        };

        return {
            faq,
            faqs,
            faqPagination,
            fetchFaq,
            onSaveFaq,
            onUpdateFaq,
            $reset,
        };
    },
    { persist: true }
);
