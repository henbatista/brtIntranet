<script setup lang="ts">
import type { TVisit } from "@/types/visit";
import FAQHomeCard from "./FAQHomeCard.vue";

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
        <ModalComponent title="Editar FAQ" :open="openModal">
            <PagesFaqCadastro :data="modalData" :onSuccess="onSuccess" />
        </ModalComponent>

        <li v-for="item in (props.dataSource as TVisit[])" :key="item.visit_id">
            <FAQHomeCard :data="item" :onClick="onOpenModal" />
        </li>
    </ul>
</template>

<style lang="scss" scoped>
.visit-list-container {
    display: grid;
    margin: 0;
    padding: 0;
    margin-top: 7px;
    gap: 6px;

    li {
        list-style: none;
    }
}
</style>
