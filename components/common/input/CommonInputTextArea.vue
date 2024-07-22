<script setup>
const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    },
    value: {
        type: String,
        default: "",
    },
    label: {
        type: String,
        default: "",
    },
    id: {
        type: String,
        default: "",
    },
    placeholder: {
        type: String,
        default: "",
    },
    rows: {
        type: Number,
        default: 5,
    },
    divClass: {
        type: String,
        default: "",
    },
});
const inputId = `input_${Math.floor(Math.random() * 1000000)}`;
</script>

<template>
    <div class="text-area-container">
        <label :for="id">
            {{ label }}
        </label>
        <textarea
            :id="inputId"
            :value="modelValue"
            v-bind="$attrs"
            class="form-control"
            :rows="rows"
            :placeholder="placeholder"
            @input="$emit('update:modelValue', $event.target.value)"
        ></textarea>
    </div>
</template>

<style lang="scss" scoped>
.text-area-container {
    width: 100%;
    min-height: 90px;
    display: block;
    border: 1px solid #dadada;
    border-radius: 8px;
    position: relative;
    overflow: hidden;

    label {
        height: 50px;
        font-size: 12px;
        line-height: 25px;
        opacity: 1;
        position: absolute;
        pointer-events: none;
        top: 0;
        left: 0;
        padding-left: 16px;
    }

    textarea {
        width: 100%;
        height: inherit;
        font-family: inherit;
        padding-top: 25px;
        padding-left: 16px;
        background: transparent;
        border: 0;
        resize: vertical;
        transition: all 0.4s ease;
        outline: 0;
    }
}
</style>
