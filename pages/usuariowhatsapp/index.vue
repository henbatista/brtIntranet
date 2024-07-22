<script lang="tsx" setup>
import type { TWhatsappUser } from "@/types/whatsappUser.d";
import StatusComponent from "@/components/common/statusComponent/StatusComponent.vue";
import type { columnsType } from "@/components/common/table/TableComponent.vue";
import { useWhatsAppUserStore } from "@/stores/WhatsAppUserStore";

import EditAndDeleteTableButton from "@/components/common/editAndDeleteTablebutton/EditAndDeleteTableButton.vue";
import { useTableStore } from "@/stores/TableStore";
import { useAlertStore } from "@/stores/AlertStore";
import { useDeleteItemStore } from "@/stores/deleteItemStore";

const deleteStore = useDeleteItemStore();
const alertStore = useAlertStore();
const tableStore = useTableStore();

const whatsAppUserStore = useWhatsAppUserStore();

const onDelete = async (data: TWhatsappUser) => {
    alertStore.loading = true;
    await whatsAppUserStore.deleteWhatsAppUser(data);
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const onChangeStatus = async (value: boolean, data: TWhatsappUser) => {
    alertStore.loading = true;
    await whatsAppUserStore.updateWhatsAppUser({
        ...data,
        whatsapp_user_status: value,
    });
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const columns: columnsType<any>[] = [
    {
        field: "whatsapp_user_id",
        header: "IdWhats",
    },
    {
        field: "whatsapp_user_agency",
        header: "Nome da Agência",
        style: "flex: 1",
    },

    {
        field: "whatsapp_user_api_username",
        header: "Nome do Usuário",
    },
    {
        field: "whatsapp_user_cnpj",
        header: "CNPJ",
    },

    {
        field: "whatsapp_user_status",
        header: "Status",
        render: (value: boolean, data: TWhatsappUser) => (
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
        render: (_v: string, data: TWhatsappUser) => (
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

const onRowClick = async (data: TWhatsappUser) => {
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
                    ? 'Editar Usuário WhatsApp'
                    : 'Cadastro de Usuários WhatsApp'
            "
            :open="openModal"
        >
            <PagesUsuarioWhatsappCadastro
                :onCancel="onOpenModal"
                :data="modalData"
            />
        </ModalComponent>
        <NuxtLayout name="main">
            <main class="body-content">
                <TableComponent
                    title="Usuários WhatsApp"
                    addNewLabel="Cadastrar"
                    :columns="columns"
                    :onRowClick="onRowClick"
                    :onAddNew="onOpenModal"
                    apiUrl="suporte/apiwhatsapp/listar"
                />

                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>
