<script lang="ts" setup>
import { useCardStore } from "@/stores/CardStore";
import { useAlertStore } from "@/stores/AlertStore";
import * as yup from "yup";
import { populateModal } from "@/hooks/populateModals";
import useFormValidation from "@/hooks/formValidation";
import { useTableStore } from "@/stores/TableStore";

const props = defineProps({
    onCancel: {
        type: Function,
    },
    onSuccess: {
        type: Function,
    },
    data: {
        type: Object,
    },
});

const tableStore = useTableStore();
const alertStore = useAlertStore();
const cardStore = useCardStore();

interface formFieldsProps {
    credit_card_name: string;
    credit_card_abreviation: string;
    credit_card_logo: string;
}

const formFields = ref({
    credit_card_name: "",
    credit_card_abreviation: "",
    credit_card_logo: "",
    credit_card_status: true,
});

onBeforeMount(() => {
    if (props?.data) {
        populateModal(props.data, formFields);
    }
});

const schema = yup.object({
    credit_card_name: yup.string().required("O Nome do Cartão é obrigatório"),
    credit_card_abreviation: yup
        .string()
        .required("A abreviação é obrigatória"),
});

const { errors, inputValidate, validateSubmit } =
    useFormValidation<formFieldsProps>(schema, formFields.value);

const onSubmit = async (Event: any) => {
    const data = await validateSubmit(Event);
    const formData = new FormData();

    for (const fieldName in data) {
        const fieldValue = data[fieldName];

        if (fieldName === "credit_card_status") {
            formData.append(fieldName, fieldValue ? "1" : "0");
        } else if (
            fieldValue !== undefined &&
            !(fieldName === "created_at" || fieldName === "updated_at")
        ) {
            formData.append(fieldName, fieldValue);
        }
    }

    alertStore.loading = true;

    if (props.data) {
        await cardStore.updateCard(formData);
    } else {
        await cardStore.saveCard(formData);
    }
    alertStore.loading = false;
    tableStore.onFetchTable();

    props.onCancel?.();
};

const onDelete = async () => {
    alertStore.loading = true;
    await cardStore.deleteCard(props.data);
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};

const handleImageSelected = (selectedImages: any) => {
    formFields.value.credit_card_logo = selectedImages;
};

const handleInputMask = (event: any) => {
    const value = event.target.value.toUpperCase().replace(/[^A-Z]/g, "");
    event.target.value = value.slice(0, 2);
    formFields.value.credit_card_abreviation = event.target.value;
};
</script>

<template>
    <form class="form-container" @submit.prevent="onSubmit">
        <CommonInputWrapInput
            v-model="formFields.credit_card_name"
            label="Nome"
            :is-required="true"
            :error="errors?.credit_card_name"
            @update:modelValue="inputValidate('credit_card_name')"
        />
        <CommonInputWrapInput
        v-model="formFields.credit_card_abreviation"
        label="Abreviação"
        :is-required="true"
        :error="errors?.credit_card_abreviation"
        @update:modelValue="inputValidate('credit_card_abreviation')"
        @input="handleInputMask"
        />
    
        <CommonInputFile
            id="input1"
            title="Fazer upload da bandeira"
            :index="1"
            :initialImage="formFields.credit_card_logo"
            :onChange="handleImageSelected"
        />
        <CommonInputCheckBoxSwitch
            id="mySwitch"
            label-off="Status"
            v-model="formFields.credit_card_status"
        />
        <div class="buttons-container">
            <FormDeleteButton :onSuccess="onDelete" v-if="props.data" />
            <ButtonComponent @click="props?.onCancel" variant="text">
                Cancelar
            </ButtonComponent>
            <ButtonComponent type="submit"> Salvar </ButtonComponent>
        </div>
    </form>
</template>

<style lang="scss" scoped>
.form-container {
    display: grid;
    gap: 24px;
}

.buttons-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
    margin-top: 30px;
}
</style>
