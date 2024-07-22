<script setup lang="ts">
import { populateModal } from "@/hooks/populateModals";

const props = defineProps({
    onRemove: {
        type: Function,
    },
    index: {
        type: Number,
    },
    onClose: {
        type: Function,
    },
    onAddNew: {
        type: Function,
    },
    data: {
        type: Object,
        default: {
            installment_number: "",
            installment_coefficient: "",
            installment_code: "",
            installment_fee: "",
        },
    },
});

interface installmentsType {
    installment_number: string;
    installment_coefficient: string;
    installment_code: string;
    installment_fee: string;
}

onBeforeMount(() => {
    if (props?.data) {
        populateModal(props.data, formInput);
    }
});

const installmentTaxOptions = [
    {
        label: "Com Juros",
        value: "com juros",
    },
    {
        label: "Sem Juros",
        value: "sem juros",
    },
];

const formInput = ref<installmentsType>({
    installment_number: "",
    installment_coefficient: "",
    installment_code: "",
    installment_fee: "",
});

const onSubmit = async () => {
    const { installment_code, installment_number, installment_fee, ...rest } =
        formInput.value;

    props.onAddNew?.({
        ...rest,
        installment_code: Number(installment_code),
        installment_number: Number(installment_number),
        installment_fee: Number(installment_fee),
    });
};
</script>

<template>
    <form class="installment-form-container" @submit.prevent="onSubmit">
        <CommonInputWrapInput
            label="Número da Parcela"
            v-model="formInput.installment_number"
            max="12"
            min="0"
            type="number"
        />
        <CommonInputWrapInput
            label="Coeficiênte de parcela"
            v-model="formInput.installment_coefficient"
            type="number"
            step="0.000001"
        />
        <CommonInputWrapInput
            label="Código da parcela"
            v-model="formInput.installment_code"
        />

        <CommonInputTrvAutocomplete
            :options="installmentTaxOptions"
            labelInput="Taxa da parcela"
            :onSelect="(data) => (formInput.installment_fee = data)"
        />

        <div class="button-container">
            <ButtonComponent @click="props.onClose" variant="text">
                Cancelar
            </ButtonComponent>
            <ButtonComponent type="submit"> Salvar </ButtonComponent>
        </div>
    </form>
</template>

<style lang="scss" scoped>
.installment-form-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 28px;
}

.button-container {
    grid-column: span 2;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
}
</style>
