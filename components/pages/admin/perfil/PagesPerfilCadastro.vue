<script lang="tsx" setup>
import "@vuepic/vue-datepicker/dist/main.css";
import type { Permission } from "@/types/frontend";
import { useAlertStore } from "@/stores/AlertStore";
import { useProfileStore } from "@/stores/ProfileStore";
import { usePermissionStore } from "@/stores/PermissionStore";
import { populateModal } from "@/hooks/populateModals";
import { Icon } from "@iconify/vue";

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

const alertStore = useAlertStore();
const profileStore = useProfileStore();
const permissionStore = usePermissionStore();
const oldList = ref<Permission[]>([]);
const newList = ref<Permission[]>([]);

const formData = ref({
    profile_name: "",
    profile_description: "",
    profile_permissions: [] as string[],
    permissions: [] as Permission[],
});

//to render the permission list according profile stored in database
onBeforeMount(async () => {
    if (props?.data) {
        populateModal(props.data, formData);
    }

    const permissionList = await permissionStore.getPermissions("", 1, 0, "");

    oldList.value = permissionList.map((e) => ({
        ...e,
        value: e,
        label: e.name,
    }));

    newList.value = props.data?.permissions?.map((e) => ({
        ...e,
        value: e,
        label: e?.name,
    }));
});

const onSubmit = async () => {
    alertStore.loading = true;

    if (props.data) {
        await profileStore.updateProfile(formData.value);
    } else {
        await profileStore.saveProfile(formData.value);
    }
    props.onSuccess?.();

    props.onCancel?.();
};

const onDelete = async () => {
    alertStore.loading = true;
    await profileStore.deleteProfile(props.data);
    alertStore.loading = false;
    props.onSuccess?.();
    props.onCancel?.();
};

const updatePermissionList = (value = []) => {
    formData.value.profile_permissions = value.map(
        (permission) => permission?.id
    );
};

const groupedHeader = [
    {
        field: "create",
        label: "Criação ",
        render: (_: string, data: Permission[]) => (
            <div class="custom-trigger">
                <Icon icon="mdi:plus" color="green" />
                <span>Create</span>
                <span class="amount-span">{data?.length}</span>
            </div>
        ),
    },
    {
        field: "view",
        label: "View",
        render: (_: string, data: Permission[]) => (
            <div class="custom-trigger">
                <Icon icon="mdi:eye-outline" />
                <span>View</span>
                <span class="amount-span">{data?.length}</span>
            </div>
        ),
    },
    {
        field: "edit",
        label: "Edit",
        render: (_: string, data: Permission[]) => (
            <div class="custom-trigger">
                <Icon icon="mdi:edit" color="blue" />
                <span>Edit</span>
                <span class="amount-span">{data?.length}</span>
            </div>
        ),
    },
    {
        field: "deleta",
        label: "Deletar",
        render: (_: string, data: Permission[]) => (
            <div class="custom-trigger">
                <Icon icon="mdi:delete-outline" color="red" />
                <span>Deleta</span>
                <span class="amount-span">{data?.length}</span>
            </div>
        ),
    },
];
</script>

<template>
    <form class="permission-form-container" @submit.prevent="onSubmit">
        <div class="form-body">
            <CommonInputWrapInput
                v-model="formData.profile_name"
                label="Nome"
            />
            <RichText
                v-model:content="formData.profile_description"
                label="Descrição"
                style="width: 100%"
                :is-required="false"
            />
            <DragAndDrop
                v-if="oldList.length"
                :oldList="oldList"
                :newList="newList"
                :groupedHeader="groupedHeader"
                :groupBy="(item:Permission) => item.name.split(' ')[0]"
                :onChange="updatePermissionList"
                oldListTitle="Permissões Base"
                newListTitle="Permissões do Perfil"
            />
        </div>
        <div class="buttons-container">
            <FormDeleteButton :onSuccess="onDelete" v-if="props.data" />
            <ButtonComponent @click="props?.onCancel" variant="text">
                Cancelar
            </ButtonComponent>
            <ButtonComponent type="submit"> Salvar </ButtonComponent>
        </div>
    </form>
</template>
<style lang="scss">
.permission-form-container {
    display: grid;
    gap: 24px;

    .form-body {
        max-height: 80vh;
        display: grid;
        gap: 24px;
        padding: 0 12px 20px 0;
        overflow-y: auto;
        overflow-x: hidden;

        &::-webkit-scrollbar {
            width: 10px;
        }
        &::-webkit-scrollbar-track {
            background: transparent;
        }
        &::-webkit-scrollbar-thumb {
            background: var(--grey-500);
            border-radius: 90px;
        }
        &::-webkit-scrollbar-thumb:hover {
            background: var(--grey-600);
        }
    }

    .custom-trigger {
        display: grid;
        grid-template-columns: 13px 50px 20px;
        align-items: center;
        gap: 6px;

        .amount-span {
            color: var(--grey-700);
            font-weight: 400;
        }
    }
    .buttons-container {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 14px;
        margin-top: 30px;
    }
}
</style>
