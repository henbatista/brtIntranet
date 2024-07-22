<script lang="ts" setup>
import { onMounted, ref, shallowRef, onBeforeMount } from 'vue';
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useAlertStore } from "@/stores/AlertStore";
import { useRoleStore } from "@/stores/RoleStore";
import { useBranchStore } from "@/stores/BranchStore";
import { useDepartmentStore } from "@/stores/DepartmentStore";
import { usePositionStore } from "@/stores/PositionStore";
import { useUserStore } from "@/stores/UserStore";
import { useTableStore } from "@/stores/TableStore";
import type { optionsType } from "@/types/global";
import * as yup from "yup";
import useFormValidation from "@/hooks/formValidation";
import { populateModal } from "@/hooks/populateModals";
import { formatDate } from "@/hooks/formatDate";
import type { Role, User } from "@/types/frontend";
import { useAuthStore } from "@/stores/AuthStore";


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

const { loginUser } = useAuthStore();
const tableStore = useTableStore();
const alertStore = useAlertStore();
const roleStore = useRoleStore();
const branchStore = useBranchStore();
const departmentStore = useDepartmentStore();
const positionStore = usePositionStore();
const userStore = useUserStore();
const minLength = ref(2);
const DataPicker = shallowRef(VueDatePicker);

const formFields = ref({
  user_name: '',
  email: '',
  user_username: '',
  user_google: '',
  user_department_id: '',
  user_position_id: '',
  user_birth_date: '',
  user_cpf: '',
  user_branch_id: '',
  user_position_name: '',
  password: '',
  confirm_password: '',
  user_status: true,
  roles: [],
});

const schema = yup.object({
    user_name: yup.string().required("O Nome é obrigatório"),
    email: yup.string().required("O Email é obrigatório"),
    user_username: yup.string().required("O Nome de usuário é obrigatório"),
    user_google: yup.string().required("O Usuário do Google é obrigatório"),
    user_cpf: yup.string().required("O CPF é obrigatório"),
    user_branch_id: yup.string().required("A filial é obrigatória"),
    user_department_id: yup.string().required("O Departamento é obrigatório"),
    user_position_id: yup.string().required("O Cargo é obrigatório"),
    roles: yup.array().required("A Função é obrigatória")
        .test("roles", "Selecione uma função para o usuário", value => value && value.length > 0),
    password: !props.data
        ? yup.string().required("A senha é obrigatória").test(
      "regex",
      "Password deverá ter no mínimo 8 characters, entre 1 Character Especial, 1 Letra Maiúscula, 1 Número e 1 Letra Minpuscula",
      val => {
        let regExp = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        console.log(regExp.test(val), regExp, val);
        return regExp.test(val);
      }
    )
        : yup.string(),

    confirm_password: !props.data
        ? yup
              .string()
              .min(8)
              .oneOf([yup.ref("password")], "As senhas devem ser iguais")
        : yup.string(),
    user_birth_date: yup.date().required("A data de nascimento é obrigatória")
        .test("age", "O usuário deve ter no mínimo 14 anos", value => {
            const today = new Date();
            const birthDate = new Date(value);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age >= 14;
        }),
});

const { errors, inputValidate, validateSubmit } = useFormValidation(schema, formFields.value);

const roleList = ref<optionsType[]>([]);
const branchList = ref<optionsType[]>([]);
const departmentList = ref<optionsType[]>([]);
const positionList = ref<optionsType[]>([]);

const roleResult = async (search = "") => {
    await roleStore.getRoles(search, 1, 10, "");
    roleList.value = roleStore.roles.map((e) => ({
        value: e,
        label: e.name,
    }));
};

const branchResult = async (search = "") => {
    await branchStore.getBranches(search, 1, 10, "");
    branchList.value = branchStore.branches.map((e) => ({
        value: e.branch_id,
        label: e.branch_name,
    }));
};

const departmentResult = async (search = "") => {
    await departmentStore.getDepartments(search, 1, 10, "");
    departmentList.value = departmentStore.departments.map((e) => ({
        value: e.department_id,
        label: e.department_name,
    }));
};

const positionResult = async (search = "") => {
    await positionStore.getPositions(search, 1, 10, "");
    positionList.value = positionStore.positions.map((e) => ({
        value: e.position_id,
        label: e.position_name,
    }));
};

const updateRole = (data: Role) => {
    const userRoles: Role[] = formFields.value.roles;

    const filterRole = userRoles.filter((e) => e.id === data.id);
    if (!filterRole.length) {
        (formFields.value.roles as Role[]) = userRoles.concat(data);
        inputValidate('roles'); 

    }
};

const updateBranch = (data: any) => {
    formFields.value.user_branch_id = data;
    inputValidate('user_branch_id'); 

};

const updateDepartment = (data: any) => {
    formFields.value.user_department_id = data;
    inputValidate('user_department_id'); 

};

const onDelete = async () => {
    alertStore.loading = true;
    await userStore.deleteUser(props.data as User);
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};

const onSubmit = async (Event: any) => {
    const data = validateSubmit(Event);

    if (!data) {
        console.log(errors.value);
        return;
    }

    if (!data.password) {
        delete data.password;
    }

    alertStore.loading = true;

    if (props.data) {
        await userStore.updateUser(data);
    } else {
        await userStore.saveUser(data);
    }
    alertStore.loading = false;
    tableStore.onFetchTable();
    props.onCancel?.();
};

onBeforeMount(() => {
    if (props?.data) {
        console.log("user_data", props.data);
        populateModal(props.data, formFields);
    }
});

