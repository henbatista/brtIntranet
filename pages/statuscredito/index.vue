<script lang="tsx" setup>
import type { columnsType } from "@/components/common/table/TableComponent.vue";
import StatusComponent from "@/components/common/statusComponent/StatusComponent.vue";
import type { TCreditStatus } from "@/types/creditStatus.d";

import EditAndDeleteTableButton from "@/components/common/editAndDeleteTablebutton/EditAndDeleteTableButton.vue";
import { useTableStore } from "@/stores/TableStore";
import { useAlertStore } from "@/stores/AlertStore";
import { useDeleteItemStore } from "@/stores/deleteItemStore";

const deleteStore = useDeleteItemStore();
const alertStore = useAlertStore();
const tableStore = useTableStore();

const onDelete = async (data: TCreditStatus) => {
    alertStore.loading = true;
    await deleteCreditStatus(data);
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const onChangeStatus = async (value: boolean, data: TCreditStatus) => {
    alertStore.loading = true;
    await updateCreditStatus({
        ...data,
        credit_status_status: value,
    });
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const columns: columnsType[] = [
    {
        field: "credit_status_id",
        header: "ID",
    },
    {
        field: "credit_status_type",
        header: "Tipo",
        style: "flex: 1",
    },

    {
        field: "credit_status_name",
        header: "Nome",
    },
    {
        field: "complementar",
        header: "Complementar",
    },
    {
        field: "exibirAba",
        header: "Exibir Aba",
    },
    {
        field: "credit_status_color",
        header: "Cor",
        render: (value) => (
            <div
                style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "90px",
                    backgroundColor: value,
                }}
            ></div>
        ),
    },

    {
        field: "credit_status_status",
        header: "Status",
        render: (value: boolean, data: TCreditStatus) => (
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
        render: (_v: string, data: TCreditStatus) => (
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

const onRowClick = async (data: TCreditStatus) => {
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
                    ? 'Editar Status de Crédito'
                    : 'Cadastro de Status de Crédito'
            "
            :open="openModal"
        >
            <PagesStatusCreditoCadastro
                :onCancel="onOpenModal"
                :data="modalData"
            />
        </ModalComponent>
        <NuxtLayout name="main">
            <main class="body-content">
                <TableComponent
                    title="Status de Crédito"
                    addNewLabel="Cadastrar"
                    :columns="columns"
                    :onRowClick="onRowClick"
                    :onAddNew="onOpenModal"
                    apiUrl="suporte/statuscredito/listar"
                />

                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>
