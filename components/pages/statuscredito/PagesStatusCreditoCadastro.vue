<script lang="ts" setup>
import { useTableStore } from "@/stores/TableStore";
import { populateModal } from "@/hooks/populateModals";
import type { TCreditStatus } from "@/types/creditStatus";
import { useAlertStore } from "@/stores/AlertStore";
import { onPromisseError } from "@/hooks/useError";

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

const { $toast } = useNuxtApp();

const formInput = ref<TCreditStatus>({
    credit_status_name: "",
    credit_status_type: "",
    credit_status_color: "",
    credit_status_status: true,
});

onBeforeMount(() => {
    if (props?.data) {
        populateModal(props.data, formInput);
    }
});

const onSubmit = async () => {
    try {
        alertStore.loading = true;

        if (props.data) {
            await updateCreditStatus(formInput.value);
            $toast.success("Status de Crédito Atualizado!", {
                position: "top-right",
            });
        } else {
            await saveCreditStatus(formInput.value);
            $toast.success("Cadastro enviado com sucesso!", {
                position: "top-right",
            });
        }
        alertStore.loading = false;
        tableStore.onFetchTable();
        props.onCancel?.();
    } catch (error) {
        alertStore.loading = false;
        onPromisseError(error);
    }
};

const onDelete = async () => {
    alertStore.loading = true;
    await deleteCreditStatus(props.data as TCreditStatus);
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};

const statusOptions = [
    {
        label: "Selecionar",
        value: null,
    },
    {
        label: "Complementar",
        value: "complementar",
    },
];
</script>
<template>
    <form class="form-container" @submit.prevent="onSubmit">
        <CommonInputWrapInput
            label="Nome do Status"
            type="text"
            v-model="formInput.credit_status_name"
        />
        <SelectComponent
            label="Tipo de status"
            :options="statusOptions"
            @update="(value) => (formInput.credit_status_type = value && value)"
        />

        <CommonInputWrapInput
            label="Cor"
            type="color"
            v-model="formInput.credit_status_color"
        />
        <CommonInputCheckBoxSwitch
            id="mySwitch"
            label-off="Status"
            v-model="formInput.credit_status_status"
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
