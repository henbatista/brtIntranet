<script lang="ts" setup>
import type { ObjectResponse } from "@/types/frontend";
import type { columnsType } from "@/components/common/table/TableComponent.vue";

const columns: columnsType<any>[] = [
    {
        field: "data",
        header: "Data",
    },
    {
        field: "solicitante",
        header: "Solicitante",
        style: "flex: 1",
    },

    {
        field: "atendente",
        header: "Atendente",
    },
    {
        field: "agencia",
        header: "Agência",
    },
    {
        field: "tipoAtendimento",
        header: "Tipo de Atendimento",
    },
    {
        field: "formaContato",
        header: "Forma Contato",
    },
    {
        field: "status",
        header: "Status",
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
                modalData ? 'Editar Atendimento' : 'Cadastro de Atendimentos'
            "
            :open="openModal"
        >
            <PagesAtendimentoCadastro
                :onCancel="onOpenModal"
                :data="modalData"
            />
        </ModalComponent>
        <NuxtLayout name="main">
            <main class="body-content">
                <TableComponent
                    title="Atendimento"
                    addNewLabel="Cadastrar"
                    :columns="columns"
                    :onRowClick="onRowClick"
                    :onAddNew="onOpenModal"
                    apiUrl="suporte/ticket/listar"
                />

                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>
