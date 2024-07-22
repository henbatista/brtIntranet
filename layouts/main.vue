<script lang="ts" setup>
import { useModalStore } from "@/stores/ModalStore";
import { useToast } from "vue-toast-notification";
import { useAlertStore } from "@/stores/AlertStore";
const $toast = useToast();
const modalStore = useModalStore();
const alertStore = useAlertStore();

watch(
    () => alertStore.success,
    () => {
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
    <main id="page">
        <deleteModalComponent />
        <div class="sidebar">
            <LayoutSideBarHeader />
            <LayoutSideBar />
        </div>
        <slot />
        <PagesLoaderLoading />
        <!-- <PagesLoaderLoading v-if="alertStore.loading == true" /> -->
        <ModalsCadastro v-if="modalStore.getModalShow == true" />
        <!--  Ajustar CSSS para que o footer seja aqui <LayoutFooter /> -->
        <!-- <LayoutFooter /> -->
    </main>
</template>

<style scoped lang="scss">
#page {
    display: grid;
    grid-template-columns: 260px 1fr;
}
.sidebar {
    width: 100%;
    height: 100%;
    background: var(--white);
    transition: all 0.4s ease;
    border-right: 1px solid var(--grey-500);
    z-index: 999999;
}

@media (max-width: 991px) {
    .sidebar {
        width: 100%;
        min-height: 0;
    }
    .sidebar + .miolo {
        width: calc(100% - 00px);
        margin-left: 0px;
    }
}
</style>
