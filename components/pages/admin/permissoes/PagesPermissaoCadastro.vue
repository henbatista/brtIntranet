<script lang="ts" setup>
import "@vuepic/vue-datepicker/dist/main.css";
import { useAlertStore } from "@/stores/AlertStore";
import { usePermissionStore } from "@/stores/PermissionStore";
import { useTableStore } from "@/stores/TableStore";
import { populateModal } from "@/hooks/populateModals";
import * as yup from "yup";
import useFormValidation from "@/hooks/formValidation";

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
const alertStore = useAlertStore();
const permissionStore = usePermissionStore();
const errorMessage = ref('');

const inputForm = ref({
    name: "",
    description: "",

    //madeup
    function: "",
    page: "",
});

const {
    options: { routes },
} = useRouter();

const functionOptions = ref<any[]>([
    {
        value: "view",
        label: "Visualizar",
    },
    {
        value: "create",
        label: "Criar",
    },
    {
        value: "deleta",
        label: "Deletar",
    },
    {
        value: "edit",
        label: "Editar",
    },
]);

const pagesOptions = ref<any[]>([]);

const schema = yup.object({
    page: yup.string().required("A página é obrigatória"),
    function: yup.string().required("A função é obrigatório"),
});

const { errors, inputValidate, validateSubmit } = useFormValidation(
    schema,
    inputForm.value
);


const onDeletePermission = async () => {
    alertStore.loading = true;
    await permissionStore.deletePermission(props.data);
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};

const onUpdatePagePermission = (value: string) => {
    inputForm.value.page = value;
    inputValidate("page");
};
const onUpdateFunction = (value: string) => {
    inputForm.value.function = value;
    inputValidate("function");
};

const onSubmit = async (event: any) => {
    const data = validateSubmit(event);

    const body = {
        name: data.function + " " + data.page,
        description: data.description,
    };

    // Inclui o id no body se estiver presente em props.data
    if (props.data && props.data.id) {
        body.id = props.data.id;
    }

    alertStore.loading = true;
    if (props.data) {
        await permissionStore.updatePermission(body);
    } else {
        await permissionStore.savePermission(body);
    }
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};


onBeforeMount(() => {
    if (props?.data) {
        const splitPermissionName = props.data.name.split(" ");
        const data = {
            ...props.data,
            function: splitPermissionName[0],
            page: splitPermissionName[1],
        };

        populateModal(data, inputForm);
    }
});

onMounted(() => {
    pagesOptions.value = routes.map((e) => {
        let label = e.name;

        if ((label as string)?.includes("-")) {
            const splitedRoute = (label as string).split("-");
            label = splitedRoute.join(" ");
        }
        return {
            value: e.name,
            label,
        };
    });
});

</script>

<template>
    <form class="form-container" @submit.prevent="onSubmit">
        <CommonInputTrvAutocomplete
            v-if="pagesOptions.length"
            :options="pagesOptions"
            :error="errors.page"
            label-input="Página"
            :defaultValue="inputForm.page"
            :clearable="true"
            :onSelect="onUpdatePagePermission"
        />
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>


        <CommonInputTrvAutocomplete
            v-if="functionOptions.length"
            :options="functionOptions"
            label-input="Função"
            :error="errors.function"
            :defaultValue="inputForm.function"
            :clearable="true"
            :onSelect="onUpdateFunction"
        />
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>


        <!-- <CommonInputWrapInput
            v-model="inputForm.name"
            label="Nome"
            :is-required="true"
            @update:modelValue="inputValidate('name')"
            :error="errors.name"
        /> -->
        <RichText
            v-model:content="inputForm.description"
            placeholder="Descrição"
            style="width: 100%; grid-column: span 2"
        />
        <div class="buttons-container">
            <FormDeleteButton
                :onSuccess="onDeletePermission"
                v-if="props.data"
            />
            <ButtonComponent @click="props?.onCancel" variant="text">
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
}

.buttons-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
    grid-column: span 2;
    margin-top: 30px;
}
</style>
