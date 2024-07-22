<script setup>
import { useModalStore } from "@/stores/ModalStore";

const modalStore = useModalStore();

const closeModal = (event) => {
    const modal = document.querySelector(".modal-section");
    if (event.target === modal) {
        store.commit("modal/SET_SHOW", false);
    }
};
const modalStateReset = (event) => {
    modalStore.$patch((state) => {
        state.modalShow = false;
    });
};

onMounted(() => {
    document.addEventListener("click", closeModal);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", closeModal);
});
</script>
<template>
    <section
        class="modal-section"
        :class="{ active: modalStore.getModalShow || alertStore.loading }"
    >
        <div
            class="modal"
            :class="{ active: modalStore.getModalShow || alertStore.loading }"
        >
            <div class="head">
                <img src="/images/edit.svg" alt="icone de fechar modal" />
                <h2>
                    {{ modalStore.getModalTitle }}
                </h2>
                <div>
                    <button class="close" @click.prevent="modalStateReset()">
                        <img
                            src="/images/edit.svg"
                            alt="icone de fechar modal"
                        />
                    </button>
                </div>
            </div>
            <div class="body">
                <PagesCargoCadastro
                    v-if="
                        modalStore.getModalType == 'cargo' &&
                        modalStore.getModalShow == true
                    "
                />
            </div>
        </div>
    </section>
</template>

<style></style>
