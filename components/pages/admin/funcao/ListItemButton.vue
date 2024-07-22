<script setup lang="ts">
const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
    onSelect: {
        type: Function,
        required: true,
    },
    selected: {
        type: Boolean,
    },
});

const selectButton = ref(props.selected || false);

const handleClick = () => {
    selectButton.value = !selectButton.value;
    props.onSelect(props.data);
};
</script>

<template>
    <ButtonComponent
        variant="text"
        class="custom-accordeon-item"
        :data-selected="selectButton"
        @click="handleClick"
    >
        {{ props.data.name }}
    </ButtonComponent>
</template>

<style scoped lang="scss">
.custom-accordeon-item {
    width: 100%;
    height: 40px;
    display: flex;
    gap: 6px;
    align-items: center;
    justify-content: flex-start;
    padding: 10px 15px 10px 13px;
    font-size: 14px;
    font-weight: 500;
    color: var(--grey-900);
    text-decoration: none;
    transition: all 0.4s ease;
    border-radius: 0;
    border-width: 0 0 1px !important;

    &:hover {
        background: var(--grey-600);
        border-radius: 6px;
    }

    &[data-selected="true"] {
        border: solid var(--blue-700);
        border-radius: 0px;
        border-width: 0 0 0 2px !important;
        font-weight: 800;
    }
}
</style>
