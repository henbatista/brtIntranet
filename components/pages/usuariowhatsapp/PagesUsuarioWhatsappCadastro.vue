<script lang="ts" setup>
import { useWhatsAppUserStore } from "@/stores/WhatsAppUserStore";
import { useAlertStore } from "@/stores/AlertStore";
import * as yup from "yup";
import useFormValidation from "@/hooks/formValidation";
import { useTableStore } from "@/stores/TableStore";
import { populateModal } from "@/hooks/populateModals";
import type { Agency } from "@/types/frontend";

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
const whatsAppUserStore = useWhatsAppUserStore();

const formInputs = ref({
    whatsapp_user_agency_id: "",
    whatsapp_user_cnpj: "",
    whatsapp_user_base: "",
    whatsapp_user_api_username: "",
    whatsapp_user_api_user_password: "",
    whatsapp_user_api_user_password_confirmed: "",
    whatsapp_user_status: true,
});

onBeforeMount(() => {
    if (props?.data) {
        populateModal(props.data, formInputs);
    }
});

const agencyOptions = ref([]);

const onGetAgency = async (search = "") => {
    const {
        data: { data },
    } = await getAgency(search, 1, 10, search ? "agency_name" : "");

    console.log(data);

    agencyOptions.value = data.map((e) => ({
        label: e?.agency_name,
        value: e,
    }));
};

onBeforeMount(() => {
    onGetAgency();
});

const schema = yup.object({
    whatsapp_user_api_user_password: yup
        .string()
        .required("A senha é obrigatória"),
    whatsapp_user_api_user_password_confirmed: yup
        .string()
        .oneOf(
            [yup.ref("whatsapp_user_api_user_password")],
            "As senhas devem ser iguais"
        ),
});

const { errors, inputValidate, validateSubmit } = useFormValidation(
    schema,
    formInputs.value
);

const saveWhatsAppUser = async (data: any) => {
    await whatsAppUserStore.saveWhatsAppUser(data);
};

const updateWhatsAppUser = async (data: any) => {
    await whatsAppUserStore.updateWhatsAppUser(data);
};

const onSubmit = async (event: any) => {
    validateSubmit(event);

    alertStore.loading = true;

    let data = formInputs.value;

    data = { ...data, whatsapp_user_status: data.whatsapp_user_status ? 1 : 0 };

    if (props.data) {
        await updateWhatsAppUser(data);
    } else {
        await saveWhatsAppUser(data);
    }

    tableStore.onFetchTable();
    props.onCancel?.();
};

const onDelete = async () => {
    alertStore.loading = true;
    await whatsAppUserStore.deleteWhatsAppUser(props.data as TVisit);
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};

const onSelectAgency = (data: Agency) => {
    console.log({ data });

    formInputs.value.whatsapp_user_agency_id = data.agency_id;
    formInputs.value.whatsapp_user_cnpj = data.agency_cnpj;
    formInputs.value.whatsapp_user_base = data.agency_name;
};
</script>
<template>
    <form class="form-container" @submit.prevent="onSubmit">
        <CommonInputTrvAutocomplete
            :defaultValue="formInputs.whatsapp_user_agency_id"
            :options="agencyOptions"
            label-input="Agência"
            :search-min-length="2"
            :clearable="true"
            :onSelect="onSelectAgency"
        />
        <CommonInputWrapInput
            v-model="formInputs.whatsapp_user_cnpj"
            label="CNPJ"
            mask="##.###.###/####-##"
            disabled
        />

        <CommonInputWrapInput
            v-model="formInputs.whatsapp_user_base"
            disabled
            label="Base"
        />

        <CommonInputWrapInput
            v-model="formInputs.whatsapp_user_api_username"
            label="Nome Usuário API"
        />

        <CommonInputWrapInput
            type="password"
            v-model="formInputs.whatsapp_user_api_user_password"
            label="Senha do Usuário API"
            :error="errors?.whatsapp_user_api_user_password"
            @update:modelValue="
                inputValidate('whatsapp_user_api_user_password')
            "
        />
        <CommonInputWrapInput
            type="password"
            v-model="formInputs.whatsapp_user_api_user_password_confirmed"
            label="Confirmar senha"
            :error="errors?.whatsapp_user_api_user_password_confirmed"
            @update:modelValue="
                inputValidate('whatsapp_user_api_user_password_confirmed')
            "
        />
        <CommonInputCheckBoxSwitch
            id="mySwitch"
            label-off="Status"
            v-model="formInputs.whatsapp_user_status"
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
    grid-template-columns: repeat(1, minmax(250px, 1fr));
    gap: 24px;
}

.buttons-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
    margin-top: 30px;
    grid-column: span 1;
}
</style>
