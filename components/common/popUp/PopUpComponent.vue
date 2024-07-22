<script setup lang="ts">
import { Icon } from "@iconify/vue";

const props = defineProps({
    title: {
        type: String,
    },
    open: {
        type: Boolean,
    },
});

const modalOpen = ref(false);
const closingModal = ref(false);
const modalRef = ref();

const handleOpenChange = () => {
    if (modalOpen.value) {
        closingModal.value = !closingModal.value;
        setTimeout(() => {
            modalOpen.value = !modalOpen.value;
        }, 200);
    } else {
        closingModal.value = false;
        modalOpen.value = !modalOpen.value;
    }
};

const closeModal = (event: MouseEvent) => {
    const targetElement = event.target as Element;

    if (targetElement?.className === "modal-overlay") {
        handleOpenChange();
    }
};

watch(
    () => props.open,
    () => {
        handleOpenChange();
    }
);
</script>

<template>
    <div
        class="modal-overlay"
        :class="closingModal ? 'close-modal' : ''"
        v-if="modalOpen"
        @mousedown="closeModal"
    >
        <section class="modal-content" ref="modalRef">
            <div class="modal-title">
                <h5>{{ props.title }}</h5>

                <button
                    type="button"
                    class="modal-close-button"
                    @click="handleOpenChange"
                >
                    <Icon icon="ion:close" />
                </button>
            </div>

            <div class="modal-body">
                <slot></slot>
            </div>
        </section>
    </div>
</template>

<style lang="scss" scoped>
@keyframes fadeInModal {
    0% {
        transform: scale(0);
    }

    100% {
        transform: scale(1);
    }
}
@keyframes fadeOutModal {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    100% {
        transform: scale(0);
        opacity: 0;
    }
}

.modal-overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(3px);
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999999;
}

.modal-content {
    min-width: 200px;
    padding: 0px 20px;
    background: var(--white);
    box-shadow: 0 4px 15px -5px rgba(0, 0, 0, 0.37),
        0 6px 25px -10px rgba(0, 0, 0, 0.2);
    animation: 0.3s fadeInModal forwards ease-out;
    border-radius: 20px;
}

.modal-title {
    display: flex;
    padding: 10px 0px;
    border-bottom: 1px solid var(--grey-500);
    align-items: center;
    gap: 100px;
    justify-content: space-between;

    h5 {
        color: var(--grey-800);
        font-size: 16px;
        font-weight: 900;
    }

    .modal-close-button {
        background-color: var(--white);
        padding: 6px 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--grey-800);
        font-size: 18px;
        border-radius: 7px;
        border: 1px solid var(--grey-500);
    }
}

.modal-body {
    padding: 20px 10px 10px;
}

.close-modal {
    .modal-content {
        animation: 0.2s fadeOutModal forwards ease-out;
    }
}
</style>
