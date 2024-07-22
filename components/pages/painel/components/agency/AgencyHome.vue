<script setup lang="ts">
import type { Agency } from "@/types/frontend";
import AgencyHomeCard from "./AgencyHomeCard.vue";

const props = defineProps({
    dataSource: {
        type: Array,
        required: true,
    },
    onSuccess: {
        type: Function,
    },
});

console.log({ dataSource: props.dataSource });

const openModal = ref(false);

const modalData = ref();
const onOpenModal = (data: Agency) => {
    modalData.value = data;
    openModal.value = !openModal.value;
};
</script>

<template>
    <ul class="agency-list-container">
        <ModalComponent title="Editar Agência" :open="openModal">
            <PagesVisitaCadastro :data="modalData" :onSuccess="onSuccess" />
        </ModalComponent>

        <li
            v-for="item in (props.dataSource as Agency[])"
            :key="item.agency_id"
        >
            <AgencyHomeCard :data="item" :onClick="onOpenModal" />
        </li>
    </ul>
</template>

<style lang="scss" scoped>
.agency-list-container {
    display: grid;
    margin: 0;
    margin-top: 7px;
    padding: 0;
    gap: 6px;

    li {
        list-style: none;
    }
}
</style>
