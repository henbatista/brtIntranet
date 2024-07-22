<script lang="ts" setup>
import { useTableStore } from "@/stores/TableStore";
import { populateModal } from "@/hooks/populateModals";
import type { TFinance } from "@/types/finance";
import { useAlertStore } from "@/stores/AlertStore";
import { onPromisseError } from "@/hooks/useError";
import { useCompanyStore } from "@/stores/CompanyStore";
import type { selectType } from "@/components/common/select/SelectComponent.vue";
import type { Company } from "@/types/frontend";

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

const formInput = ref<TFinance>({
    finance_type: "",
    finance_flight_company_id: 0,
    finance_description: "",
    finance_status: true,
});

onBeforeMount(() => {
    if (props?.data) {
        populateModal(props.data, formInput);
    }
});

const { getCompanies, companies } = useCompanyStore();

const companhiasOptions = ref<selectType[]>([]);

const onGetCompanies = async (search = "") => {
    const data: Company[] = await getCompanies(search, 1, 10, "company_name");

    companhiasOptions.value = data
        .filter((filter) => filter.company_status)
        .map((e) => ({
            label: e.company_name,
            value: e.company_id,
        }));
};

onMounted(async () => {
    console.log({ data: props.data });
    onGetCompanies();
});

const onSubmit = async () => {
    try {
        alertStore.loading = true;

        let data = formInput.value;
        data = { ...data, finance_status: data.finance_status ? "1" : "0" };

        delete data.created_at;
        delete data.updated_at;

        if (props.data) {
            await updateFinance(data);
            $toast.success("Financiamento Atualizado!", {
                position: "top-right",
            });
        } else {
            await saveFinance(data);
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
    await deleteFinance(props.data as TFinance);
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};
</script>
<template>
    <form class="form-container" @submit.prevent="onSubmit">
        <CommonInputTrvAutocomplete
            :defaultValue="props.data?.finance_flight_company_id + ''"
            :options="companhiasOptions"
            label-input="Companhia Aérea"
            :search-min-length="3"
            :clearable="true"
            @shouldSearch="onGetCompanies"
            :onSelect="
                (data:number) => (formInput.finance_flight_company_id = data && data)
            "
        />

        <RichText
            label="Descrição"
            style="width: 100%"
            v-model:content="formInput.finance_description"
        />
        <CommonInputCheckBoxSwitch
            id="mySwitch"
            label-off="Status"
            v-model="formInput.finance_status"
        />

        <div class="radio-container">
            <div>
                <input
                    type="radio"
                    id="nacional"
                    name="tipo"
                    value="nacional"
                    v-model="formInput.finance_type"
                />
                <label for="nacional">Nacional</label>
            </div>
            <div>
                <input
                    type="radio"
                    id="internacional"
                    name="tipo"
                    value="internacional"
                    v-model="formInput.finance_type"
                />
                <label for="internacional">Internacional</label>
            </div>
        </div>
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

    .radio-container {
        display: flex;
        align-items: center;
        gap: 24px;

        > div {
            display: flex;
            align-items: center;
            gap: 6px;
        }
    }
    .rich-editor-component {
        max-width: 47vw;
    }
}

.buttons-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
    margin-top: 30px;
}
</style>
