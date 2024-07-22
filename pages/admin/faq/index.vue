<script lang="tsx" setup>
import type { Faq } from "@/types/frontend";
import StatusComponent from "@/components/common/statusComponent/StatusComponent.vue";
import { useFaqStore } from "@/stores/FaqStore";
import { useTableStore } from "@/stores/TableStore";
import EditAndDeleteTableButton from "@/components/common/editAndDeleteTablebutton/EditAndDeleteTableButton.vue";
import { useAlertStore } from "@/stores/AlertStore";
import { useDeleteItemStore } from "@/stores/deleteItemStore";

const { onUpdateFaq } = useFaqStore();
const alertStore = useAlertStore();
const tableStore = useTableStore();
const deleteStore = useDeleteItemStore();
const openModal = ref(false);
const modalData = ref();

const columns = [
    {
        field: "faq_id",
        header: "ID",
        
    },
    {
        field: "department",
        header: "Departamento",
        style: "flex: 1",
        render: (value: any) => {
            return <span>{value?.department_name}</span>;
        },
    },
    {
        field: "faq_question",
        header: "E-Pergunta",
        style: "flex: 1",
        render: (value: any) => <div v-html={value}></div>,
    },
    {
        field: "faq_answer",
        header: "Resposta",
        style: "flex: 1",
        render: (value: any) => <div v-html={value}></div>,
    },
    {
        field: "created_at",
        header: "Data de Criação",
        style: "flex: 1",
        render: (_value: any, data: { created_at: string | undefined; }) => (
            <span>{ formatDateOnly(data?.created_at) }</span>
        )
    },
    {
        field: "faq_status",
        header: "Status",
        render: (value: boolean, data: Faq) => (
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
        render: (_v: string, data: Faq) => (
            <EditAndDeleteTableButton
                onEdit={() => onEdit(data)}
                onClickDeleteButton={() =>
                    deleteStore.setDeleteFunction(() => onDelete(data))
                }
            />
        ),
    },
];

function formatDateOnly(dateString: string | undefined) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Data inválida"; 
  return date.toLocaleDateString();
}

const onDelete = async (data: Faq) => {
    alertStore.loading = true;
    await deleteFaq(data);
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const onChangeStatus = async (value: boolean, data: Faq) => {
    alertStore.loading = true;
    await onUpdateFaq({
        faq_id: data.faq_id,
        faq_status: value,
    });
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const onEdit = async (data: Faq) => {
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
        <NuxtLayout name="main">
            <ModalComponent
                :title="modalData ? 'Editar FAQ' : 'Cadastro de FAQ'"
                :open="openModal"
            >
                <PagesFaqCadastro :onCancel="onOpenModal" :data="modalData" />
            </ModalComponent>
            <main class="body-content">
                <TableComponent
                    title="FAQ"
                    :columns="columns"
                    apiUrl="suporte/faq/listar"
                    addNewLabel="Cadastrar"
                    :onAddNew="onOpenModal"
                    :onRowClick="onEdit"
                />
                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>