<script lang="tsx" setup>
import type { TSistem } from "@/types/sistem";
import type { columnsType } from "@/components/common/table/TableComponent.vue";
import StatusComponent from "@/components/common/statusComponent/StatusComponent.vue";
import EditAndDeleteTableButton from "@/components/common/editAndDeleteTablebutton/EditAndDeleteTableButton.vue";
import { useTableStore } from "@/stores/TableStore";
import { useAlertStore } from "@/stores/AlertStore";
import { useDeleteItemStore } from "@/stores/deleteItemStore";
import { useSystemStore } from "@/stores/SystemStore";

const deleteStore = useDeleteItemStore();
const alertStore = useAlertStore();
const tableStore = useTableStore();

const sistemStore = useSystemStore();

const onDelete = async (data: TSistem) => {
    alertStore.loading = true;
    await sistemStore.deleteSystem(data);
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const onChangeStatus = async (value: boolean, data: TSistem) => {
    alertStore.loading = true;
    await sistemStore.updateSystem({
        ...data,
        system_status: value,
    });
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const columns: columnsType<TSistem>[] = [
    {
        field: "system_logo",
        header: "Logo",
        render: (value) => (
            <img
                src={"https://business.travelapi.com.br/api/public/" + value}
                alt="sistem logo"
            />
        ),
    },
    {
        field: "system_id",
        header: "idSistemaAereo",
    },
    {
        field: "system_name",
        header: "Sistema",
        style: "flex: 1",
    },

    {
        field: "system_type",
        header: "Tipo Sistema",
    },
    {
        field: "system_status",
        header: "Status",
        render: (value: boolean, data: TSistem) => (
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
        render: (_v: string, data: TSistem) => (
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

const onRowClick = async (data: TSistem) => {
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
            :title="modalData ? 'Editar Sistema' : 'Cadastro de Sistemas'"
            :open="openModal"
        >
            <PagesSistemaCadastro :onCancel="onOpenModal" :data="modalData" />
        </ModalComponent>
        <NuxtLayout name="main">
            <main class="body-content">
                <TableComponent
                    title="Sistemas"
                    addNewLabel="Cadastrar"
                    :columns="columns"
                    :onRowClick="onRowClick"
                    :onAddNew="onOpenModal"
                    apiUrl="suporte/sistema/listar"
                />

                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>
