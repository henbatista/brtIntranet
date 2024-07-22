<script lang="tsx" setup>
import { ref } from "vue";
import type {  User } from "@/types/frontend";
import type { columnsType } from "components/common/table/TableComponent.vue";

import EditAndDeleteTableButton from "@/components/common/editAndDeleteTablebutton/EditAndDeleteTableButton.vue";
import { useTableStore } from "@/stores/TableStore";
import { useAlertStore } from "@/stores/AlertStore";
import { useUserStore } from "@/stores/UserStore";
import { useDeleteItemStore } from "@/stores/deleteItemStore";

const deleteStore = useDeleteItemStore();
const alertStore = useAlertStore();
const tableStore = useTableStore();
const userStore = useUserStore();

const onChangeStatus = async (value: boolean, data: User) => {
    alertStore.loading = true;
    await userStore.updateUser({
        id: data.id,
        user_status: value,
    });
    alertStore.loading = false;
    tableStore.onFetchTable();
};

function formatDateOnly(dateString: string | undefined) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Data inválida"; 
  return date.toLocaleDateString();
}

const columns: (columnsType<User> | columnsType<User, boolean>)[] = [

    {
        field: "user_name",
        header: "Nome",
        style: "flex: 1",
    },

    {
        field: "email",
        header: "E-mail",
        style: "flex: 1",
    },

    {
        field: "department",
        header: "Departamento",
        render: (_value: any, data: { department: { department_name: any; }; }) => (
            <span>{data?.department?.department_name}</span>
        ),
    },

    {
        field: "position",
        header: "Cargo",
        render: (_v: any, data: { position: { position_name: any; }; }) => <span>{data?.position?.position_name}</span>,
    },

    {
        field: "created_at",
        header: "Data de Criação",
        style: "flex: 1",
        render: (_value: any, data: { created_at: string | undefined; }) => (
            <span>{ formatDateOnly(data?.created_at) }</span>
        ),
    },

    {
        field: "user_status",
        header: "Status",
        render: (value: boolean, data: User) => (
            <StatusComponent
                status={value}
                onChangeStatus={(status: boolean) => onChangeStatus(status, data)}
            />
        ),
    },

    {
        field: "actions",
        header: "",
        render: (_v: string, data?: User) => (
            <EditAndDeleteTableButton
                onEdit={() => onRowClick(data)}
                onClickDeleteButton={() =>
                    deleteStore.setDeleteFunction(() => onDelete(data))
                }
            />
        ),
    },
];

const modalData = ref<User | null>(null);
const openModal = ref(false);

const onRowClick = async (data?: User) => {
    if (!data) return; // Early return if data is undefined
    modalData.value = data;
    openModal.value = !openModal.value;
};

const onDelete = async (data?: User) => {
    if (!data) {
        console.error("No user data provided for deletion");
        return; // Early return to prevent calling deleteUser with undefined
    }
    alertStore.loading = true;
    await userStore.deleteUser(data); // Now data is guaranteed to be of type User
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const onOpenModal = () => {
    modalData.value = null;
    openModal.value = !openModal.value;
};

</script>

<template>
    <div>
        <ModalComponent
            :title="modalData ? 'Editar Usuário' : 'Cadastro de Usuários'"
            :open="openModal"
        >
            <PagesUsuarioCadastro :onCancel="onOpenModal" :data="modalData" />
        </ModalComponent>
        <NuxtLayout name="main">
            <main class="body-content">
                <TableComponent
                    title="Usuários"
                    addNewLabel="Cadastrar"
                    :columns="columns"
                    :onRowClick="onRowClick"
                    :onAddNew="onOpenModal"
                    apiUrl="admin/usuario/listar"
                />
                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>: any: { department: { department_name: any; }; }: any: { position: { position_name: any; }; }: any: { created_at: string | undefined; }