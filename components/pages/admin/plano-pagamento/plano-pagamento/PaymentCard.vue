<script setup lang="tsx">
import vSelect from "vue-select";
import { Icon } from "@iconify/vue";
import { useCardStore } from "@/stores/CardStore";
import type { TCreditCardSystem } from "@/types/card";
import "vue-select/dist/vue-select.css";
import { useSystemStore } from "@/stores/SystemStore";
import EditAndDeleteTableButton from "@/components/common/editAndDeleteTablebutton/EditAndDeleteTableButton.vue";
import { useDeleteItemStore } from "@/stores/deleteItemStore";

const props = defineProps({
    onRemove: {
        type: Function,
    },
    index: {
        type: Number,
    },
    data: {
        type: Object,
    },
});

const removeAnim = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const deleteStore = useDeleteItemStore();

const cardStore = useCardStore();
const systemStore = useSystemStore();

interface installmentsType {
    installment_number: number;
    installment_coefficient: string;
    installment_code: number;
    installment_fee: number;
}

const handleRemove = () => {
    removeAnim.value = true;
    setTimeout(() => props?.onRemove?.(), 500);
};

const cardList = ref<any>([]);
const systemList = ref<any>([]);

const getCardList = async () => {
    await cardStore.getCards("", 1, 10, "");
    cardList.value = cardStore.cards.map((e: any) => ({
        label: e?.credit_card_name,
        value: e?.credit_card_id + "",
    }));

    console.log({
        c: cardList.value,
        data: props.data,
    });
};

const getSystemList = async () => {
    await systemStore.getSystems("", 1, 10, "");
    systemList.value = systemStore.Systems.map((e) => ({
        label: e?.system_name,
        code: e?.system_id,
    }));
};

onMounted(() => {
    getCardList();
    getSystemList();
});

watch([containerRef], () => {
    if (containerRef?.value) {
        containerRef.value.scrollIntoView({
            behavior: "smooth",
            inline: "end",
        });
    }
});

const handleSelectCard = (data: number) => {
    (props.data as TCreditCardSystem).cardId = data;
};

const openModal = ref(false);
const modalData = ref<installmentsType>();

const onOpenModal = () => {
    openModal.value = !openModal.value;
};

const onRowClick = async (data: installmentsType) => {
    modalData.value = data;
    openModal.value = !openModal.value;
};

const removeItem = (itemId: string | number) => {
    const index = (props.data as TCreditCardSystem).installments.findIndex(
        (item) => item.id === itemId
    );
    if (index !== -1) {
        (props.data as TCreditCardSystem).installments.splice(index, 1);
    }
};

const columns = [
    {
        field: "installment_number",
        header: "Número da parcela",
        style: "flex: 1",
    },

    {
        field: "installment_coefficient",
        header: "Coeficiente de parcela",
    },
    {
        field: "installment_code",
        header: "Código da parcela",
    },
    {
        field: "installment_fee",
        header: "Taxa da parcela",
    },
    {
        field: "actions",
        header: "",
        render: (_v: string, data: TCreditCardSystem["installments"]) => (
            <EditAndDeleteTableButton
                onEdit={() => onRowClick(data)}
                onClickDeleteButton={() =>
                    deleteStore.setDeleteFunction(() => removeItem(data.id))
                }
            />
        ),
    },
];

const handleAddInstallment = (data: installmentsType) => {
    const newIndex = (props.data as TCreditCardSystem).installments.length;

    (props.data as TCreditCardSystem).installments[newIndex] = {
        ...data,
        id: newIndex,
    };

    // dataSource.value = [...dataSource.value, data];

    onOpenModal();
};
</script>

<template>
    <PopUpComponent :open="openModal" title="Parcela">
        <InstallmentPopUp
            :data="modalData"
            :onClose="onOpenModal"
            :onAddNew="handleAddInstallment"
        />
    </PopUpComponent>
    <div
        class="ticket-card-payment"
        :class="removeAnim ? 'remove-ticket' : ''"
        ref="containerRef"
    >
        <p class="ticket-title">
            Cartão {{ index?.toString().padStart(2, "0") }}
        </p>
        <ButtonComponent
            @click="handleRemove"
            variant="text"
            style="padding: '10px 12px'; justify-self: flex-end"
        >
            <Icon icon="mingcute:close-fill" />
        </ButtonComponent>
        <CommonInputTrvAutocomplete
            :defaultValue="props.data?.cardId || props?.data?.credit_card_id"
            :options="cardList"
            v-if="cardList.length"
            label-input="Cartão"
            :search-min-length="3"
            :clearable="true"
            :onSelect="handleSelectCard"
            @shouldSearch="getCardList"
        />
        <vSelect
            v-model="(props.data as TCreditCardSystem).acceptedSystems"
            multiple
            :options="systemList"
            placeholder="Sistemas"
            :reduce="(data: any) => Number(data.code)"
        />

        <ButtonComponent @click="onOpenModal">
            Adicionar Parcela
        </ButtonComponent>

        <div style="grid-column: span 3">
            <InstallmentTable
                :dataSource="(props.data as TCreditCardSystem).installments"
                addNewLabel="Adicionar Parcela"
                :onRowClick="onRowClick"
                :columns="columns"
                :onDelete="removeItem"
            />
        </div>
    </div>
</template>

<style lang="scss">
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
@keyframes fadeOut {
    0% {
        flex-basis: 250px;
        opacity: 1;
    }

    100% {
        width: 0px;
        opacity: 0;
        padding: 0;
        flex: 0;
        margin: 0 -10px;
    }
}

.ticket-card-payment {
    flex-basis: 250px;
    flex-grow: 1;
    display: grid;
    padding: 20px;
    grid-template-columns: 1fr 1fr 190px;
    border-radius: 12px;
    gap: 16px;
    border: solid 1px var(--grey-400);
    box-shadow: 0 6px 12px -5px rgba(0, 0, 0, 0.1);
    animation: 0.5s fadeIn ease forwards;
    transform-origin: left;

    .v-select {
        .vs__dropdown-toggle {
            height: 100%;

            .vs__selected {
                background-color: var(--blue-600);
                color: var(--white);
                font-size: 14px;

                button {
                    fill: var(--white);
                }
            }
        }
    }
}

.ticket-title {
    grid-column: span 2;
}

.wrap-input input {
    height: 40px;
}
.remove-ticket {
    animation: 0.4s fadeOut ease forwards;
}
</style>
