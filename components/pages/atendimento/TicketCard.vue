<script setup lang="ts">
import { Icon } from "@iconify/vue";

const props = defineProps({
    onRemove: {
        type: Function,
    },
    index: {
        type: Number,
    },
});

const removeAnim = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const handleRemove = () => {
    removeAnim.value = true;
    setTimeout(() => props?.onRemove?.(), 500);
};

watch([containerRef], () => {
    if (containerRef?.value) {
        containerRef.value.scrollIntoView({
            behavior: "smooth",
            inline: "end",
        });
    }
});
</script>

<template>
    <div
        class="ticket-card"
        :class="removeAnim ? 'remove-ticket' : ''"
        ref="containerRef"
    >
        <p class="ticket-title">
            Passagem {{ index?.toString().padStart(2, "0") }}
        </p>
        <ButtonComponent
            @click="handleRemove"
            variant="text"
            style="padding: 10px; justify-self: flex-end"
        >
            <Icon icon="mingcute:close-fill" />
        </ButtonComponent>
        <CommonInputWrapInput
            label="Reserva/Loc"
            div-class="wrap-input"
            type="text"
        />
        <CommonInputWrapInput
            label="Bilhete"
            div-class="wrap-input"
            type="text"
        />
        <CommonInputWrapInput
            label="Tarifa"
            div-class="wrap-input"
            type="text"
        />
        <CommonInputWrapInput
            label="Taxa de Embarque"
            div-class="wrap-input"
            type="text"
        />
        <CommonInputWrapInput
            label="Taxa de Serviço"
            div-class="wrap-input"
            type="text"
        />
        <CommonInputWrapInput
            label="Outras Taxas"
            div-class="wrap-input"
            type="text"
        />
    </div>
</template>

<style lang="scss" scoped>
@keyframes fadeIn {
    from {
        width: 0px;
        opacity: 0;
        padding: 0;
        flex: 0;
        transform: rotateY(90deg);
        margin: 0 -10px;
    }

    to {
        flex-basis: 250px;
        transform: rotateY(0deg);
        opacity: 1;
    }
}
@keyframes fadeOut {
    0% {
        flex-basis: 250px;
        opacity: 1;
    }

    100% {
        width: 0px;
        opacity: 0;
        padding: 0;
        flex: 0;
        margin: 0 -10px;
    }
}

.ticket-card {
    flex-basis: 250px;
    flex-grow: 1;
    display: grid;
    padding: 20px;
    grid-template-columns: repeat(2, 1fr);
    border-radius: 12px;
    gap: 16px;
    border: solid 1px var(--grey-400);
    box-shadow: 0 6px 12px -5px rgba(0, 0, 0, 0.1);
    animation: 0.5s fadeIn ease forwards;
    transform-origin: left;
}

.wrap-input input {
    height: 40px;
}
.remove-ticket {
    animation: 0.4s fadeOut ease forwards;
}
</style>
