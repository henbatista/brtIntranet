<script setup>
const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: "",
    },

    success: {
        type: Boolean,
        default: false,
    },

    error: {
        type: String,
    },

    label: {
        type: String,
        default: "",
    },

    isRequired: {
        type: Boolean,
        default: false,
    },

    errorMessage: {
        type: String,
        default: "",
    },

    clearable: {
        type: Boolean,
        default: true,
    },
    
    mask: {
        type: String,
        default: "",
    },
});

defineOptions({
    inheritAttrs: false,
});

const emit = defineEmits(["update:modelValue"]);

</script>

<template>
    <div class="input-container" :class="error ? 'error-container' : ''">
        <input
            :value="modelValue"
            v-maska
            :data-maska="props.mask"
            v-bind="$attrs"
            :placeholder="$attrs.placeholder || ''"
            :isRequired="isRequired"
            @input="$emit('update:modelValue', $event.target.value)"
            autocomplete="off" 
        />
        <label>
            {{ label }}
        </label>
        <span class="error-message" v-if="error">erro: {{ error }}</span>

    </div>

</template>

<style scoped lang="scss">

.input-container {
    width: 100%;
    display: block;
    height: 40px;
    border: 1px solid #dadada;
    border-radius: 3px;
    position: relative;

    &.error-container {
        border-color: var(--error-900);
        color: var(--error-900);
        margin-top: 10px;

    }

    .error-message {
        color: var(--error-900);
        position: absolute;
        pointer-events: none;
        font-size: 12px;
        left: 0;
        margin-top: 30px
    }

    label {
        position: absolute;
        pointer-events: none;
        top: 0;
        left: 0;
        padding-left: 16px;
        height: 40px;
        line-height: 40px;
        opacity: 0.5;
        font-size: 13px;

        transition: all 0.4s ease;
    }

    input {
        width: 100%;
        height: 38px;
        padding: 13px 0 0 16px;
        background: var(--white);
        border: 0;
        transition: all 0.4s ease;
        outline: 0;
        font-size: 15px;


        &:focus + label,

        &:not(:placeholder-shown) + label {
            font-size: 9px;
            line-height: 20px;
            opacity: 1;

            
        }

        &:disabled {
            background: var(--grey-400);

        }
    }
}
</style>
