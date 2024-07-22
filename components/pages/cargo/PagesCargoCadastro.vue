<script lang="ts" setup>
import { useTableStore } from "@/stores/TableStore";
import { useDepartmentStore } from "@/stores/DepartmentStore";
import type { optionsType } from "@/types/global";
import { populateModal } from "@/hooks/populateModals";
import { useAlertStore } from "@/stores/AlertStore";
import { usePositionStore } from "@/stores/PositionStore";
import type { TPosition } from "@/types/position";

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
const departmentStore = useDepartmentStore();
const alertStore = useAlertStore();
const positionSote = usePositionStore();
const { $toast } = useNuxtApp();

const formInputs = ref<TPosition>({
    position_name: "",
    position_default_permission: "",
    position_status: true,
});

onBeforeMount(() => {
    if (props?.data) {
        populateModal(props.data, formInputs);
    }
});

const onSubmit = () => {
    const data = formInputs.value;
    alertStore.loading = true;

    delete data.updated_at;
    delete data.created_at;

    if (props.data) {
        positionSote.updatePosition(data);
    } else {
        positionSote.savePosition(data);
        $toast.success("Cadastro enviado com sucesso!", {
            position: "top-right",
        });
    }
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};

const departmentList = ref<optionsType[]>([]);
const departmentResult = async (search = "") => {
    await departmentStore.getDepartments(search, 1, 10, "");
    departmentList.value = departmentStore.departments.map((e) => ({
        value: e,
        label: e.department_name,
    }));
};

onMounted(() => {
    departmentResult("");
});

const onDelete = async () => {
    alertStore.loading = true;
    await positionSote.deletePosition(props.data as TPosition);
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};
</script>
<template>
    <form class="form-container" @submit.prevent="onSubmit">
        <CommonInputWrapInput
            label="Nome do Cargo"
            v-model="formInputs.position_name"
        />
        <CommonInputWrapInput
            label="Número da Permissão"
            v-model="formInputs.position_default_permission"
        />
        <CommonInputCheckBoxSwitch
            id="mySwitch"
            label-off="Status"
            v-model="formInputs.position_status"
        />
        <!-- <CommonInputTrvAutocomplete
            :options="departmentList"
            label-input="Departamento"
            :search-min-length="2"
            :clearable="true"
            @shouldSearch="departmentResult"
            :onSelect="(data:TDepartament) => console.log(data)"
        > -->
        <!-- </CommonInputTrvAutocomplete> -->
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
    grid-template-columns: repeat(2, minmax(300px, 1fr));
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
