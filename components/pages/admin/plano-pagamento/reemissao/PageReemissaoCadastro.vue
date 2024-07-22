<script lang="ts" setup>
import { useAlertStore } from "@/stores/AlertStore";
import VueDatePicker from "@vuepic/vue-datepicker";
import * as yup from "yup";
import { useToast } from "vue-toast-notification";
import { populateModal } from "@/hooks/populateModals";
import useFormValidation from "@/hooks/formValidation";
import { useTableStore } from "@/stores/TableStore";
import { formatDate } from "@/hooks/formatDate";
import { useCompanyStore } from "@/stores/CompanyStore";
import type { TReemissao } from "types/reemissao";
import { getDirtData } from "@/hooks/getDirtyData";

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
const DataPicker = shallowRef(VueDatePicker);
const companyStore = useCompanyStore();
const $toast = useToast();

const infoReemissaoHeaders = {
    info_reissuance_tax_valid_date: "Data de validade",
    info_reissuance_accept_installments: "Aceita parcelas",

    info_reissuance_company_id: "Companhia",
    info_reissuance_tax: "Taxa de Reemissão",
    air_company_info_double_payment_way_to_issue:
        "Dupla forma de pagamento em emissões",
    info_reissuance_portion: "Parcela",
    info_reissuance_has_comission: "Comissão",
    info_reissuance_need_tour_code: "Tour Code",
    info_reissuance_has_bonus: "Incentivo",
    info_reissuance_full_available: "Inteiramente disponivel",
    info_reissuance_partially_used: "Parcialmente utilizados",
    info_reissuance_accept_downgrade: "Reemissão com downgrade",
    info_reissuance_no_show: "No show",
    info_reissuance_accept_refund: "Devolve troco",
    info_reissuance_refund_type: "Como",
    info_reissuance_refund_way: "De que maneira",
    info_reissuance_fare_base_penalty_type: "Cobra-se o valor",
    info_reissuance_comments: "Tarifa volta ao mundo",
};

const formFields = ref({
    info_reissuance_tax_valid_date: formatDate(new Date()),
    info_reissuance_accept_installments: "sim",

    info_reissuance_company_id: 0,
    info_reissuance_tax: "",
    info_reissuance_portion: "",
    info_reissuance_has_comission: "",
    info_reissuance_need_tour_code: "",
    info_reissuance_has_bonus: "",
    info_reissuance_full_available: "",
    info_reissuance_partially_used: "",
    info_reissuance_accept_downgrade: "",
    info_reissuance_no_show: "",
    info_reissuance_accept_refund: "",
    info_reissuance_refund_type: "",
    info_reissuance_refund_way: "",
    info_reissuance_fare_base_penalty_type: "",
    info_reissuance_comments: "",
    info_reissuance_status: "",
});

onBeforeMount(() => {
    if (props?.data) {
        populateModal(props.data, formFields);
    }
});

const schema = yup.object({});

const { validateSubmit } = useFormValidation<TReemissao>(
    schema,
    formFields.value
);

const onSuccess = () => {
    alertStore.loading = false;
    $toast.success(
        props.data
            ? "Reemissão atualizada com sucesso!"
            : "Reemissão cadastrada com sucesso!",
        {
            position: "top-right",
        }
    );
    tableStore.onFetchTable();
    props.onCancel?.();
};

const onSubmit = async (Event: any) => {
    const data = await validateSubmit(Event);

    // const data = await validateSubmit(Event);

    alertStore.loading = true;

    if (props.data) {
        const dirtyData = getDirtData<any>(props.data as any, data);

        let updates = props.data.info_reissuance_status || [];

        try {
            updates = JSON.parse(updates);
        } catch (error) {
            updates = [];
        }

        const dirtyDataKeys = Object.keys(dirtyData);

        const buildUpdateList = dirtyDataKeys.map((e) => ({
            date: formatDate(new Date(), "dd/MM/yyy HH:mm:ss"),
            field: e,
            formatedField: (infoReemissaoHeaders as any)[e],
            old: (props.data as any)[e],
            new: (data as any)[e],
        }));

        const finalData = {
            ...data,
            info_reissuance_status: JSON.stringify([
                ...buildUpdateList,
                ...updates,
            ]),
        };

        await updateReemissao(finalData)
            .then(() => {
                onSuccess();
            })
            .catch((err) => {
                console.log(err);
                $toast.error("Ocorreu um erro, tente novamente");
                alertStore.loading = false;
            });
    } else {
        await saveReemissao(data)
            .then((data: any) => {
                if (data?.success) {
                    onSuccess();
                } else {
                    alertStore.loading = false;
                }
            })
            .catch((err) => {
                $toast.error("Ocorreu um erro, tente novamente", {
                    position: "top-right",
                });
                alertStore.loading = false;
            });
    }
};

const multipleChoice = ref([
    {
        value: "Não",
        label: "Não",
    },
    {
        value: "Sim",
        label: "Sim",
    },
]);

const companyList: any = ref([]);

