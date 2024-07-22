<template>
    <div>
        <h3>Detalhes do Rebate</h3>
        <div v-for="rebate in rebates" :key="rebate.Nome" class="rebate-item">
            <p><strong>Nome:</strong> {{ rebate.Nome }}</p>
            <p><strong>Tipo Restrição:</strong> {{ rebate.tipoRestricao }}</p>
            <p><strong>Com1:</strong> {{ rebate.com1 }}</p>
            <p><strong>Com2:</strong> {{ rebate.com2 }}</p>
            <p><strong>Inc1:</strong> {{ rebate.inc1 }}</p>
            <p><strong>Inc2:</strong> {{ rebate.inc2 }}</p>
            <p><strong>Validade Inicial:</strong> {{ rebate.validade_inicial }}</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useModalStore } from "@/stores/ModalStore";

const modalStore = useModalStore();
const rebates = computed(() => modalStore.modalData);
</script>

<style scoped>
.rebate-item {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>
