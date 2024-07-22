<script setup lang="ts">
import { useDeleteItemStore } from "@/stores/deleteItemStore";

const deleteStore = useDeleteItemStore();
</script>

<template>
    <PopUpComponent
        :open="deleteStore.openModal"
        :title="deleteStore.props.modalTitle"
    >
        <section class="delete-container">
            <p>{{ deleteStore.props.text }}</p>

            <div class="buttons-container">
                <ButtonComponent
                    variant="text"
                    @click="deleteStore.handleOpenPopUp"
                >
                    Cancelar
                </ButtonComponent>

                <ButtonComponent
                    variant="error"
                    @click="deleteStore.handleDeleteItem"
                >
                    Deletar
                </ButtonComponent>
            </div>
        </section>
    </PopUpComponent>
</template>

<style scoped lang="scss">
.delete-container {
    display: flex;
    gap: 30px;
    flex-direction: column;
    justify-content: center;

    p {
        text-align: center;
        color: var(--grey-800);
    }

    .buttons-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }
}
</style>
