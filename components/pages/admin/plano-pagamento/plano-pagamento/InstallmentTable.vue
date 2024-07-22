<script setup lang="ts">
import { useTableStore } from "~/stores/TableStore";

export interface columnsType<T extends object = {}> {
    header: string;
    field: string;
    render?: (value: string, data?: T) => void;
    renderHeader?: (data?: T[]) => void;
    style?: any;
    filterable?: Boolean;
    sortable?: Boolean;
    type?: "text" | "number" | "date";
}

export type tableSort = columnsType & { order: "asc" | "desc" | null };
export type tableSearch = columnsType & { value: string };

const tableStore = useTableStore();

const props = defineProps({
    title: {
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
});
</script>

<template>
    <div>
        <table id="table-data-installment">
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
                            :tableData="props.dataSource"
                            :header="item.header"
                            :data="item"
                        />
                    </th>
                </tr>
            </thead>
            <tbody>
                <div
                    v-if="!props.dataSource?.length && !tableStore.isLoading"
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
                    v-for="data_item in (props.dataSource as any)"
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
                            @dblclick="() => onRowClick?.(data_item)"
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
                            <span v-else> {{ data_item?.[header.field] }} </span>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss">
.table-header {
    margin: -30px -30px 0px -30px;
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

#table-data-installment {
    overflow-x: auto;
    display: grid;
    border-radius: 12px;
    border: solid 1px var(--grey-500);
    box-shadow: 4px 0 15px -3px rgba(0, 0, 0, 0.1);
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
        border-bottom: solid 1px rgb(232, 232, 232);

        th {
            text-align: left;
            background-color: var(--grey-400);
        }
    }

    tbody {
        height: 200px;
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
</style>
