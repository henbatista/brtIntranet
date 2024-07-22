<script lang="ts" setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import { useDepartmentStore } from "@/stores/DepartmentStore";
import { useBranchStore } from "@/stores/BranchStore";
import { useTableStore } from "@/stores/TableStore";
import { populateModal } from "@/hooks/populateModals";
import { useAlertStore } from "@/stores/AlertStore";
import type { TWarnings } from "@/types/warnings";
import type { optionsType } from "@/types/global";
import type { TBranch } from "@/types/branch";
import type { TDepartament } from "@/types/departament";
import { useAuthStore } from "@/stores/AuthStore";
import { onPromisseError } from "@/hooks/useError";
import { formatDate } from "@/hooks/formatDate";

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
const { loginUser } = useAuthStore();
const { $toast } = useNuxtApp();

const formInput = ref<TWarnings>({
    advice_title: "",
    advice_description: "",
    advice_start_date: new Date(),
    advice_end_date: new Date(),
    advice_start_event: "",
    advice_end_event: "",
    advice_img: "",
    advice_attach_name: "",
    advice_original_name: "",
});

onBeforeMount(() => {
    if (props?.data) {
        populateModal(props.data, formInput);
    }
});

const minLength = ref(2);

const departmentStore = useDepartmentStore();
const branchStore = useBranchStore();

const nomeAviso = ref("");

const format = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

type dataType = TWarnings & { advice_user_id?: string };

const onSubmit = async () => {
    const {
        advice_start_date,
        advice_end_date,
        advice_start_event,
        advice_end_event,
    } = formInput.value;
    const data: dataType = {
        ...formInput.value,
        advice_user_id: loginUser?.user_id,
        advice_status: "1",
        advice_start_date: formatDate(advice_start_date as Date, "yyyy-MM-dd"),
        advice_end_date: formatDate(advice_end_date as Date, "yyyy-MM-dd"),
        advice_start_event: formatDate(
            advice_start_event as Date,
            "yyyy-MM-dd"
        ),
        advice_end_event: formatDate(advice_end_event as Date, "yyyy-MM-dd"),
    };
    const formData = new FormData();

    for (const key of Object.keys(data)) {
        let value: any = data[key as keyof {}];

        formData.append(key, value);
    }

    try {
        nomeAviso.value = "";
        alertStore.loading = true;

        if (props.data) {
            await updateAdvice(data);
            $toast.success("Aviso Atualizado!", {
                position: "top-right",
            });
        } else {
            await saveAdvice(formData);
            $toast.success("Cadastro enviado com sucesso!", {
                position: "top-right",
            });
        }
        alertStore.loading = false;
        tableStore.onFetchTable();
        props.onCancel?.();
    } catch (error) {
        alertStore.loading = false;
        onPromisseError?.(error);
    }
};

const handleUploadImage = (file: File) => {
    if (!file) {
        formInput.value.advice_img = undefined;
        formInput.value.advice_attach_name = undefined;
        formInput.value.advice_original_name = undefined;
        return;
    }

    formInput.value.advice_img = new File([file], file.name, {
        type: file.type,
    });
    formInput.value.advice_attach_name = file.name;
    formInput.value.advice_original_name = file.name;
};

const branchList = ref<optionsType[]>([]);
const departmentList = ref<optionsType[]>([]);

const branchResult = async (search = "") => {
    await branchStore.getBranches(search, 1, 10, "");
    branchList.value = branchStore.branches.map((e) => ({
        value: e,
        label: e.branch_name,
    }));
};
const departmentResult = async (search = "") => {
    await departmentStore.getDepartments(search, 1, 10, "");
    departmentList.value = departmentStore.departments.map((e) => ({
        value: e,
        label: e.department_name,
    }));
};

const onDelete = async () => {
    alertStore.loading = true;
    await deleteAdvice(props.data as TWarnings);
    alertStore.loading = false;
    props.onSuccess?.();
    props.onCancel?.();
};

onMounted(() => {
    branchResult("");
    departmentResult("");
});
</script>