onMounted(() => {
    roleResult();
    positionResult();
    departmentResult();
    branchResult();

    // Reset autocomplete attributes with JavaScript
    document.querySelectorAll('input').forEach(input => {
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('name', `no_autocomplete_${Math.random().toString(36).substring(2, 15)}`);
        input.setAttribute('id', `no_autocomplete_${Math.random().toString(36).substring(2, 15)}`);
    });
});

</script>

<template>
    <form class="form-container" @submit.prevent="onSubmit" autocomplete="off">

        <CommonInputWrapInput
            v-model="formFields.user_name"
            label="Nome"
            :is-required="true"
            @update:modelValue="inputValidate('user_name')"
            :error="errors.user_name"
            autocomplete="off"
        />

        <CommonInputWrapInput
            v-model="formFields.email"
            label="Email"
            type="email"
            :is-required="true"
            :error="errors.email"
            @update:modelValue="inputValidate('email')"
            autocomplete="off"
        />
        
        <CommonInputWrapInput
            v-model="formFields.user_username"
            label="Nome de usuário"
            :is-required="true"
            @update:modelValue="inputValidate('user_username')"
            :error="errors.user_username"
            autocomplete="off"
        />

        <CommonInputWrapInput
            v-model="formFields.user_google"
            label="Nome usuário Google"
            @update:modelValue="inputValidate('user_google')"
            :is-required="true"
            :error="errors.user_google"
            autocomplete="off"
        />

        <DataPicker
        v-model="formFields.user_birth_date"
        :format="formatDate"
        :auto-apply="true"
        placeholder="Data de Nascimento"
        text-input
        autocomplete="off"
        :error="errors.user_birth_date"
        @update:modelValue="inputValidate('user_birth_date')"
        :max-date="new Date(new Date().setFullYear(new Date().getFullYear() - 14))"
        >
        <template #input-icon>
            <img id="data-picker-input" class="input-slot-image" />
        </template>
        <template #clear-icon="{ clear }">
            <img
                class="input-slot-image"
                src="/images/icons/svg-blue/regular/x-circle.svg"
                alt="icone limpar"
                @click="clear"
            />
        </template>
    </DataPicker>
    
        <CommonInputWrapInput
            v-model="formFields.user_cpf"
            label="CPF"
            mask="###.###.###-##"
            :error="errors.user_cpf"
            @update:modelValue="inputValidate('user_cpf')"
            :is-required="true"
            autocomplete="off"
        />

        <CommonInputTrvAutocomplete
            :options="branchList"
            v-if="branchList.length"
            :defaultValue="props.data?.branch?.branch_id"
            label-input="Nome da filial"
            :search-min-length="minLength"
            :clearable="true"
            :onSelect="updateBranch"
            @shouldSearch="branchResult"
            :is-required="true"
            :error="errors.user_branch_id"
            autocomplete="off"
        />

        <CommonInputTrvAutocomplete
            :options="departmentList"
            label-input="Nome do departamento"
            :defaultValue="props.data?.department?.department_id"
            v-if="departmentList.length"
            :search-min-length="minLength"
            :clearable="true"
            :onSelect="updateDepartment "
            @shouldSearch="departmentResult"
            :is-required="true"
            :error="errors.user_department_id"
            autocomplete="off"
        />
        
        <CommonInputTrvAutocomplete
        v-if="positionList.length"
        :defaultValue="props.data?.position?.position_name"
        :options="positionList"
        label-input="Nome do cargo"
        :search-min-length="minLength"
        :clearable="true"
        :onSelect="(data: any) => {
            formFields.user_position_id = data;
            formFields.user_position_name = data;
            inputValidate('user_position_id'); 
        }"
        @shouldSearch="positionResult"
        :is-required="true"
        :error="errors.user_position_id"
        autocomplete="off"
    />

        <CommonInputTrvAutocomplete
            :options="roleList"
            v-if="roleList.length"
            :defaultValue="
                props.data?.user_roles?.length
                    ? JSON?.stringify?.(roleList.filter(
                          (e) => e.label === props.data?.user_roles?.[0]
                      )?.[0]?.value )as any
                    : ''
            "
            label-input="Função associada"
            @update:modelValue="inputValidate('user_roles')"
            :search-min-length="minLength"
            :clearable="true"
            :onSelect="updateRole"
            @shouldSearch="roleResult"
            :is-required="true"
            :error="errors.roles "
            autocomplete="off"
        />

        <CommonInputWrapInput
            v-model="formFields.password"
            label="Senha"
            type="password"
            @update:modelValue="inputValidate('password')"
            :error="errors.password"
            :is-required="true"
            autocomplete="new-password"
            readonly
            @focus="(e) => e.target.removeAttribute('readonly')"
        />
        
        <CommonInputWrapInput
            v-model="formFields.confirm_password"
            label="Confirmação da senha"
            @update:modelValue="inputValidate('confirm_password')"
            type="password"
            :error="errors.confirm_password"
            :is-required="true"
            autocomplete="new-password"
            readonly
            @focus="(e) => e.target.removeAttribute('readonly')"
        />
        <div class="switchInput">
        <CommonInputCheckBoxSwitch
            id="mySwitch"
            label-off="Status"
            v-model="formFields.user_status"
        />
    </div>

        <div
            class="buttons-container"
            v-if="loginUser?.user_id !== props.data?.user_id"
        >
            <FormDeleteButton :onSuccess="onDelete" v-if="props.data" />

            <ButtonComponent @click="props?.onCancel" variant="text">
                Cancelar
            </ButtonComponent>
            <ButtonComponent type="submit"> Salvar </ButtonComponent>
        </div>

    </form>
</template>
<style lang="scss" >

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
    margin-top: 30px;
    grid-column: span 2;
}

.dp__input_icon_pad  {
    padding: 13px;
    padding-left: 20px;
}

.switchInput{
    margin-top: 15px;
}

</style>
