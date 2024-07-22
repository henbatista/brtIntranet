import { defineStore } from "pinia";
import type { Item } from "vue3-easy-data-table";

export const useModalStore = defineStore(
    "ModalStore",
    () => {
        // state
        const modalShow = ref(false);
        const modalType = ref("");
        const modalTitle = ref("");
        const modalData = ref<Item | null>(null);
        const modalAction = ref("");

        // actions
        const $reset = (): void => {
            modalShow.value = false;
            modalType.value = "";
            modalTitle.value = "";
            modalData.value = null;
            modalAction.value = "";
        };

        // getters
        const getModalShow = computed(() => modalShow.value);
        const getModalType = computed(() => modalType.value);
        const getModalTitle = computed(() => modalTitle.value);
        const getModalData = computed(() => modalData.value);
        const getModalAction = computed(() => modalAction.value);

        return {
            modalShow,
            modalType,
            modalTitle,
            modalData,
            modalAction,
            $reset,
            getModalShow,
            getModalType,
            getModalTitle,
            getModalData,
            getModalAction,
        };
    },
    {
        persist: {
            storage: persistedState.localStorage,
        },
    }
);
