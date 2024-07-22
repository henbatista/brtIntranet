<script lang="ts" setup>
import { defineProps, computed } from 'vue';

interface Rebate {
  rebate_id: string;
  rebate_template_id: string;
  rebate_tourcode_id: string;
  rebate_company_iata: string;
  rebate_tourcode_backoffice: string;
  rebate_tourcode_description: string;
  rebate_tourcode_status: string;
  rebate_comission_received: number;
  rebate_comission_repassed: number;
  rebate_incentive_received: number;
  rebate_incentive_repassed: number;
  rebate_repasse_preset: number;
}

interface RebateDetails {
  rebate_template_id: string;
  rebate_template_created_by: string;
  rebate_template_name: string;
  rebate_template_comments: string | null;
  rebate_template_status: number;
  rebates: Rebate[];
}

const props = defineProps<{
  data: RebateDetails | null;
  onCancel: () => void;
}>();

const isLoading = ref(false);

const rebateStatus = computed(() => {
  if (props.data) {
    return props.data.rebate_template_status === 1 ? 'Ativo' : 'Inativo';
  }
  return '';
});

const statusClass = computed(() => {
  if (props.data) {
    return props.data.rebate_template_status === 1 ? 'text-green-600' : 'text-red-500';
  }
  return '';
});
</script>


<template>
    <div>
      <TableHeader class="-mt-1" title="Configuração" description="Detalhes do template cadastrado" src="/images/icons/png-color/settings.png" />
      <div v-if="isLoading">
        <div class="loading-table-icon-container">
          <div class="loading">
            <div class="effect-1 effects"></div>
            <div class="effect-2 effects"></div>
            <div class="effect-3 effects"></div>
          </div>
        </div>
      </div>
      <div  v-else-if="data">
          <div class="px-96 py-8 mx-auto sm:py-10 lg:py-3 -mt-8">
              <div class="relative py-6 overflow-hidden rounded-md bg-gradient-to-r from-[#202D3B] to-[#202D3B] lg:py-5 md:px-6 lg:p-16 md:shadow-sm md:bg-purple-1000" data-primary="purple-600" data-rounded="rounded-lg" data-rounded-max="rounded-full">
                  <div class="flex flex-col items-center">
                      <div class="w-full flex justify-start mb-4">
                          <p class="text-base leading-6 text-white"><strong>Criado por:</strong> {{ data.rebate_template_created_by }}</p>
                      </div>
                      <div class="w-full flex justify-end mb-4 -mt-10">
                        <strong class="text-white">Status:&nbsp;  </strong><p class="text-base leading-6" :class="statusClass"> {{ rebateStatus }}</p>
                      </div>
                      <h2 class="text-xl font-extrabold leading-9 tracking-tight text-white sm:text-xl sm:leading-1 mb-4 text-center">
                          <strong>Nome do Template:</strong> {{ data.rebate_template_name }}
                      </h2>
          
                      <div class="w-full text-center">
                          <p class="text-base leading-6 text-white"><strong>Descrição:</strong> <span v-html="data.rebate_template_comments"></span></p>
                      </div>
                  </div>
              </div>
          </div>
        <div class="table-container text-sm border rounded-sm bg-white shadow-sm p-5">
          <table class="border text-xs bg-white">
            <thead>
              <tr>
                <th class="border">Tourcode ID</th>
                <th class="border">IATA</th>
                <th class="border">Tourcode Backoffice</th>
                <th class="border">Descrição</th>
                <th class="border">Comissão Recebido</th>
                <th class="border">Comissão Repasado</th>
                <th class="border">Incentivo Recebido</th>
                <th class="border">Incentivo Repasado</th>
                <th class="border">Incentivo Aplicado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rebate in data.rebates" :key="rebate.rebate_id" class="hover:bg-slate-100">
                <td class="border-y text-[11px]">{{ rebate.rebate_tourcode_id }}</td>
                <td class="border-y text-[11px]">{{ rebate.rebate_company_iata }}</td>
                <td class="border-y text-[11px]">{{ rebate.rebate_tourcode_backoffice }}</td>
                <td class="border-y text-[11px]">{{ rebate.rebate_tourcode_description }}</td>
                <td class="border-y text-[11px]">{{ rebate.rebate_comission_received }}</td>
                <td class="border-y text-[11px]">{{ rebate.rebate_comission_repassed }}</td>
                <td class="border-y text-[11px]">{{ rebate.rebate_incentive_received }}</td>
                <td class="border-y text-[11px]">{{ rebate.rebate_incentive_repassed }}</td>
                <td class="border-y text-[11px]">{{ rebate.rebate_repasse_preset }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-end col-span-4 items-end">
          <ButtonComponent @click="props?.onCancel" >Voltar</ButtonComponent>
        </div>
      </div>
  
    </div>
  </template>
  

<style scoped>
.table-container {
  overflow-y: auto;
  max-height: calc(100vh - 380px);
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

.rebate-table th {
  background-color: #f4f4f4;
}

.rebate-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.rebate-table tr:hover {
  background-color: #f1f1f1;
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

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #0056b3;
}
</style>
