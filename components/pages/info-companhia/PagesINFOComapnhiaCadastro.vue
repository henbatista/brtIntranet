<script lang="ts" setup>
import { useTableStore } from "@/stores/TableStore";
import { populateModal } from "@/hooks/populateModals";
import type { TInfoCompanhias } from "@/types/info-companhias";
import { useAlertStore } from "@/stores/AlertStore";
import { useCompanyStore } from "@/stores/CompanyStore";
import type { selectType } from "@/components/common/select/SelectComponent.vue";
import { getDirtData } from "@/hooks/getDirtyData";
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
    onCloseModal: {
        type: Function,
    },
});

const onCloseModal = inject<() => void>("closeModal");

const handleCancel = () => {
    if (props.onCancel) {
        props.onCancel();
        return;
    }
    onCloseModal?.();
};

const alertStore = useAlertStore();
const tableStore = useTableStore();
const showAgency = ref(false);

const { getCompanies, companies } = useCompanyStore();

const companhiasOptions = ref<selectType[]>([]);

const onGetCompanies = async (search = "") => {
    await getCompanies(search, 1, 10, search);
    companhiasOptions.value = companies.map((e) => ({
        label: e.company_name,
        value: e.company_id,
    }));
};

onMounted(async () => {
    onGetCompanies();
});

interface updatedData {
    date: Date;
    field: string;
    formatedField: string;
    old: TInfoCompanhias;
    new: TInfoCompanhias;
}

const companyHeader = {
    air_company_info_administrative_policy: "Politica de ADM",
    air_company_info_advanced_passenger_information:
        "API (Advanced Passanger Information)",
    air_company_info_double_payment_way_to_issue:
        "Dupla forma de pagamento em emissões",
    air_company_info_offline_operation: "OFF LINE",
    air_company_info_bagagge_rules: "Franquia de bagagem",
    air_company_info_unaccompanied_minors: "Menor Desacompanhado",
    air_company_info_round_world_fare: "Tarifa volta ao mundo",
    air_company_info_seat_premium_economy: "Assento premium economy",
    air_company_info_cia_with_mileage_agreement: "Acordo de milhas",
    air_company_info_mileage_card: "Cartão de milhas",
};

const formInput = ref<TInfoCompanhias>({
    air_company_info_administrative_policy: "",
    air_company_info_advanced_passenger_information: "",
    air_company_info_double_payment_way_to_issue: "",
    air_company_info_offline_operation: "",
    air_company_info_bagagge_rules: "",
    air_company_info_unaccompanied_minors: "",
    air_company_info_round_world_fare: "",
    air_company_info_seat_premium_economy: "",
    air_company_info_cia_with_mileage_agreement: "",
    air_company_info_mileage_card: "",
    air_company_info_company_id: 0,
});

onBeforeMount(() => {
    if (props?.data) {
        showAgency.value = true;
        populateModal(props.data, formInput);
    }
});

const onSuccess = () => {
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onSuccess?.();
    handleCancel();
};

const onSubmit = async () => {
    const data = formInput.value;

    alertStore.loading = true;

    if (props.data) {
        const dirtyData = getDirtData<TInfoCompanhias>(
            props.data as TInfoCompanhias,
            data
        );

        let updates = props.data.air_company_info_status || [];

        try {
            updates = JSON.parse(updates);
        } catch (error) {
            updates = [];
        }

        const dirtyDataKeys = Object.keys(dirtyData);

        const buildUpdateList = dirtyDataKeys.map((e) => ({
            date: formatDate(new Date(), "dd/MM/yyy HH:mm:ss"),
            field: e,
            formatedField: companyHeader[e],
            old: props.data[e],
            new: data[e],
        }));

        const finalData = {
            ...data,
            air_company_info_status: JSON.stringify([
                ...buildUpdateList,
                ...updates,
            ]),
        };

        await updateInfoCompanhia(finalData)
            .then(() => {
                onSuccess();
            })
            .catch(() => {
                alertStore.loading = false;
            });
    } else {
        await saveInfoCompanhia(data)
            .then(() => {
                onSuccess();
            })
            .catch(() => {
                alertStore.loading = false;
            });
    }
};

const onDelete = async () => {
    alertStore.loading = true;
    await deleteInfoCompanhia(props.data as TInfoCompanhias);
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};
</script>

<template>
    <form class="form-container">
        <div class="scrolable-content">
            <CommonInputWrapInput
                v-model="formInput.air_company_info_administrative_policy"
                type="url"
                label="politica de ADM"
            />

            <CommonInputTrvAutocomplete
                :defaultValue="props.data?.air_company_info_company_id + ''"
                :options="companhiasOptions"
                v-if="companhiasOptions.length"
                label-input="Companhias"
                :search-min-length="2"
                :clearable="true"
                :onSelect="(data: number) =>  formInput.air_company_info_company_id = data"
            />

            <RichText
                label="API (Advanced Passanger Information)"
                v-model:content="
                    formInput.air_company_info_advanced_passenger_information
                "
            />
            <RichText
                label="Dupla forma de pagamento em emissões"
                v-model:content="
                    formInput.air_company_info_double_payment_way_to_issue
                "
            />
            <RichText
                label="OFF LINE"
                v-model:content="formInput.air_company_info_offline_operation"
            />
            <RichText
                label="Franquia de bagagem"
                v-model:content="formInput.air_company_info_bagagge_rules"
            />
            <RichText
                label="Menor desacompanhado"
                v-model:content="
                    formInput.air_company_info_unaccompanied_minors
                "
            />
            <RichText
                label="Tarifa volta ao mundo"
                v-model:content="formInput.air_company_info_round_world_fare"
            />
            <RichText
                label="Assento premium economy"
                v-model:content="
                    formInput.air_company_info_seat_premium_economy
                "
            />
            <RichText
                label="Acordo de milhas"
                v-model:content="
                    formInput.air_company_info_cia_with_mileage_agreement
                "
            />
            <RichText
                label="cartão de milhas"
                v-model:content="formInput.air_company_info_mileage_card"
            />
        </div>
        <div class="buttons-container">
            <FormDeleteButton :onSuccess="onDelete" v-if="props.data" />

            <ButtonComponent @click="handleCancel" variant="text">
                Cancelar
            </ButtonComponent>
            <ButtonComponent @click="onSubmit"> Salvar </ButtonComponent>
        </div>
    </form>
</template>

<style lang="scss" scoped>
.form-container {
    height: 90%;
    display: flex;
    flex-direction: column;

    .scrolable-content {
        flex: 1 0 0;
        overflow-y: auto;
        display: grid;
        padding-right: 10px;
        grid-template-columns: repeat(1, 1fr);
        gap: 24px;
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
