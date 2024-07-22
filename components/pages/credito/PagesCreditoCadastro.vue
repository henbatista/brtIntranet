<script lang="ts" setup>
import { defineProps, ref, computed, onMounted, watch, shallowRef } from 'vue';
import { useTableStore } from "@/stores/TableStore";
import { useToast } from "vue-toast-notification";
import VueDatePicker from "@vuepic/vue-datepicker";
import type { optionsType } from "@/types/global";
import * as yup from "yup";
import useFormValidation from "@/hooks/formValidation";
import { useAlertStore } from "@/stores/AlertStore";
import type { Agency } from "@/types/frontend";
import { formatDate } from "@/hooks/formatDate";
import { useAuthStore } from "@/stores/AuthStore";
import { fixNumber, inputCurrencyMask } from "@/hooks/formatCurrency";
import type { TCredit, TCreditStatus } from "@/types/credit";

const props = defineProps({
  onCancel: {
    type: Function,
  },
  onSuccess: {
    type: Function,
  },
  data: {
    type: Object as PropType<TCredit>,
  },
});

const tableStore = useTableStore();
const alertStore = useAlertStore();
const { loginUser } = useAuthStore();

const userIsManager = loginUser?.user_roles?.includes("manager") || loginUser?.user_roles?.includes("admin");
const userIsAccountExecutive = loginUser?.user_roles?.includes("accountexecutive") || loginUser?.user_roles?.includes("admin");
const userIsCreditAnalyst = loginUser?.user_roles?.includes("creditanalyst") || loginUser?.user_roles?.includes("admin");

const $toast = useToast();
const DataPicker = shallowRef(VueDatePicker);

const statusOptions = ref<optionsType<TCreditStatus>[]>([]);
const agencyOptions = ref<optionsType<Agency>[]>([]);

const solicitationTypeOptions = [
  { label: "Limite Fixo", value: "Limite Fixo" },
  { label: "Limite Temporário", value: "Limite Temporario" },
  { label: "Bloqueio Limite", value: "Bloqueio Limite" },
  { label: "Desbloqueio Limite", value: "Desbloqueio Limite" },
];

const clientTypeOptions = [
  { label: "Manutenção", value: "Manutenção" },
  { label: "Prospecção", value: "Prospecção" },
];


const contractTypeOptions = [
  { label: "Termo", value: "Termo" },
  { label: "Digital", value: "Digital" },
];

type updateCreditInputType = {
  credit_id: number;
  credit_status_id: number;
  user_id: number;
  description?: string;
};

type formInputProps = Partial<TCredit> & {
  cnpj?: string;
  base?: string;
} & Partial<updateCreditInputType>;

const formInput = ref<formInputProps>({
  credit_attendant: loginUser?.user_id as string,
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
});

const resetFormInput = () => {
  formInput.value = {
    credit_attendant: loginUser?.user_id as string,
    credit_agency: undefined,
    credit_request_type: "",
    credit_client_type: "Manutenção",
    credit_invoiced_value: undefined,
    credit_card_value: undefined,
    credit_contract: 0,
    credit_contract_type: "Termo",
    credit_contract_date: undefined,
    credit_description: undefined,
    credit_id: undefined,
    credit_status_id: undefined,
    user_id: undefined,
    description: undefined,
    cnpj: "",
    base: "",
  };
};

const getLatestStatus = (statusHistoric: any[]) => {
  return statusHistoric[statusHistoric.length - 1];
};

const latestStatus = computed(() => props.data?.status_historic ? getLatestStatus(props.data.status_historic) : null);

const statusColor = computed(() => {
  if (!latestStatus.value) return "#000000"; // Cor padrão se latestStatus for null
  const statusColors: { [key: string]: string } = {
    solicitado: "#67a7cb",
    analise: "#f7bf5e",
    reanalise: "#ee881e",
    cancelado: "#ff6961",
    rejeitado: "#ff6961",
    negado: "#ff6961",
    aprovado: "#5DC4A2",
  };
  return statusColors[latestStatus.value.credit_status_name] || "#000000"; // Cor padrão se não for encontrada
});

