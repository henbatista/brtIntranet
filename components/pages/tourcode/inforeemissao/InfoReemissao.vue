<script setup lang="ts">
import { ref, watch } from 'vue';
import type { TReemissao } from "@/types/reemissao";

const props = defineProps({
    company_id: {
        type: Number,
    },
});

const infoReemissao = ref<Partial<TReemissao> | null>(null);
const imageUrlPrefix = "https://business.travelapi.com.br/storage/";
const openAccordions = ref<number[]>([]);

const toggleAccordion = (index: number) => {
    if (openAccordions.value.includes(index)) {
        openAccordions.value = openAccordions.value.filter(i => i !== index);
    } else {
        openAccordions.value.push(index);
    }
};

const isAccordionOpen = (index: number) => {
    return openAccordions.value.includes(index);
};

watch(
    props,
    async () => {
        const { data: { data } }: any = await getReemissao(`?search=${props.company_id}&field=info_reissuance_company_id`);

        if (data?.length) {
            infoReemissao.value = data[0];
        }
    },
    {
        immediate: true,
    }
);

function enter(el: HTMLElement) {
    el.style.maxHeight = '0';
    el.style.opacity = '0';
    requestAnimationFrame(() => {
        el.style.transition = 'all 0.3s ease';
        el.style.maxHeight = el.scrollHeight + 'px';
        el.style.opacity = '1';
    });
}

function leave(el: HTMLElement) {
    el.style.maxHeight = el.scrollHeight + 'px';
    el.style.opacity = '1';
    requestAnimationFrame(() => {
        el.style.transition = 'all 0.3s ease';
        el.style.maxHeight = '0';
        el.style.opacity = '0';
    });
}
</script>

<template>
    <section class="info-reemissao-section">
        <div class="company-details" v-if="infoReemissao">
            <img :src="`${imageUrlPrefix}${infoReemissao.company_logo}`" alt="Company Logo" class="company-logo" />
        </div>

        <div class="cards-container" v-if="infoReemissao">
            <div class="card">
                <div class="company-header">
                    <h4>Data de validade</h4>
                </div>
                <div class="company-value">{{ infoReemissao.info_reissuance_tax_valid_date }}</div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Aceita parcelas</h4>
                </div>
                <div class="company-value">{{ infoReemissao.info_reissuance_accept_installments }}</div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Companhia</h4>
                </div>
                <div class="company-value">{{ infoReemissao.info_reissuance_company_id }}</div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Taxa de Reemissão</h4>
                </div>
                <div class="company-value">{{ infoReemissao.info_reissuance_tax }}</div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Dupla forma de pagamento em emissões</h4>
                </div>
                <div class="company-value">{{ infoReemissao.air_company_info_double_payment_way_to_issue }}</div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Parcela</h4>
                </div>
                <div class="company-value">{{ infoReemissao.info_reissuance_portion }}</div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Comissão</h4>
                </div>
                <div class="company-value">{{ infoReemissao.info_reissuance_has_comission }}</div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Tour Code</h4>
                </div>
                <div class="company-value">{{ infoReemissao.info_reissuance_need_tour_code }}</div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Incentivo</h4>
                </div>
                <div class="company-value">{{ infoReemissao.info_reissuance_has_bonus }}</div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Tarifa volta ao mundo</h4>
                </div>
                <div class="company-value" v-html="infoReemissao.info_reissuance_comments"></div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Inteiramente disponível</h4>
                </div>
                <div class="company-value">{{ infoReemissao.info_reissuance_full_available }}</div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Parcialmente utilizados</h4>
                </div>
                <div class="company-value">{{ infoReemissao.info_reissuance_partially_used }}</div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Reemissão com downgrade</h4>
                </div>
                <div class="company-value">{{ infoReemissao.info_reissuance_accept_downgrade }}</div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>No show</h4>
                </div>
                <div class="company-value">{{ infoReemissao.info_reissuance_no_show }}</div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Devolve troco</h4>
                </div>
                <div class="company-value">{{ infoReemissao.info_reissuance_accept_refund }}</div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Como</h4>
                </div>
                <div class="company-value">{{ infoReemissao.info_reissuance_refund_type }}</div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>De que maneira</h4>
                </div>
                <div class="company-value">{{ infoReemissao.info_reissuance_refund_way }}</div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Cobra-se o valor</h4>
                </div>
                <div class="company-value">{{ infoReemissao.info_reissuance_fare_base_penalty_type }}</div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Regras</h4>
                </div>
                <div class="company-value">{{ infoReemissao.info_reissuance_rules }}</div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Observação</h4>
                </div>
                <div class="company-value">{{ infoReemissao.info_reissuance_observations }}</div>
            </div>

            <div class="card col-span-5 mt-4">
                <div class="company-header">
                    <h4>Atualizações</h4>
                </div>
                <div class="timeline">
                    <div class="timeline-item" v-for="(log, index) in JSON?.parse?.(infoReemissao.info_reissuance_status)" :key="log.date" :class="{'timeline-item-right': index % 2 === 0, 'timeline-item-left': index % 2 !== 0}">
                        <div class="timeline-content">
                            <div @click="toggleAccordion(index)" class="accordion-header cursor-pointer py-4 px-5 text-base text-gray-800 text-left bg-white border-0 transition focus:outline-none">
                                {{ log.date }}
                            </div>
                            <transition name="accordion" @enter="enter" @leave="leave">
                                <div v-show="isAccordionOpen(index)" class="accordion-body overflow-hidden py-4 px-5">
                                    <div class="timeline-title">{{ log.formatedField }}</div>
                                    <div class="timeline-body">
                                        <div class="timeline-subtitle">Antes</div>
                                        <div class="timeline-text old-value" v-html="log.old"></div>
                                        <div class="timeline-subtitle">Depois</div>
                                        <div class="timeline-text new-value" v-html="log.new"></div>
                                    </div>
                                </div>
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>


