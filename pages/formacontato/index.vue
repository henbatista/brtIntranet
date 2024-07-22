<script lang="tsx" setup>
import type { ContactType } from "@/types/frontend";
import type { columnsType } from "@/components/common/table/TableComponent.vue";
import type { TBranch } from "@/types/branch";
import StatusComponent from "@/components/common/statusComponent/StatusComponent.vue";

import EditAndDeleteTableButton from "@/components/common/editAndDeleteTablebutton/EditAndDeleteTableButton.vue";
import { useTableStore } from "@/stores/TableStore";
import { useAlertStore } from "@/stores/AlertStore";
import { useDeleteItemStore } from "@/stores/deleteItemStore";
import { useContactTypeStore } from "@/stores/ContactTypeStore";

const deleteStore = useDeleteItemStore();
const alertStore = useAlertStore();
const tableStore = useTableStore();

const { updateContactType, deleteContactType } = useContactTypeStore();

const onDelete = async (data: ContactType) => {
    alertStore.loading = true;
    await deleteContactType(data);
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const onChangeStatus = async (value: boolean, data: ContactType) => {
    alertStore.loading = true;
    await updateContactType({
        ...data,
        contact_type_status: value,
    });
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const columns: columnsType<TBranch>[] = [
    {
        field: "contact_type_id",
        header: "ID",
    },
    {
        field: "contact_type_name",
        header: "Nome",
        style: "flex: 1",
    },

    {
        field: "contact_type_status",
        header: "Status",
        render: (value: boolean, data: ContactType) => (
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
        render: (_v: string, data: ContactType) => (
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

const onRowClick = async (data: ContactType) => {
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
                    ? 'Editar Forma de Contato'
                    : 'Cadastro de Formas de Contato'
            "
            :open="openModal"
        >
            <PagesFormacontatoCadastro
                :onCancel="onOpenModal"
                :data="modalData"
            />
        </ModalComponent>
        <NuxtLayout name="main">
            <main class="body-content">
                <TableComponent
                    title="Formas de Contato"
                    addNewLabel="Cadastrar"
                    :columns="columns"
                    :onRowClick="onRowClick"
                    :onAddNew="onOpenModal"
                    apiUrl="suporte/formasDeContato/listar"
                />

                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>
