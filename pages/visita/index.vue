<script lang="tsx" setup>
import type { columnsType } from "@/components/common/table/TableComponent.vue";
import StatusComponent from "@/components/common/statusComponent/StatusComponent.vue";
import { formatDate } from "@/hooks/formatDate";

import EditAndDeleteTableButton from "@/components/common/editAndDeleteTablebutton/EditAndDeleteTableButton.vue";
import { useTableStore } from "@/stores/TableStore";
import { useAlertStore } from "@/stores/AlertStore";
import { useDeleteItemStore } from "@/stores/deleteItemStore";
import type { TVisit } from "@/types/visit";

const deleteStore = useDeleteItemStore();
const alertStore = useAlertStore();
const tableStore = useTableStore();

const onDelete = async (data: TVisit) => {
    alertStore.loading = true;
    await deleteVisit(data);
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const onChangeStatus = async (value: boolean, data: TVisit) => {
    alertStore.loading = true;
    await updateVisit({
        ...data,
        visit_status: value,
    });
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const columns: columnsType<TVisit>[] = [
    {
        field: "created_at",
        header: "Criado",
        render: (value) => <span>{formatDate(value, "dd/MM/yyyy")}</span>,
    },
    {
        field: "visit_date",
        header: "Data",
        render: (value) => <span>{formatDate(value, "dd/MM/yyyy")}</span>,
    },

    {
        field: "atendente",
        header: "Atendente",
    },
    {
        field: "filial",
        header: "Filial",
    },
    {
        field: "departamento",
        header: "Departamento",
    },
    {
        field: "visit_agency_name",
        header: "Agência",
    },
    {
        field: "visit_agency_address",
        header: "Endereço",
    },
    {
        field: "visit_agency_city",
        header: "Cidade",
    },
    {
        field: "visit_agency_city_uf",
        header: "Estado",
    },
    {
        field: "visit_distance_km",
        header: "KM",
    },
    {
        field: "visit_objective",
        header: "Objetivo",
    },
    {
        field: "visit_objective",
        header: "Atividade",
    },

    {
        field: "visit_status",
        header: "Status",
        render: (value: boolean, data: TVisit) => (
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
        render: (_v: string, data: TVisit) => (
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

const onRowClick = async (data: TVisit) => {
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
            :title="modalData ? 'Editar Visita' : 'Cadastro de Visitas'"
            :open="openModal"
        >
            <PagesVisitaCadastro :onCancel="onOpenModal" :data="modalData" />
        </ModalComponent>
        <NuxtLayout name="main">
            <main class="body-content">
                <TableComponent
                    title="Visitas"
                    addNewLabel="Cadastrar"
                    :columns="columns"
                    :onRowClick="onRowClick"
                    :onAddNew="onOpenModal"
                    apiUrl="suporte/visita/listar"
                />

                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>
