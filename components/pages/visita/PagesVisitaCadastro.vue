<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useTableStore } from "@/stores/TableStore";
import { populateModal } from "@/hooks/populateModals";
import type { TVisit } from "@/types/visit";
import { useAlertStore } from "@/stores/AlertStore";
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

const formInput = ref<TVisit>({
    visit_objective: "",
    visit_activity_performed: "",
    visit_agency_name: "",
    visit_agency_address: "",
    visit_agency_complement: "",
    visit_agency_city: "",
    visit_agency_city_uf: "",
    visit_date: new Date(),
    visit_distance_km: "",
    visit_status: false,
    visit_people_contacted: "",
    visit_comments: "",
    visit_agency_concessions: "",

    visit_agency_profile: "",
    visit_agency_perfile_additional: "",
    visit_agency_brt_profile: "",
});

onBeforeMount(() => {
    if (props?.data) {
        showAgency.value = true;
        populateModal(props.data, formInput);
    }
});

const DataPicker = shallowRef(VueDatePicker);

const profileAgency = ref("");
const addtionalProfile = ref("");
const profileBRT = ref("");

const objectiveOptions = ref([
    { value: "Prospecção", label: "Prospecção" },
    { value: "Manutenção", label: "Manutenção" },
    { value: "Recuperação", label: "Recuperação" },
    { value: "Interno", label: "Interno" },
]);

const dataAgencyProfile = ref([
    { value: "Corporativo", label: "Corporativo" },
    { value: "Lazer", label: "Lazer" },
    { value: "Grupos", label: "Grupos" },
    { value: "Turismo Religioso", label: "Turismo Religioso" },
]);
const profileAddAgency = ref([
    { value: "V-Cash", label: "V-Cash" },
    { value: "Corporate", label: "Corporate" },
    { value: "White label", label: "White Label" },
    { value: "Acordos Corporativos CIAS", label: "Acordos Corporativos CIAS" },
]);
const profileWithBRT = ref([
    { value: "Consolidação", label: "Consolidação" },
    { value: "Operação", label: "Operação" },
    { value: "On-line", label: "On-line" },
    { value: "Carro", label: "Carro" },
    { value: "Ônibus", label: "Ônibus" },
]);

const onSubmit = async () => {
    const data = formInput.value;
    alertStore.loading = true;
    try {
        if (props.data) {
            await updateVisit(data);
        } else {
            await saveVisit(data);
        }
        alertStore.loading = false;
        tableStore.onFetchTable();
        handleCancel();
        props.onSuccess?.();
    } catch (error) {
        alertStore.loading = false;
    }
};

const onDelete = async () => {
    alertStore.loading = true;
    await deleteVisit(props.data as TVisit);
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};

const showAgencyProfile = () => {
    showAgency.value = true;
};
const closeAgencyProfile = () => {
    showAgency.value = false;
    clearAgencyProfile();
};

const clearAgencyProfile = () => {
    profileAgency.value = "";
    addtionalProfile.value = "";
    profileBRT.value = "";
};
</script>
<template>
    <form class="visit-form" @submit.prevent="onSubmit">
        <CommonInputTrvAutocomplete
            :options="objectiveOptions"
            label-input="Objetivo"
            :search-min-length="3"
            :clearable="true"
            :defaultValue="formInput.visit_objective"
            :onSelect="(data: string) => formInput.visit_objective = data"
        />
        <CommonInputWrapInput
            label="Atividade Realizada"
            v-model="formInput.visit_activity_performed"
        />
        <CommonInputWrapInput
            label="Agência"
            v-model="formInput.visit_agency_name"
        />
        <CommonInputWrapInput
            label="Endereço"
            v-model="formInput.visit_agency_address"
        />

        <CommonInputWrapInput
            label="Complemento"
            v-model="formInput.visit_agency_complement"
        />
        <CommonInputWrapInput
            label="Cidade"
            v-model="formInput.visit_agency_city"
        />

        <CommonInputWrapInput
            v-model="formInput.visit_agency_city_uf"
            label="UF"
        />

        <DataPicker
            v-model="formInput.visit_date"
            :auto-apply="true"
            :format="formatDate"
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
            label="KM Percorrido"
            type="number"
            v-model="formInput.visit_distance_km"
        />
        <CommonInputWrapInput
            label="Pessoas Contatadas"
            v-model="formInput.visit_people_contacted"
            type="text"
        />
        <CommonInputWrapInput
            label="Comentarios"
            v-model="formInput.visit_comments"
            type="text"
        />
        <CommonInputWrapInput
            label="Concessões a agência"
            v-model="formInput.visit_agency_concessions"
            type="text"
        />
        <CommonInputCheckBoxSwitch
            id="mySwitch"
            label-off="Status"
            v-model="formInput.visit_status"
        />

        <ButtonComponent
            @click="showAgencyProfile"
            variant="text"
            v-if="!showAgency"
        >
            Incluir perfil Agência
        </ButtonComponent>

        <div v-if="showAgency" class="agency-container">
            <CommonInputTrvAutocomplete
                :options="profileAddAgency"
                label-input="Perfil Agência"
                :search-min-length="3"
                :clearable="true"
                :defaultValue="formInput.visit_agency_profile"
                :onSelect="(data: string) => formInput.visit_agency_profile = data"
            />
            <CommonInputTrvAutocomplete
                :options="dataAgencyProfile"
                label-input="Perfil Adicional"
                :search-min-length="3"
                :clearable="true"
                :defaultValue="formInput.visit_agency_perfile_additional"
                :onSelect="(data: string) => formInput.visit_agency_perfile_additional = data"
            />
            <CommonInputTrvAutocomplete
                :options="profileWithBRT"
                label-input="Perfil com BRT"
                :search-min-length="3"
                :clearable="true"
                :defaultValue="formInput.visit_agency_brt_profile"
                :onSelect="(data: string) => formInput.visit_agency_brt_profile = data"
            />
            <ButtonComponent
                @click="closeAgencyProfile"
                style="padding: 10px"
                variant="text"
                class="close-button"
            >
                <Icon icon="mingcute:close-fill" />
            </ButtonComponent>
        </div>

        <div class="buttons-container">
            <FormDeleteButton :onSuccess="onDelete" v-if="props.data" />

            <ButtonComponent @click="handleCancel" variant="text">
                Cancelar
            </ButtonComponent>
            <ButtonComponent type="submit"> Salvar </ButtonComponent>
        </div>
    </form>
</template>

<style lang="scss">
.visit-form {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;

    .buttons-container {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 14px;
        margin-top: 30px;
        grid-column: span 3;
    }

    @keyframes fadeIn {
        from {
            width: 0px;
            opacity: 0;
            padding: 0;
            flex: 0;
            transform: rotateY(90deg);
            margin: 0 -10px;
        }

        to {
            flex-basis: 250px;
            transform: rotateY(0deg);
            opacity: 1;
        }
    }

    .agency-container {
        grid-column: span 3;
        display: grid;
        padding: 20px;
        grid-template-columns: 1fr 1fr 1fr 50px;
        border-radius: 12px;
        gap: 16px;
        border: solid 1px var(--grey-400);
        box-shadow: 0 6px 12px -5px rgba(0, 0, 0, 0.1);
        animation: 0.5s fadeIn ease forwards;
        transform-origin: left;
        position: relative;

        .trv-auto-input-group {
            input {
                padding: 10px 0 0 15px;
            }
        }
    }
}
</style>
