<script lang="ts" setup>
import { useDepartmentStore } from "@/stores/DepartmentStore";
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

const alertStore = useAlertStore();
const departmentStore = useDepartmentStore();
const tableStore = useTableStore();

const formInputs = ref({
    department_name: "",
    department_status: true,
});

onBeforeMount(() => {
    if (props?.data) {
        populateModal(props.data, formInputs);
    }
});

const schema = yup.object({
    department_name: yup
        .string()
        .required("O Nome do Departamento é obrigatório"),
});

const { errors, inputValidate, validateSubmit } = useFormValidation(
    schema,
    formInputs.value
);

const onSubmit = async (event: any) => {
    const data = validateSubmit(event);
    alertStore.loading = true;

    if (props.data) {
        await departmentStore.updateDepartment(data);
    } else {
        await departmentStore.departmentSave(data);
    }

    tableStore.onFetchTable();
    props.onCancel?.();
};

const onDelete = async () => {
    alertStore.loading = true;
    await departmentStore.deleteDepartment(props.data);
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};
</script>
<template>
    <form class="form-container" @submit.prevent="onSubmit">
        <CommonInputWrapInput
            v-model="formInputs.department_name"
            label="Nome do Departamento"
            :error="errors.department_name"
            @update:modelValue="inputValidate('department_name')"
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
