<script setup lang="ts">
import type { TPaymentPlan } from "@/types/paymentPlan";
import { ref, watch } from "vue";

const props = defineProps({
    company_id: {
        type: Number,
        required: true,
    },
});

interface companyList {
    header: string;
    value: any;
}

const companyHeader = {
    payment_config_description: "Descrição",
    payment_config_expiration: "Expira em:",
    payment_config_offline: "Offline",
    payment_config_code_share: "CodeShare",
    payment_config_code_share_comments: "CodeShare Comentários",
    payment_config_tariff_breaks: "Tarifa",
    payment_config_tariff_breaks_comments: "Tarifa Comentários",
    payment_config_minimum_installment: "Mínimo de Parcelas",
    payment_config_installment_allows_multiple_payments: "Multiplos Pgto.",
    credit_cards: "Cartão de Crédito",
};

const columns = [
    {
        field: "installment_number",
        header: "Número da parcela",
        style: "flex: 1",
    },
    {
        field: "installment_coefficient",
        header: "Coeficiente de parcela",
        style: "flex: 1",
    },
    {
        field: "installment_code",
        header: "Código da parcela",
        style: "flex: 1",
    },
    {
        field: "installment_fee",
        header: "Taxa da parcela",
        style: "flex: 1",
    },
];

const paymentPlanList = ref<companyList[]>([]);
const imageUrlPrefix = "https://business.travelapi.com.br/storage/";

watch(
    props,
    async () => {
        const data: TPaymentPlan[] = await getPaymentPlans(props.company_id);

        if (data?.length) {
            const filterData = data.filter(
                (e) =>
                    Number(e.payment_config_company_id) ===
                    Number(props.company_id)
            );

            if (filterData.length) {
                filterData.forEach(plan => {
                    const headers: Partial<TPaymentPlan> = { ...plan };

                    delete headers.payment_config_id;
                    delete headers.created_at;
                    delete headers.updated_at;
                    delete headers.payment_config_company_id;
                    delete headers.payments_info;

                    Object.keys(headers).forEach(key => {
                        paymentPlanList.value.push({
                            header: companyHeader[key] || key,
                            value: headers[key as keyof TPaymentPlan],
                        });
                    });

                    // Adicione os dados de payments_info à lista
                    plan.payments_info.forEach(info => {

                        // Cartões de crédito
                        if (Array.isArray(info.credit_cards)) {
                            paymentPlanList.value.push({
                                header: companyHeader?.credit_cards,
                                value: info.credit_cards.map(card => ({
                                    ...card,
                                    credit_card_logo: imageUrlPrefix + card.credit_card_logo,
                                    acceptedSystems: card.acceptedSystems.map(system => ({
                                        ...system,
                                        system_logo: imageUrlPrefix + system.system_logo
                                    }))
                                }))
                            });
                        }

                        // Parcelas
                        if (Array.isArray(info.installments)) {
                            paymentPlanList.value.push({
                                header: 'Parcelas',
                                value: info.installments
                            });
                        }
                    });
                });
            }
        }
    },
    {
        immediate: true,
    }
);



</script>

<template>
    <section class="plano-pagamento-section">
        <div class="cards-container">
            <div
                v-if="paymentPlanList?.length > 0"
                v-for="item in paymentPlanList"
                :key="item.header"
                class="card"
                :class="{
                    'col-span-5 gap-3 mt-5': item.header === 'Cartão de Crédito',
                    'col-span-2 ': item.header !== 'Cartão de Crédito' && item.header !== 'Parcelas',
                    'col-span-5 gap-2 pl-3 mt-5': item.header === 'Parcelas'
                }"
            >
                <div
                    class="company-header "
                    :class="item.header === 'Cartão de Crédito' ? 'credit-card-header' : ''"
                >
                    <h4>{{ item.header }}</h4>
                </div>

                <section
                    v-if="item.header === 'Cartão de Crédito'"
                    class="credit-card-section"
                >
                    <div
                        v-for="card in item?.value"
                        :key="card.credit_card_id"
                        class="card-container"
                    >
                        <section class="card-header">
                            <img :src="card.credit_card_logo" :alt="card.credit_card_name" class="card-logo"/>
                        </section>

                        <section class="system-section card-inner-sections">
                            <ul class="systems-list">
                                <li v-for="system in card.acceptedSystems" :key="system.system_id" class="system-item">
                                    <img :src="system.system_logo" :alt="system.system_name" class="system-logo"/>
                                </li>
                            </ul>
                        </section>
                    </div>
                </section>

                <section
                    v-if="item.header === 'Parcelas'"
                    class="installment-section card-inner-sections"
                >
                    <InstallmentTable
                        :dataSource="item.value"
                        :columns="columns"
                        class="text-xs mt-2"
                    />
                </section>
                <div v-else class="company-value " v-html="item.value"></div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.plano-pagamento-section {
    /* Adicione estilos para a seção principal, se necessário */
}

.header {
    @apply flex items-center justify-center mb-4;
}

.cards-container {
    @apply grid grid-cols-1 md:grid-cols-1 lg:grid-cols-10 gap-y-3 text-sm;
}

.card {
    @apply bg-white;
    & + .card {
        /* Adicione margens ou espaçamento entre os cartões, se necessário */
    }
}

.company-header {
    @apply flex justify-center items-center p-2 bg-[#F5F7FA] border-slate-900;
    h4 {
        @apply text-sm font-semibold text-[#202D3B];
    }
}

.credit-card-header {
    @apply bg-[#F5F7FA];
}

.company-value {
    @apply flex justify-center items-center p-2 text-gray-700;
}

.credit-card-section {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-1;
}

.card-container {
    @apply flex flex-col items-center border m-1 rounded-lg shadow-md p-2 bg-white;

    .card-header {
        @apply flex flex-col items-center mb-2;
    }

    .card-inner-sections {
        @apply w-full;
    }

    .system-section {
        @apply border border-gray-300 rounded-lg p-2 bg-gray-100;

        .systems-list {
            @apply flex flex-wrap justify-center -ml-[20px] gap-2;
        }

        .system-item {
            @apply flex flex-col items-center gap-2;

            & + .system-item {
                @apply mt-1;
            }
        }
    }

    .installment-section {
        @apply mt-2;
    }
}

.card-logo {
    @apply w-20 h-20 object-contain;
}

.system-logo {
    @apply w-12 h-12 object-contain;
}
</style>
