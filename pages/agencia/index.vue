<script lang="tsx" setup>
import type { Agency } from "@/types/frontend";
import type { columnsType } from "@/components/common/table/TableComponent.vue";
import ButtonComponent from "@/components/common/button/ButtonComponent.vue";
import StatusComponent from "@/components/common/statusComponent/StatusComponent.vue";

import EditAndDeleteTableButton from "@/components/common/editAndDeleteTablebutton/EditAndDeleteTableButton.vue";
import { useTableStore } from "@/stores/TableStore";
import { useAlertStore } from "@/stores/AlertStore";
import { useDeleteItemStore } from "@/stores/deleteItemStore";
import { useAgencyStore } from "@/stores/AgencyStore";

const deleteStore = useDeleteItemStore();
const alertStore = useAlertStore();
const tableStore = useTableStore();

const agencyStore = useAgencyStore();

const onDelete = async (data: Agency) => {
    alertStore.loading = true;
    await deleteAgency(data);
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const onChangeStatus = async (value: boolean, data: Agency) => {
    alertStore.loading = true;
    await agencyStore.updateBranch({
        ...data,
        agency_status: value,
    });
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const columns: columnsType<Agency>[] = [
    {
        field: "agency_name",
        header: "Nome Fantasia",
        style: "flex: 1",
    },
    {
        field: "agency_main_name",
        header: "Nome",
    },

    {
        field: "agency_address",
        header: "Endereço",
    },
    {
        field: "agency_phone",
        header: "Telefone",
    },
    {
        field: "agency_cnpj",
        header: "CNPJ",
    },
    {
        field: "agency_special_billing",
        header: "Pagamento Especial",
        render: (value: boolean) => <StatusComponent status={value} />,
    },

    {
        field: "agency_status",
        header: "Status",
        render: (value: boolean, data: Agency) => (
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
        render: (_v: string, data: Agency) => (
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

const onRowClick = async (data: Agency) => {
    modalData.value = data;
    openModal.value = !openModal.value;
};

const onUpdateAgency = () => {
    console.log("");
};

const attButton = ref<any>(
    <ButtonComponent variant="text" onClick={onUpdateAgency}>
        Atualizar
    </ButtonComponent>
);

const onOpenModal = () => {
    modalData.value = null;
    openModal.value = !openModal.value;
};
</script>
<template>
    <div>
        <ModalComponent
            :title="modalData ? 'Editar Agência' : 'Cadastro de Agências'"
            :open="openModal"
        >
            <PagesAgenciaCadastro :onCancel="onOpenModal" :data="modalData" />
        </ModalComponent>
        <NuxtLayout name="main">
            <main class="body-content">
                <TableComponent
                    title="Agências"
                    addNewLabel="Cadastrar"
                    :columns="columns"
                    :onRowClick="onRowClick"
                    :headerComponent="attButton"
                    :onAddNew="onOpenModal"
                    apiUrl="suporte/agencia/listar"
                />

                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>
