<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { useToast } from "vue-toast-notification";
import { useTableStore } from "@/stores/TableStore";
import { populateModal } from "@/hooks/populateModals";

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

// onBeforeMount(() => {
//     if (props?.data) {
//         populateModal(props.data, branch);
//     }
// });

const $toast = useToast();
const nomeAtendimento = ref("");

const onSubmit = () => {
    nomeAtendimento.value = "";
    showToastSuccess();
};

const showToastSuccess = () => {
    $toast.success("Cadastro enviado com sucesso!", {
        position: "top-right",
    });
};

const items = ref<any[]>([]);

const addItem = () => {
    const newItem = {
        id: Math.floor(Math.random() * (9999999 - 1)) + 1,
        reserva: "Reserva " + (items.value.length + 1),
        bilhete: "Bilhete " + (items.value.length + 1),
        tarifa: "Tarifa " + (items.value.length + 1),
        taxaEmbarque: "Taxa de Embarque " + (items.value.length + 1),
        taxaServico: "Taxa de Serviço " + (items.value.length + 1),
        outrasTaxas: "Outras Taxas " + (items.value.length + 1),
    };
    items.value.push(newItem);
};

const removeItem = (itemId) => {
    const index = items.value.findIndex((item) => item.id === itemId);
    if (index !== -1) {
        items.value.splice(index, 1);
    }
};

const requesterOptions = [
    {
        label: "Lorem ipsum",
        value: "Lorem ipsum",
    },
];
</script>
<template>
    <form class="form-container" @submit.prevent="onSubmit">
        <div class="form-body">
            <CommonInputWrapInput
                label="Protocolo de Atendimento"
                :is-required="true"
            />

            <CommonInputWrapInput label="Atendente" :is-required="true" />

            <CommonInputWrapInput label="Consolidador" :is-required="true" />
            <CommonInputWrapInput label="Agências" :is-required="true" />

            <CommonInputWrapInput label="Base" :is-required="true" />
            <SelectComponent label="Solicitante" :options="requesterOptions" />

            <SelectComponent
                label="Tipo de Atendimento"
                :options="requesterOptions"
            />

            <SelectComponent
                label="Forma de Contato"
                :options="requesterOptions"
            />

            <SelectComponent
                label="Companhia Aérea"
                :options="requesterOptions"
            />

            <SelectComponent
                label="Forma de Pagamento"
                :options="requesterOptions"
            />
            <SelectComponent label="Sistema" :options="requesterOptions" />

            <SelectComponent
                label="Status do Atendimento"
                :options="requesterOptions"
            />

            <RichText
                label="Descrição do Atendimento"
                style="grid-column: span 3; width: 100%"
            />

            <section class="tickets-container">
                <div class="title-container">
                    <h6 class="title">Passagens</h6>

                    <ButtonComponent
                        @click="addItem"
                        variant="text"
                        style="padding: 10px"
                    >
                        <Icon icon="heroicons-solid:plus" />
                    </ButtonComponent>
                </div>

                <div class="tickets-list">
                    <TicketCard
                        v-for="(item, index) in items"
                        :key="item.id"
                        :onRemove="() => removeItem(item.id)"
                        :index="index + 1"
                    />
                </div>
            </section>
        </div>

        <div class="buttons-container">
            <ButtonComponent @click="props?.onCancel" variant="error">
                Cancelar
            </ButtonComponent>
            <ButtonComponent type="submit"> Salvar </ButtonComponent>
        </div>
    </form>
</template>

<style lang="scss" scoped>
.form-container {
    .form-body {
        max-height: 80vh;
        display: grid;
        grid-template-columns: repeat(3, minmax(250px, 1fr));
        gap: 24px;
        padding: 0 12px 20px 0;
        overflow-y: auto;

        &::-webkit-scrollbar {
            width: 10px;
        }
        &::-webkit-scrollbar-track {
            background: transparent;
        }
        &::-webkit-scrollbar-thumb {
            background: var(--grey-500);
            border-radius: 90px;
        }
        &::-webkit-scrollbar-thumb:hover {
            background: var(--grey-600);
        }
    }
}

.buttons-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
    margin-top: 30px;
    grid-column: span 3;
}

.tickets-container {
    grid-column: span 3;
    .title-container {
        display: flex;
        position: sticky;
        top: 0;
        background-color: var(--white);
        align-items: center;
        gap: 20px;
        z-index: 3;
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
        overflow: hidden;
        margin-top: 20px;
    }
}
</style>
