<script lang="ts" setup>
import { useRegionStore } from "@/stores/RegionStore";
import { useAlertStore } from "@/stores/AlertStore";
import { useTableStore } from "@/stores/TableStore";
import * as yup from "yup";
import { populateModal } from "@/hooks/populateModals";
import useFormValidation from "@/hooks/formValidation";

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
const regionStore = useRegionStore();

const schema = yup.object({
    region_name: yup.string().required("O Nome da Região é obrigatório"),
});

const formInputs = ref({
    region_name: "",
    region_status: true,
});
const { errors, inputValidate, validateSubmit } = useFormValidation(
    schema,
    formInputs.value
);

onBeforeMount(() => {
    if (props?.data) {
        populateModal(props.data, formInputs);
    }
});

const onSubmit = async (Event: any) => {
    const data = validateSubmit(Event);

    alertStore.loading = true;
    if (props.data) {
        await regionStore.updateRegion(data);
    } else {
        await regionStore.regionSave(data);
    }

    tableStore.onFetchTable();
    props.onCancel?.();
};

const onDelete = async () => {
    alertStore.loading = true;
    await regionStore.deleteRegion(props.data);
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};
</script>

<template>
    <form class="form-container" @submit.prevent="onSubmit">
        <CommonInputWrapInput
            v-model="formInputs.region_name"
            label="Nome da Região"
            :is-required="true"
            @update:modelValue="inputValidate('region_name')"
            :error="errors.region_name"
        />
        <CommonInputCheckBoxSwitch
            id="mySwitch"
            label-off="Status"
            v-model="formInputs.region_status"
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
