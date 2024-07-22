<script setup lang="tsx">
import type { TLocator } from "@/types/locator";
import { useAlertStore } from "@/stores/AlertStore";

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
    locatorType: {
        type: String,
        required: true,
    },
});

interface inputType {
    newLocator: string;
    locator: string;
}

const inputRef = ref<inputType>({
    locator: props.data.locator,
    newLocator: props.data.locator,
});
const { $toast } = useNuxtApp();

const editInformation = ref(false);
const alertStore = useAlertStore();

const locatorTicketData = ref<TLocator>(props.data);

const defaultErrorMessage =
    "Ocorreu um erro ao atualizar o localizador, tente novamente mais tarde!";

const locatorRoutes = {
    aerial: updateAerialLocator,
    car: updateCarLocator,
    hotel: updateHotelLocator,
};

const onSubmit = async () => {
    const { newLocator } = inputRef.value;
    alertStore.loading = true;

    const formData = {
        newLocator,
        locator: locatorTicketData.value.locator,
    };

    try {
        const { data } = await locatorRoutes[props.locatorType](formData);

        alertStore.loading = false;
        locatorResult.value = data;
        $toast.success("Localizador Atualizado!", {
            position: "top-right",
        });
        editInformation.value = false;
    } catch (error) {
        if (error?.message) {
            $toast.error(error.message, {
                position: "top-right",
            });
        } else {
            $toast.error(defaultErrorMessage, {
                position: "top-right",
            });
        }
        editInformation.value = false;
        alertStore.loading = false;
    }
};
</script>

<template>
    <section class="ticket-section">
        <div class="title ticket-content">
            <span>Companhia</span>
            <h2>{{ locatorTicketData.company || "-----" }}</h2>
        </div>

        <div class="ticket-content">
            <span>Código iata</span>
            <b>{{ locatorTicketData.iataCode || "-----" }}</b>
        </div>

        <div class="ticket-content">
            <span>Rota</span>
            <b>{{ locatorTicketData.route || "-----" }}</b>
        </div>

        <div class="ticket-content">
            <span>Unidade</span>
            <b>{{ locatorTicketData.unit || "-----" }}</b>
        </div>

        <div class="ticket-content">
            <span>Localizador</span>
            <b v-if="!editInformation">{{
                locatorTicketData.locator || "-----"
            }}</b>
            <CommonInputWrapInput
                v-else
                label="Localizador"
                v-model="inputRef.newLocator"
            />
        </div>

        <div class="ticket-content">
            <span>Agência</span>
            <b>{{ locatorTicketData.agency || "-----" }}</b>
        </div>

        <div class="ticket-content">
            <span>Cliente</span>
            <b>{{ locatorTicketData.client || "-----" }}</b>
        </div>

        <div></div>
        <div></div>
        <div></div>

        <div class="buttons-section" v-if="editInformation">
            <ButtonComponent
                variant="secondary"
                @click="editInformation = false"
                >Cancelar</ButtonComponent
            >
            <ButtonComponent @click="onSubmit">Salvar</ButtonComponent>
        </div>

        <ButtonComponent
            variant="secondary"
            @click="editInformation = true"
            v-else
            >Editar informações</ButtonComponent
        >
    </section>
</template>

<style lang="scss" scoped>
.ticket-section {
    padding: 1em;
    background-color: var(--grey-500);
    display: grid;
    border-radius: 12px;
    gap: 19px;
    grid-template-columns: repeat(2, 1fr);

    .title {
        grid-column: span 2;
        margin-bottom: 20px;
    }

    .ticket-content {
        display: flex;
        gap: 2px;
        flex-direction: column;

        h2 {
            font-size: 3em;
        }
        span,
        b {
            text-align: left;
        }
    }

    .buttons-section {
        display: flex;
        justify-content: center;
        gap: 12px;
        grid-column: span 2;
    }
}
</style>
