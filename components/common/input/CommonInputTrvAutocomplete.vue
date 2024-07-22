<script setup lang="ts">
import type { optionsType } from "@/types/global";
import type { SelectType } from "@/types/types.js";
import { ref, watch  } from 'vue';

const keyword = ref<string>(""); // variável reativa para armazenar o valor digitado no input
const mutableOptions = ref<any[]>([]); // variável reativa para armazenar o array de opções que será manipulado
const showElement = ref(false); // variável reativa para mostrar ou esconder a lista de opções
const isActive = ref<boolean>(false); // variável reativa para mostrar ou esconder a lista de opções

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: "",
    },

    placeholder: {
        // placeholder para o campo input
        type: String,
        default: "Buscar",
    },

    labelInput: {
        // label para o campo input
        type: String,
        default: "",
    },

    options: {
        // array de opções a serem mostradas na lista do autocomplete
        type: Array,
        default: () => [],
    },

    defaultValue: {
        type: [String, Object],
    },

    error: {
        type: String,
    },

    errorMessage: {
        type: String,
        default: "",
    },

    mainIconPosition: {
        // posição do ícone principal - opções: left, right
        type: String,
        default: "left",
    },

    searchMinLength: {
        // quantidade mínima de caracteres para iniciar a busca
        type: Number,
        default: 3,
    },

    clearable: {
        // se o campo deve ser limpo ao clicar no ícone
        type: Boolean,
        default: true,
    },

    onSelect: {
        type: Function,
    },

    disabled: {
        type: Boolean,
        default: false,
    },

    isReadOnly: {
        // se o campo deve ser somente leitura
        type: Boolean,
        default: false,
    },

    isRequired: {
        type: Boolean,
        default: false,
    },

});

defineOptions({
    inheritAttrs: false,
});

const emits = defineEmits([
    "onSearch",
    "onSelect:selectedOption",
    "shouldSearch",
    "update:modelValue"
]); 

watch(
    props,
    () => {
        if (props.defaultValue !== null && props.defaultValue !== undefined) {
            const filterOptions = (props.options as SelectType[]).filter(
                (e) => {
                    if (typeof e.value === "object") {
                        return JSON.stringify(e.value) === JSON.stringify(props.defaultValue);
                    }
                    return e.value === props.defaultValue;
                }
            );

            if (filterOptions.length) {
                keyword.value = filterOptions[0].label;
            }
        }
    },
    {
        immediate: true,
    }
);

watch(
    () => props.modelValue,
    () => {
        props.onSelect?.(props.modelValue);
        emits("update:modelValue", props.modelValue);
    }
);

// clona o array de opções
const cloneOptions = () => {
    mutableOptions.value = props.options;
};

watch(
    () => props.options,
    () => cloneOptions(),
    {
        immediate: true,
    }
);

const searchInternally = () => {
    if (typeof keyword.value === "string" && keyword.value !== "") {
        const search = keyword.value.toLowerCase();
        mutableOptions.value = (props.options as optionsType[]).filter(
            ({ label }) => label.toLowerCase().includes(search)
        );
    } else {
        mutableOptions.value = props.options;
    }
};

const onInput = (inputedValue: string) => {
    keyword.value = inputedValue;

    const inputedValueSize = inputedValue.length;
    if (inputedValue && inputedValueSize >= props.searchMinLength) {
        isActive.value = true;

        emits("shouldSearch", inputedValue);
        searchInternally();
    } else {
        isActive.value = false;
    }
};

const resetKeyword = () => {
    keyword.value = "";
    props.onSelect?.("");
    emits("onSelect:selectedOption", null);
};

const checkIfValueExistOnOptions = () => {
    const filterOpt = mutableOptions.value.filter((e) => {
        if (typeof e.value === "object") {
            return JSON.stringify(e.value) === JSON.stringify(keyword.value);
        }

        return e.value === keyword.value;
    });

    if (!filterOpt.length) {
        resetKeyword();
    }
};

const onBlur = (evt: FocusEvent) => {
    const tgt: any = evt.relatedTarget;

    if (
        tgt &&
        (tgt.classList.contains("autocomplete-item") ||
            tgt.classList.contains("trv-auto-icon-search-right"))
    ) {
        return;
    }
    isActive.value = false;
    showElement.value = false;
    mutableOptions.value = props.options;

    checkIfValueExistOnOptions();
};

const onFocus = () => {
    showElement.value = true;
    isActive.value = true;
};

const onSelect = (data: optionsType) => {
    keyword.value = data.label as string;
    isActive.value = true;
    showElement.value = false;

    // Emit the value
    props.onSelect?.(data.value);
    emits("update:modelValue", data.value); 
};


const onClear = () => {
    isActive.value = false;
    resetKeyword();
    props.onSelect?.(null);
    emits("onSelect:selectedOption", null);
};
</script>
<template>
    <div class="w-full relative">
      <label v-if="labelInput" class="block text-sm font-medium text-gray-700 mb-1">
        {{ labelInput }}
      </label>
      <div class="relative">
        <input
        :value="keyword"
        @input="onInput($event.target.value)"
        @focus="onFocus"
        @blur="onBlur"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="isReadOnly"
        :required="isRequired"
        class="shadow-sm border focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-[13px] border-gray-300 rounded-sm p-2"
      />
      
        <button v-if="keyword && clearable" type="button" class="absolute right-0 top-1/2 transform -translate-y-1/2 mr-3" @click="onClear">
          <img src="/images/icons/svg-blue/regular/x-circle.svg" alt="clear icon" class="h-5 w-5 text-gray-400" />
        </button>
        <span v-else class="absolute right-0 top-1/2 transform -translate-y-1/2 mr-3">
          <img src="/images/icons/svg-blue/regular/magnifying-glass.svg" alt="search icon" class="h-5 w-5 text-gray-400" />
        </span>
      </div>
      <p v-if="errorMessage" class="mt-2 text-sm text-red-600">
        {{ errorMessage }}
      </p>
      <div v-show="mutableOptions.length && showElement" class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
        <ul tabindex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-item-3">
            <li v-for="(opt, index) in mutableOptions" :key="index" :id="`listbox-item-${index}`" role="option" class="text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9">
                <button type="button" class="autocomplete-item w-full text-left hover:bg-gray-100 focus:bg-gray-200" @click="() => onSelect(opt)">
                  <span class="font-normal block truncate">{{ opt.label }}</span>
                </button>
              </li>
              
        </ul>
      </div>
    </div>
  </template>
  