<script lang="tsx" setup>
import type { TRegion } from "@/types/branch";
import type { columnsType } from "@/components/common/table/TableComponent.vue";
import StatusComponent from "@/components/common/statusComponent/StatusComponent.vue";

import EditAndDeleteTableButton from "@/components/common/editAndDeleteTablebutton/EditAndDeleteTableButton.vue";
import { useTableStore } from "@/stores/TableStore";
import { useAlertStore } from "@/stores/AlertStore";
import { useDeleteItemStore } from "@/stores/deleteItemStore";
import { useRegionStore } from "@/stores/RegionStore";

const deleteStore = useDeleteItemStore();
const alertStore = useAlertStore();
const tableStore = useTableStore();

const regionStore = useRegionStore();

const onDelete = async (data: TRegion) => {
    alertStore.loading = true;
    await regionStore.deleteRegion(data);
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const onChangeStatus = async (value: boolean, data: TRegion) => {
    alertStore.loading = true;
    await regionStore.updateRegion({
        ...data,
        region_status: value,
    });
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const columns: columnsType<TRegion>[] = [
    {
        field: "region_id",
        header: "ID Região",
    },
    {
        field: "region_name",
        header: "Região",
        style: "flex: 1",
    },

    {
        field: "region_status",
        header: "Status",
        render: (value: boolean, data: TRegion) => (
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
        render: (_v: string, data: TRegion) => (
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

const onRowClick = async (data: TRegion) => {
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
            :title="modalData ? 'Editar Região' : 'Cadastro de Regiões'"
            :open="openModal"
        >
            <PagesRegiaoCadastro :onCancel="onOpenModal" :data="modalData" />
        </ModalComponent>
        <NuxtLayout name="main">
            <main class="body-content">
                <TableComponent
                    title="Regiões"
                    addNewLabel="Cadastrar"
                    :columns="columns"
                    :onRowClick="onRowClick"
                    :onAddNew="onOpenModal"
                    apiUrl="suporte/regiao/listar"
                />

                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>
