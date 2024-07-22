<script lang="tsx" setup>
import type { ObjectResponse } from "@/types/frontend";
import { columnsType } from "@/components/common/table/TableComponent.vue";
import type { TBranch } from "@/types/branch";
import StatusComponent from "@/components/common/statusComponent/StatusComponent.vue";

import EditAndDeleteTableButton from "@/components/common/editAndDeleteTablebutton/EditAndDeleteTableButton.vue";
import { useTableStore } from "@/stores/TableStore";
import { useAlertStore } from "@/stores/AlertStore";
import { useDeleteItemStore } from "@/stores/deleteItemStore";
import { useBranchStore } from "@/stores/BranchStore";

const deleteStore = useDeleteItemStore();
const alertStore = useAlertStore();
const tableStore = useTableStore();

const branchStore = useBranchStore();

const onDelete = async (data: TBranch) => {
    alertStore.loading = true;
    await branchStore.deleteBranch(data);
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const onChangeStatus = async (value: boolean, data: TBranch) => {
    alertStore.loading = true;
    await branchStore.updateBranch({
        ...data,
        branch_status: value,
    });
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const columns: columnsType<TBranch>[] = [
    {
        field: "department_id",
        header: "ID Departamento",
    },
    {
        field: "branch_name",
        header: "Nome",
        style: "flex: 1",
    },

    {
        field: "branch_alias",
        header: "Alias",
    },
    {
        field: "region.region_name",
        header: "Região",
        render: (_, data) => <span>{data?.region?.region_name}</span>,
    },
    {
        field: "branch_city.city_name",
        header: "Cidade",
        render: (_, data) => <span>{data?.branch_city?.city_name}</span>,
    },
    {
        field: "branch_phone",
        header: "Telefone",
    },

    {
        field: "branch_status",
        header: "Status",
        render: (value: boolean, data: TBranch) => (
            <StatusComponent
                status={value}
                onChangeStatus={(status: boolean) =>
                    onChangeStatus(status, data)
                }
            />
        ),
    },
    {
        field: "actions",
        header: "",
        render: (_v: string, data: TBranch) => (
            <EditAndDeleteTableButton
                onEdit={() => onRowClick(data)}
                onClickDeleteButton={() =>
                    deleteStore.setDeleteFunction(() => onDelete(data))
                }
            />
        ),
    },
];

const modalData = ref();

const openModal = ref(false);

const onRowClick = async (data: TBranch) => {
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
            :title="modalData ? 'Editar Filial' : 'Cadastro de Filiais'"
            :open="openModal"
        >
            <PagesFilialCadastro :onCancel="onOpenModal" :data="modalData" />
        </ModalComponent>
        <NuxtLayout name="main">
            <main class="body-content">
                <TableComponent
                    title="Filiais"
                    addNewLabel="Cadastrar"
                    :columns="columns"
                    :onRowClick="onRowClick"
                    :onAddNew="onOpenModal"
                    apiUrl="admin/filial/listar"
                />

                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>
