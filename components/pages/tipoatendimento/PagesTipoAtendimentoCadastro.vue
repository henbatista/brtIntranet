<script lang="ts" setup>
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

onBeforeMount(() => {
    if (props?.data) {
        populateModal(props.data, branch);
    }
});

const $toast = useToast();
const nomeTipoAtendimento = ref("");

const onSubmit = () => {
    nomeTipoAtendimento.value = "";
    showToastSuccess();
};

const showToastSuccess = () => {
    $toast.success("Cadastro enviado com sucesso!", {
        position: "top-right",
    });
};
</script>

<template>
    <form class="form-container" @submit.prevent="onSubmit">
        <div class="departament-selection">
            <label> Selecione os Departamentos </label>

            <div class="switchs-container">
                <CommonInputCheckBoxSwitch id="all" labelOff="Todos" />
                <CommonInputCheckBoxSwitch id="support" labelOff="Suporte" />
                <CommonInputCheckBoxSwitch
                    id="financial"
                    labelOff="Financeiro"
                />
                <CommonInputCheckBoxSwitch
                    id="comercial"
                    labelOff="Comercial"
                />
                <CommonInputCheckBoxSwitch
                    id="operational"
                    labelOff="Operacional"
                />
                <CommonInputCheckBoxSwitch id="ti" labelOff="TI" />
                <CommonInputCheckBoxSwitch id="brtGroup" labelOff="Grupo BRT" />
                <CommonInputCheckBoxSwitch id="rh" labelOff="RH" />
                <CommonInputCheckBoxSwitch
                    id="consolidator"
                    labelOff="Consolidadora"
                />
                <CommonInputCheckBoxSwitch id="operator" labelOff="Operadora" />
                <CommonInputCheckBoxSwitch id="terrain" labelOff="Terrestre" />
                <CommonInputCheckBoxSwitch
                    id="administration"
                    labelOff="Administrativo"
                />
                <CommonInputCheckBoxSwitch id="credit" labelOff="Crédito" />
            </div>
        </div>

        <CommonInputWrapInput
            div-class="wrap-input"
            label="Nome"
            type="text"
            :is-required="true"
            :error="false"
            error-message="ok"
        />
        <CommonInputWrapInput
            div-class="wrap-input"
            label="Nivel Requisitado "
            type="text"
            :is-required="true"
            :error="false"
            error-message="ok"
        />
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
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;

    .departament-selection {
        grid-column: span 2;

        .switchs-container {
            margin-top: 20px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;

            .trv-form-switcher {
                width: 200px;
                display: flex;
                justify-content: space-between;

                .trv-form-switcher-toggle {
                    width: 38px;
                    height: 20px;

                    .trv-form-switcher-slider {
                        width: 10px;
                        height: 10px;
                    }
                }
            }
        }
    }
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
