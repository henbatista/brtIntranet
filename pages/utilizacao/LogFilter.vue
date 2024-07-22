<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";

const DataPicker = shallowRef(VueDatePicker);

const filterInputs = ref({
    consulta: "",
    agency_name: "",
    initialDate: "",
    finalDate: "",
});

const format = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

const onSubmit = () => {
    console.log(filterInputs.value);
};

const openModal = ref(false);

const onOpenModal = () => {
    openModal.value = !openModal.value;
};

const clearFilter = () => {
    filterInputs.value = {
        agency_name: "",
        consulta: "",
        finalDate: "",
        initialDate: "",
    };

    onOpenModal();
};
</script>

<template>
    <div>
        <ButtonComponent @click="onOpenModal" variant="text">
            Filtro
        </ButtonComponent>

        <ModalComponent title="Filtro" :open="openModal">
            <section class="filter-modal">
                <form class="form-container" @submit.prevent="onSubmit">
                    <CommonInputWrapInput
                        label="Tipo de Consulta"
                        v-model="filterInputs.consulta"
                        div-class="wrap-input"
                        :is-required="true"
                        :error="false"
                    />
                    <CommonInputWrapInput
                        label="Nome da Agência"
                        v-model="filterInputs.agency_name"
                        div-class="wrap-input"
                        :is-required="true"
                        :error="false"
                    />
                    <DataPicker
                        v-model="filterInputs.initialDate"
                        :auto-apply="true"
                        input-class-name="wrap-input-search txt"
                        :format="format"
                        placeholder="Data Inicio"
                        text-input
                    >
                        <template #input-icon>
                            <img
                                class="input-slot-image"
                                src="/images/icons/svg-blue/regular/calendar-blank.svg"
                                alt="icone calendario"
                            />
                        </template>
                        <template #clear-icon="{ clear }">
                            <img
                                class="input-slot-image"
                                src="/images/icons/svg-blue/regular/x-circle.svg"
                                alt="icone limpar"
                                @click="clear"
                            />
                        </template>
                    </DataPicker>
                    <DataPicker
                        v-model="filterInputs.finalDate"
                        :auto-apply="true"
                        input-class-name="wrap-input-search txt"
                        :format="format"
                        placeholder="Data fim"
                        text-input
                    >
                        <template #input-icon>
                            <img
                                class="input-slot-image"
                                src="/images/icons/svg-blue/regular/calendar-blank.svg"
                                alt="icone calendario"
                            />
                        </template>
                        <template #clear-icon="{ clear }">
                            <img
                                class="input-slot-image"
                                src="/images/icons/svg-blue/regular/x-circle.svg"
                                alt="icone limpar"
                                @click="clear"
                            />
                        </template>
                    </DataPicker>

                    <div class="buttons-container">
                        <ButtonComponent @click="clearFilter" variant="text">
                            Limpar
                        </ButtonComponent>
                        <ButtonComponent type="submit">
                            Buscar
                        </ButtonComponent>
                    </div>
                </form>
            </section>
        </ModalComponent>
    </div>
</template>

<style lang="scss" scoped>
.form-container {
    display: grid;
    gap: 24px;
    grid-template-columns: repeat(2, 1fr);
}

.buttons-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
    grid-column: span 2;
    margin-top: 30px;
}
</style>
