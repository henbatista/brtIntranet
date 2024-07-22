<script lang="ts" setup>
import { ref } from "vue";
import { useCompanyStore } from "@/stores/CompanyStore";
import { useAlertStore } from "@/stores/AlertStore";
import { populateModal } from "../../../hooks/populateModals";
import { useTableStore } from "../../../stores/TableStore";

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
const companyStore = useCompanyStore();

const inputForm = ref({
    company_iata_code: "",
    company_iata_number: "",
    company_name: "",
    company_email: "",
    company_website: "",
    company_address: "",
    company_company_type: "",
    company_flight_type: "",
    company_postal_code: "",
    company_phones: "",
    company_comments: "",
    company_logo: "",
    company_icon: "",
    company_status: true,
});

onBeforeMount(() => {
    if (props?.data) {
        populateModal(props.data, inputForm);
    }
});

const saveCompany = async () => {
    const formData = new FormData();

    for (const fieldName in inputForm.value) {
        const fieldValue = inputForm.value[fieldName];

        if (fieldValue !== undefined) {
            formData.append(fieldName, fieldValue || "");
        }
    }

    await companyStore.saveCompany(formData);
};

const updateCompany = async () => {
    const formData = new FormData();
    for (const fieldName in inputForm.value) {
        const fieldValue = inputForm.value[fieldName];

        if (fieldValue === "created_at" || fieldValue === "updated_at") return;

        if (
            fieldValue !== null &&
            fieldValue !== undefined &&
            fieldValue !== ""
        ) {
            formData.append(fieldName, fieldValue);
        }
    }
    await companyStore.updateCompany(formData);
};
const onSubmit = async () => {
    alertStore.loading = true;

    if (props.data) {
        await updateCompany();
    } else {
        await saveCompany();
    }

    tableStore.onFetchTable();
    props.onCancel?.();
};

const onDelete = async () => {
    alertStore.loading = true;
    await companyStore.deleteCompany(props.data);
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};

const handleImageSelected = (
    selectedImages: any,
    type: "logo" | "icon" = "logo"
) => {
    console.log(selectedImages);
    if (type === "logo") {
        inputForm.value.company_logo = selectedImages;
    } else {
        inputForm.value.company_icon = selectedImages;
    }
};
</script>
<template>
    <form class="form-container" @submit.prevent="onSubmit">
        <CommonInputWrapInput
            v-model="inputForm.company_iata_code"
            label="Codigo IATA"
        />
        <CommonInputWrapInput
            v-model="inputForm.company_iata_number"
            label="Código Companhia Aerea"
        />
        <CommonInputWrapInput
            v-model="inputForm.company_name"
            label="Nome da Companhia"
        />
        <CommonInputWrapInput
            v-model="inputForm.company_email"
            label="E-mail"
        />
        <CommonInputWrapInput
            v-model="inputForm.company_website"
            label="WebSite"
        />
        <CommonInputWrapInput
            v-model="inputForm.company_address"
            label="Endereço"
        />
        <CommonInputWrapInput
            v-model="inputForm.company_company_type"
            label="Tipo de Companhia"
        />
        <CommonInputWrapInput
            v-model="inputForm.company_flight_type"
            label="Tipos de Voo"
        />
        <CommonInputWrapInput
            v-model="inputForm.company_postal_code"
            label="CEP"
            mask="#####-###"
        />
        <CommonInputWrapInput
            v-model="inputForm.company_phones"
            label="Telefone"
            mask="['(##) #####-####', '(##) ####-####']"
        />
        <RichText
            v-model:content="inputForm.company_comments"
            label="Observação"
        />
        <CommonInputFile
            id="input1"
            title="Fazer upload do Logo"
            accept="image/jpeg, image/png"
            :initialImage="inputForm.company_logo"
            :onChange="handleImageSelected"
        />
        <CommonInputFile
            id="input2"
            title="Fazer upload do Ícone"
            accept="image/jpeg, image/png"
            :initialImage="inputForm.company_icon"
            :onChange="(image:File) => handleImageSelected(image, 'icon')"
        />
        <CommonInputCheckBoxSwitch
            id="mySwitch"
            label-off="Status"
            v-model="inputForm.company_status"
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
    grid-template-columns: repeat(3, minmax(240px, 1fr));
    gap: 24px;

    .rich-editor-component {
        grid-column: span 3;
    }
}

.buttons-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
    margin-top: 30px;
    grid-column: span 3;
}
</style>
