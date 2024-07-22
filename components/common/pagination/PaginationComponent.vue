<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import { useTableStore } from "~/stores/TableStore";

const tableStore = useTableStore();

const emits = defineEmits(["onChangePage", "onChangePageSize"]);

const props = defineProps({
    results: {
        type: Number,
    },

    total_results: {
        type: Number,
        required: true,
    },
});

const currentPage = ref<number>(tableStore.apiMeta?.current_page || 1);

const resultsPerPage = ref<number>(Number(tableStore.apiMeta?.per_page) || 15);

const initialPagesButtons = ref<number[]>([]);
const lastPagesButtons = ref<number[]>([]);
const totalPages = ref<number>(0);

watch(
    () => tableStore.apiMeta,
    () => {
        if (tableStore?.apiMeta) {
            const { current_page = 1, per_page = 15 } = tableStore.apiMeta;
            currentPage.value = current_page as number;
            resultsPerPage.value = per_page as number;
        }
    }
);

watch(
    () => props.total_results,
    () => {
        totalPages.value = Math.ceil(
            (props.total_results || 0) / resultsPerPage.value
        );
    },
    {
        immediate: true,
    }
);

const paginationButtonsArray = computed(() => {
    const pagesArray = Array.from(Array(totalPages.value).keys());

    if (currentPage.value >= 5 && currentPage.value < totalPages.value - 3) {
        return pagesArray.slice(currentPage.value - 2, currentPage.value + 1);
    }
    if (currentPage.value >= totalPages.value - 3 && totalPages.value > 5) {
        return pagesArray.slice(totalPages.value - 5, totalPages.value);
    }
    return pagesArray.slice(0, 5);
});

watch(
    [currentPage, totalPages, resultsPerPage],
    () => {
        const allPagesArray = Array.from(Array(totalPages?.value || 1).keys());
        const pagesArray = Array.from(Array(3).keys());

        if (totalPages.value >= 8) {
            if (currentPage.value >= totalPages.value - 3) {
                lastPagesButtons.value = [];
            } else {
                lastPagesButtons.value = allPagesArray.slice(
                    totalPages.value - 3,
                    totalPages.value
                );
            }
        } else {
            lastPagesButtons.value = [];
        }

        if (currentPage.value >= 5 && totalPages.value > 8) {
            initialPagesButtons.value = pagesArray;
        } else {
            initialPagesButtons.value = [];
        }
    },
    {
        immediate: true,
    }
);

const selectOptions = [
    {
        label: "10",
        value: 10,
    },
    {
        label: "15",
        value: 15,
    },

    {
        label: "20",
        value: 20,
    },

    {
        label: "50",
        value: 50,
    },
    {
        label: "100",
        value: 100,
    },
    {
        label: "Todos",
        value: props.total_results,
    },
];

const changePage = (num: number) => {
    emits("onChangePage", num);
    currentPage.value = num;
};

const changePageSize = (num: number) => {
    emits("onChangePageSize", num);
    resultsPerPage.value = num;
};
</script>

<template>
    <div>
        <section class="table-data-footter">
            <div class="table-page-number">
                <span> Mostrando </span>

                <span> {{ results }} / {{ total_results }} </span>
            </div>

            <div class="pagination-footter">
                <div class="page-selection">
                    <button
                        type="button"
                        class="pag-arrow"
                        :class="currentPage === 1 ? 'disabled-button' : ''"
                        @click="() => changePage(tableStore.page - 1)"
                    >
                        <Icon icon="uim:angle-left" />
                    </button>
                    <button
                        v-if="initialPagesButtons?.length"
                        v-for="(item, index) in initialPagesButtons"
                        :key="index"
                        @click="() => changePage(item + 1)"
                        class="pag-buttons"
                        :class="item === currentPage - 1 ? 'active-page ' : ''"
                    >
                        {{ item + 1 }}
                    </button>
                    <span v-if="initialPagesButtons?.length">...</span>
                    <button
                        v-for="(item, index) in paginationButtonsArray.slice(
                            0,
                            5
                        )"
                        :key="index"
                        @click="() => changePage(item + 1)"
                        class="pag-buttons"
                        :class="
                            item === currentPage - 1
                                ? 'active-page bg-slate-900'
                                : ''
                        "
                    >
                        {{ item + 1 }}
                    </button>
                    <span v-if="lastPagesButtons?.length">...</span>

                    <button
                        v-if="lastPagesButtons?.length"
                        v-for="(item, index) in lastPagesButtons"
                        :key="index"
                        @click="() => changePage(item + 1)"
                        class="pag-buttons"
                        :class="
                            item === currentPage - 1
                                ? 'active-page bg-slate-900'
                                : ''
                        "
                    >
                        {{ item + 1 }}
                    </button>

                    <button
                        type="button"
                        class="pag-arrow pag-arrow-right"
                        :class="
                            currentPage === totalPages ? 'disabled-button' : ''
                        "
                        @click="() => changePage(tableStore.page + 1)"
                    >
                        <Icon icon="uim:angle-left" />
                    </button>
                </div>
                <SelectComponent
                    :options="selectOptions"
                    :defaultSelected="resultsPerPage"
                    class="table-select-page-amount"
                    @update="(data: number) => changePageSize(data)"
                />
            </div>
        </section>
    </div>
</template>

<style lang="scss">
.table-select-page-amount {
    min-width: 85px;
    height: 30px;
    border-radius: 4px;
    background-color: var(--white);
    color: var(--grey-800);
    border-radius: 10px;

    option {
        padding: 8px 12px;
    }
}

.table-data-footter {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.page-selection {
    display: flex;
    align-items: center;
    gap: 12px;

    button {
        color: var(--grey-800);
        font-size: 18px;
        transition: 0.3s;
        border-radius: 3px;
        font-weight: 400;
        cursor: pointer;

        &.active-page {
            color: white;
            background-color: var(--blue-800);
        }

        &:hover {
            color: white;
            background-color: var(--blue-800);
        }
    }

    .disabled-button {
        background-color: white;
        opacity: 0.3;
        cursor: not-allowed;
        pointer-events: none;
    }

    .pag-buttons,
    .pag-arrow {
        padding: 4px 14px;
        background-color: var(--white);
        border: solid 1px var(--grey-500);
    }
    .pag-arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px 10px;
    }

    .pag-arrow-right {
        rotate: 180deg;
    }
}

.pagination-footter {
    display: flex;
    align-items: center;
    gap: 12px;
}
</style>
