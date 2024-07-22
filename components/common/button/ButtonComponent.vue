<script setup lang="ts">
type buttonVariant = "primary" | "secondary" | "error" | "success" | "text";

const props = defineProps({
    variant: {
        type: String,
        default: "primary",
    },
    onClick: {
        type: Function,
    },
});
</script>

<template>
    <button
        type="button"
        class="button-component transform transition scale-95 hover:scale-100  duration-300 ease-in-out "
        :data-variant="props.variant"
        @click="props.onClick"
        v-bind="$attrs"
    >
        <slot></slot>
    </button>
</template>

<style lang="scss" scoped>
.button-component {
    border: 0;
    border-radius: 3px;
    padding: 6px 30px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-size: 13px;

    &[data-variant="primary"] {
        background-color: var(--blue-800);
        color: var(--white);

        &:hover {
            background-color: var(--blue-600);
        }
    }
    &[data-variant="error"] {
        border: solid 1px;
        background-color: transparent;
        color: var(--error-900);

        &:hover {
            background-color: var(--error-900);
            color: var(--white);
        }
    }
    &[data-variant="text"] {
        border: solid 1px var(--grey-500);
        background-color: transparent;
        color: var(--grey-800);

        &:hover {
            background-color: var(--grey-500);
        }
    }
}
</style>
