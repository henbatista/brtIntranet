<script lang="ts" setup>
import { ref } from "vue";
import type { Header, Item } from "vue3-easy-data-table";
import { usePagination } from "use-vue3-easy-data-table";
import { useAlertStore } from "@/stores/AlertStore";

const route = useRoute();
const alertStore = useAlertStore();
const runtimeConfig = useRuntimeConfig();
const imageUrlServer = runtimeConfig.public.imageUrlServer;

const props = defineProps({
    title: {
        type: String,
        default: "",
    },
    type: {
        type: String,
        default: "",
    },
    keyFieldName: {
        type: [String, Number],
        default: "",
        required: true,
    },
    headConfig: {
        type: Array as PropType<Header[]>,
        default: () => [],
        required: true,
    },
    tableData: {
        type: Object,
        default: () => ({}),
        required: true,
    },
    tablePagination: {
        type: Object,
        default: null,
        required: true,
    },
    toggleFieldName: {
        type: String,
        default: "",
        required: true,
    },
    imageUrl: {
        type: String,
        default: "",
    },
});

// DATA
const searchValue = ref("");
const searchField = ref("");
const rowsPerPageActiveOption = ref(10);
const isReadOnly = ref(true);
const rowsPerPageOptions = [10, 25, 50, 100];
const headers: Header[] = props.headConfig;
const items = ref<Item[]>(props.tableData.value);
const keyField = props.keyFieldName;
const pagination = usePagination(props.tablePagination.value);

const emits = defineEmits([
    "statusResourceChange",
    "resourceDelete",
    "searchByPage",
    "searchByValue",
    "searchPerPage",
    "editResource",
]);

watch(
    () => [
        props.tablePagination.to,
        props.tablePagination.from,
        props.tablePagination.total,
    ],
    ([newDataTableTo, newDataTableFrom, newDataTableTotal]) => {
        if (
            newDataTableTo != null &&
            newDataTableFrom != null &&
            newDataTableTotal != null
        ) {
            pagination.currentPageLastIndex = JSON.parse(
                JSON.stringify(newDataTableTo)
            );
            pagination.currentPageFirstIndex = JSON.parse(
                JSON.stringify(newDataTableFrom)
            );
            pagination.clientItemsLength = JSON.parse(
                JSON.stringify(newDataTableTotal)
            );
        } else {
            pagination.currentPageLastIndex = 0;
            pagination.currentPageFirstIndex = 0;
            pagination.clientItemsLength = 0;
        }
    },
    { immediate: true }
);

watch(
    () => props.tableData,
    (newDataTable) => {
        items.value = newDataTable;
    },
    { immediate: true }
);

watch(
    () => searchField.value,
    (newSearchField) => {
        if (newSearchField != "") {
            isReadOnly.value = false;
        }
    },
    { immediate: true }
);

watch(
    () => searchValue.value,
    (searchValue) => {
        if (searchValue === "") {
            emits(
                "searchByValue",
                "",
                1,
                rowsPerPageActiveOption.value,
                searchField.value
            );
        }
    },
    { immediate: true }
);

// COMPUTED
const maxPaginationNumber = computed(() => {
    if (props.tablePagination.last_page != null)
        return JSON.parse(JSON.stringify(props.tablePagination.last_page));
});
const currentPaginationNumber = computed(() => {
    if (props.tablePagination.current_page != null)
        return JSON.parse(JSON.stringify(props.tablePagination.current_page));
});

// METHODS
const updatePage = (paginationNumber: number) => {
    emits(
        "searchByPage",
        searchValue.value,
        paginationNumber,
        rowsPerPageActiveOption.value,
        searchField.value
    );
};

const nextPage = () => {
    const nextPageNumber = currentPaginationNumber.value + 1;
    if (nextPageNumber <= maxPaginationNumber.value) {
        updatePage(nextPageNumber);
    }
};

const prevPage = () => {
    const nextPageNumber = currentPaginationNumber.value - 1;
    if (nextPageNumber <= maxPaginationNumber.value) {
        updatePage(nextPageNumber);
    }
};

