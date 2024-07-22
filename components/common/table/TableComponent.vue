<script setup lang="ts">
import { usePermissions } from "@/hooks/usePermission";
import { computed, ref, watch, onMounted } from "vue";
import { useTableStore } from "~/stores/TableStore";

export interface columnsType<T extends object = {}> {
    header: string;
    field: string;
    render?: (value: string | boolean, data?: T) => JSX.Element | void;
    renderHeader?: (data?: T[]) => void;
    style?: any;
    filterable?: Boolean;
    sortable?: Boolean;
    type?: "text" | "number" | "date";
}

export type tableSort = columnsType & { order: "asc" | "desc" | null };
export type tableSearch = columnsType & { value: string };

const tableStore = useTableStore();
const router = useRoute();

const props = defineProps({
    title: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    sortBy: {
        type: String,
        default: 'date',
    },
    src: {
        type: String,
        required: true,
    },
    height: {
        type: String,
    },
    headerComponent: {
        type: Object,
    },
    columns: {
        type: Array,
    },
    dataSource: {
        type: Array,
        default: [],
    },
    onRowClick: {
        type: Function,
    },
    onEdit: {
        type: Function,
    },
    onDelete: {
        type: Function,
    },
    addNewLabel: {
        type: String,
    },
    onAddNew: {
        type: Function,
    },
    defaultSort: {
        type: Object,
    },
    onChangePage: {
        type: Function,
    },
    onChangePageSize: {
        type: Function,
    },
    onSearch: {
        type: Function,
    },
    apiUrl: {
        type: String,
    },
    hasSearchBar: {
        type: Boolean,
        default: true,
    },
    hasHeader: {
        type: Boolean,
        default: true,
    },
    hasPagination: {
        type: Boolean,
        default: true,
    },
    tableHeading: {
        type: Object,
    },
});

const defaultHeight = ref(props.height || "555px");

const permissions = ref({
    edit: false,
    create: false,
});

const sort = ref<tableSort>((props?.defaultSort as tableSort) || null);
const filteredTable = ref<Array<any>>([]);

watch(
    () => props.apiUrl,
    () => {
        tableStore.resetTable();
        if (props.apiUrl) {
            const params = router.query;
            tableStore.apiUrl = props.apiUrl;

            if (Object.keys(params)?.length) {
                tableStore.buildSearchParams(params);
            } else {
                tableStore.buildSearchParams({ page: 1, per_page: 10 });
            }
        }
    },
    { immediate: true }
);

onMounted(() => {
    const permissionname = router.name;

    const { canAccess: canEdit } = usePermissions(
        `edit ${permissionname as string}`
    );
    const { canAccess: canCreate } = usePermissions(
        `create ${permissionname as string}`
    );

    permissions.value = {
        edit: canEdit,
        create: canCreate,
    };
});