const progressPercentage = computed(() => {
  if (!latestStatus.value) return 0; // Porcentagem padrão se latestStatus for null
  const statusPercentage: { [key: string]: number } = {
    solicitado: 33,
    analise: 66,
    reanalise: 66,
    cancelado: 100,
    rejeitado: 100,
    negado: 100,
    aprovado: 100,
  };
  return statusPercentage[latestStatus.value.credit_status_name] || 0; // Porcentagem padrão se não for encontrada
});

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

const onSelectAgency = async (value: number) => {
  try {
    const agencyData = await getAgencyDetails(value); // Usando a função do serviço
    formInput.value.credit_agency = agencyData.agency_id;
    formInput.value.cnpj = agencyData.agency_cnpj;
    formInput.value.base = agencyData.branch.branch_name;
    inputValidate("credit_agency");
  } catch (error) {
    console.error('Error fetching agency:', error);
  }
};

const fetchCreditStatus = async (search = "") => {
    const { data }: any = await getStatusCredits(search, 1, 10, "");
    statusOptions.value = data.data.map((e: TCreditStatus) => ({
        value: e.credit_status_id,
        label: e?.credit_status_name,
    }));
    console.log(statusOptions.value);
};

onMounted(() => {
  fetchAgencyOptions(""); 
  fetchCreditStatus("");
});

watch(
  () => props.data,
  (newData) => {
    if (newData) {
      formInput.value = {
        ...newData,
        cnpj: newData.agency?.agency_cnpj,
        base: newData.agency?.agency_address,
        credit_contract: newData.credit_contract ? 1 : 0,
        credit_contract_date: newData.credit_contract_date ? new Date(newData.credit_contract_date) : undefined,
        credit_status_id: newData.status_historic?.[0]?.credit_status_id,
        description: newData.status_historic?.[0]?.description,
      };
    } else {
      resetFormInput();
    }
  },
  { immediate: true }
);

const schema = props.data
  ? yup.object({
    credit_status_id: yup.string().required("O Status é obrigatório"),
    latest_credit_status: yup.object({
      description: yup.string()
        .required("A Descrição é obrigatória")
        .min(10, "A Descrição deve ter no mínimo 10 caracteres")
        .max(500, "A Descrição deve ter no máximo 500 caracteres"),
    }),
  })
  : yup.object({
    credit_attendant: yup.string().required("O Atendente é obrigatório"),
    credit_agency: yup.string().required("A Agência é obrigatória"),
    credit_contract_date: yup
      .string()
      .when("credit_contract", ([credit_contract], schema) => {
        if (credit_contract === 1) {
          return schema.required(
            "A Data do contrato é obrigatória"
          );
        }
      }),
    credit_description: yup.string()
      .required("A justificativa é obrigatória")
      .min(10, "A Justificativa deve ter no mínimo 10 caracteres")
      .max(500, "A Justificativa deve ter no máximo 500 caracteres"),
  });

const { errors, inputValidate, validateSubmit } =
  useFormValidation<formInputProps>(schema, formInput.value);

