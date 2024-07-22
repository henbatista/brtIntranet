<script setup lang="tsx">
import { useEfacilStore } from "@/stores/EfacilStore";
import type { Company } from "@/types/frontend";
import ButtonComponent from "@/components/common/button/ButtonComponent.vue";
import StatusComponent from "@/components/common/statusComponent/StatusComponent.vue";

import EditAndDeleteTableButton from "@/components/common/editAndDeleteTablebutton/EditAndDeleteTableButton.vue";
import { useCompanyStore } from "@/stores/CompanyStore";
import { useTableStore } from "@/stores/TableStore";
import { useAlertStore } from "@/stores/AlertStore";
import { useDeleteItemStore } from "@/stores/deleteItemStore";

const efacilStore = useEfacilStore();
const companyStore = useCompanyStore();

const deleteStore = useDeleteItemStore();
const alertStore = useAlertStore();
const tableStore = useTableStore();

const modalData = ref();

const onDelete = async (data: Company) => {
    alertStore.loading = true;
    await companyStore.deleteCompany(data);
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const onChangeStatus = async (value: boolean, data: Company) => {
    alertStore.loading = true;
    await companyStore.updateCompany({ ...data, company_status: value });
    alertStore.loading = false;
    tableStore.onFetchTable();
};

const companyColumns = [
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
        field: "company_email",
        header: "E-mail",
    },
    {
        field: "company_phones",
        header: "Telefone",
    },
    {
        field: "company_iata_code",
        header: "IATA",
    },
    {
        field: "company_iata_number",
        header: "Codigo",
    },
    {
        field: "company_status",
        header: "Status",
        render: (value: boolean, data: Company) => (
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
        render: (_v: string, data: Company) => (
            <EditAndDeleteTableButton
                onEdit={() => editCompany(data)}
                onClickDeleteButton={() =>
                    deleteStore.setDeleteFunction(() => onDelete(data))
                }
            />
        ),
    },
];

const openModal = ref(false);

const editCompany = async (data: Company) => {
    modalData.value = data;
    openModal.value = !openModal.value;
};

const updateCompaniesEfacil = async () => {
    alertStore.loading = true;
    await efacilStore.getCompaniesEfacil();
    await tableStore.onFetchTable();
};

const attButton = ref<any>(
    <ButtonComponent variant="text" onClick={updateCompaniesEfacil}>
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
            :title="modalData ? 'Editar Companhia' : 'Cadastro de Companhias'"
            :open="openModal"
        >
            <PagesCompanhiaCadastro :onCancel="onOpenModal" :data="modalData" />
        </ModalComponent>

        <TableComponent
            title="Companhias"
            :columns="companyColumns"
            apiUrl="suporte/companhia/listar"
            addNewLabel="Cadastrar"
            :onAddNew="onOpenModal"
            :onRowClick="editCompany"
            :headerComponent="attButton"
        />
    </div>
</template>
