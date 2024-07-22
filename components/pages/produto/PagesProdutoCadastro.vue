<script lang="ts" setup>
import { useProductStore } from "@/stores/ProductStore";
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
// DATA
const alertStore = useAlertStore();
const ProductStore = useProductStore();

const formInputs = ref({
    product_name: "",
    product_status: true,
});

onBeforeMount(() => {
    if (props?.data) {
        populateModal(props.data, formInputs);
    }
});

const saveProduct = async () => {
    await ProductStore.saveProduct(formInputs.value);
};

const updateProduct = async () => {
    await ProductStore.updateProduct(formInputs.value);
};

const onSubmit = async () => {
    alertStore.loading = true;
    if (props.data) {
        await updateProduct();
    } else {
        await saveProduct();
    }

    tableStore.onFetchTable();
    props.onCancel?.();
};

const onDelete = async () => {
    alertStore.loading = true;
    await ProductStore.deleteProduct(props.data);
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};
</script>
<template>
    <form class="form-container" @submit.prevent="onSubmit">
        <CommonInputWrapInput
            v-model="formInputs.product_name"
            label="Nome do Produto"
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
