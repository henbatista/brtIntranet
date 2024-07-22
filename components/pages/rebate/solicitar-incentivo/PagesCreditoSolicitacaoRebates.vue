<script setup lang="ts">
import { useEfacilStore } from '~/stores/EfacilStore';
import { onMounted, ref, computed } from 'vue';
import type { TourCode } from "~/types/tourCode";
import type { RebatesPayload } from "~/types/rebates";
import type { optionsType } from "@/types/global";
import type { Agency } from "@/types/frontend";
import type { TCredit } from "@/types/credit";

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

interface RebateTemplateOption {
  value: string;
  label: string;
  object?: {
    rebate_template_id: string;
    rebate_template_name: string;
  };
}

type updateCreditInputType = {
  credit_id: number;
  credit_status_id: number;
  user_id: number;
  description?: string;
}

type formInputProps = Partial<TCredit> & {
  cnpj?: string;
  base?: string;
  credit_agency_client?: string;
  rebate_template_id?: string;
} & Partial<updateCreditInputType>;

const efacilStore = useEfacilStore();
const tourCodesEfacil = ref<TourCode[]>([]);
const templateName = ref('');
const agencyOptions = ref<optionsType<Agency>[]>([]);
const clientOptions = ref<optionsType<Agency>[]>([]);
const rebateTemplateOptions = ref<RebateTemplateOption[]>([]);
const isTemplateSelected = ref(false);
const rebateData = ref<RebatesPayload | null>(null); 
const isLoading = ref(false);

const formInput = ref<formInputProps>({
  credit_attendant: undefined,
  credit_agency: 0,
  credit_request_type: '',
  credit_client_type: 'Manutenção',
  credit_invoiced_value: undefined,
  credit_card_value: undefined,
  credit_contract: 0,
  credit_contract_type: 'Termo',
  credit_contract_date: undefined,
  credit_description: undefined,
  credit_id: undefined,
  credit_status_id: undefined,
  user_id: undefined,
  description: undefined,
  cnpj: '',
  base: '',
  credit_agency_client: undefined, 
  rebate_template_id: undefined, 
});

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

const generateOptions = (minValue: number, maxValue: number) => {
  const options = [];
  for (let i = minValue + 0.25; i <= maxValue; i += 0.25) {
    options.push(i.toFixed(3));
  }
  return options;
};

const onSubmitRebates = async () => {
  await efacilStore.createRebates(templateName.value);
  props?.onSuccess(); 
};

const fetchAgencyOptions = async (search = "") => {
  try {
    const { data }: any = await getAgency(search, 1, 10, "agency_name");
    agencyOptions.value = data.data.map((e: any) => ({
      value: e.agency_id,
      label: e.agency_name,
      object: e,
    }));
  } catch (error) {
    console.error('Error fetching agency options:', error);
  }
};

const fetchRebateTemplates = async () => {
  try {
    const response = await efacilService.getRebateTemplates();
    const templates = response.data; 
    rebateTemplateOptions.value = templates
      .filter((template: any) => template.rebate_template_status !== 2) // Filtrar templates com status 2
      .map((template: any) => ({
        value: template.rebate_template_id,
        label: template.rebate_template_name,
        object: template,
      }));
  } catch (error) {
    console.error('Error fetching rebate templates:', error);
  }
};

const onSelectAgency = async (value: number) => {
  try {
    const agencyData = await getAgencyDetails(value); 
    formInput.value.credit_agency = agencyData.agency_id;
    formInput.value.cnpj = agencyData.agency_cnpj;
    formInput.value.base = agencyData.branch.branch_name;

    // Buscar clientes da agência
    const clients = await efacilService.getClientsByAgencyId(agencyData.agency_efacil_id);
    clientOptions.value = clients
        .filter(client => client.client_status === "1") // Filtrar clientes ativos
        .map(client => ({
            value: client.client_id,
            label: client.client_name,
            object: client,
        }));
  } catch (error) {
    console.error('Error fetching agency:', error);
  }
};

const onSelectClient = (client: any) => {
  formInput.value.credit_agency_client = client.client_id;
};

const onSelectRebateTemplate = async (value: string) => {
  try {
    isLoading.value = true;
    const rebateDetails = await efacilService.getRebateDetails(value);
    rebateData.value = rebateDetails;
    isTemplateSelected.value = true;
    rebateData.value.rebates.forEach(rebate => {
      rebate.selectedRebateRepasse = rebate.rebate_repasse_preset;
    });
    isLoading.value = false;
  } catch (error) {
    console.error('Error fetching rebate details:', error);
    isLoading.value = false;
  }
};



onMounted(() => {
  loadTourCodes();
  fetchAgencyOptions(""); 
  fetchRebateTemplates();
});

</script>

