<script lang="ts" setup>
import type { ObjectResponse } from "@/types/frontend";
import type { columnsType } from "@/components/common/table/TableComponent.vue";
import type { TBranch } from "@/types/branch";

const columns: columnsType<TBranch>[] = [
    {
        field: "product_id",
        header: "ID",
    },
    {
        field: "product_name",
        header: "Nome",
        style: "flex: 1",
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
            :title="modalData ? 'Editar Produto' : 'Cadastro de Produtos'"
            :open="openModal"
        >
            <PagesProdutoCadastro :onCancel="onOpenModal" :data="modalData" />
        </ModalComponent>
        <NuxtLayout name="main">
            <main class="body-content">
                <TableComponent
                    title="Produtos"
                    addNewLabel="Cadastrar"
                    :columns="columns"
                    :onRowClick="onRowClick"
                    :onAddNew="onOpenModal"
                    apiUrl="suporte/produto/listar"
                />

                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>
