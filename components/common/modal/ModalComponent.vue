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

provide("closeModal", handleOpenChange);
</script>

<template>
    <div
        class="modal-overlay"
        :class="closingModal ? 'close-modal' : ''"
        v-if="modalOpen"
        @mousedown="closeModal"
    >
        <section class="modal-content" ref="modalRef">
            <section class="relative w-full bg-white">
                <div class="absolute bottom-0 left-0 w-full bg-[#F3F5FD] h-1/2"></div>
                <div class="relative px-12 py-3 mx-auto max-w-7xl ">
                    <div class="relative flex flex-col items-center w-full h-full shadow-md px-4 py-3 bg-[#202D3B] sm:px-4 md:px-4 lg:py-4 rounded-md">
                        <div class="relative flex flex-col items-center justify-between w-full h-full lg:flex-row">
                            <h5 class="text-base font-semibold text-center text-white md:leading-tight lg:mb-0 lg:text-left md:text-2xl sm:text-xl">{{ props.title }}</h5>
                            <div class="absolute -left-28 sm:-right-[57rem]  transform scale-50 hover:scale-75 transition">
                                <div class="wrapper">
                                    <button type="button" @click="handleOpenChange" class="close-button">
                                        <div class="in">
                                            <div class="close-button-block"></div>
                                            <div class="close-button-block"></div>
                                        </div>
                                        <div class="out">
                                            <div class="close-button-block"></div>
                                            <div class="close-button-block"></div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div class="h-full px-2 py-2 sm:px-12 sm:py-4">
                <slot></slot>
            </div>
        </section>
    </div>
</template>



<style lang="scss" scoped>
.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-button {
    display: block;
    width: 40px;
    height: 40px;
    position: relative;
    overflow: hidden;
    transition: background 280ms ease-out;

    &:hover,
    &:focus {
        border-radius: 3px;
    }

    > div {
        position: relative;
    }

    &-block {
        width: 40px;
        height: 20px;
        position: relative;
        overflow: hidden;

        &:before,
        &:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: calc(55% - 4px);
            display: block;
            width: 4px;
            height: 25px;
            transform-origin: bottom center;
            background: white;
            transition: all ease-out 280ms;
        }

        &:last-of-type {
            transform: rotate(180deg);
        }
    }

    .in {
        .close-button-block {
            &:before {
                transition-delay: 280ms;
                transform: translateX(20px) translateY(-20px) rotate(45deg);
            }

            &:after {
                transition-delay: 280ms;
                transform: translateX(-22px) translateY(-22px) rotate(-45deg);
            }
        }
    }

    .out {
        position: absolute;
        top: 0;
        left: 0;

        .close-button-block {
            &:before {
                transform: translateX(-5px) translateY(5px) rotate(45deg);
            }

            &:after {
                transform: translateX(5px) translateY(5px) rotate(-45deg);
            }
        }
    }

    &:hover {
        .in {
            .close-button-block {
                &:before {
                    transform: translateX(-5px) translateY(5px) rotate(45deg);
                }

                &:after {
                    transform: translateX(5px) translateY(5px) rotate(-45deg);
                }
            }
        }

        .out {
            .close-button-block {
                &:before {
                    transform: translateX(-20px) translateY(20px) rotate(45deg);
                }

                &:after {
                    transform: translateX(20px) translateY(20px) rotate(-45deg);
                }
            }
        }
    }
}

@keyframes fadeInModal {
    0% {
        transform: rotateY(180deg);
    }

    100% {
        transform: rotateY(0deg);
    }
}

@keyframes fadeOutModal {
    0% {
        transform: rotateY(0deg);
    }

    100% {
        transform: rotateY(-180deg);
    }
}

.modal-overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.3);
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    z-index: 999999999;
}

.modal-content {
    width: 50vw;
    height: 100%;
    background: var(--white);
    box-shadow: 0 4px 15px -5px rgba(0, 0, 0, 0.37),
        0 6px 25px -10px rgba(0, 0, 0, 0.2);
    transform-origin: right;
    animation: 0.5s fadeInModal forwards ease-out;
}

.modal-title {
    display: flex;
    padding: 10px 10px;
    background-color: #f5f7fa;
    border-bottom: 1px solid var(--grey-500);
    align-items: center;
    gap: 100px;
    justify-content: space-between;

    h5 {
        color: var(--grey-800);
        font-size: 18px;
        font-weight: 900;
    }

    .modal-close-button {
        background-color: var(--grey-800);
        padding: 6px 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--white);
        font-size: 18px;
        border-radius: 7px;
        border: 1px solid var(--grey-500);
    }
}

.modal-body {
    
}

.close-modal {
    .modal-content {
        transform-origin: right;
        animation: 0.5s fadeOutModal forwards ease-out;
    }
}
</style>
