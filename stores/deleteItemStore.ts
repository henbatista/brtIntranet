// stores/deleteItemStore.ts
import { defineStore } from "pinia";

export const useDeleteItemStore = defineStore("delete-item", () => {
    const props = ref({
        modalTitle: "Deletar Item?",
        text: "Você tem certeza que deseja deletar este item?",
    });

    const onDelete = ref<() => Promise<void>>(async () => {});

    const openModal = ref(false);

    const handleOpenPopUp = () => {
        openModal.value = !openModal.value;
    };

    const setDeleteFunction = (func: () => Promise<void>) => {
        onDelete.value = func;
    };

    const handleDeleteItem = async () => {
        await onDelete.value();
        handleOpenPopUp();
    };

    return {
        handleOpenPopUp,
        setDeleteFunction,
        onDelete,
        props,
        handleDeleteItem,
        openModal,
    };
});