<template>
    <form class="form-container" @submit.prevent="onSubmit">
        <CommonInputTrvAutocomplete
            :options="branchList"
            label-input="Filial"
            :search-min-length="minLength"
            :clearable="true"
            @shouldSearch="branchResult"
            :onSelect="(data:TBranch) => formInput.advice_branch_id = data && data.branch_id "
        >
            <template #iconLeft>
                <img
                    src="/images/icons/svg-blue/regular/magnifying-glass.svg"
                    alt="icone de procura"
                />
            </template>
            <template #iconRight>
                <img
                    src="/images/icons/svg-blue/regular/magnifying-glass.svg"
                    alt="icone de procura"
                />
            </template>
        </CommonInputTrvAutocomplete>
        <CommonInputTrvAutocomplete
            :options="departmentList"
            label-input="Departamento"
            :search-min-length="minLength"
            :clearable="true"
            @shouldSearch="departmentResult"
            :onSelect="(data:TDepartament) => formInput.advice_department_id = data && data.department_id"
        >
            <template #iconRight>
                <img
                    src="/images/icons/svg-blue/regular/magnifying-glass.svg"
                    alt="icone de procura"
                />
            </template>
        </CommonInputTrvAutocomplete>
        <CommonInputWrapInput
            div-class="wrap-input"
            label="Titulo"
            v-model="formInput.advice_title"
            type="text"
        />

        <CommonInputWrapInput
            div-class="wrap-input"
            label="Descrição"
            v-model="formInput.advice_description"
            type="text"
        />

        <VueDatePicker
            v-model="formInput.advice_start_date"
            :auto-apply="true"
            :format="format"
            input-class-name="wrap-input"
            placeholder="Data Aviso - Início"
        >
            <template #input-icon>
                <img
                    class="input-slot-image"
                    src="/images/icons/svg-blue/regular/calendar-blank.svg"
                    alt="icone calendario"
                />
            </template>
            <template #clear-icon="{ clear }">
                <img
                    class="input-slot-image"
                    src="/images/icons/svg-blue/regular/x-circle.svg"
                    alt="icone limpar"
                    @click="clear"
                />
            </template>
        </VueDatePicker>

        <VueDatePicker
            :auto-apply="true"
            :format="format"
            v-model="formInput.advice_end_date"
            input-class-name="wrap-input"
            placeholder="Data Aviso - Fim"
        >
            <template #input-icon>
                <img
                    class="input-slot-image"
                    src="/images/icons/svg-blue/regular/calendar-blank.svg"
                    alt="icone calendario"
                />
            </template>
            <template #clear-icon="{ clear }">
                <img
                    class="input-slot-image"
                    src="/images/icons/svg-blue/regular/x-circle.svg"
                    alt="icone limpar"
                    @click="clear"
                />
            </template>
        </VueDatePicker>

        <VueDatePicker
            v-model="formInput.advice_start_event"
            :auto-apply="true"
            :format="format"
            input-class-name="wrap-input"
            placeholder="Data Evento - Início"
        >
            <template #input-icon>
                <img
                    class="input-slot-image"
                    src="/images/icons/svg-blue/regular/calendar-blank.svg"
                    alt="icone calendario"
                />
            </template>
            <template #clear-icon="{ clear }">
                <img
                    class="input-slot-image"
                    src="/images/icons/svg-blue/regular/x-circle.svg"
                    alt="icone limpar"
                    @click="clear"
                />
            </template>
        </VueDatePicker>

        <VueDatePicker
            :auto-apply="true"
            v-model="formInput.advice_end_event"
            :format="format"
            input-class-name="wrap-input"
            placeholder="Data Evento - Fim"
        >
            <template #input-icon>
                <img
                    class="input-slot-image"
                    src="/images/icons/svg-blue/regular/calendar-blank.svg"
                    alt="icone calendario"
                />
            </template>
            <template #clear-icon="{ clear }">
                <img
                    class="input-slot-image"
                    src="/images/icons/svg-blue/regular/x-circle.svg"
                    alt="icone limpar"
                    @click="clear"
                />
            </template>
        </VueDatePicker>

        <div>
            Logo
            <CommonInputFile
                id="logo"
                accept="image/png, image/gif, image/jpeg"
                :onChange="handleUploadImage"
            />
        </div>
        <!-- <CommonInputCheckBoxSwitch
            id="mySwitch"
            label-off="Status"
            v-model="formInput.advice_status"
        /> -->
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