const onSubmit = async (Event: any) => {
  let data = await validateSubmit(Event);

  delete data.base;
  delete data.cnpj;

  try {
    alertStore.loading = true;

    if (props.data) {
      const updateData: updateCreditInputType = {
        user_id: loginUser?.user_id,
        credit_id: (props.data as TCredit).credit_id as string,
        credit_status_id: data.credit_status_id,
        description: data.description,
      };

      await updateCredit(updateData)
        .then((data: any) => {
          if (data?.success) {
            onSuccess("Crédito atualizado com sucesso!");
            alertStore.loading = false;
            props.onCancel?.(); 
          } else {
            alertStore.loading = false;
          }
        })
        .catch((err) => {
          $toast.error("Ocorreu um erro, tente novamente", {
            position: "top-right",
          });
          alertStore.loading = false;
        });
    } else {
      data = { ...data, credit_attendant: Number(loginUser?.user_id) };
      if (data.credit_invoiced_value) {
        data = {
          ...data,
          credit_invoiced_value: fixNumber(
            data.credit_invoiced_value
          ),
        };
      }
      if (data.credit_card_value) {
        data = {
          ...data,
          credit_card_value: fixNumber(data.credit_card_value),
        };
      }
      if (data.credit_contract_date) {
        data = {
          ...data,
          credit_contract_date: formatDate(
            data.credit_contract_date,
            "yyyy-MM-dd"
          ),
        };
      }

      await saveCredit(data as TCredit)
        .then((data: any) => {
          if (data?.success) {
            onSuccess("Crédito cadastrado com sucesso!");
            props.onCancel?.(); 
          } else {
            alertStore.loading = false;
          }
        })
        .catch((err) => {
          $toast.error("Ocorreu um erro, tente novamente", {
            position: "top-right",
          });
          alertStore.loading = false;
        });
    }
  } catch (error) {
    alertStore.loading = false;
  }
};

const onSuccess = (toast_message: string) => {
  alertStore.loading = false;
  $toast.success(toast_message, {
    position: "top-right",
  });
  tableStore.onFetchTable();
  props.onSuccess?.();
  props.onCancel?.();
};

