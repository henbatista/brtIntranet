<script setup lang="ts">
import { Icon } from "@iconify/vue";

const props = defineProps({
    title: {
        type: String,
    },
    to: {
        type: String,
    },
    addNewElement: Object,
    modalTitle: {
        type: String,
    },
});

const openModal = ref(false);

const onOpenModal = () => {
    openModal.value = !openModal.value;
};
</script>

<template>
    <div class="painel-card-container" v-bind="$attrs">
        <ModalComponent :title="props.modalTitle" :open="openModal">
            <component :is="props.addNewElement" />
        </ModalComponent>
        <div class="card-title">
            <NuxtLink
                :to="props?.to"
                class="card-link-title"
                :class="props.to ? 'hoverable-link' : ''"
            >
                <h5>{{ props.title }}</h5>
                <Icon
                    icon="fluent:arrow-enter-16-filled"
                    class="enter-arrow"
                    v-if="props.to"
                />
            </NuxtLink>

            <ButtonComponent
                variant="text"
                class="add-new-card-btn"
                @click="onOpenModal"
                v-if="props.addNewElement"
            >
                <Icon icon="ic:round-plus" />
            </ButtonComponent>
        </div>

        <div class="card-content">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped lang="scss">
.painel-card-container {
    border-radius: 5px;
    box-shadow: 0 2px 14px -9px rgba(0, 0, 0, 0.3);
    background-color: var(--white);
    padding: 1em;
}

.card-title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .card-link-title {
        width: fit-content;
        display: flex;
        gap: 0.3em;
        align-items: center;
        padding: 0.3em 0.4em;
        margin: -8px -8px;
        border: solid 1px transparent;
        cursor: pointer;

        &:hover {
            text-decoration: none;
        }

        &.hoverable-link:hover {
            border: solid 1px var(--grey-500);
            border-radius: 4px;

            .enter-arrow {
                opacity: 1;
            }
        }

        .enter-arrow {
            opacity: 0;
            transition: 0.4s;
        }

        h5 {
            font-size: 1.2em;
            font-weight: 800;
            color: var(--black) !important;
        }
    }

    .add-new-card-btn {
        color: var(--black) !important;
        border-color: var(--black);
        padding: 0.8em;
        border-radius: 99px;
    }
}

.card-content {
    margin-top: 0.6em;
}
</style>
