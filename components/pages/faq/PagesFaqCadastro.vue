<script lang="ts" setup>
import { useAlertStore } from "@/stores/AlertStore";
import { useDepartmentStore } from "@/stores/DepartmentStore";
import { populateModal } from "@/hooks/populateModals";
import { useTableStore } from "@/stores/TableStore";

interface formInputProps {
    faq_department_id: string;
    faq_status: boolean;
    faq_question: string;
    faq_answer: string;
}

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

const departmentStore = useDepartmentStore();
const tableStore = useTableStore();
const alertStore = useAlertStore();
const minLength = ref(2);

const formFields = ref<formInputProps>({
    faq_department_id: "",
    faq_question: "",
    faq_answer: "",
    faq_status: true,
});

onBeforeMount(() => {
    if (props?.data) {
        populateModal(props.data, formFields);
    }
});

const departmentList = ref<{ label: string; value: string }[]>([]);

const departmentResult = async (search = "") => {
    await departmentStore.getDepartments(search, 1, 10, "");
    departmentList.value = departmentStore.departments.map((e) => ({
        label: e.department_name,
        value: e.department_id,
    }));
};

onMounted(() => {
    departmentResult();
});

const updateDepartment = (data: any) => {
    formFields.value.faq_department_id = data;
};

const onSubmit = async () => {
    alertStore.loading = true;

    const data = formFields.value;

    delete data.faq_department_name;

    try {
        if (props.data) {
            await updateFaq(data);
        } else {
            await saveFaq(data);
        }
        tableStore.onFetchTable();
        props.onCancel?.();
    } catch (error) {
        alertStore.success = false;
        alertStore.message = error.message;
    } finally {
        alertStore.loading = false;
    }
};


</script>
<template>
    <form class="form-container" @submit.prevent="onSubmit">
        <CommonInputTrvAutocomplete
            v-if="departmentList.length"
            :defaultValue="props.data?.faq_department_id + ''"
            :options="departmentList"
            label-input="Nome do departamento"
            :search-min-length="minLength"
            :clearable="true"
            :onSelect="updateDepartment"
            @shouldSearch="departmentResult"
        />

        <div></div>

        <RichText v-model:content="formFields.faq_question" label="Pergunta" />
        <RichText v-model:content="formFields.faq_answer" label="Resposta" />

        <CommonInputCheckBoxSwitch
        id="mySwitch"
        label-off="Status"
        v-model="formFields.faq_status"
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