<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { tableSort } from "~/types/table";

const props = defineProps({
    header: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    },
    render: {
        type: Function,
    },
    tableData: {
        type: Array,
    },
    sortable: {
        type: Boolean,
        default: true,
    },
    onSort: {
        type: Function,
    },
    sort: {
        type: Object,
    },
});

const handleSort = () => {
    if (!props.sortable) return;

    const order = props?.sort?.order as tableSort["order"];

    const sortOptions = {
        asc: "desc" as "desc",
        desc: null,
    };

    if (!order) {
        props.onSort?.({
            ...props.data,
            order: "asc",
        });
    } else {
        props.onSort?.({
            ...props.data,
            order: sortOptions[order],
        });
    }
};
</script>

<template>
    <button type="button" @click="handleSort" class="table-header-button">
        <component v-if="render" :is="render(tableData)" />
        <span v-else>
            {{ header }}
        </span>

        <Icon
            v-if="props?.sort && (props?.sort as tableSort)?.order !== null"
            icon="uil:angle-up"
            class="icon-animation"
            :style="
          (props?.sort as tableSort)?.order === 'asc'
            ? 'rotate: 0deg'
            : 'rotate: 180deg'
        "
        />
    </button>
</template>

<style lang="scss">
@keyframes fadeIn {
    to {
        opacity: 1;
        scale: 1;
    }
}
.icon-animation {
    font-size: 19px;
    animation: 0.1s fadeIn linear forwards;
    scale: 0.6;
    transition: 0.3s;
}

.table-header-button {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 2px 12px;
    background-color: transparent;
    border: 0;

    span {
        max-width: 95%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
