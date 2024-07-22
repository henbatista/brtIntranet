<script lang="tsx" setup>
import type { ObjectResponse } from "@/types/frontend";
import StatusComponent from "@/components/common/statusComponent/StatusComponent.vue";

import EditAndDeleteTableButton from "@/components/common/editAndDeleteTablebutton/EditAndDeleteTableButton.vue";
import { useTableStore } from "@/stores/TableStore";
import { useAlertStore } from "@/stores/AlertStore";
import { useDeleteItemStore } from "@/stores/deleteItemStore";
import { useCardStore } from "@/stores/CardStore";

const deleteStore = useDeleteItemStore();
const alertStore = useAlertStore();
const tableStore = useTableStore();

const { deleteCard, updateCard } = useCardStore();

const onDelete = async (data: any) => {
    alertStore.loading = true;
    await deleteCard(data);
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const onChangeStatus = async (value: boolean, data: any) => {
    alertStore.loading = true;
    await updateCard({
        ...data,
        credit_card_status: value,
    });
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const columns = [
    {
        field: "logo",
        header: "Bandeira",
    },
    {
        field: "credit_card_efacil_id",
        header: "Efacil ID",
    },

    {
        field: "credit_card_name",
        header: "Nome",
        style: "flex: 1",
    },
    {
        field: "credit_card_abreviation",
        header: "Abreviação",
    },
    {
        field: "credit_card_status",
        header: "Status",
        render: (value: boolean, data: any) => (
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
        render: (_v: string, data: any) => (
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
            :title="modalData ? 'Editar Cartão' : 'Cadastro de Cartões'"
            :open="openModal"
        >
            <PagesCartaoCadastro :onCancel="onOpenModal" :data="modalData" />
        </ModalComponent>
        <NuxtLayout name="main">
            <main class="body-content">
                <TableComponent
                    title="Cartões"
                    addNewLabel="Cadastrar"
                    :columns="columns"
                    :onRowClick="onRowClick"
                    :onAddNew="onOpenModal"
                    apiUrl="suporte/cartao/listar"
                />

                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>
