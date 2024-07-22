<script lang="tsx" setup>
import type { TCredit } from "@/types/credit";
import EditAndDeleteTableButton from "@/components/common/editAndDeleteTablebutton/EditAndDeleteTableButton.vue";
import { useTableStore } from "@/stores/TableStore";
import { useAlertStore } from "@/stores/AlertStore";
import { useDeleteItemStore } from "@/stores/deleteItemStore";
import type { Agency, User } from "@/types/frontend";
import CreditStatusSelectButtons from "@/components/pages/credito/CreditStatusSelectButtons.vue";
import { formatDate } from "@/hooks/formatDate";
import { useAuthStore } from "@/stores/AuthStore";

const deleteStore = useDeleteItemStore();
const alertStore = useAlertStore();
const tableStore = useTableStore();
const refetch = ref(false);
const modalData = ref<TCredit | null>(null);
const openModal = ref(false);
const { loginUser } = useAuthStore();

const sortBy = ref<'date'>('date');

const currencyFormatter = (value: string) => {
  const valueToNumber = Number(value);

  if (isNaN(valueToNumber)) {
    return value.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  }

  return valueToNumber.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
};

const isMoreThan20Minutes = (createdDate: string) => {
  const date = new Date(createdDate);
  const now = new Date();
  const diff = Math.abs(now.getTime() - date.getTime());
  return diff > 20 * 60 * 1000; 
};

const columns = [
    {
        field: "credit_protocol",
        header: "Protocolo",
        style: "width: 120px",
        
    },
    {
  field: "created_at",
  header: "Data",
  render: (value: string, data: TCredit) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span>{formatDate(value, "dd/MM/yyyy HH:mm")}</span>
      {data.latest_credit_status.credit_status_name === "solicitado" &&
        isMoreThan20Minutes(value) && (
          <div
            class="custom-span ml-2 -mt-3 h-[5px] w-[5px] bg-red-500 rounded-full inline-block ring-[3px] ring-opacity-30 ring-red-500"
          ></div>
        )}
    </div>
  ),
  style: "flex: 1"
},

    {
        field: "user",
        header: "Atendente",
        render: (value: User) => <span>{value?.user_name}</span>,
        style: "flex: 1"
    },
    {
        field: "agency",
        header: "Agência",
        render: (value: Agency) => <span>{value?.agency_name}</span>,
        style: "flex: 1"
    },
    {
        field: "credit_request_type",
        header: "Solicitação",
        style: "flex: 1"
    },
    {
        field: "credit_invoiced_value",
        header: "Faturamento",
        render: (value: string) => <span>{currencyFormatter(value)}</span>,
        style: "flex: 1"
    },
    {
        field: "credit_card_value",
        header: "Cartão",
        render: (value: string) => <span>{currencyFormatter(value)}</span>,
        style: "flex: 1"
    },
    {
        field: "credit_status_name",
        header: "Status",
        render: (_v: string, data: TCredit) => (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    background: data.latest_credit_status.credit_status_color,
                }}
                class="credit-status-column"
            >
                <span
                    style={{
                        color: data.latest_credit_status?.credit_status_color,
                    }}
                >
                    {data.latest_credit_status?.credit_status_name}
                </span>
    
            </div>
        ),
    },
    {
    field: "actions",
    header: "",
    render: (_v: string, data: TCredit) => {
      const isSolicitado = data.latest_credit_status.credit_status_name === "solicitado";
      const isUserCreator = data.user.user_name === loginUser?.user_name;

      return (
        <div>
          <EditAndDeleteTableButton
            onEdit={() => onRowClick(data)}
            onClickDeleteButton={isSolicitado && isUserCreator ? () => deleteStore.setDeleteFunction(() => onDelete(data)) : undefined}
            showDeleteButton={isSolicitado && isUserCreator}
          />
        </div>
      );
    },
  },
];

const onRowClick = async (data: TCredit) => {
  try {
    console.log('Dados da linha clicada:', data);
    if (data.credit_id !== undefined) {
      const creditData = await getCredit(data.credit_id.toString());
      console.log('Dados do crédito recebidos:', creditData);
      modalData.value = creditData.data; 
      openModal.value = !openModal.value;
    }
  } catch (error) {
    console.error('Erro ao buscar crédito:', error);
  }
};

const onOpenModal = () => {
  modalData.value = null;
  openModal.value = !openModal.value;
};

const onCloseModal = () => {
  openModal.value = !openModal.value;
  console.log(openModal);
};

const onSuccess = () => {
  openModal.value = !openModal.value;
  tableStore.onFetchTable();
};

const onDelete = async (data: TCredit) => {
  alertStore.loading = true;
  await deleteCredit(data);
  alertStore.loading = false;
  tableStore.onFetchTable();
};



provide("refetchSearch", refetch);
</script>

<template>
    <div>
      <ModalComponent
        :title="modalData ? 'Informações do Crédito' : 'Cadastro de Créditos'"
        :open="openModal"
      >
        <PagesCreditoCadastro
          :onCancel="onCloseModal"
          :data="modalData"
          :on-success="onSuccess"
        />
      </ModalComponent>
      <NuxtLayout name="main">
        <main class="body-content credit-page-table">
          <TableComponent
            title="Crédito"
            addNewLabel="Cadastrar"
            src="/images/icons/png-color/credit-icon.png"
            :columns="columns"
            :onRowClick="onRowClick"
            :onAddNew="onOpenModal"
            apiUrl="suporte/credito/listar"
            :table-heading="CreditStatusSelectButtons"
            :sortBy="sortBy"
          />
          <div>
            <label for="sort-by">Ordenar por:</label>
            <select id="sort-by" v-model="sortBy">
              <option value="date">Data</option>
              <option value="alphabetical">Ordem Alfabética</option>
            </select>
          </div>
          <LayoutFooter />
        </main>
      </NuxtLayout>
    </div>
  </template>

<style lang="scss">
.credit-status-column {
  padding: 4px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  span {
    font-size: 13px;
    filter: invert(1) brightness(6) grayscale(1);
    font-weight: 600;
    text-transform: capitalize;
  }
}

.credit-status-list-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  .credit-status-button {
    padding: 4px 8-px;
    text-transform: capitalize;
    span {
      font-size: 13px;
      filter: invert(1) brightness(6) grayscale(1);
      font-weight: 600;
    }
  }
}

@keyframes blink {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }
  }
  
  .custom-span {
    animation: blink 1.5s infinite;
  }
  
</style>
