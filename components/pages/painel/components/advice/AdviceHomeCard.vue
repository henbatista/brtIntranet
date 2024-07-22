<script lang="ts" setup>
import { formatDate } from "@/hooks/formatDate";

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
        class="faq-card-container"
        @click="() => onClick?.(data)"
    >
        <div className="title">
            <h6>
                {{ data.advice_title }}
            </h6>

            <span>
                {{ formatDate(data.advice_start_date, "dd/MM/yyyy") }}
            </span>
        </div>

        <p>{{ data.advice_description }}</p>
    </button>
</template>

<style lang="scss" scoped>
.faq-card-container {
    width: 100%;
    padding: 12px 8px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    background-color: transparent;
    transition: 0.3s;
    border: 0;
    border-radius: 2px;
    &:hover {
        background-color: var(--grey-400);
    }

    .title {
        display: flex;
        align-items: center;
        gap: 30px;

        h6 {
            font-size: 16px;
            text-align: left;
            color: var(--grey-800);
        }
        span {
            font-size: 14px;
            text-align: left;
            color: var(--grey-700);
        }
    }

    p {
        margin: 4px 0;
        font-size: 12px;
        text-align: left;
        color: var(--grey-700);
    }
}
</style>
