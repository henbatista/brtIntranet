<script lang="ts" setup>
import { useCommandStore } from "@/stores/CommandStore";
import { useAlertStore } from "@/stores/AlertStore";
import { useCompanyStore } from "~/stores/CompanyStore";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useTableStore } from "@/stores/TableStore";
import { formatDate } from "@/hooks/formatDate";
import { populateModal } from "@/hooks/populateModals";
import type { Command } from "@/types/frontend";
import { useSystemStore } from "@/stores/SystemStore";

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
const CommandStore = useCommandStore();
const companyStore = useCompanyStore();
const { getSystems, Systems } = useSystemStore();
const minLength = ref(2);
const DataPicker = shallowRef(VueDatePicker);
const tableStore = useTableStore();

interface inputFormProps {
    command_airline: string;
    command_system_type: string;
    command_name: string;
    command_description: string;
    command_validity: string | Date;
    command_status: boolean;
    created_at?: string;
    updated_at?: string;
    id?: string;
}

const inputForm = ref<inputFormProps>({
    command_airline: "",
    command_system_type: "",
    command_name: "",
    command_description: "",
    command_validity: new Date(),
    command_status: true,
});

onBeforeMount(() => {
    if (props.data) {
        console.log(props.data);
        populateModal(props.data, inputForm);
    }
});

const companyList = ref<any>([]);
const sistemList = ref<any>([]);

const companyResult = async (search = "") => {
    await companyStore.getCompanies(search, 1, 10, "");
    companyList.value = companyStore.companies.map((e) => ({
        label: e.company_name,
        value: e.company_id,
    }));
};

const getSistems = async (search = "") => {
    await getSystems(search, 1, 10, "");
    sistemList.value = Systems.map((e) => ({
        label: e.system_name,
        value: e.system_type,
    }));
};

onMounted(() => {
    companyResult();
    getSistems();
});

const onSubmit = async () => {
    alertStore.loading = true;

    inputForm.value.command_validity = formatDate(
        new Date(inputForm.value.command_validity),
        "yyyy-MM-dd"
    );
    if (props.data) {
        const updateData = inputForm.value;

        delete updateData.created_at;
        delete updateData.updated_at;

        await CommandStore.updateCommand(updateData);
    } else {
        await CommandStore.saveCommand(inputForm.value);
    }

    tableStore.onFetchTable();
    props.onCancel?.();
};

const onDelete = async () => {
    alertStore.loading = true;
    await CommandStore.deleteCommand(props.data as Command);
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};

const handleSelectCompany = (value: string) => {
    inputForm.value.command_airline = value;
};

const handleSelectSystem = (value: string) => {
    inputForm.value.command_system_type = value;
};
</script>
<template>
    <form class="form-container" @submit.prevent="onSubmit">
        <DataPicker
            v-model="inputForm.command_validity"
            :auto-apply="true"
            :format="formatDate"
            class="date-input-picker"
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
        </DataPicker>
        <CommonInputTrvAutocomplete
            :defaultValue="props.data?.command_airline"
            :options="companyList"
            v-if="companyList.length"
            label-input="Companhia Aérea"
            :search-min-length="minLength"
            :clearable="true"
            :onSelect="handleSelectCompany"
            @shouldSearch="companyResult"
        />
        <CommonInputTrvAutocomplete
            :defaultValue="props.data?.command_system_type"
            :options="sistemList"
            v-if="sistemList.length"
            label-input="Sistema"
            :search-min-length="minLength"
            :clearable="true"
            :onSelect="handleSelectSystem"
            @shouldSearch="getSistems"
        />

        <CommonInputWrapInput
            v-model="inputForm.command_name"
            label="Comando"
        />
        <RichText
            v-model:content="inputForm.command_description"
            label=" Descrição Comando"
            :error="false"
        />
        <CommonInputCheckBoxSwitch
            id="mySwitch"
            label-off="Status"
            v-model="inputForm.command_status"
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

    .rich-editor-component {
        max-width: unset;
        grid-column: span 2;
    }
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
