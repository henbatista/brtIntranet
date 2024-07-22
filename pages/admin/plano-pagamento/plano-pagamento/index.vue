<script lang="tsx" setup>
const columns = [
    {
        field: "payment_config_description",
        header: "Descrição",
        style: "flex:1",
    },
    {
        field: "payment_config_code_share",
        header: "Code Share",
    },

    {
        field: "payment_config_code_share_comments",
        header: "Comentários Code Share",
    },
    {
        field: "payment_config_expiration",
        header: "Dt. Expiração",
    },
    {
        field: "payment_config_offline",
        header: "Offline",
    },
    {
        field: "payment_config_tariff_breaks",
        header: "Tarifa",
    },
    {
        field: "payment_config_tariff_breaks_comments",
        header: "Comentários Tarifa",
    },
    {
        field: "payment_config_company_id",
        header: "Companhia Aérea",
    },
];

const modalData = ref();

const openModal = ref(false);

const onRowClick = async (data: any) => {
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
                    ? 'Plano de Pagamento Cartão'
                    : 'Cadastro de Planos de Pagamento'
            "
            :open="openModal"
        >
            <PlanoPagamentoCadastro :onCancel="onOpenModal" :data="modalData" />
        </ModalComponent>
        <NuxtLayout name="main">
            <main class="body-content">
                <TableComponent
                    title="Plano de Pagamento"
                    addNewLabel="Cadastrar"
                    :columns="columns"
                    :onRowClick="onRowClick"
                    :onAddNew="onOpenModal"
                    apiUrl="suporte/configuracao-parcelamento/listar"
                />

                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>
