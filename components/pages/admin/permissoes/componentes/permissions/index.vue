<script lang="tsx" setup>
import type { ObjectResponse } from "@/types/frontend";
import type { columnsType } from "components/common/table/TableComponent.vue";


function formatDateOnly(dateString: string | undefined) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Data inválida"; 
  return date.toLocaleDateString();
}

const columns: (columnsType<Permissions> | columnsType<Permissions, boolean>)[] = [
    {
        field: "name",
        header: "Nome",
        style: "flex: 1",
    },
    
    {
        field: "description",
        header: "Descrição",
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
        field: "guard_name",
        header: "Guard Name",
        style: "flex: 1",

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
            :title="modalData ? 'Editar Permissão' : 'Cadastro de Permissões'"
            :open="openModal"
        >
            <PagesPermissaoCadastro :onCancel="onOpenModal" :data="modalData" />
        </ModalComponent>
        <TableComponent
            title=""
            addNewLabel="Cadastrar"
            :columns="columns"
            :onRowClick="onRowClick"
            :onAddNew="onOpenModal"
            apiUrl="admin/permissao/listar"
        />
    </div>
</template>
