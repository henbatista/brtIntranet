<script lang="tsx" setup>
import type { ObjectResponse } from "@/types/frontend";
import type { columnsType } from "@/components/common/table/TableComponent.vue";
import StatusComponent from "@/components/common/statusComponent/StatusComponent.vue";

import EditAndDeleteTableButton from "@/components/common/editAndDeleteTablebutton/EditAndDeleteTableButton.vue";
import { useTableStore } from "@/stores/TableStore";
import { useAlertStore } from "@/stores/AlertStore";
import { useDeleteItemStore } from "@/stores/deleteItemStore";
import { TWarnings } from "types/warnings";

const deleteStore = useDeleteItemStore();
const alertStore = useAlertStore();
const tableStore = useTableStore();

const onDelete = async (data: TWarnings) => {
    alertStore.loading = true;
    await deleteAdvice(data);
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const onChangeStatus = async (value: boolean, data: TWarnings) => {
    alertStore.loading = true;
    await updateAdvice({
        ...data,
        advice_status: value,
    });
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const columns: columnsType<any>[] = [
    {
        field: "advice_id",
        header: "ID",
    },
    {
        field: "advice_branch_id",
        header: "Filial",
        style: "flex: 1",
    },

    {
        field: "advice_department_id",
        header: "Departamento",
    },
    {
        field: "advice_title",
        header: "Titulo",
    },
    {
        field: "logo",
        header: "Logo",
    },
    {
        field: "advice_start_date",
        header: "Data Ínicio",
    },
    {
        field: "advice_end_date",
        header: "Data fim",
    },
    {
        field: "advice_start_event",
        header: "Data início evento",
    },
    {
        field: "advice_end_event",
        header: "Data fim evento",
    },
    {
        field: "advice_status",
        header: "Status",
        render: (value: boolean, data: TWarnings) => (
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
        render: (_v: string, data: TWarnings) => (
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
            :title="modalData ? 'Editar Aviso' : 'Cadastro de Avisos'"
            :open="openModal"
        >
            <PagesAvisoCadastro :onCancel="onOpenModal" :data="modalData" />
        </ModalComponent>
        <NuxtLayout name="main">
            <main class="body-content">
                <TableComponent
                    title="Avisos"
                    addNewLabel="Cadastrar"
                    :columns="columns"
                    :onRowClick="onRowClick"
                    :onAddNew="onOpenModal"
                    apiUrl="suporte/avisos/listar"
                />

                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>
