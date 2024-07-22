<script setup lang="ts">
import { useEfacilStore } from '~/stores/EfacilStore';
import { onMounted, ref, computed } from 'vue';
import type { TourCode } from "~/types/tourCode";
import type { RebatesPayload } from "~/types/rebates";

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

const efacilStore = useEfacilStore();
const tourCodesEfacil = ref<TourCode[]>([]);
const templateName = ref('');
const templateComments = ref('');
const isLoading = ref(true); 

const filters = ref({
  iata: '',
  backoffice: '',
  id: ''
});

const loadTourCodes = async () => {
  isLoading.value = true; // Ativar estado de carregamento
  await efacilStore.getTourCodes();
  tourCodesEfacil.value = efacilStore.tourCodesEfacil;
  isLoading.value = false; // Desativar estado de carregamento
};

const filteredTourCodes = computed(() => {
  const iataFilter = filters.value.iata.toLowerCase();
  const backofficeFilter = filters.value.backoffice.toLowerCase();
  const idFilter = filters.value.id.toLowerCase();
  
  return tourCodesEfacil.value.filter(tour => {
    return (
      (iataFilter === '' || tour.efacil_company_iata.toLowerCase().includes(iataFilter)) &&
      (backofficeFilter === '' || tour.efacil_tourcode_backoffice.toLowerCase().includes(backofficeFilter)) &&
      (idFilter === '' || tour.efacil_tourcode_id.toLowerCase().includes(idFilter))
    );
  });
});

const generateOptions = (maxValue: number) => {
  const options = [];
  for (let i = 0.00; i <= maxValue; i += 0.25) {
    options.push(i.toFixed(2));
  }
  return options;
};

const onSubmitRebates = async () => {
  await efacilStore.createRebates(templateName.value, templateComments.value);
  props?.onSuccess(); 
};


onMounted(() => {
  loadTourCodes();
});

</script>

<template>
    <section class="">
      <div class="grid grid-cols-4 gap-6">
        <TableHeader class="-mt-1" title="Configuração" description="Cadastrar template de incentivo" src="/images/icons/png-color/settings.png" />
        <CommonInputWrapInput v-model="filters.iata" type="text" label="Filtrar por IATA" class="border p-2 shadow-sm"/>
        <CommonInputWrapInput v-model="filters.backoffice" type="text" label="Filtrar por Backoffice" class="border p-2 shadow-sm"/>
        <CommonInputWrapInput v-model="filters.id" type="text" label="Filtrar por ID" class="border p-2 shadow-sm"/>
      </div>
  
      <div class="main-content grid grid-cols-4 gap-6 -mt-2">
        <div class="fixed-section border shadow-sm rounded-sm col-span-1">
          <div class="mb-4 grid grid-cols-1 gap-6">
            <CommonInputWrapInput v-model="templateName" type="text" label="Nome do Template" class="border p-2"/>
            <div>
              <RichText v-model:content="templateComments" label="Descrição" maxlength="5" />
            </div>
          </div>
        </div>
  
        <div class="table-container col-span-3 border rounded-sm bg-white shadow-sm p-5">
          <div class="loading-table-icon-container"  v-if="isLoading">
            <div class="loading">
              <div class="effect-1 effects"></div>
              <div class="effect-2 effects"></div>
              <div class="effect-3 effects"></div>
            </div>
          </div>
          <table v-if="!isLoading && filteredTourCodes.length" class="border text-xs bg-white">
            <thead>
              <tr>
                <th class="border">ID</th>
                <th class="border">IATA</th>
                <th class="border">Tourcode Backoffice</th>
                <th class="border">Comissão Recebida</th>
                <th class="border">Comissão Repassada</th>
                <th class="border">Incentivo Recebido</th>
                <th class="border">Incentivo Repassado</th>
                <th class="border">Incentivo à aplicar</th>
              </tr>
            </thead>
            <tbody>
              <tr class="hover:bg-slate-100" v-for="tour in filteredTourCodes" :key="tour.efacil_tourcode_id">
                <td class="border-y text-[11px]">{{ tour.efacil_tourcode_id }}</td>
                <td class="border-y text-[11px]">{{ tour.efacil_company_iata }}</td>
                <td class="border-y text-[11px]">{{ tour.efacil_tourcode_backoffice }}</td>
                <td class="border-y text-[11px]">{{ tour.efacil_comission_received }}</td>
                <td class="border-y text-[11px]">{{ tour.efacil_comission_repassed }}</td>
                <td class="border-y text-[11px]">{{ tour.efacil_incentive_received }}</td>
                <td class="border-y text-[11px]">{{ tour.efacil_incentive_repassed }}</td>
                <td class="border-y text-[11px]">
                  <template v-if="tour.max_repasse_value > 0">
                    <select class="bg-slate-200 py-1" v-model="tour.rebate_repasse_preset">
                      <option class="text-[11px] " v-for="option in generateOptions(tour.max_repasse_value)" :key="option" :value="option">{{ option }}</option>
                    </select>
                  </template>
                  <template v-else>
                    <span class="text-[9px] text-red-800">Repasse não disponível</span>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div class="flex justify-end col-span-4 items-end">
          <ButtonComponent @click="props?.onCancel" variant="error">Cancelar</ButtonComponent>
          <ButtonComponent type="submit" @click="onSubmitRebates">Cadastrar Template</ButtonComponent>
        </div>
      </div>
    </section>
    <LayoutFooter />
  </template>
  
  
  <style scoped>
  .fixed-section {
    background: white;
    z-index: 1000;
    padding: 10px;
    height: fit-content;
  }
  
  .table-container {
    overflow-y: auto;
    max-height: calc(100vh - 200px);
    background-color: white;
    position: relative;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
  }
  
  th, td {
    padding: 8px;
    text-align: center;
  }
  
  .filters {
    margin-bottom: 10px;
  }
  
  .loading-table-icon-container {
    font-size: 50px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(1px);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
  
  .loading {
    position: absolute;
    left: calc(50% - 35px);
    top: 40%;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    box-sizing: border-box;
    border: 3px solid transparent;
  }
  
  .loading .effect-1,
  .loading .effect-2 {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-left: 3px solid #0f172a;
    border-radius: 50%;
    box-sizing: border-box;
  }
  
  .loading .effect-1 {
    animation: rotate 1s ease infinite;
  }
  
  .loading .effect-2 {
    animation: rotateOpacity 1s ease infinite 0.1s;
  }
  
  .loading .effect-3 {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-left: 3px solid #0f172a;
    animation: rotateOpacity 1s ease infinite 0.2s;
    border-radius: 50%;
    box-sizing: border-box;
  }
  
  .loading .effects {
    transition: all 0.3s ease;
  }
  
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(1turn);
    }
  }
  
  @keyframes rotateOpacity {
    0% {
      transform: rotate(0deg);
      opacity: 0.1;
    }
    100% {
      transform: rotate(1turn);
      opacity: 1;
    }
  }
  </style>
  