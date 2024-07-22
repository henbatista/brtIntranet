import { defineStore } from "pinia";
import cardService from "../utils/Card.Service";
import { useAlertStore } from "./AlertStore";

export const useCardStore = defineStore(
    "CardStore",
    () => {
        const alertStore = useAlertStore();
        const blankCard = {
            credit_card_efacil_id: 0,
            credit_card_name: "",
            credit_card_abreviation: "",
            credit_card_logo: "",
            credit_card_status: false,
        };

        // state
        const cards = ref([]);
        const card = ref({});
        const cardPagination = ref({});

        // actions
        const $reset = (): void => {
            cards.value = [];
            card.value = {
                credit_card_efacil_id: 0,
                credit_card_name: "",
                credit_card_abreviation: "",
                credit_card_logo: "",
                credit_card_status: false,
            };
            cardPagination.value = {};
        };

        const getCards = async (
            search: string,
            page: number,
            per_page: number,
            field: string
        ) => {
            try {
                let cardList: any = await cardService.getCards(
                    search,
                    page,
                    per_page,
                    field
                );
                alertStore.loading = false;
                cards.value = cardList.data.data;
                cardPagination.value = cardList.data;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = `Erro ao retornar cartões: ${error.message}`;
            }
        };

        const saveCard = async (data: any) => {
            alertStore.loading = true;
            try {
                await cardService.saveCard(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Cartão salvo com sucesso!";
                card.value = blankCard;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const updateCard = async (data: any) => {
            alertStore.loading = true;
            try {
                await cardService.updateCard(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Cartão atualizado com sucesso!";
                card.value = blankCard;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const deleteCard = async (data: any) => {
            alertStore.loading = true;
            try {
                await cardService.deleteCard(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Cartão deletado com sucesso!";
                card.value = blankCard;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        return {
            card,
            cards,
            cardPagination,
            blankCard,
            getCards,
            saveCard,
            updateCard,
            $reset,
            deleteCard,
        };
    },
    { persist: true }
);
