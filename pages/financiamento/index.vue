<script lang="tsx" setup>
import type { columnsType } from "@/components/common/table/TableComponent.vue";
import StatusComponent from "@/components/common/statusComponent/StatusComponent.vue";
import type { TFinance } from "@/types/finance";

import EditAndDeleteTableButton from "@/components/common/editAndDeleteTablebutton/EditAndDeleteTableButton.vue";
import { useTableStore } from "@/stores/TableStore";
import { useAlertStore } from "@/stores/AlertStore";
import { useDeleteItemStore } from "@/stores/deleteItemStore";
import ButtonComponent from "@/components/common/button/ButtonComponent.vue";

const deleteStore = useDeleteItemStore();
const alertStore = useAlertStore();
const tableStore = useTableStore();

const onDelete = async (data: TFinance) => {
    alertStore.loading = true;
    await deleteFinance(data);
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const onChangeStatus = async (value: boolean, data: TFinance) => {
    alertStore.loading = true;
    await updateFinance({
        ...data,
        finance_status: value,
    });
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const columns: columnsType<any>[] = [
    {
        field: "finance_type",
        header: "Tipo",
    },
    {
        field: "company",
        header: "Companhia Aérea",
        style: "flex: 1",
        render: (value: any) => <p>{value?.company_name}</p>,
    },

    {
        field: "finance_description",
        header: "Descrição",
    },

    {
        field: "finance_status",
        header: "Status",
        render: (value: boolean, data: TFinance) => (
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
        render: (_v: string, data: TFinance) => (
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
const route = useRouter();

const onOpenFinancialPage = () => {
    const origin = window.location.origin;

    window.open(`${origin}/brt-financiamentos`, "_blank")?.focus();
};

const tableAdditionalButton = ref(
    <ButtonComponent variant="secondary" onClick={onOpenFinancialPage}>
        Abrir Página de financiamentos
    </ButtonComponent>
);

const onRowClick = async (data: TFinance) => {
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
                modalData ? 'Editar Financiamento' : 'Cadastro de Financiamento'
            "
            :open="openModal"
        >
            <PagesFinanciamentoCadastro
                :onCancel="onOpenModal"
                :data="modalData"
            />
        </ModalComponent>
        <NuxtLayout name="main">
            <main class="body-content">
                <TableComponent
                    title="Financiamento"
                    addNewLabel="Cadastrar"
                    :columns="columns"
                    :onRowClick="onRowClick"
                    :onAddNew="onOpenModal"
                    apiUrl="suporte/financiamento/listar"
                    :headerComponent="tableAdditionalButton"
                />

                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>
