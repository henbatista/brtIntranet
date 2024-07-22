<script lang="tsx" setup>
import { ref } from "vue";
import type { RebatesPayload } from "@/types/rebates";
import { useTableStore } from "@/stores/TableStore";
import { useAlertStore } from "@/stores/AlertStore";
import { useDeleteItemStore } from "@/stores/deleteItemStore";
import { useAuthStore } from "@/stores/AuthStore";
import { formatDate } from "@/hooks/formatDate";
import efacilService from "@/utils/efacil.service";
import { Icon } from '@iconify/vue';

const props = defineProps({
  onCancel: {
    type: Function,
  },
  onSuccess: {
    type: Function,
  },
  data: {
    type: Object as PropType<RebatesPayload>,
  },
});

const deleteStore = useDeleteItemStore();
const alertStore = useAlertStore();
const tableStore = useTableStore();
const refetch = ref(false);
const modalData = ref<RebatesPayload | null>(null);

const isAddingNew = ref(false);
const isViewingDetails = ref(false); 
const { loginUser } = useAuthStore();

const columns = [
    {
        field: "rebate_template_name",
        header: "Nome do Template",
        style: "flex: 1",
    },
    {
        header: "Criado por:",
        style: "flex: 1",
        render: (value: string, data: RebatesPayload) => (
            <span>
                {data.user?.user_name}
            </span>
        ),
    },
    {
        field: "created_at",
        header: "Data",
        render: (value: string, data: RebatesPayload) => (
            <div style={{ display: "flex", alignItems: "center" }}>
                <span>{formatDate(value, "dd/MM/yyyy HH:mm")}</span>
            </div>
        ),
        style: "flex: 1"
    },
    {
    header: "Status",
    field: "rebate_template_status",
    render: (value: number) => {
      const status = value === 1 ? 'Ativo' : 'Inativo';
      const statusClass = value === 1 ? 'text-emerald-500' : 'text-red-500';
      return (
        <span class={statusClass}>
          {status}
        </span>
      );
    },
    style: "flex: 1"
  },
    {
        field: "actions",
        header: "",
        render: (_v: string, data: RebatesPayload) => (
            <div style="display: flex; align-items: center; gap: 10px;">
                <div onClick={() => onOpenModal(data, true)} >
                <Icon icon="iconoir:eye" style="cursor: pointer;"  />
            </div>
            <div onClick={() => onDeleteClick(data)}>
                <Icon icon="iconoir:trash" style="cursor: pointer;"  />
            </div>
        </div>
        ),
        
    },
];

const onRowClick = async (data: RebatesPayload) => {
  try {
    if (data.rebate_template_id !== undefined) {
      const rebateData = await efacilService.getRebateDetails(data.rebate_template_id.toString());
      modalData.value = rebateData; 
      isViewingDetails.value = true;
      
    }
  } catch (error) {
    console.error('Erro ao buscar detalhes do rebate:', error);
  }
};

const onEdit = async (data: RebatesPayload) => {
  await onRowClick(data);
  isAddingNew.value = true;
};

const onOpenModal = async (data: RebatesPayload, isView: boolean) => {
  if (isView) {
    await onRowClick(data);
    isViewingDetails.value = true;
  } else {
    modalData.value = null;
    isAddingNew.value = true;
  }
};

const onCloseModal = () => {
  isAddingNew.value = false;
  isViewingDetails.value = false;
};

const onSuccess = () => {
  isAddingNew.value = false;
  tableStore.onFetchTable();
};

const onDelete = async (data: RebatesPayload) => {
  alertStore.loading = true;
  await efacilService.deleteRebate(data.rebate_template_id);
  alertStore.loading = false;
  tableStore.onFetchTable();
};

const onDeleteClick = (data: RebatesPayload) => {
  deleteStore.setDeleteFunction(async () => {
    try {
      await efacilService.deactivateRebate(data.rebate_template_id.toString());
      alertStore.success = true;
      alertStore.message = "Rebate desativado com sucesso!";
      tableStore.onFetchTable();
    } catch (error) {
      alertStore.success = false;
      alertStore.message = `Erro ao desativar rebate: ${error.message}`;
    }
  });
  deleteStore.handleOpenPopUp();
};


provide("refetchSearch", refetch);
</script>

<template>
    <div>
      <NuxtLayout name="main">
        <main class="body-content credit-page-table">
          <transition name="slide-fade" mode="out-in">
            <div v-if="isAddingNew" key="form">
              <PagesRebateConfig
                :onCancel="onCloseModal"
                :data="modalData"
                :on-success="onSuccess"
              />
            </div>
            <div v-else-if="isViewingDetails" key="details">
              <RebateDetails
                :data="modalData"
                :onCancel="onCloseModal"
              />
            </div>
            <div v-else key="table">
              <TableComponent
                title="Configuração"
                addNewLabel="Cadastrar"
                description="Lista de template de incentivos"
                src="/images/icons/png-color/settings.png"
                :columns="columns"
                :onRowClick="onRowClick"
                :onAddNew="onOpenModal"
                apiUrl="suporte/rebate/listar"
              />
            </div>
          </transition>
          <LayoutFooter />
  
          <!-- Modal de confirmação -->
          <Modal v-if="deleteStore.openModal" @close="deleteStore.handleOpenPopUp">
            <template #header>
              {{ deleteStore.props.modalTitle }}
            </template>
            <template #body>
              {{ deleteStore.props.text }}
            </template>
            <template #footer>
              <button @click="deleteStore.handleOpenPopUp">Cancelar</button>
              <button @click="deleteStore.handleDeleteItem">Confirmar</button>
            </template>
          </Modal>
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

/* Animações de transição */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: perspective(1000px) translate3d(0, 0, -50px) scale(0.9);
  opacity: 0;
}

.slide-fade-enter-to {
  transform: perspective(1000px) translate3d(0, 0, 0) scale(1);
  opacity: 1;
}

.slide-fade-leave-active {
  transform: perspective(1000px) translate3d(0, 0, -50px) scale(0.9);
  opacity: 0;
}

.slide-fade-enter {
  transform: scale(0.5);
  opacity: 0;
}
</style>