const tableData = computed(() => {
    if (props.apiUrl) return [];
    if (!props?.dataSource?.length) return [];
    let data = props.dataSource;

    if (filteredTable.value.length) {
        data = filteredTable.value;
    }

    // Ordenar os dados de acordo com o critério de ordenação selecionado
    if (props.sortBy === 'date') {
        data = data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (props.sortBy === 'alphabetical' && sort.value?.field) {
        data = data.sort((a: any, b: any) => a[sort.value.field].localeCompare(b[sort.value.field]));
    }

    tableStore.dataSource = data
        ?.sort((a: any, b: any) => {
            if (!sort.value?.order) return 0;

            if (sort.value.order === "asc" && a[sort.value.field] > b[sort.value.field]) {
                return 1;
            }
            return -1;
        })
        .slice((tableStore.page - 1) * tableStore.resultsPerPage, tableStore.resultsPerPage * tableStore.page);

    return tableStore.dataSource;
});

const handleSort = (data: any) => {
    sort.value = data.order;
};
const handleChangePage = (value: number) => {
    if (props.apiUrl) {
        tableStore.buildSearchParams({ page: value });
    }

    if (props.onChangePage) {
        props.onChangePage({
            page: value,
        });
    }
    tableStore.page = value;
};
const handleChangePageSize = (value: number) => {
    if (tableStore.apiUrl) {
        tableStore.buildSearchParams({ per_page: value });
        tableStore.resultsPerPage = value;
    }
    if (props.onChangePageSize) {
        props.onChangePageSize({
            per_page: value,
        });
    }
};

const handleSearch = (data: tableSearch) => {
    if (props.apiUrl) {
        tableStore.buildSearchParams({ search: data.value, field: data.type });
        handleChangePage(1);
        return;
    }

    if (props.onSearch) {
        props.onSearch(data);
        return;
    }

    if (!data.value) filteredTable.value = [];

    if (props.dataSource) {
        const filterTable = props.dataSource.filter((f: any) => {
            return f[data.field]
                .toLowerCase()
                .includes(data.value.toLocaleLowerCase());
        });

        filteredTable.value = filterTable;
    }
};

</script>

<template>
    <div>
        <div class="table-header flex items-center justify-between" v-if="props.hasHeader">
            <div class="flex items-center">
                <div class="icon-container">
                    <img
                        :src="src"
                        alt="Ícone de envio"
                        class="icon-image"
                    />
                </div>
                <div class="text-container">
                    <h1 v-if="props.title" class="title">{{ props.title }}</h1>
                    <p class="description">
                        {{ props.description }}
                    </p>
                </div>
            </div>

            <TableSearchBar
                :table_columns="props.columns as columnsType[]"
                :onSearch="handleSearch"
                v-if="props.hasSearchBar"
            />

            <div class="right-side flex items-center gap-2">
                <component
                    v-if="props.headerComponent"
                    :is="props.headerComponent"
                />

                <ButtonComponent
                    v-if="props.onAddNew && permissions.create"
                    @click="props.onAddNew"
                >
                    {{ props.addNewLabel }}
                </ButtonComponent>
            </div>
        </div>

        <section v-if="tableHeading" class="table-heading">
            <component :is="props.tableHeading" />
        </section>

        <table id="table-data" class="shadow-md">
            <div
                class="loading-table-icon-container"
                v-if="tableStore.isLoading"
            >
                <div class="loading">
                    <div class="effect-1 effects"></div>
                    <div class="effect-2 effects"></div>
                    <div class="effect-3 effects"></div>
                </div>
            </div>
            <thead>
                <tr>
                    <th
                        v-for="(item, index) in props.columns as columnsType[]"
                        :key="index"
                        :style="item?.style"
                    >
                        <TableHeaderColumn
                            :render="item.renderHeader"
                            :tableData="tableData"
                            :header="item.header"
                            :onSort="handleSort"
                            :sort="sort?.field === item.field ? (sort as any) : null"
                            :data="item"
                        />
                    </th>
                </tr>
            </thead>
            <tbody>
                <div
                    v-if="
                        !tableStore.dataSource?.length && !tableStore.isLoading
                    "
                    class="empty-table"
                >
                    <p>Nenhum dado encontrado!</p>

                    <ButtonComponent
                        variant="text"
                        @click="() => tableStore.onFetchTable()"
                    >
                        Refresh
                    </ButtonComponent>
                </div>

                <tr
                    v-for="data_item in tableStore.dataSource"
                    :key="data_item"
                    v-else
                >
                    <td
                        v-for="(header) in props.columns as columnsType[]"
                        :key="data_item?.[header.field]"
                        :style="header?.style"
                    >
                        <button
                            type="button"
                            @dblclick="
                                () => {
                                    if (permissions.edit) {
                                        onRowClick?.(data_item);
                                    }
                                }
                            "
                            class="body-button-item"
                        >
                            <component
                                v-if="header?.render"
                                :is="
                                    header.render(
                                        data_item?.[header.field],
                                        data_item
                                    )
                                "
                            />
                            <span v-else> {{ data_item?.[header.field] }}</span>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <PaginationComponent
            :total_results="
                tableStore?.apiMeta?.total || props?.dataSource?.length
            "
            :results="tableStore?.apiMeta?.to || dataSource?.length"
            v-if="props.hasPagination"
            :page="tableStore.page"
            :tableSize="tableStore.resultsPerPage"
            @onChangePage="handleChangePage"
            @onChangePageSize="handleChangePageSize"
        />
 

    </div>
</template>

<style lang="scss">
.table-header {
    padding: 26px 30px;
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;

    .right-side {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    h4 {
        font-size: 27px;
        font-weight: 900;
        color: var(--blue-700);
    }
}

#table-data {
    overflow-x: auto;
    display: grid;
    border-radius: 5px;
    border: solid 1px var(--grey-500);
    margin-bottom: 20px;
    background-color: white;
    position: relative;
    z-index: 0;

    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    &::-webkit-scrollbar-thumb {
        width: 8px;
        height: 8px;
        background-color: rgb(189, 193, 202);
        border-radius: 99px;
    }

    .empty-table {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    thead {
        th {
            text-align: left;
            background-color: #F5F7FA;
            color:#002347;
            font-size: 14px;

        }
    }

    tbody {
        height: v-bind(defaultHeight);
        overflow-y: auto;
        &::-webkit-scrollbar {
            width: 8px;
            height: 8px;
            
        }

        &::-webkit-scrollbar-thumb {
            width: 8px;
            height: 8px;
            background-color: rgb(189, 193, 202);
            border-radius: 99px;
        }

        tr {
            & + tr {
                border-top: solid 1px var(--grey-600);

            }
            &:nth-last-child(1) {
                border-bottom: solid 1px var(--grey-600);
            }

            &:hover {
                background-color: rgb(242, 242, 242);
            }

            .body-button-item {
                width: 100%;
                height: 100%;
                gap: 6px;
                padding: 2px 12px;
                background-color: transparent;
                border: 0;
                text-align: left;
                font-size: 13px;

            }
        }
    }

    tr {
        display: flex;
        align-items: center;
        height: 45px;
        transition: 0.3s;
    }

    th,
    td {
        width: 150px;
        height: 100%;
        user-select: text;
        color:#002347;


        span,
        button {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
}

@keyframes loading {
    to {
        rotate: 360deg;
    }
}

.loading-table-icon-container {
    font-size: 50px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(1px);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;

    .loading {
        position: absolute;
        left: calc(50% - 35px);
        top: 40%;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        border: 3px solid transparent;
    }

    .loading .effect-1,
    .loading .effect-2 {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 3px solid transparent;
        border-left: 3px solid #0f172a;
        border-radius: 50%;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }

    .loading .effect-1 {
        animation: rotate 1s ease infinite;
    }

    .loading .effect-2 {
        animation: rotateOpacity 1s ease infinite 0.1s;
    }

    .loading .effect-3 {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 3px solid transparent;
        border-left: 3px solid #0f172a;
        -webkit-animation: rotateOpacity 1s ease infinite 0.2s;
        animation: rotateOpacity 1s ease infinite 0.2s;
        border-radius: 50%;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }

    .loading .effects {
        transition: all 0.3s ease;
    }

    @keyframes rotate {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }

        100% {
            -webkit-transform: rotate(1turn);
            transform: rotate(1turn);
        }
    }

    @keyframes rotateOpacity {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
            opacity: 0.1;
        }

        100% {
            -webkit-transform: rotate(1turn);
            transform: rotate(1turn);
            opacity: 1;
        }
    }

    svg {
        animation: 0.8s loading linear infinite;
    }
}

.container {
    @apply flex items-center sm:flex-auto mb-10;
  }
  .icon-container {
    @apply flex items-center;
  }
  .icon-image {
    @apply w-10 h-10 mr-2 mix-blend-darken;
  }
  .text-container {}
  .title {
    @apply text-2xl font-semibold text-slate-900 mt-2;
  }
  .description {
    @apply text-[13px] text-gray-700;
  }
</style>
