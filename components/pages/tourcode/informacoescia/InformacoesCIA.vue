<script setup lang="ts">
import { ref, watch } from 'vue';
import type { TInfoCompanhias } from "@/types/info-companhias";

const props = defineProps({
    company_id: {
        type: Number,
    },
});

const companyDetails = ref<Partial<TInfoCompanhias> | null>(null);
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
        const { data: { data } } = await getInfoCompanhia(`?search=${props.company_id}&field=air_company_info_company_id`);

        if (data?.length) {
            const filterData = (data as TInfoCompanhias[]).filter(
                (e) => Number(e.air_company_info_company_id) === Number(props.company_id)
            );

            if (filterData.length) {
                companyDetails.value = filterData[0];
            }
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
    <section class="info-companhia-section">
        <div class="company-details" v-if="companyDetails">
            <img :src="`${imageUrlPrefix}${companyDetails.company_logo}`" alt="Company Logo" class="company-logo" />
        </div>

        <div class="cards-container">
            <div class="card">
                <div class="company-header">
                    <h4>Politica de ADM</h4>
                </div>
                <div class="company-value">
                    <a target="_blank" :href="companyDetails?.air_company_info_administrative_policy || ''">
                        {{ companyDetails?.air_company_info_administrative_policy }}
                    </a>
                </div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>API (Advanced Passanger Information)</h4>
                </div>
                <div class="company-value" v-html="companyDetails?.air_company_info_advanced_passenger_information"></div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Dupla Forma de Pagamento em Emissões</h4>
                </div>
                <div class="company-value" v-html="companyDetails?.air_company_info_double_payment_way_to_issue"></div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>OFF LINE</h4>
                </div>
                <div class="company-value" v-html="companyDetails?.air_company_info_offline_operation"></div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Franquia de Bagagem</h4>
                </div>
                <div class="company-value" v-html="companyDetails?.air_company_info_bagagge_rules"></div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Menor Desacompanhado</h4>
                </div>
                <div class="company-value" v-html="companyDetails?.air_company_info_unaccompanied_minors"></div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Tarifa Volta ao Mundo</h4>
                </div>
                <div class="company-value" v-html="companyDetails?.air_company_info_round_world_fare"></div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Assento Premium Economy</h4>
                </div>
                <div class="company-value" v-html="companyDetails?.air_company_info_seat_premium_economy"></div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Acordo de Milhas</h4>
                </div>
                <div class="company-value" v-html="companyDetails?.air_company_info_cia_with_mileage_agreement"></div>
            </div>

            <div class="card">
                <div class="company-header">
                    <h4>Cartão de Milhas</h4>
                </div>
                <div class="company-value" v-html="companyDetails?.air_company_info_mileage_card"></div>
            </div>

                <div class="card col-span-5 mt-4">
                    <div class="company-header">
                        <h4>Atualizações</h4>
                    </div>
                    <div class="timeline">
                        <div class="timeline-item " v-for="(log, index) in JSON?.parse?.(companyDetails?.air_company_info_status || '[]')" :key="log.date" :class="{'timeline-item-right': index % 2 === 0, 'timeline-item-left': index % 2 !== 0}">
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
.info-companhia-section {
    .company-details {
        @apply flex flex-col items-center mb-4;
        .company-logo {
            @apply w-[120px] my-7;
        }
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

.info-companhia-section {
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

    .att-container {
        ul {
            @apply grid grid-cols-2 gap-3 p-3;
            li {
                @apply border shadow-md rounded-lg p-3 list-none;
                .log-container {
                    .log-header {
                        @apply flex justify-between items-center gap-3;
                        h5 {
                            @apply text-sm font-bold text-gray-800;
                        }
                        span {
                            @apply text-xs text-gray-800;
                        }
                    }
                    .body {
                        @apply grid grid-cols-2 mt-3;
                        .body-title {
                            @apply text-gray-800 mb-2;
                        }
                        .body-container {
                            @apply p-2 grid grid-rows-2;
                            .left-side {
                                @apply border-r ;
                            }
                            .old-value, .new-value {
                                @apply rounded;
                                p {
                                    @apply p-1 m-0;
                                }
                            }
                            .old-value {
                                @apply border border-red-400 text-red-400 p-1;
                            }
                            .new-value {
                                @apply border border-teal-700 text-teal-700 p-1;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