const companyResult = async (search = "") => {
    await companyStore.getCompanies(search, 1, 10, "company_name");
    companyList.value = companyStore.companies.map((e) => ({
        label: e.company_name,
        value: e.company_id,
    }));
};

onMounted(() => {
    companyResult();
});

const onDelete = async () => {
    alertStore.loading = true;
    await deleteReemissao(props.data as TReemissao);
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};
</script>
<template>
    <form class="form-container" @submit.prevent="onSubmit">
        <div class="scrolable-content">
            <CommonInputTrvAutocomplete
                :defaultValue="props.data?.info_reissuance_company_id"
                :options="companyList"
                label-input="Companhia"
                :search-min-length="3"
                :onSelect="(value:number) => formFields.info_reissuance_company_id = value"
                @shouldSearch="companyResult"
            />
            <h3 class="section-title">Diferença de tarifa</h3>

            <section class="reinssuance-section">
                <CommonInputWrapInput
                    v-model="formFields.info_reissuance_tax"
                    label="Taxa de Reemissão"
                />

                <DataPicker
                    v-model="formFields.info_reissuance_tax_valid_date"
                    :auto-apply="true"
                    :format="formatDate"
                    placeholder="Data de validade"
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
                    :defaultValue="
                        props.data?.info_reissuance_accept_installments
                    "
                    :options="multipleChoice"
                    label-input="Aceita Parcela"
                    :search-min-length="3"
                    :onSelect="(value:string) => formFields.info_reissuance_accept_installments = value"
                />
                <CommonInputWrapInput
                    v-model="formFields.info_reissuance_portion"
                    label="Parcela"
                />
                <CommonInputTrvAutocomplete
                    :defaultValue="props.data?.info_reissuance_has_comission"
                    :options="multipleChoice"
                    label-input="Comissão"
                    :search-min-length="3"
                    :onSelect="(value:string) => formFields.info_reissuance_has_comission = value"
                />

                <CommonInputTrvAutocomplete
                    :defaultValue="props.data?.info_reissuance_need_tour_code"
                    :options="multipleChoice"
                    label-input="Tour code"
                    :search-min-length="3"
                    :onSelect="(value:string) => formFields.info_reissuance_need_tour_code = value"
                />

                <CommonInputWrapInput
                    v-model="formFields.info_reissuance_has_bonus"
                    label="Incentivo"
                />
            </section>

            <h3 class="section-title">Regras para Reemissão</h3>
            <section class="reinssuance-section">
                <CommonInputWrapInput
                    v-model="formFields.info_reissuance_full_available"
                    label="Inteiramente disponivel"
                />

                <CommonInputWrapInput
                    v-model="formFields.info_reissuance_partially_used"
                    label="Parcialmente utilizados"
                />

                <CommonInputTrvAutocomplete
                    :defaultValue="props.data?.info_reissuance_accept_downgrade"
                    :options="multipleChoice"
                    label-input="Reemissão com downgrade"
                    :search-min-length="3"
                    :onSelect="(value:string) => formFields.info_reissuance_accept_downgrade = value"
                />

                <CommonInputWrapInput
                    label="No show"
                    v-model="formFields.info_reissuance_no_show"
                />
            </section>

            <h3 class="section-title">Diferença à menor/Devolução de troco</h3>
            <section class="reinssuance-section">
                <CommonInputTrvAutocomplete
                    :defaultValue="props.data?.info_reissuance_accept_refund"
                    :options="multipleChoice"
                    label-input="Devolve troco"
                    :search-min-length="3"
                    :onSelect="(value:string) => formFields.info_reissuance_accept_refund = value"
                />
                <CommonInputWrapInput
                    label="Como"
                    v-model="formFields.info_reissuance_refund_type"
                />
                <CommonInputWrapInput
                    label="De que maneira"
                    v-model="formFields.info_reissuance_refund_way"
                />
            </section>
            <h3 class="section-title">Base tarifaria para multa</h3>
            <section class="reinssuance-section">
                <CommonInputWrapInput
                    label="Cobra-se o valor"
                    v-model="formFields.info_reissuance_fare_base_penalty_type"
                />
            </section>

            <h3 class="section-title">Comentários</h3>
            <section class="reinssuance-section">
                <RichText
                    label="Tarifa volta ao mundo"
                    v-model:content="formFields.info_reissuance_comments"
                />
            </section>
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
    height: 90%;
    display: flex;
    flex-direction: column;

    .section-title {
        grid-column: span 2;
        color: var(--grey-800);
        font-weight: 900;
        text-align: center;
        font-size: 16px;
    }

    .scrolable-content {
        flex: 1 0 0;
        overflow-y: auto;
        display: grid;
        padding-right: 10px;
        grid-template-columns: repeat(1, 1fr);
        gap: 24px;
    }

    .reinssuance-section {
        display: grid;
        gap: 24px;
        grid-template-columns: repeat(2, minmax(250px, 1fr));
        background-color: var(--grey-400);
        padding: 12px;
        border-radius: 9px;

        .rich-editor-component {
            grid-column: span 2;
        }
    }
}

.buttons-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
    grid-column: span 2;
    margin-top: 30px;
}
</style>
