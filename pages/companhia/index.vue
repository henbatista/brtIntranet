<script setup lang="tsx">
import CompanhiaTable from "@/components/pages/companhia/CompanhiaTable.vue";
import InfoCompanhiaTable from "@/components/pages/info-companhia/InfoCompanhiaTable.vue";
import PaymentPlanTable from "@/components/pages/admin/plano-pagamento/plano-pagamento/PaymentPlanTable.vue";
import InfoReemissaoTable from "@/components/pages/admin/plano-pagamento/reemissao/InfoReemissaoTable.vue";

const tabOptions = [
    {
        label: "Companhias",
        value: "company",
        component: () => <CompanhiaTable />,
    },
    {
        label: "Info Companhia",
        value: "info-company",
        component: () => <InfoCompanhiaTable />,
    },
    {
        label: "Plano de Pagamento",
        value: "payment_plan",
        component: () => <PaymentPlanTable />,
    },
    {
        label: "Info Reemissão",
        value: "info_reemissao",
        component: () => <InfoReemissaoTable />,
    },
];
</script>

<template>
    <div>
        <NuxtLayout name="main">
            <main class="body-content">
                <TabComponent :options="tabOptions" />
            </main>
        </NuxtLayout>
    </div>
</template>
