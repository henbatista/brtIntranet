<script lang="ts" setup>
defineProps({
    data: {
        type: Object,
        required: true,
    },
    onClick: {
        type: Function,
    },
});
</script>

<template>
    <button
        type="button"
        class="visit-card-container"
        @click="() => onClick?.(data)"
    >
        <div class="top-side">
            <h6>{{ data?.agency_name }}</h6>
            <span>{{ data?.agency_cnpj }}</span>
        </div>

        <div class="bottom-side">
            <span>{{ data?.agency_address }}</span>
            <span>{{ data?.agency_phone }}</span>
        </div>
    </button>
</template>

<style lang="scss" scoped>
.visit-card-container {
    width: 100%;
    padding: 12px 8px;
    display: grid;
    gap: 6px;
    background-color: #e1e4fe;
    transition: 0.3s;
    border: 0;
    border-radius: 12px;

    &:hover {
        background-color: var(--grey-400);
    }

    .top-side {
        display: flex;
        align-items: center;
        gap: 6px;

        h6 {
            font-size: 16px;
            color: var(--grey-800);
        }
        span {
            font-size: 14px;
            color: var(--grey-700);
        }
    }
    .bottom-side {
        display: flex;
        gap: 6px;

        span {
            font-size: 13px;
            &:nth-child(1) {
                color: var(--grey-800);
            }
            &:nth-child(2) {
                font-size: 12px;
                color: var(--grey-700);
            }
        }
    }
}
</style>