<style scoped>
.info-reemissao-section {
    .company-details {
        @apply flex flex-col items-center mb-4;
        .company-logo {
            @apply w-[120px] my-7;
        }
    }

    .cards-container {
        @apply grid grid-cols-4 md:grid-cols-6 lg:grid-cols-3 text-sm;
    }

    .card {
        @apply bg-white p-1   flex flex-col;
    }

    .company-header {
        @apply flex justify-center items-center p-2 bg-[#F5F7FA] w-full rounded-t-lg;
        h4 {
            @apply text-sm font-semibold text-gray-900;
        }
    }

    .company-value {
        @apply flex justify-center items-center p-2 text-gray-700 w-full;
    }

    .timeline {
        @apply relative mx-auto max-w-full pt-4;

        &:before {
            @apply absolute left-1/2 top-0 w-1 bg-[#F5F7FA] h-full transform -translate-x-1/2;
            content: '';
        }
    }

    .timeline-item {
        @apply relative w-full;

        &.timeline-item-right {
            @apply text-left flex justify-end;
            .timeline-content {
                @apply ml-[650px];
            }
        }

        &.timeline-item-left {
            @apply text-right flex justify-start;
            .timeline-content {
                @apply mr-[650px];
            }
        }

        &:before {
            @apply absolute left-1/2 top-8 w-4 h-4 bg-slate-200 border-2 border-slate-900 rounded-full transform -translate-x-1/2;
            content: '';
            z-index: 1;
        }
    }

    .timeline-item-right::after,
    .timeline-item-left::after {
        content: '';
        position: absolute;
        top: 39px; 
        height: 2px;
        background: #334155; 
        z-index: 0;
    }

    .timeline-item-right::after {
        left: 50%;
        width: calc(100% - 594px); 
    }

    .timeline-item-left::after {
        right: 50%;
        width: calc(50% - 235px); 
    }

    .timeline-content {
        @apply bg-white p-4 rounded-lg shadow-md border border-gray-200 max-w-lg;
        position: relative;
        z-index: 1;
    }

    .accordion-header {
        @apply cursor-pointer py-4 px-5 text-base text-gray-800 text-left bg-white border-0 transition focus:outline-none;
    }

    .accordion-body {
        @apply overflow-hidden;
    }

    .timeline-title {
        @apply text-lg font-bold text-gray-700;
    }

    .timeline-body {
        @apply mt-2;

        .timeline-subtitle {
            @apply text-sm font-semibold text-gray-600;
        }

        .timeline-text {
            @apply text-sm text-gray-800 p-2;

            &.old-value {
                @apply border  text-red-400 rounded mb-2;
            }

            &.new-value {
                @apply border  text-teal-700 rounded;
            }
        }
    }
}

.accordion-enter-active, .accordion-leave-active {
    transition: all 0.3s ease;
}
.accordion-enter-from, .accordion-leave-to {
    max-height: 0;
    opacity: 0;
}
.accordion-enter-to, .accordion-leave-from {
    max-height: 1000px;
    opacity: 1;
}

</style>
