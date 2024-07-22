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
        <h6>{{ data?.faq_question }}</h6>
        <span>{{ data?.faq_answer }}</span>
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
    background-color: #f5d7ff;
    transition: 0.3s;
    border: 0;
    border-radius: 12px;

    &:hover {
        background-color: var(--grey-400);
    }
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
</style>
