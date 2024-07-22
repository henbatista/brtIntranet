<script lang="tsx" setup>
import type { ObjectResponse } from "@/types/frontend";
import StatusComponent from "@/components/common/statusComponent/StatusComponent.vue";
import { formatDate } from "@/hooks/formatDate";

const columns = [
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
        render: (value: string) => (
            <span>{formatDate(value, "dd/MM/yyyy")}</span>
        ),
    },
    {
        field: "info_reissuance_status",
        header: "Status",
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
            :title="modalData ? 'Reemissão' : 'Cadastro de Reemissão'"
            :open="openModal"
        >
            <PageReemissaoCadastro :onCancel="onOpenModal" :data="modalData" />
        </ModalComponent>
        <TableComponent
            title="Reemissão"
            addNewLabel="Cadastrar"
            :columns="columns"
            :onRowClick="onRowClick"
            :onAddNew="onOpenModal"
            apiUrl="suporte/inforeemissao/listar"
        />
    </div>
</template>
