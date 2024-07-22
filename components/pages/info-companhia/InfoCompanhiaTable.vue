<script lang="tsx" setup>
import type { columnsType } from "@/components/common/table/TableComponent.vue";
import type { TBranch } from "@/types/branch";
import { useTableStore } from "@/stores/TableStore";
import { useAlertStore } from "@/stores/AlertStore";
import { useDeleteItemStore } from "@/stores/deleteItemStore";
import { TInfoCompanhias } from "@/types/info-companhias";
import EditAndDeleteTableButton from "@/components/common/editAndDeleteTablebutton/EditAndDeleteTableButton.vue";
import { formatDate } from "@/hooks/formatDate";

const deleteStore = useDeleteItemStore();
const alertStore = useAlertStore();
const tableStore = useTableStore();

const onDelete = async (data: TInfoCompanhias) => {
    alertStore.loading = true;
    await deleteInfoCompanhia(data);
    alertStore.loading = false;
    tableStore.onFetchTable();
};

// const onChangeStatus = async (value: boolean, data: TInfoCompanhias) => {
//     alertStore.loading = true;
//     await updateInfoCompanhia({ ...data, info_company_status: value });
//     alertStore.loading = false;
//     tableStore.onFetchTable();
// };

const columns: columnsType<TBranch>[] = [
    {
        field: "company_logo",
        header: "Logo",
        render: (value: string) => (
            <img
                src={"https://business.travelapi.com.br/storage/" + value}
                alt="companhia-logo"
                style={{
                    maxHeight: "39px",
                    objectFit: "cover",
                }}
            />
        ),
    },
    {
        field: "company_name",
        header: "Companhia",
        style: "flex: 1",
    },

    {
        field: "created_at",
        header: "Dt. Criação",
        render: (value) => <span>{formatDate(value, "dd/MM/yyyy")}</span>,
    },
    {
        field: "air_company_info_status",
        header: "Status",
    },
];

const modalData = ref();

const openModal = ref(false);

const onRowClick = async (data: TInfoCompanhias) => {
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
                    ? 'Editar INFO Companhia'
                    : 'Cadastro de INFO Companhias'
            "
            :open="openModal"
        >
            <PagesINFOComapnhiaCadastro
                :onCancel="onOpenModal"
                :data="modalData"
            />
        </ModalComponent>
        <TableComponent
            title="INFO Companhias"
            addNewLabel="Cadastrar"
            :columns="columns"
            :onRowClick="onRowClick"
            :onAddNew="onOpenModal"
            apiUrl="suporte/companhiaareainfo/listar"
        />
    </div>
</template>
