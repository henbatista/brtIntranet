<script lang="ts" setup>
import { useSystemStore } from "@/stores/SystemStore";
import { useAlertStore } from "@/stores/AlertStore";
import { useTableStore } from "@/stores/TableStore";
import { populateModal } from "@/hooks/populateModals";

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
const SystemStore = useSystemStore();

interface inputFormProps {
    system_name: string;
    system_type: string;
    system_logo: File | string;
    system_status: Boolean;
}

const inputForm = ref<inputFormProps>({
    system_name: "",
    system_type: "",
    system_logo: "",
    system_status: true,
});

onBeforeMount(() => {
    if (props?.data) {
        populateModal(props.data, inputForm);
    }
});

const systemList = ref([
    { label: "Aéreo", value: "0" },
    { label: "Hotel", value: "1" },
]);

const saveSystem = async () => {
    const formData = new FormData();

    for (const fieldName in inputForm.value) {
        let fieldValue = inputForm.value[fieldName];

        if (fieldName === "system_status") {
            fieldValue = fieldValue ? "1" : "0";
        }

        if (fieldValue !== undefined) {
            formData.append(fieldName, fieldValue || "");
        }
    }

    await SystemStore.saveSystem(formData);
};

const updateSystem = async () => {
    const formData = new FormData();
    for (const fieldName in inputForm.value) {
        let fieldValue = inputForm.value[fieldName];

        if (fieldName === "system_status") {
            fieldValue = fieldValue ? "1" : "0";
        }

        if (
            fieldValue !== null &&
            fieldValue !== undefined &&
            fieldValue !== ""
        ) {
            if (fieldValue instanceof File) {
                formData.append(fieldName, fieldValue);
            } else {
                formData.append(fieldName, fieldValue);
            }
        }
    }
    await SystemStore.updateSystem(formData);
};

const onSubmit = async () => {
    alertStore.loading = true;
    if (props.data) {
        await updateSystem();
    } else {
        await saveSystem();
    }

    tableStore.onFetchTable();
    props.onCancel?.();
};

const onDelete = async () => {
    alertStore.loading = true;
    await SystemStore.deleteSystem(props.data);
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};

const handleImageSelected = (file: File) => {
    inputForm.value.system_logo = file;
};

const handleSelect = (value: string) => {
    inputForm.value.system_type = value;
};
</script>
<template>
    <form class="form-container" @submit.prevent="onSubmit">
        <CommonInputWrapInput
            v-model="inputForm.system_name"
            label="Nome do Sistema"
        />
        <CommonInputTrvAutocomplete
            :options="systemList"
            :defaultValue="inputForm.system_type"
            label-input="Selecione o Sistema"
            :search-min-length="2"
            :clearable="true"
            :onSelect="handleSelect"
        />
        <CommonInputFile
            id="input1"
            title="Fazer Upload da Logo"
            :onChange="handleImageSelected"
        />
        <CommonInputCheckBoxSwitch
            id="mySwitch"
            label-off="Status"
            v-model="inputForm.system_status"
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
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
}

.buttons-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
    margin-top: 30px;
    grid-column: span 2;
}
</style>
