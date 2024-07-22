<script setup>
import { useAlertStore } from "@/stores/AlertStore";
import { Icon } from "@iconify/vue";

const alertStore = useAlertStore();
</script>
<template>
    <section class="loading-section" :class="{ active: alertStore.loading }">
        <div class="loading">
            <Icon icon="mdi:loading" color="white" />
        </div>
    </section>
</template>

<style scoped lang="scss">
@keyframes loadingAnimation {
    from {
        rotate: 0deg;
    }

    to {
        rotate: 360deg;
    }
}

.loading-section {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 999999999;
    backdrop-filter: blur(2px);
    pointer-events: none;
    opacity: 0;
    transition: all 0.4s ease;

    &.active {
        pointer-events: inherit;
        opacity: 1;
    }

    .loading {
        margin: auto;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 10px;
        padding: 20px;
        transition: all 0.4s ease;

        svg {
            width: 60px;
            height: 60px;
            animation: 0.8s loadingAnimation linear infinite;
        }
    }
}
</style>
