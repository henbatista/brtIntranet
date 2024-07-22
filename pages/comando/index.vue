<script lang="tsx" setup>
import { useAlertStore } from "@/stores/AlertStore";
import type { Command } from "@/types/frontend";
import StatusComponent from "@/components/common/statusComponent/StatusComponent.vue";
import EditAndDeleteTableButton from "@/components/common/editAndDeleteTablebutton/EditAndDeleteTableButton.vue";
import { useTableStore } from "@/stores/TableStore";
import { useCommandStore } from "@/stores/CommandStore";
import { useDeleteItemStore } from "@/stores/deleteItemStore";

const deleteStore = useDeleteItemStore();
const alertStore = useAlertStore();
const tableStore = useTableStore();
const commandStore = useCommandStore();
const modalData = ref();
const openModal = ref(false);

const columns = [
    {
        field: "command_id",
        header: "idComando",
    },
    {
        field: "command_name",
        header: "Comando",
        style: "flex: 1",
    },
    {
        field: "command_validity",
        header: "Validade",
    },
    {
        field: "command_system_type",
        header: "Sistema",
    },
    {
        field: "command_description",
        header: "Descrição",
        render: (value: any) => <div v-html={value}></div>,
    },
    {
        field: "command_status",
        header: "Status",
        render: (value: boolean, data: Command) => (
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
        render: (_v: string, data: Command) => (
            <EditAndDeleteTableButton
                onEdit={() => edit(data)}
                onClickDeleteButton={() =>
                    deleteStore.setDeleteFunction(() => onDelete(data))
                }
            />
        ),
    },
];

const onOpenModal = () => {
    modalData.value = null;
    openModal.value = !openModal.value;
};

const onChangeStatus = async (value: boolean, data: Command) => {
    alertStore.loading = true;
    await commandStore.updateCommand({ ...data, command_status: value });
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const edit = async (data: Command) => {
    modalData.value = data;
    openModal.value = !openModal.value;
};

const onDelete = async (data: Command) => {
    alertStore.loading = true;
    await commandStore.deleteCommand(data);
    alertStore.loading = false;
    tableStore.onFetchTable();
};


</script>
<template>
    <div>
        <ModalComponent
            :title="modalData ? 'Editar Comando' : 'Cadastro de Comando'"
            :open="openModal"
        >
            <PagesComandoCadastro :data="modalData" :onCancel="onOpenModal" />
        </ModalComponent>
        <NuxtLayout name="main">
            <main class="body-content">
                <TableComponent
                    title="Comando"
                    addNewLabel="Cadastrar"
                    :columns="columns"
                    :onRowClick="edit"
                    :onAddNew="onOpenModal"
                    apiUrl="suporte/comando/listar"
                />
                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>
