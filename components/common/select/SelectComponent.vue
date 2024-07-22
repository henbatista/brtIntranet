<script setup lang="ts">
defineOptions({
    inheritAttrs: false,
});

defineEmits(["update"]);

export interface SelectType {
    value: number | string;
    label: string;
}

const props = defineProps<{
    label?: string;
    options: SelectType[];
    defaultSelected?: number | string;
    icon?: string;
    error?: string;
    required?: boolean;
}>();
</script>

<template>
    <div class="select-container" :class="props.label ? 'label-select' : ''">
        <label
            class="select-label"
            :class="props.required ? 'required-input-label' : ''"
            v-if="props.label"
        >
            {{ props.label }}</label
        >
        <select
            v-if="props.options"
            v-bind="$attrs"
            @input="$emit('update', ($event.target as HTMLInputElement).value)"
            class="select-input"
        >
            <option
                v-for="item in props.options"
                :key="item.value"
                :value="item.value"
                :selected="item.value === props.defaultSelected"
            >
                {{ item.label }}
            </option>
        </select>
        <p
            v-if="props.error"
            :class="props.error ? 'error-message' : 'hidden-prefix'"
        >
            {{ props.error }}
        </p>
    </div>
</template>

<style lang="scss" scoped>
.select-container {
    display: flex;
    border-radius: 6px;
    background-color: var(--white);
    border: 1px solid var(--grey-600);
    position: relative;

    &.label-select {
        padding-top: 20px;
        height: 50px;
    }
}

.select-label {
    width: 90%;
    position: absolute;
    top: 4px;
    left: 10px;
    font-size: 12px;
}

.select-input {
    width: 100%;
    padding: 2px 8px;
    border: 0;

    option {
        height: 40px;
    }
}

.hidden-prefix {
    display: none;
}
.error-input {
    border: solid #d12f24 1px;
    transition: 0.3s;
}

.error-message {
    color: #d12f24;
    font-size: 12px;
    transition: 0.3s;
}

.required-input-label {
    &::after {
        content: "*";
        color: #d12f24;
        display: inline-block;
        margin-left: 6px;
    }
}
</style>
