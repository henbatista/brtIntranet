<script lang="ts" setup>
import { useTableStore } from "@/stores/TableStore";
import { populateModal } from "@/hooks/populateModals";
import type { TReserve } from "@/types/reserve";
import { useAlertStore } from "@/stores/AlertStore";
import type { optionsType } from "@/types/global";
import { useSystemStore } from "@/stores/SystemStore";
import { useAgencyStore } from "@/stores/AgencyStore";

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

const formInput = ref<TReserve>({
    reserve_user: "",
    reserve_password: "",
    reserve_description: "",
    reserve_code: "",
    reserve_system: "",
    reserve_secondary_code: "",
    reserve_status: true,
    reserve_agency: "",
});

const tableStore = useTableStore();
const alertStore = useAlertStore();
const sistemStore = useSystemStore();
const agencyStore = useAgencyStore();
const { $toast } = useNuxtApp();

onBeforeMount(() => {
    if (props?.data) {
        populateModal(props.data, formInput);
    }
});

const agencyOptions = ref<optionsType[]>([]);
const sistemOptions = ref<optionsType[]>([]);

const fetchSistem = async (search = "") => {
    await sistemStore.getSystems(search, 1, 10, "");
    sistemOptions.value = sistemStore.Systems.map((e) => ({
        value: e.system_id,
        label: e.system_name,
    }));
};
const fetchAgency = async (search = "") => {
    const { data } = await getAgency(search, 1, 10, "");
    agencyOptions.value = data.data.map((e) => ({
        value: e?.agency_id,
        label: e?.agency_name,
    }));
};

onMounted(() => {
    fetchSistem("");
    fetchAgency("");
});

const onSubmit = async () => {
    const data = formInput.value;

    try {
        alertStore.loading = true;

        if (props.data) {
            await updateReserve(data);
            $toast.success("Reserva Atualizado!", {
                position: "top-right",
            });
        } else {
            await saveReserve(data);
            $toast.success("Cadastro enviado com sucesso!", {
                position: "top-right",
            });
        }
        alertStore.loading = false;
        tableStore.onFetchTable();
        props.onCancel?.();
    } catch (error) {
        alertStore.loading = false;
    }
};

const onDelete = async () => {
    alertStore.loading = true;
    await deleteReserve(props.data as TReserve);
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};
</script>
<template>
    <form class="form-container" @submit.prevent="onSubmit">
        <CommonInputWrapInput
            label="Usúario"
            v-model="formInput.reserve_user"
            type="text"
        />

        <CommonInputWrapInput
            label="Senha"
            v-model="formInput.reserve_password"
            type="password"
        />

        <CommonInputWrapInput
            label="Descrição"
            v-model="formInput.reserve_description"
            type="text"
        />

        <!-- <CommonInputWrapInput label="Observação" type="text" /> -->

        <CommonInputWrapInput
            label="Código"
            type="text"
            v-model="formInput.reserve_code"
        />
        <CommonInputWrapInput
            label="Código Secundario"
            type="text"
            v-model="formInput.reserve_secondary_code"
        />
        <CommonInputCheckBoxSwitch
            id="mySwitch"
            label-off="Status"
            v-model="formInput.reserve_status"
        />

        <CommonInputTrvAutocomplete
            v-if="sistemOptions.length"
            :options="sistemOptions"
            label-input="Sistema"
            :defaultValue="props.data?.reserve_system"
            :search-min-length="2"
            :clearable="true"
            @shouldSearch="fetchSistem"
            :onSelect="(data:string) => formInput.reserve_system = data && data"
        />
        <CommonInputTrvAutocomplete
            v-if="agencyOptions.length"
            :options="agencyOptions"
            label-input="Agência"
            :defaultValue="props.data?.reserve_agency"
            :search-min-length="2"
            :clearable="true"
            @shouldSearch="fetchAgency"
            :onSelect="(data:string) => formInput.reserve_agency = data && data"
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