const searchValueFunction = () => {
    if (searchValue.value.length > 2) {
        emits(
            "searchByValue",
            searchValue.value,
            1,
            rowsPerPageActiveOption.value,
            searchField.value
        );
    }
};

const toggleAtivo = (val: Item) => {
    alertStore.loading = true;
    emits("statusResourceChange", val);
};

const deleteItem = (val: Item) => {
    alertStore.loading = true;
    emits("resourceDelete", val);
};

const editItem = (val: Item) => {
    const objectToEdit = JSON.parse(JSON.stringify(val));
    emits("editResource", objectToEdit);
};

const updateRowsPerPageSelect = () => {
    emits(
        "searchPerPage",
        searchValue.value,
        1,
        rowsPerPageActiveOption.value,
        searchField.value
    );
};
</script>
<template>
    <div class="row">
        <div class="col-12 col-sm-6 col-xl-4">
            Mostrar
            <select
                class="data-table-header"
                @change="updateRowsPerPageSelect()"
                v-model="rowsPerPageActiveOption"
            >
                <option
                    v-for="item in rowsPerPageOptions"
                    :key="item"
                    :selected="item === rowsPerPageActiveOption"
                    :value="item"
                >
                    {{ item }}
                </option>
            </select>
            registros
        </div>
        <div class="col-12 col-sm-6 col-xl-4">
            Campo:
            <select class="data-table-header" v-model="searchField">
                <option
                    v-for="item in headers"
                    :key="keyField"
                    :value="item.value"
                >
                    {{ item.text }}
                </option>
            </select>
        </div>
        <div class="col-12 col-sm-6 col-xl-4">
            Buscar:
            <input
                class="data-table-header"
                type="text"
                v-model="searchValue"
                :readonly="isReadOnly"
                @input="searchValueFunction"
            />
        </div>
        <div class="col-12 col-sm-12 col-xl-12">
            <EasyDataTable
                table-class-name="customize-table"
                :headers="headers"
                :items="items"
                hide-footer
            >
                <template #item-logo="item">
                    <img
                        class="logo"
                        :src="`${imageUrlServer}${item[props.imageUrl]}`"
                    />
                </template>
                <template #empty-message>
                    <p class="empty-table">A busca não retornou dados</p>
                </template>
                <template #item-editReserve="item">
                    <NuxtLink
                        v-if="route.path === '/agencia'"
                        class="img action"
                        @click.prevent="editItem(item)"
                    >
                        <img
                            src="/images/icons/svg-blue/regular/key.svg"
                            width="25"
                            height="30"
                        />
                    </NuxtLink>
                </template>
                <template #item-edit="item">
                    <img
                        @click="editItem(item)"
                        src="/images/icons/svg-blue/regular/edit.svg"
                        width="25"
                        height="30"
                    />
                </template>
                <template #item-delete="item">
                    <NuxtLink
                        class="img action"
                        @click.prevent="deleteItem(item)"
                    >
                        <img
                            src="/images/icons/svg-blue/regular/trash.svg"
                            width="25"
                            height="30"
                        />
                    </NuxtLink>
                </template>
                <template #item-toggle="item">
                    <label class="switch">
                        <input
                            type="checkbox"
                            v-model="item[props.toggleFieldName]"
                            @click="toggleAtivo(item)"
                        />
                        <span class="slider"></span>
                    </label>
                </template>
            </EasyDataTable>
        </div>
        <div class="col-md-6 col-sm-12">
            <div class="dataTables_info">
                Mostrando {{ pagination.currentPageFirstIndex }} até
                {{ pagination.currentPageLastIndex }} de
                {{ pagination.clientItemsLength }} registros
            </div>
        </div>
        <div class="col-md-6 col-sm-12">
            <div class="dataTables_paginate">
                <button @click="prevPage">&lt;</button>
                <div class="dataTables_paginate paging_simple_numbers">
                    <button
                        v-for="paginationNumber in maxPaginationNumber"
                        :class="{
                            'paginate_button current':
                                paginationNumber === currentPaginationNumber,
                        }"
                        @click="updatePage(paginationNumber)"
                    >
                        {{ paginationNumber }}
                    </button>
                    <button @click.="nextPage">></button>
                </div>
            </div>
        </div>
    </div>
</template>
