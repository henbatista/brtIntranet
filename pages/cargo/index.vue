<script lang="tsx" setup>
import type { ObjectResponse } from "@/types/frontend";
import type { columnsType } from "@/components/common/table/TableComponent.vue";
import type { TBranch } from "@/types/branch";
import StatusComponent from "@/components/common/statusComponent/StatusComponent.vue";

const columns: columnsType<TBranch>[] = [
    {
        field: "position_id",
        header: "ID",
    },

    {
        field: "departament",
        header: "Departamento",
        style: "flex: 1",
    },
    {
        field: "position_name",
        header: "Nome",
        style: "flex: 1",
    },
    {
        field: "position_default_permission",
        header: "Número de Permissão",
    },
    {
        field: "position_status",
        header: "Status",
        render: (value: boolean) => <StatusComponent status={value} />,
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
            :title="modalData ? 'Editar Cargo' : 'Cadastro de Cargos'"
            :open="openModal"
        >
            <PagesCargoCadastro :onCancel="onOpenModal" :data="modalData" />
        </ModalComponent>
        <NuxtLayout name="main">
            <main class="body-content">
                <TableComponent
                    title="Cargos"
                    addNewLabel="Cadastrar"
                    :columns="columns"
                    :onRowClick="onRowClick"
                    :onAddNew="onOpenModal"
                    apiUrl="admin/cargo/listar"
                />

                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>
