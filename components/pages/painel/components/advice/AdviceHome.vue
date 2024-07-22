<script setup lang="ts">
import type { TVisit } from "@/types/visit";
import AdviceHomeCard from "./AdviceHomeCard.vue";

const props = defineProps({
    dataSource: {
        type: Array,
        required: true,
    },
    onSuccess: {
        type: Function,
    },
});

const openModal = ref(false);

const modalData = ref();
const onOpenModal = (data: TVisit) => {
    modalData.value = data;
    openModal.value = !openModal.value;
};
</script>

<template>
    <ul class="visit-list-container">
        <ModalComponent title="Editar Aviso" :open="openModal">
            <PagesAvisoCadastro :data="modalData" :onSuccess="onSuccess" />
        </ModalComponent>

        <li v-for="item in (props.dataSource as TVisit[])" :key="item.visit_id">
            <AdviceHomeCard :data="item" :onClick="onOpenModal" />
        </li>
    </ul>
</template>

<style lang="scss" scoped>
.visit-list-container {
    display: grid;
    margin: 0;
    padding: 0;

    li {
        list-style: none;

        & + li {
            border-top: 1px solid var(--grey-500);
        }
    }
}
</style>
