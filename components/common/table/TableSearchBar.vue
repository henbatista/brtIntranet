<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { columnsType } from "./TableComponent.vue";
import { useTableStore } from "@/stores/TableStore";
const router = useRoute();

interface selectType {
    value: number | string;
    label: string;
}

const tableStore = useTableStore();

const props = defineProps({
    table_columns: {
        type: Array,
        required: true,
    },

    isLoading: {
        type: Boolean,
    },
    onSearch: {
        type: Function,
        required: true,
    },
});

const selectDefaultvalue = ref("");

const loading = ref<boolean>(false);
const input = ref<string>("");
const options = ref<selectType[]>([]);
const selectedOption = ref<selectType>({
    label: "",
    value: "",
});

onMounted(() => {
    setTimeout(() => {
        const params = router.query;
        if (params.search) {
            input.value = params.search as string;
        }
    }, 500);
});

watch(
    () => props.table_columns,
    () => {
        if (props?.table_columns?.length) {
            const mapOptions = (props.table_columns as columnsType[])
                .filter((e) => {
                    if (typeof e.filterable === "boolean" && !e.filterable) {
                        return false;
                    }
                    return true;
                })
                .map((e) => ({
                    label: e.header,
                    value: e.field,
                }));

            options.value = mapOptions;

            selectedOption.value = mapOptions[0];
        }
    },
    {
        immediate: true,
    }
);

watch(input, () => (loading.value = true));

watch([tableStore], () => {
    const param = new URLSearchParams(tableStore.searchParam);

    const getField = param.get("field");

    if (getField) {
        selectDefaultvalue.value = getField;
    }
});

const handleSelectType = (value: string) => {
    const getOption = options.value.filter((e) => e.value === value);
    selectedOption.value = getOption[0];
};

watch(
    input,
    useDebounce(() => {
        props.onSearch({
            value: input.value,
            type: selectedOption.value.value,
        });
        loading.value = false;
    }, 800)
);
</script>

<template>
    <div class="searchbar-container shadow-sm">
        <SelectComponent
            :options="options"
            class="search-select"
            @update="handleSelectType"
            :default-selected="selectDefaultvalue"
        />
        <input
            class="input-searchbar"
            :placeholder="'Buscar por ' + selectedOption.label"
            v-model="input"
        />

        <Icon
            v-if="loading"
            icon="icon-park-outline:loading-four"
            class="w-[20px] h-[20px] text-[#9C9C9C] loading-icon mr-[5px]"
        />

        <Icon v-else icon="material-symbols-light:search" class="search-icon" />
    </div>
</template>

<style lang="scss">
.searchbar-container {
    border-radius: 5px;
    display: flex;
    align-items: center;
    background-color: var(--white);
    padding: 4px 5px;
    border: 0;
    flex: 1;

    .select-container {
        height: 28px !important;
        border: 0;
        border-radius: 5px;

        select {
            background-color: var(--blue-50);
            font-size: 13px;
            border-radius: 5px;
            padding: 4px 8px;
        }
    }

    .input-searchbar {
        height: 18px;
        flex: 1;
        border: 0;
        margin-left: 10px;
        font-size: 13px;
        font-weight: 600;
        outline: 0;

        &:focus {
            outline: 0;
            border-color: #f2f2f2;
            box-shadow: none;
        }
        &::placeholder {
            font-weight: 400;
        }
    }

    .search-icon {
        width: 25px;
        height: 25px;
        margin-right: 5px;
        color: var(--blue-900);
    }
}

@keyframes loadingIcon {
    to {
        rotate: 360deg;
    }
}

.loading-icon {
    rotate: 0deg;
    animation: 0.9s loadingIcon infinite linear;
}
</style>