const onApproveCredit = async () => {
  const data = formInput.value;

  try {
    alertStore.loading = true;

    const approveData = {
      credit_id: Number((props.data as TCredit).credit_id as string),
      description: data.description + "",
    };

    await approveCredit(approveData)
      .then((data: any) => {
        if (data?.success) {
          onSuccess("Crédito Aprovado!");
          props.onCancel?.(); 
        } else {
          alertStore.loading = false;
        }
      })
      .catch((err) => {
        $toast.error("Ocorreu um erro, tente novamente", {
          position: "top-right",
        });
        alertStore.loading = false;
      });
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const onApproveCreditAnalyst = async () => {
  const data = formInput.value;

  try {
    alertStore.loading = true;

    const approveData = {
      credit_id: Number((props.data as TCredit).credit_id as string),
      description: data.description + "",
      credit_status_id: 6,
    };

    await approveCreditAnalyst(approveData)
      .then((data: any) => {
        if (data?.success) {
          onSuccess("Crédito Aprovado!");
          props.onCancel?.(); 
        } else {
          alertStore.loading = false;
        }
      })
      .catch((err) => {
        $toast.error("Ocorreu um erro, tente novamente", {
          position: "top-right",
        });
        alertStore.loading = false;
      });
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const onReproveCredit = async () => {
  const data = formInput.value;

  try {
    alertStore.loading = true;

    const reproveData = {
      credit_id: Number((props.data as TCredit).credit_id as string),
      description: data.description + "",
    };

    await reproveCredit(reproveData)
      .then((data: any) => {
        if (data?.success) {
          onSuccess("Crédito Reprovado!");
          props.onCancel?.(); 
        } else {
          alertStore.loading = false;
        }
      })
      .catch((err) => {
        $toast.error("Ocorreu um erro, tente novamente", {
          position: "top-right",
        });
        alertStore.loading = false;
      });
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const onReproveCreditAnalys = async () => {
  const data = formInput.value;

  try {
    alertStore.loading = true;

    const reproveData = {
      credit_id: Number((props.data as TCredit).credit_id as string),
      description: data.description + "",
    };

    await reproveCreditAnalyst(reproveData)
      .then((data: any) => {
        if (data?.success) {
          onSuccess("Crédito Reprovado!");
          props.onCancel?.(); 
        } else {
          alertStore.loading = false;
        }
      })
      .catch((err) => {
        $toast.error("Ocorreu um erro, tente novamente", {
          position: "top-right",
        });
        alertStore.loading = false;
      });
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const onreproveCreditManager = async () => {
  const data = formInput.value;

  try {
    alertStore.loading = true;

    const reproveData = {
      credit_id: Number((props.data as TCredit).credit_id as string),
      description: data.description + "",
    };

    await reproveCreditManager(reproveData)
      .then((data: any) => {
        if (data?.success) {
          onSuccess("Crédito Reprovado!");
          props.onCancel?.(); 
        } else {
          alertStore.loading = false;
        }
      })
      .catch((err) => {
        $toast.error("Ocorreu um erro, tente novamente", {
          position: "top-right",
        });
        alertStore.loading = false;
      });
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const onCancelCredit = async () => {
  const data = formInput.value;

  try {
    alertStore.loading = true;

    const cancelData = {
      credit_id: Number((props.data as TCredit).credit_id as string),
      description: data.description + "",
    };

    await cancelCredit(cancelData)
      .then((data: any) => {
        if (data?.success) {
          onSuccess("Crédito Cancelado!");
          props.onCancel?.(); 
        } else {
          alertStore.loading = false;
        }
      })
      .catch((err) => {
        $toast.error("Ocorreu um erro, tente novamente", {
          position: "top-right",
        });
        alertStore.loading = false;
      });
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const barColor = (percentage: number) => {
  if (percentage <= 30) {
    return "bg-red-600";
  } else if (percentage > 30 && percentage <= 60) {
    return "bg-yellow-400";
  } else if (percentage > 60 && percentage <= 80) {
    return "bg-orange-500";
  } else {
    return "bg-emerald-700";
  }
};

const barColorText = (percentage: number) => {
  if (percentage <= 30) {
    return  "text-red-600";
  } else if (percentage > 30 && percentage <= 60) {
    return "text-yellow-400";
  } else if (percentage > 60 && percentage <= 80) {
    return "text-orange-500";
  } else {
    return "text-emerald-700";
  }
};

const openAccordions = ref<number[]>([]);

const toggleAccordion = (index: number) => {
  if (openAccordions.value.includes(index)) {
    openAccordions.value = openAccordions.value.filter(i => i !== index);
  } else {
    openAccordions.value.push(index);
  }
};

const isAccordionOpen = (index: number) => {
  return openAccordions.value.includes(index);
};

const isStatusFinal = computed(() => {
  const status = latestStatus.value?.credit_status_name;
  return status === 'aprovado' || status === 'rejeitado' || status === 'cancelado' || status === 'negado' ;
});

const isUserNotManagerInRequest = computed(() => {
  return latestStatus.value?.credit_status_name === 'solicitado' && !userIsManager;
});


const timelineMaxHeight = computed(() => {
  return isStatusFinal.value ? '45vh' : '15.3vh';
});

function enter(el: HTMLElement) {
  el.style.maxHeight = '0';
  el.style.opacity = '0';
  requestAnimationFrame(() => {
    el.style.transition = 'all 0.3s ease';
    el.style.maxHeight = el.scrollHeight + 'px';
    el.style.opacity = '1';
  });
}

function leave(el: HTMLElement) {
  el.style.maxHeight = el.scrollHeight + 'px';
  el.style.opacity = '1';
  requestAnimationFrame(() => {
    el.style.transition = 'all 0.3s ease';
    el.style.maxHeight = '0';
    el.style.opacity = '0';
  });
}
</script>


<template>
    <form @submit.prevent="onSubmit">
      <section class=" grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Campos para modo de criação -->
        <template v-if="!props.data">
          <input type="hidden" v-model="formInput.credit_attendant as string" />
  
          <div class="col-span-2">
          <CommonInputTrvAutocomplete
          :options="agencyOptions"
          label-input="Agência"
          :defaultValue="String(formInput.credit_agency)"
          :search-min-length="2"
          :clearable="true"
          @shouldSearch="fetchAgencyOptions"
          :onSelect="onSelectAgency"
          :is-required="true"
          :error="errors?.credit_agency"
          :disabled="!!props?.data"
        />
    </div>

        
        <div class="border-b mr-3 text-slate-900">
          <label class="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
          <p class="text-sm text-gray-900">{{ formInput.cnpj }}</p>
        </div>
        
        <div class="border-b text-slate-900">
          <label class="block text-sm font-medium text-gray-700 mb-2">Base</label>
          <p class="text-sm text-gray-900">{{ formInput.base }}</p>
        </div>
        
          
          <CommonInputTrvAutocomplete
            :options="solicitationTypeOptions"
            label-input="Tipo de solicitação"
            :defaultValue="formInput.credit_request_type"
            :clearable="true"
            :disabled="!!props?.data"
            :onSelect="(data: string) => formInput.credit_request_type = data && data"
          />
  
          <CommonInputTrvAutocomplete
            :options="clientTypeOptions"
            label-input="Tipo de cliente"
            :defaultValue="formInput.credit_client_type"
            :clearable="true"
            :onSelect="(data: string) => formInput.credit_client_type = data && data"
            :disabled="!!props?.data"
          />
          
          <CommonInputWrapInput
            v-model="formInput.credit_invoiced_value"
            label="Valor faturado"
            :disabled="!!props?.data"
            @input="inputCurrencyMask"
            maxlength="16"
          />
  
          <CommonInputWrapInput
            v-model="formInput.credit_card_value"
            label="Valor cartão"
            :disabled="!!props?.data"
            @input="inputCurrencyMask"
            maxlength="16"
          />
  
          <fieldset
            class="contract-options"
            v-if="formInput.credit_contract === 1"
          >
            <legend>Opções do contrato</legend>
            <CommonInputTrvAutocomplete
              :options="contractTypeOptions"
              label-input="Tipo de contrato"
              :defaultValue="formInput.credit_contract_type"
              :clearable="true"
              :onSelect="(data: string) => formInput.credit_contract_type = data && data"
            />
            <div>
              <DataPicker
                v-model="formInput.credit_contract_date"
                :auto-apply="true"
                :format="formatDate"
                placeholder="Data do contrato"
                class="date-input-picker"
                :is-required="formInput.credit_contract === 1"
                @update:modelValue="inputValidate('credit_contract_date')"
              >
                <template #input-icon>
                  <img class="input-slot-image" src="/images/icons/svg-blue/regular/calendar-blank.svg" alt="icone calendario" />
                </template>
                <template #clear-icon="{ clear }">
                  <img class="input-slot-image" src="/images/icons/svg-blue/regular/x-circle.svg" alt="icone limpar" @click="clear" />
                </template>
              </DataPicker>
              <span v-if="errors?.credit_contract_date" class="error-message">{{ errors?.credit_contract_date }}</span>
            </div>
          </fieldset>
        </template>
      </section>
  
      <!-- Campo para modo de edição -->
      <template v-if="props.data">
        <div class="card mb-5">
          <div class="card-body">
            <div class="custom-container">

<div class="flex flex-col sm:flex-row sm:justify-between w-full mb-2 sm:mb-0">
  <span class="shadow-md h-8 w-full sm:w-40 border text-center flex items-center justify-center text-xs font-medium box-border rounded-sm mb-2 sm:mb-0" :style="{ borderColor: statusColor, color: statusColor }">
    Protocolo: {{ props.data.credit_protocol }}
  </span>
  <h4 class="w-full sm:w-auto text-left sm:text-right text-xs sm:text-sm font-semibold text-gray-600 sm:mr-2">
    Solicitante: {{ props.data.user.user_name }}
  </h4>
</div>

                  
                  

              <div class="custom-image-container">
                <div class="credit-card custom-image" :style="{ borderColor: statusColor }">
                  <div class="credit-card-header">
                    <span :style="{ color: statusColor }">{{ latestStatus?.credit_status_name }}</span>
                  </div>
                </div>
              </div>
              <div class="inline-block bg-gray-800 text-white py-1 px-2 text-sm font-medium rounded min-w-[60px]">
                Agência: {{ props.data.agency.agency_name }}
              </div>
                <div class="grid grid-cols-1 text-xs sm:text-base gap-2 sm:grid-cols-2 sm:gap-4 mt-4">
                <p><span class="font-bold">Tipo de Solicitação:</span> {{ props.data.credit_request_type }}</p>
                <p><span class="font-bold">Tipo de Cliente:</span> <span class="font-normal">{{ props.data.credit_client_type }}</span></p>
                <p class="mt-2 sm:mt-0">Valor Faturado: {{ formatCurrency(props.data.credit_invoiced_value) }}</p>
                <p class="mt-2 sm:mt-0">Valor Cartão: {{ formatCurrency(props.data.credit_card_value) }}</p>
              </div>
              
              <div>
                <div class="custom-progress-info">
                  <span>Progresso</span>
                  <span :class="barColorText(progressPercentage)" class="progress-percent">{{ progressPercentage }}%</span>
                </div>
                <div class="custom-progress-bar-bg">
                  <ProgressBar :value="progressPercentage" :barColor="barColor(progressPercentage)" :animate="true" :striped="true" />
                </div>
              </div>
            </div>
            <div class="credit-card-body"></div>
          </div>
        </div>
      </template>
  
      <!-- Linha do tempo vertical com rolagem -->
      <template v-if="props.data && props.data.status_historic">
        <Card>
            <div class="relative mx-auto max-w-full pt-4 overflow-y-auto" :style="{ maxHeight: timelineMaxHeight }">
                <div v-for="(status, index) in props.data.status_historic" :key="status.credit_status_id" class="relative mb-4">
                  <details @toggle="toggleAccordion(index)">
                    <summary class="cursor-pointer list-none outline-none">
                      <div class="flex items-center mb-2">
                        <div class="inline-block py-1 px-2 text-white text-xs sm:text-base font-medium rounded-full" :style="{ backgroundColor: status.credit_status_color }">
                          <span>{{ status.credit_status_name }}</span>
                        </div>
                        <div class="ml-auto text-right">
                          <div class="text-sm text-gray-500 text-xs sm:text-base">Atualização: {{ formatDate(status.created_at, 'dd/MM/yyyy HH:mm') }}</div>
                        </div>
                      </div>
                    </summary>
                    <transition name="accordion" @enter="enter" @leave="leave">
                      <div v-show="isAccordionOpen(index)" class="mt-2">
                        <p class="text-gray-700 text-xs sm:text-base">Responsável: {{ status.responsible }}</p>
                        <div v-html="status.description" class="text-gray-600 text-xs sm:text-base"></div>
                      </div>
                    </transition>
                  </details>
                </div>
              </div>
              
        </Card>
      </template>
  
      <div class="my-4 " v-if="!isStatusFinal && !isUserNotManagerInRequest">
        <RichText
          v-if="!props.data"
          label="Justificativa"
          v-model:content="formInput.credit_description"
          :is-required="true"
          :error="errors?.credit_description"
          @update:content="inputValidate('credit_description')"
          maxlength="16"
        />
        
        <RichText
          v-else
          label="Resposta"
          :error="errors?.latest_credit_status?.description"
          v-model:content="formInput.description"
        />
      </div>
      
  
<!-- Botões de validação -->
<div class="flex text-xs sm:text-base flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-4 mt-4 sm:mt-8 sticky bottom-0 bg-white p-4" v-if="!isStatusFinal">
    <!-- Botões para modo de criação -->
    <template v-if="!props.data">
      <ButtonComponent @click="props?.onCancel" variant="text">Cancelar</ButtonComponent>
      <ButtonComponent type="submit">Salvar</ButtonComponent>
    </template>
    
    <!-- Botões para Manager -->
    <template v-if="userIsManager && props.data && latestStatus?.credit_status_name === 'solicitado'">
      <ButtonComponent type="submit" @click="onreproveCreditManager" variant="error">Negar Solicitação</ButtonComponent>
      <ButtonComponent type="submit" @click="onApproveCredit">Aprovar Solicitação</ButtonComponent>
    </template>
    
    <!-- Botão para Account Executive ou Usuário Logado na Solicitação -->
    <template v-if="(userIsAccountExecutive && props.data && latestStatus?.credit_status_name === 'solicitado') || (loginUser?.user_id === props?.data?.user?.id && latestStatus?.credit_status_name === 'solicitado')">
      <ButtonComponent type="submit" @click="onCancelCredit" variant="text">Cancelar Solicitação</ButtonComponent>
    </template>
  
    <!-- Botão "Enviar para Análise" para Account Executive ou Usuário Logado na Solicitação -->
    <template v-if="(userIsAccountExecutive && props.data && latestStatus?.credit_status_name === 'reanalise') || (loginUser?.user_id === props?.data?.user?.id && latestStatus?.credit_status_name === 'reanalise')">
      <ButtonComponent type="submit" @click="onApproveCredit">Enviar para Análise</ButtonComponent>
    </template>
    
    <!-- Botões para Credit Analyst -->
    <template v-if="userIsCreditAnalyst && props.data && (latestStatus?.credit_status_name === 'analise' || latestStatus?.credit_status_name === 'analise')">
      <ButtonComponent type="submit" @click="onReproveCredit" variant="error">Negar Crédito</ButtonComponent>
      <ButtonComponent type="submit" @click="onReproveCreditAnalys" variant="text">Rejeitar Crédito</ButtonComponent>
      <ButtonComponent type="submit" @click="onApproveCreditAnalyst">Aprovar Crédito</ButtonComponent>
    </template>
</div>

  
    </form>
  </template>
  
<style lang="scss" scoped>

.header-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  
  .custom-protocol {
    flex: 1;
    text-align: left;
    margin-left: 10px; 
  }
  
  .custom-name {
    flex: 1;
    text-align: right;
    margin-right: 10px; 
  }

.protocol {
  justify-content: flex-end;
}

.credit-card {
  border: 2px solid;
  border-radius: 3px;
  font-size: 12px;
  padding: 20px;
  width: 90px;
}

.credit-card-header span {
  text-transform: uppercase;
  display: flex;
  justify-content: center;
}

.card {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  height: 100%;
  padding: px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e7e7e7;
  box-sizing: border-box;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header .start {
  flex: 1;
  text-align: left;
}

.card-header .end {
  flex: 1;
  text-align: right;
}

.card-body h3 {
  font-size: 16px;
  margin: 0;
  color: #666;
}

.card-body p {
  color: #202D3B;
  margin: 10px 0 0 0;
}

.value-credit p {
    margin: 10px 0; 
  }
  
  .close-spacing {
    margin-top: 5px;  
    margin-bottom: 5px;  
  }

.value-credit {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 10px;
  justify-items: center;
  padding: 3px;
  border-top: 1px solid #e7e7e7;
}

.value-type {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
}

.form-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  section {
    flex: 1;
    max-height: 80vh;
    overflow-y: auto;
    padding: 0 10px 0 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    .rich-editor-component {
        padding: 10px;

    }
  }

  .contract-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 20px;
    grid-column: span 2;
    gap: 24px;
    position: relative;
    border-radius: 3px;
    border: solid 1px rgb(189, 189, 189);
    legend {
      font-size: 14px;
    }
    .error-message {
      color: var(--error-900);
      pointer-events: none;
      font-size: 12px;
    }
  }
}

.buttons-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 30px;
  position: sticky;
  bottom: 0;
  background-color: white;
  
}

.custom-container {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 1rem;
}

.custom-container::before {
  content: "";
  width: 100%;
  height: calc(100% - 60px);
  position: absolute;
  left: 0;
  top: 60px;
  border-radius: 3px;
  z-index: -1;
  background-color: #F3F5FD;
}

.custom-image-container {
  width: 100px;
  margin: 0 auto 1rem auto;
  position: relative;
  background-color: #fff;
}

.custom-image {
  width: 100%;
  border-radius: 5%;
}

.custom-badge {
  height: 30px;
  width: 160px;
  position: absolute;
  top: 15px;
  border: 1px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e293b;
  font-size: 0.75rem;
  font-weight: 500;
  box-sizing: border-box;
  border-radius: 3px;
}

.custom-name {
  font-size: 0.875rem;
  color: #475569;
  font-weight: 600;
  margin-top: 5px;
}

.custom-score {
  display: inline-block;
  background-color: #1e293b;
  color: white;
  padding: 0.400rem 0.600rem;
  font-size: 14px;
  font-weight: 500;
  border-radius: 3px;
  min-width: 60px;
}

.custom-progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  font-weight: 400;
  color: #94a3b8;
  margin-bottom: 0.75rem;
  margin-top: 1rem;
}

.progress-percent {
  font-weight: 400;
}

.custom-progress-bar-bg {
  width: 100%;
  background-color: #e2e8f0;
  height: 0.5rem;
  border-radius: 0.75rem;
  overflow: hidden;
}

.custom-progress-bar {
  height: 100%;
  border-radius: 0.75rem;
}

.animate-progress {
  animation: fillProgress 1s ease-in-out forwards;
}

@keyframes fillProgress {
  0% {
    width: 0;
  }
  100% {
    width: var(--progress-width);
  }
}

.bold-type {
  font-weight: 800;
}

.status-name {
  display: inline-block;
  padding: 0.5rem;
  text-align: center;
  width: 7rem;
  border-radius: 9999px;
  color: #fff;
  font-weight: 500;
  font-size: 0.675rem;
  text-transform: uppercase;
}

.status-date {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-left: 2.5rem;
  margin-right: 2.5rem;
  display: flex;
  align-items: end;
  justify-items: end;
  justify-content: flex-end;
}


details summary {
  cursor: pointer;
  list-style: none;
  outline: none;
}

details summary::-webkit-details-marker {
  display: none;
}

details[open] .timeline-item-header {
  margin-bottom: 1rem;
}

.timeline {
  @apply relative mx-auto max-w-full pt-4;
  max-height: 20vh;
  overflow-y: auto;
}

.timeline-item-right::after,
.timeline-item-left::after {
  content: '';
  position: absolute;
  top: 39px;
  height: 2px;
  background: #334155;
  z-index: 0;
}

.timeline-item-right::after {
  left: 50%;
  width: calc(100% - 594px);
}

.timeline-item-left::after {
  right: 50%;
  width: calc(50% - 235px);
}

.timeline-content {
  @apply bg-white p-4 rounded-sm shadow-md border border-gray-200 max-w-lg;
  position: relative;
  z-index: 1;
}

.accordion-header {
  @apply cursor-pointer py-4 px-5 text-base text-gray-800 text-left bg-white border-0 transition focus:outline-none;
}

.accordion-body {
  @apply overflow-hidden;
}

.timeline-title {
  @apply text-lg font-bold text-gray-700;
}

.timeline-body {
  @apply mt-2;
  .timeline-subtitle {
    @apply text-sm font-semibold text-gray-600;
  }
  .timeline-text {
    @apply text-sm text-gray-800 p-2;
    &.old-value {
      @apply border border-red-400 text-red-400 rounded mb-2;
    }
    &.new-value {
      @apply border border-teal-700 text-teal-700 rounded;
    }
  }
}

.accordion-enter-active, .accordion-leave-active {
  transition: all 0.3s ease;
}

.accordion-enter-from, .accordion-leave-to {
  max-height: 0;
  opacity: 0;
}

.accordion-enter-to, .accordion-leave-from {
  max-height: 1000px;
  opacity: 1;
}
</style>