<template>
    <section class="">
      <div class="grid grid-cols-4 gap-6">
        <TableHeader class="-mt-1" title="Solicitar Incentivos" description="Lista de solicitação de incentivos" src="/images/icons/png-color/discount.png" />
        <CommonInputWrapInput v-model="filters.iata" type="text" label="Filtrar por IATA" class="border p-2 shadow-sm"/>
        <CommonInputWrapInput v-model="filters.backoffice" type="text" label="Filtrar por Backoffice" class="border p-2 shadow-sm"/>
        <CommonInputWrapInput v-model="filters.id" type="text" label="Filtrar por ID" class="border p-2 shadow-sm"/>
      </div>
      <div class="main-content grid grid-cols-4 gap-6 -mt-2">
        <div class="fixed-section border shadow-sm rounded-sm col-span-1">
          <div class="mb-4 grid grid-cols-1 p-3 gap-6">
            <div>
              <CommonInputTrvAutocomplete
                :options="agencyOptions"
                label-input="Agência"
                :defaultValue="String(formInput.credit_agency)"
                :search-min-length="2"
                :clearable="true"
                @shouldSearch="fetchAgencyOptions"
                :onSelect="onSelectAgency"
                :is-required="true"
                :disabled="!!props?.data"
                class=""
              />
              <div class="border-b text-slate-900">
                <label class="block text-sm font-medium text-gray-700 mb-1 mt-4">CNPJ</label>
                <p class="text-sm text-gray-900">{{ formInput.cnpj }}</p>
              </div>
              <div class="border-b text-slate-900">
                <label class="block text-sm font-medium text-gray-700 mb-1 mt-4">Base</label>
                <p class="text-sm text-gray-900">{{ formInput.base }}</p>
              </div>
              <div class="mt-4">
                <CommonInputTrvAutocomplete
                  :options="clientOptions"
                  label-input="Cliente Agência"
                  :defaultValue="String(formInput.credit_agency_client)"
                  :search-min-length="2"
                  :clearable="true"
                  @shouldSearch="fetchAgencyOptions"
                  @onSelect="onSelectClient"
                  :is-required="true"
                  :disabled="!!props?.data"
                />
              </div>
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Template</label>
                <select
                  v-model="formInput.rebate_template_id"
                  @change="onSelectRebateTemplate($event.target.value)"
                  class="border p-2 shadow-sm w-full"
                >
                  <option v-for="template in rebateTemplateOptions" :key="template.value" :value="template.value">
                    {{ template.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-3">
          <template v-if="isTemplateSelected && rebateData">
            <div class="template-header px-96 py-8 mx-auto overflow-hidden sm:py-10 lg:py-3">
              <div class="relative py-6 rounded-md bg-gradient-to-r from-[#202D3B] to-[#202D3B] lg:py-5 md:px-6 lg:p-16 md:shadow-sm md:bg-purple-1000" data-primary="purple-600" data-rounded="rounded-lg" data-rounded-max="rounded-full">
                <div class="flex flex-col items-center">
                  <h2 class="text-xl font-extrabold leading-9 tracking-tight text-white sm:text-2xl sm:leading-1 text-center">
                    {{ rebateData.rebate_template_name }}
                  </h2>
                </div>
              </div>
            </div>
            <div class="table-container border rounded-sm bg-white shadow-sm p-5">
              <div class="loading-table-icon-container" v-if="isLoading">
                <div class="loading">
                  <div class="effect-1 effects"></div>
                  <div class="effect-2 effects"></div>
                  <div class="effect-3 effects"></div>
                </div>
              </div>
              <table class="border text-xs bg-white">
                <thead>
                  <tr>
                    <th class="border w-24">Tourcode ID</th>
                    <th class="border">IATA</th>
                    <th class="border w-44">Tourcode Backoffice</th>
                    <th class="border">Descrição</th>
                    <th class="border ">Incentivo Recebido</th>
                    <th class="border w-36">Incentivo Repassado</th>
                    <th class="border w-36">Incentivo Aplicado Template</th>
                    <th class="border w-36">Incentivo Aplicado Template</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="rebate in rebateData.rebates" :key="rebate.rebate_id" class="hover:bg-slate-100">
                    <td class="border-y text-[11px]">{{ rebate.rebate_tourcode_id }}</td>
                    <td class="border-y text-[11px]">{{ rebate.rebate_company_iata }}</td>
                    <td class="border-y text-[11px]">{{ rebate.rebate_tourcode_backoffice }}</td>
                    <td class="border-y text-[11px]">{{ rebate.rebate_tourcode_description }}</td>
                    <td class="border-y text-[11px]">{{ rebate.rebate_incentive_received }}</td>
                    <td class="border-y text-[11px]">{{ rebate.rebate_incentive_repassed }}</td>
                    <td class="border-y bg-slate-100 font-bold text-[#202D3B] text-[11px]">{{ rebate.rebate_repasse_preset }}</td>
                    <td class="border-y text-[11px]">
                      <template v-if="rebate.rebate_incentive_received > 0">
                        <select class="bg-slate-200 py-1" v-model="rebate.selectedRebateRepasse">
                          <option class="text-[11px] " v-for="option in generateOptions(parseFloat(rebate.rebate_repasse_preset), rebate.rebate_incentive_received)" :key="option" :value="option">
                            {{ option }}
                          </option>
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
          </template>
          <template v-else>
            <div class="flex justify-center items-center h-full bg-white border shadow-sm">
              <p class="empty-search border border-slate-900 font-semibold rounded-md p-5 bg-white text-slate-900">
                Selecione os campos para adicionar o template
              </p>
            </div>
          </template>
        </div>
        <div class="flex justify-end col-span-4 items-end">
          <ButtonComponent @click="props?.onCancel" variant="error">Cancelar</ButtonComponent>
          <ButtonComponent type="submit" @click="onSubmitRebates">Solicitar Incentivos</ButtonComponent>
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
    max-height: calc(100vh - 350px);
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
