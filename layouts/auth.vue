<script lang="ts" setup>
import { useModalStore } from "@/stores/ModalStore";
import { useToast } from "vue-toast-notification";
import { useAlertStore } from "@/stores/AlertStore";
const $toast = useToast();
const modalStore = useModalStore();
const alertStore = useAlertStore();

watch(
    () => alertStore.success,
    (successNew) => {
        if (alertStore.success && alertStore.message !== "") {
            $toast.open({
                message: alertStore.message,
                type: "success",
                position: "top-right",
            });
            alertStore.$reset();
        }
        if (!alertStore.success && alertStore.message !== "") {
            $toast.open({
                message: alertStore.message,
                type: "error",
                position: "top-right",
            });
            alertStore.$reset();
        }
    }
);
</script>

<template>
    <div class="login-screen">
        <slot />
        <PagesLoaderLoading v-if="alertStore.loading == true" />
        <ModalsCadastro v-if="modalStore.getModalShow == true" />
    </div>
</template>

<style scoped lang="scss">
.login-screen {
    height: 100%;
    background-color: var(--grey-400);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
