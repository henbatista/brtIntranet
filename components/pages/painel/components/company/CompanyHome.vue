<script setup lang="ts">
import { useCompanyStore } from "@/stores/CompanyStore";

const { getCompanies } = useCompanyStore();

const dataSource = ref([]);

onBeforeMount(async () => {
    const data = await getCompanies("", 1, 5, "");

    dataSource.value = data;
});

const props = defineProps({
    title: {
        type: String,
    },
    to: {
        type: String,
    },
    addNewElement: Element,
    modalTitle: {
        type: String,
    },
});

const companyColumns = [
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
];

const openModal = ref(false);

const onOpenModal = () => {
    openModal.value = !openModal.value;
};
</script>

<template>
    <div class="company-card-content">
        <TableComponent
            title="Companhias"
            :columns="companyColumns"
            :dataSource="dataSource"
            addNewLabel="Cadastrar"
            :onAddNew="onOpenModal"
        />
    </div>
</template>

<style lang="scss">
.company-card-content {
    margin-top: 12px;
    .table-header,
    .table-data-footter {
        display: none;
    }

    #table-data {
        box-shadow: none;
        tbody {
            height: 150px;
            box-shadow: 0;
        }

        tr {
            height: 30px;
        }
    }
}
</style>
