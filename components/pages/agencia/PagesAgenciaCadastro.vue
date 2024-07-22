<script lang="ts" setup>
import { useAlertStore } from "@/stores/AlertStore";
import type { Agency } from "@/types/frontend";
import { useTableStore } from "@/stores/TableStore";
import { populateModal } from "@/hooks/populateModals";
import { useCityStore } from "~/stores/CityStore";
import { useBranchStore } from "@/stores/BranchStore";
import type { TBranch } from "@/types/branch";
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
const branchStore = useBranchStore();
const { $toast } = useNuxtApp();
const cityStore = useCityStore();

const formInputs = ref<Agency>({
    agency_name: "",
    agency_main_name: "",
    agency_branch_id: "",
    agency_address: "",
    agency_city_id: 0,
    agency_cnpj: "",
    agency_car: "",
    agency_phone: "",
    agency_special_billing: "",
    agency_status: true,
    agency_total_local_billing: 20,
});

onBeforeMount(() => {
    if (props?.data) {
        populateModal(props.data, formInputs);
    }
});

const alertStore = useAlertStore();

const faturamentoEspecial = ref([
    { value: "0", label: "Sim" },
    { value: "1", label: "Não" },
]);
const cityList = ref([]);

const optionsFilial = ref([]);

const cityResult = async (search = "") => {
    await cityStore.getCities(search, "1", "10", search ? "city_name" : "");
    cityList.value = cityStore.cities.map((e) => ({
        label: e.city_name,
        value: e.city_id,
    }));
};

onMounted(async () => {
    //filial build

    cityResult();
    branchStore.getBranches("", 1, 50, "").then(
        (data) =>
            (optionsFilial.value = data.map((e: TBranch) => ({
                value: e,
                label: e.branch_name,
            })))
    );
});

const onSubmit = async () => {
    try {
        alertStore.loading = true;

        if (props.data) {
            await updateAgency(formInputs.value);
            $toast.success("Agência Atualizado!", {
                position: "top-right",
            });
        } else {
            await saveAgency(formInputs.value);
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
    await deleteAgency(props.data as Agency);
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};
</script>
<template>
    <form class="form-container" @submit.prevent="onSubmit">
        <CommonInputWrapInput
            label="Nome da Agência"
            v-model="formInputs.agency_name"
        />
        <CommonInputWrapInput
            label="Razão Social"
            v-model="formInputs.agency_main_name"
        />

        <CommonInputTrvAutocomplete
            :defaultValue="formInputs.agency_branch_id"
            :options="optionsFilial"
            label-input="Nome da Filial"
            :search-min-length="2"
            :clearable="true"
            :onSelect="(data:TBranch) => formInputs.agency_branch_id = data && data?.branch_id"
        />

        <CommonInputWrapInput
            label="Endereço da Agência"
            v-model="formInputs.agency_address"
        />
        <CommonInputTrvAutocomplete
            :defaultValue="formInputs.agency_city_id + ''"
            :options="cityList"
            label-input="Cidade"
            :search-min-length="2"
            :clearable="true"
            :onSelect="(data:number) => formInputs.agency_city_id = data && data"
        />
        <!-- <CommonInputWrapInput
            label="Estado"
            type="text"
        />
        <CommonInputWrapInput
            label="Filial"
            type="text"
        /> -->

        <CommonInputWrapInput
            v-model="formInputs.agency_phone"
            label="Telefone"
            mask="['(##) #####-####', '(##) ####-####']"
            :is-required="true"
        />

        <CommonInputWrapInput
            v-model="formInputs.agency_cnpj"
            label="CNPJ"
            mask="##.###.###/####-##"
            :is-required="true"
        />

        <CommonInputWrapInput
            v-model="formInputs.agency_car"
            label="Fat. Total Carro"
            mask="['####.##', '#####.##', '######.##']"
            :is-required="true"
        />

        <CommonInputTrvAutocomplete
            :defaultValue="formInputs.agency_special_billing"
            :options="faturamentoEspecial"
            label-input="Faturamento Especial"
            :search-min-length="2"
            :clearable="true"
            :onSelect="(data:string) => formInputs.agency_special_billing = data && data"
        />
        <CommonInputCheckBoxSwitch
            id="mySwitch"
            label-off="Status"
            v-model="formInputs.agency_status"
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
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}

.buttons-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
    margin-top: 30px;
    grid-column: span 3;
}
</style>
