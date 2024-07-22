<script lang="ts" setup>
import { useContactTypeStore } from "@/stores/ContactTypeStore";
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
const ContactTypeStore = useContactTypeStore();

const formInputs = ref({
    contact_type_name: "",
    contact_type_status: true,
});

onBeforeMount(() => {
    if (props?.data) {
        populateModal(props.data, formInputs);
    }
});

const ContactTypeSave = async () => {
    await ContactTypeStore.saveContactType(formInputs.value);
};

const updateContactType = async () => {
    await ContactTypeStore.updateContactType(formInputs.value);
};

const onSubmit = async () => {
    alertStore.loading = true;
    if (props.data) {
        await updateContactType();
    } else {
        await ContactTypeSave();
    }

    tableStore.onFetchTable();
    props.onCancel?.();
};

const onDelete = async () => {
    alertStore.loading = true;
    await ContactTypeStore.deleteContactType(props.data);
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};
</script>
<template>
    <form class="form-container" @submit.prevent="onSubmit">
        <CommonInputWrapInput
            v-model="formInputs.contact_type_name"
            label="Forma de Contato"
        />
        <CommonInputCheckBoxSwitch
            id="mySwitch"
            label-off="Status"
            v-model="formInputs.contact_type_status"
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
