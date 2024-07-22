<script setup lang="ts">
const props = defineProps({
    status: {
        type: Boolean,
        required: true,
    },
    onChangeStatus: {
        type: Function,
    },
});
</script>

<template>
    <div class="status-container">
        <CommonInputCheckBoxSwitch
            id="myTableSwitch"
            v-model="props.status"
            @update:model-value="props.onChangeStatus"
        />
    </div>
</template>

<style lang="scss" scoped></style>
