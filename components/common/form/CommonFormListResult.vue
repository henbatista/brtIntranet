<script setup>
const props = defineProps({
    modelValue: {
        type: [String, Number, Object, Array],
        default: "",
    },
});
</script>
<template>
    <div class="content-list">
        <div class="content-list-item">
            <img
                class="content-list-icon"
                src="/images/icons/svg-blank/regular/key.svg"
                alt="icon"
            />
            <label class="contet-list-label">{{ modelValue }}</label>
        </div>
    </div>
</template>
