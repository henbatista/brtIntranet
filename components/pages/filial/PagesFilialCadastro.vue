<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useAlertStore } from "@/stores/AlertStore";
import { useBranchStore } from "@/stores/BranchStore";
import { useRegionStore } from "~/stores/RegionStore";
import { useCityStore } from "~/stores/CityStore";
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

const branchStore = useBranchStore();
const regionStore = useRegionStore();
const cityStore = useCityStore();
const alertStore = useAlertStore();
const router = useRouter();
const minLength = ref(2);

const formInputs = ref({
    branch_name: "",
    branch_alias: "",
    branch_phone: "",
    branch_region_id: "",
    branch_city: {
        city_id: "",
    },
    region: {
        region_id: "",
    },
    branch_status: true,
});

onBeforeMount(() => {
    if (props?.data) {
        populateModal(props.data, formInputs);
    }
});

const regionList = ref<{ label: string; value: string }[]>([]);
const cityList = ref<{ label: string; value: object }[]>([]);

const regionResult = async () => {
    await regionStore.getRegions("", 1, 10, "");
    regionList.value = regionStore.regions.map((e) => ({
        label: e.region_name,
        value: e.region_id,
    }));
};

const cityResult = async (search = "") => {
    await cityStore.getCities(search, "1", "10", search ? "city_name" : "");
    cityList.value = cityStore.cities.map((e) => ({
        label: e.city_name + " - " + e.city_iata,
        value: e,
    }));
};

onMounted(() => {
    regionResult();
    cityResult();
});

const updateCity = async (data: any) => {
    formInputs.value.branch_city = data;
};

const updateRegion = (data: any) => {
    formInputs.value.branch_region_id = data;
};

const schema = yup.object({
    branch_name: yup.string().required("O Nome da Filial é obrigatório"),
    branch_alias: yup.string().required("Alias é obrigatório"),
    branch_phone: yup.string().required("O Telefone é obrigatório"),
});

const { errors, inputValidate, validateSubmit } = useFormValidation(
    schema,
    formInputs.value
);

const onSubmit = async (Event: any) => {
    const data = validateSubmit(Event);

    alertStore.loading = true;
    if (props.data) {
        await branchStore.updateBranch(data);
    } else {
        await branchStore.saveBranch(data);
    }

    tableStore.onFetchTable();
    props.onCancel?.();
};

const onDelete = async () => {
    alertStore.loading = true;
    await branchStore.deleteBranch(props.data);
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};
</script>

<template>
    <form class="form-container" @submit.prevent="onSubmit">
        <CommonInputWrapInput
            v-model="formInputs.branch_name"
            label="Nome da Filial"
            :is-required="true"
            :error="errors.branch_name"
            @update:modelValue="inputValidate('branch_name')"
        />
        <CommonInputWrapInput
            v-model="formInputs.branch_alias"
            label="Alias"
            :is-required="true"
            :error="errors.branch_alias"
            @update:modelValue="inputValidate('branch_alias')"
        />
        <CommonInputWrapInput
            v-model="formInputs.branch_phone"
            label="Telefone"
            mask="['(##) #####-####', '(##) ####-####']"
            :is-required="true"
            :error="errors.branch_phone"
            @update:modelValue="inputValidate('branch_phone')"
        />
        <CommonInputTrvAutocomplete
            v-if="regionList.length"
            :defaultValue="formInputs.region.region_id"
            :options="regionList"
            label-input="Região"
            :search-min-length="minLength"
            :clearable="true"
            :onSelect="updateRegion"
            @shouldSearch="regionResult"
        />
        <CommonInputTrvAutocomplete
            :defaultValue="JSON.stringify(formInputs.branch_city)"
            v-if="cityList.length"
            :options="cityList"
            label-input="Cidade/Estado"
            :search-min-length="minLength"
            :clearable="true"
            :onSelect="updateCity"
            @shouldSearch="cityResult"
        />
        <CommonInputCheckBoxSwitch
            id="mySwitch"
            label-off="Status"
            v-model="formInputs.branch_status"
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
