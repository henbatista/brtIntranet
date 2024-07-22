<script setup lang="tsx">
import { useAlertStore } from "@/stores/AlertStore";

type locatorType = "aerial" | "car" | "hotel";

interface inputType {
    type: locatorType;
    locator: string;
}

const locatorRoutes = {
    aerial: getAerialLocator,
    car: getCarLocator,
    hotel: getHotelLocator,
};

const inputRef = ref<inputType>({
    locator: "",
    type: "aerial",
});

const loading = ref(false);
const alertStore = useAlertStore();

const selectOptions = [
    {
        label: "Aéreo",
        value: "aerial",
    },
    {
        label: "Carro",
        value: "car",
    },

    {
        label: "Hotel",
        value: "hotel",
    },
];

const locatorResult = ref<TLocator>();

const defaultErrorMessage =
    "Ocorreu um erro ao buscar o localizador, tente novamente mais tarde!";

const errorMessage = ref();

const onSearch = async () => {
    const { locator, type } = inputRef.value;
    alertStore.loading = true;

    try {
        const { data } = await locatorRoutes[type](locator);

        alertStore.loading = false;

        errorMessage.value = undefined;
        locatorResult.value = data;
    } catch (error) {
        if (error?.message) {
            errorMessage.value = error.message;
        } else {
            errorMessage.value = defaultErrorMessage;
        }
        locatorResult.value = undefined;
        alertStore.loading = false;
    }
};
</script>

<template>
    <NuxtLayout name="main">
        <main class="body-content">
            <section class="locator-content">
                <section class="header">
                    <h1>Buscar Reservas</h1>
                    <p>
                        Consulte uma reserva inserindo o código no campo abaixo.
                    </p>
                    <div class="inputs-container">
                        <CommonInputWrapInput
                            label="Código da Reserva"
                            v-model="inputRef.locator"
                        />
                        <SelectComponent
                            label="Tipo de reserva"
                            :options="selectOptions"
                            @update="(data: locatorType) => inputRef.type =data"
                        />
                        <ButtonComponent @click="onSearch"
                            >Buscar</ButtonComponent
                        >
                    </div>
                </section>
                <p class="error-message">{{ errorMessage }}</p>

                <section v-if="locatorResult">
                    <p>Resultado da busca</p>

                    <LocatorTicketCard
                        :data="locatorResult"
                        :locatorType="inputRef.type"
                    />
                </section>
            </section>
        </main>
    </NuxtLayout>
</template>

<style lang="scss" scoped>
.body-content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.locator-content {
    display: flex;
    flex-direction: column;
    box-shadow: 0 0.3em 15px -3px rgba(0, 0, 0, 0.1);
    padding: 1.5em;
    border-radius: 12px;
    background-color: var(--white);
}
.header {
    display: flex;
    flex-direction: column;

    h1 {
        width: 100%;
        text-align: left;
        font-size: 1.5em;
        font-weight: 900;
        color: var(--blue-700);
    }

    p {
        width: 100%;
        text-align: left;
        font-size: 0.8em;
        margin: 6px 0 0;
    }

    .inputs-container {
        width: 100%;
        display: grid;
        grid-template-columns: 200px 140px 100px;
        gap: 6px;
        margin-top: 20px;

        .select-container {
            height: 53px;
        }
    }
}

.error-message {
    width: 100%;
    text-align: center;
    font-size: 1.2em;
    color: var(--error-900);
}
</style>
