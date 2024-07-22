<script lang="ts" setup>
import type { columnsType } from "@/components/common/table/TableComponent.vue";
import type { ObjectResponse } from "@/types/frontend";

const columns: columnsType<any>[] = [
    {
        field: "id",
        header: "ID",
    },
    {
        field: "departamentos",
        header: "Departamentos",
        style: "flex: 1",
    },

    {
        field: "nome",
        header: "Nome",
    },
    {
        field: "nivelRequisitado",
        header: "Nivel Requisitado",
    },
    {
        field: "operation",
        header: "Ação",
    },
];

const modalData = ref();

const openModal = ref(false);

const onRowClick = async (data: ObjectResponse) => {
    modalData.value = data;
    openModal.value = !openModal.value;
};

const onOpenModal = () => {
    modalData.value = null;
    openModal.value = !openModal.value;
};
</script>
<template>
    <div>
        <ModalComponent
            :title="
                modalData
                    ? 'Editar Tipo de Atendimento'
                    : 'Cadastro de Tipo de Atendimento'
            "
            :open="openModal"
        >
            <PagesTipoAtendimentoCadastro
                :onCancel="onOpenModal"
                :data="modalData"
            />
        </ModalComponent>
        <NuxtLayout name="main">
            <main class="body-content">
                <TableComponent
                    title="Tipo de Atendimento"
                    :dataSource="[]"
                    addNewLabel="Cadastrar"
                    :columns="columns"
                    :onRowClick="onRowClick"
                    :onAddNew="onOpenModal"
                />

                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>
