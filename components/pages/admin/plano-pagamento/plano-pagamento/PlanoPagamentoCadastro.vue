<script lang="ts" setup>
import { useAlertStore } from "@/stores/AlertStore";
import VueDatePicker from "@vuepic/vue-datepicker";
import { Icon } from "@iconify/vue";
import * as yup from "yup";
import { populateModal } from "@/hooks/populateModals";
import useFormValidation from "@/hooks/formValidation";
import { useTableStore } from "@/stores/TableStore";
import { formatDate } from "@/hooks/formatDate";
import { useCompanyStore } from "@/stores/CompanyStore";
import type { Company } from "@/types/frontend";
import type { TPaymentPlan } from "@/types/paymentPlan";

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
const loadingData = ref(false);
const alertStore = useAlertStore();
const DataPicker = shallowRef(VueDatePicker);
const companyStore = useCompanyStore();

const formFields = ref<TPaymentPlan>({
    payment_config_company_id: "",
    payment_config_description: "",
    payment_config_expiration: "",
    payment_config_offline: "",
    payment_config_code_share: "",
    payment_config_code_share_comments: "",
    payment_config_tariff_breaks: "",
    payment_config_tariff_breaks_comments: "",
    payment_config_minimum_installment: "",
    payment_config_installment_allows_multiple_payments: true,
    creditCards_systems: [],
});

watch(
    props,
    async () => {
        if (props?.data) {
            loadingData.value = true;
            await populateModal(props.data, formFields);

            if (props.data?.credit_cards?.length) {
                formFields.value.creditCards_systems = props.data.credit_cards;
            }
            loadingData.value = false;
        }
    },
    {
        immediate: true,
    }
);

const schema = yup.object({});

const { validateSubmit } = useFormValidation<TPaymentPlan>(
    schema,
    formFields.value
);

const onSuccess = () => {
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};
const onSubmit = async (Event: any) => {
    const { payment_config_expiration, ...rest } = await validateSubmit(Event);

    const data = {
        payment_config_expiration: formatDate(
            new Date(payment_config_expiration),
            "yyyy-MM-dd"
        ),
        ...rest,
    };

    alertStore.loading = true;

    if (props.data) {
        delete data.created_at;
        delete data.updated_at;
        delete data.credit_cards;

        const formatedData = {
            ...data,
            creditCards_systems: data.creditCards_systems.map((e) => ({
                cardId: Number(e?.credit_card_id),
                acceptedSystems: e.acceptedSystems?.length
                    ? e.acceptedSystems
                    : e.systems?.map((e) => Number(e?.system_id)),
                installments: e.installments.map((i) => ({
                    installment_code: i.installment_code,
                    installment_coefficient: i.installment_coefficient,
                    installment_fee: i.installment_fee,
                    installment_number: i.installment_number,
                })),
            })),
        };

        await updatePaymentPlan(formatedData)
            .then(() => {
                onSuccess();
            })
            .catch(() => {
                alertStore.loading = false;
            });
    } else {
        await savePaymentPlan(data)
            .then(() => {
                onSuccess();
            })
            .catch(() => {
                alertStore.loading = false;
            });
    }
};

const companyList = ref<any[]>([]);

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

const handleSelectCompany = (data: string) => {
    formFields.value.payment_config_company_id = data;
};

const addItem = () => {
    const newItem = {
        _id: Math.floor(Math.random() * (9999999 - 1)) + 1,
        cardId: 0,
        acceptedSystems: [],
        installments: [],
    };
    formFields.value.creditCards_systems.push(newItem);
};

const removeItem = (itemId: string | number) => {
    const index = formFields.value.creditCards_systems.findIndex(
        (item) => item._id === itemId
    );
    if (index !== -1) {
        formFields.value.creditCards_systems.splice(index, 1);
    }
};

const onDelete = async () => {
    alertStore.loading = true;
    await deletePaymentPlan(props.data as TPaymentPlan);
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};
</script>
<template>
    <form class="form-container" @submit.prevent="onSubmit">
        <div class="scrolable-content">
            <CommonInputTrvAutocomplete
                :defaultValue="props.data?.payment_config_company_id + ''"
                :options="companyList"
                labelInput="Companhia Aérea"
                :searchMinLength="3"
                :clearable="true"
                :onSelect="handleSelectCompany"
                @shouldSearch="companyResult"
            />
            <CommonInputWrapInput
                v-model="formFields.payment_config_description"
                label="Descrição"
            />

            <DataPicker
                v-model="formFields.payment_config_expiration"
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

            <CommonInputWrapInput
                v-model="formFields.payment_config_offline"
                label="Offline"
            />
            <CommonInputWrapInput
                v-model="formFields.payment_config_code_share"
                label="CodeShare"
            />
            <CommonInputWrapInput
                v-model="formFields.payment_config_code_share_comments"
                label="CodeShare Comentários"
            />
            <CommonInputWrapInput
                v-model="formFields.payment_config_tariff_breaks"
                label="Tarifa"
            />
            <CommonInputWrapInput
                v-model="formFields.payment_config_tariff_breaks_comments"
                label="Tarifa Comentários"
            />
            <CommonInputWrapInput
                v-model="formFields.payment_config_minimum_installment"
                label="Tarifa Comentários"
            />

            <CommonInputCheckBoxSwitch
                labelOff="Ativo"
                v-model="
                    formFields.payment_config_installment_allows_multiple_payments
                "
            />

            <section class="cards-container">
                <div class="title-container">
                    <h6 class="title">Cartões</h6>

                    <ButtonComponent
                        @click="addItem"
                        variant="text"
                        style="padding: 10px"
                    >
                        <Icon icon="heroicons-solid:plus" />
                    </ButtonComponent>
                </div>

                <div class="tickets-list">
                    <PaymentCard
                        v-for="(item, index) in formFields.creditCards_systems"
                        :key="item._id"
                        :onRemove="() => removeItem(item._id)"
                        :index="index + 1"
                        :data="item"
                    />
                </div>
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

    .scrolable-content {
        flex: 1 0 0;
        overflow-y: auto;
        padding-right: 10px;
        display: grid;
        gap: 24px;
        grid-template-columns: repeat(3, minmax(250px, 1fr));
        align-content: baseline;
        gap: 24px;
    }
}

.buttons-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
    grid-column: span 3;
    margin-top: 30px;
}

.cards-container {
    grid-column: span 3;

    .title-container {
        display: flex;
        position: sticky;
        top: 0;
        z-index: 9;
        background-color: var(--white);
        align-items: center;
        gap: 20px;
        padding: 2px 0;

        h6 {
            font-size: 16px;
        }
    }

    .tickets-list {
        max-width: 930px;
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-top: 20px;
    }
}
</style>
