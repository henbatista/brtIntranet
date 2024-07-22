<script lang="tsx" setup>
import { useAlertStore } from "@/stores/AlertStore";
import { useProfileStore } from "@/stores/ProfileStore";
import ButtonComponent from "@/components/common/button/ButtonComponent.vue";
import { Icon } from "@iconify/vue";
import type { Permission, Profile } from "@/types/frontend";
import { chain } from "lodash";
import ListItemButton from "./ListItemButton.vue";
import { populateModal } from "@/hooks/populateModals";
import { useRoleStore } from "@/stores/RoleStore";

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

interface TPermissionList {
    field: string;
    label: string;
    id: string;
    render: (
        title?: string,
        data?: Permission[],
        selectedData?: Permission[]
    ) => void;
    value: Permission[];
}

interface selectedPermissions {
    perfil: Profile;
    permission: Permission[];
    all: Boolean;
}

const alertStore = useAlertStore();
const profileStore = useProfileStore();
const allProfiles = ref<boolean>(false);
const roleStore = useRoleStore();
await profileStore.getProfiles("", 1, 0, "");
const profileList = ref<Profile[]>(profileStore.profiles);
const permissionList = ref<TPermissionList[]>([]);

const selectedProfile = ref<Profile>();
const selectedPermissinos = ref<selectedPermissions[]>([]);

const formData = ref({
    name: "",
    description: "",
});

onBeforeMount(async () => {
    if (props?.data) {
        populateModal(props.data, formData);

        if (profileList.value) {
            let mountPermissionsList: selectedPermissions[] = [];

            profileList.value.forEach((a) => {
                const permissionFilter = a?.permissions?.filter((e) =>
                    props.data?.permissions?.some(
                        (f: Permission) => e.id === f.id
                    )
                );
                mountPermissionsList = mountPermissionsList.concat({
                    perfil: a,
                    permission: permissionFilter,
                    all: a.permissions.length === permissionFilter.length,
                });
            });

            if (!mountPermissionsList[0]) return;

            selectedPermissinos.value = mountPermissionsList;
        }
    }
});

const filterPermissions = () => {
    return selectedPermissinos.value
        .map((e) => ({ ...e.permission }))
        .flatMap((e) => Object.values(e));
};

const onSubmit = async () => {
    const data: any = {
        ...formData.value,
        guard_name: "sanctum",
        permissions: (filterPermissions() as Permission[]).map((e) => e.id),
    };

    console.log({ data });

    delete data.updated_at;
    delete data.created_at;

    alertStore.loading = true;
    if (props.data) {
        await roleStore.updateRole(data);
    } else {
        await roleStore.saveRole(data);
    }
    props.onSuccess?.();
    props.onCancel?.();
};

const onDelete = async () => {
    alertStore.loading = true;
    await roleStore.deleteRole(props.data);
    alertStore.loading = false;
    props.onSuccess?.();
    props.onCancel?.();
};

const groupedHeader = [
    {
        field: "create",
        label: "Create",
        render: (
            _: string,
            data: Permission[],
            selectedPermissions: Permission[] = []
        ) => (
            <div class="custom-trigger">
                <Icon icon="mdi:plus" color="green" />
                <span>Create</span>
                <span class="amount-span">{data?.length}</span>
                {selectedPermissions?.length > 0 && (
                    <span class="selected-amount-span" key="create">
                        {selectedPermissions?.length}
                    </span>
                )}
            </div>
        ),
    },
    {
        field: "view",
        label: "View",
        render: (
            _: string,
            data: Permission[],
            selectedPermissions: Permission[]
        ) => (
            <div class="custom-trigger">
                <Icon icon="mdi:eye-outline" />
                <span>View</span>
                <span class="amount-span">{data?.length}</span>
                {selectedPermissions?.length > 0 && (
                    <span class="selected-amount-span">
                        {selectedPermissions?.length}
                    </span>
                )}
            </div>
        ),
    },
    {
        field: "edit",
        label: "Edit",
        render: (
            _: string,
            data: Permission[],
            selectedPermissions: Permission[]
        ) => (
            <div class="custom-trigger">
                <Icon icon="mdi:edit" color="blue" />
                <span>Edit</span>
                <span class="amount-span">{data?.length}</span>
                {selectedPermissions?.length > 0 && (
                    <span class="selected-amount-span">
                        {selectedPermissions?.length}
                    </span>
                )}
            </div>
        ),
    },
    {
        field: "deleta",
        label: "Deletar",
        render: (
            _: string,
            data: Permission[],
            selectedPermissions: Permission[]
        ) => (
            <div class="custom-trigger">
                <Icon icon="mdi:delete-outline" color="red" />
                <span>Deleta</span>
                <span class="amount-span">{data?.length}</span>
                {selectedPermissions?.length > 0 && (
                    <span class="selected-amount-span">
                        {selectedPermissions?.length}
                    </span>
                )}
            </div>
        ),
    },
];

// on click in one profile, show permissions related to this profile
const onSelectProfile = (data: Profile) => {
    selectedProfile.value = data;
    const groupPermissions: TPermissionList[] = chain(data.permissions)
        .groupBy((item) => item.name.split(" ")[0])
        .map((e, i) => {
            const filterHeader = groupedHeader.filter((f) => f.field === i);
            return Object.assign(
                {
                    value: e.map((item) => {
                        const isSelected =
                            selectedPermissinos.value
                                .filter(
                                    (e) =>
                                        e.perfil.profile_id === data.profile_id
                                )[0]
                                ?.permission.filter((f) => f.id === item.id)
                                .length > 0;

                        return {
                            ...e,
                            component: (
                                <ListItemButton
                                    data={item}
                                    selected={isSelected}
                                    onSelect={onSelectPermission}
                                />
                            ),
                        };
                    }),
                    id: Math.floor(Math.random() * (9999999 - 1)) + 1,
                },
                filterHeader[0]
            ) as unknown as TPermissionList;
        })
        .value();

    permissionList.value = groupPermissions;
};

const onSelectPermission = (data: Permission) => {
    const hasPerfil = selectedPermissinos.value.filter(
        (e) => e.perfil.profile_id === selectedProfile.value?.profile_id
    ).length;

    if (hasPerfil) {
        selectedPermissinos.value = selectedPermissinos.value.map((e) => {
            if (e.perfil.profile_id === selectedProfile.value?.profile_id) {
                const hasPermission = e.permission.filter(
                    (f) => f.id === data.id
                ).length;
                if (hasPermission) {
                    const filterOutPermission = e.permission.filter(
                        (f) => f.id !== data.id
                    );

                    if (!filterOutPermission.length) {
                        setTimeout(() => {
                            onSelectProfile(selectedProfile.value as Profile);
                        }, 200);
                    }

                    return {
                        ...e,
                        permission: filterOutPermission,
                        all: false,
                    };
                }

                return {
                    ...e,
                    permission: [...e.permission, data],
                    all:
                        [...e.permission, data].length ===
                        selectedProfile.value.permissions.length,
                };
            }
            return e;
        });
    } else {
        selectedPermissinos.value = selectedPermissinos.value.concat({
            perfil: (selectedProfile as globalThis.Ref<Profile>).value,
            permission: [data],
            all: false,
        });
    }
};

// select or unselect all permissions inside one profile
const selectAllPermissionsInsideProfile = (check: boolean) => {
    const hasPerfil = selectedPermissinos.value.filter(
        (e) => e?.perfil?.profile_id === selectedProfile.value?.profile_id
    ).length;

    if (check) {
        if (hasPerfil) {
            selectedPermissinos.value = selectedPermissinos.value.map((e) => {
                if (e.perfil.profile_id === selectedProfile.value?.profile_id) {
                    return {
                        ...e,
                        permission: selectedProfile.value.permissions,
                        all: true,
                    };
                }
                return e;
            });
        } else {
            selectedPermissinos.value = selectedPermissinos.value.concat({
                perfil: selectedProfile.value,
                permission: selectedProfile.value?.permissions,
                all: true,
            });
        }
    } else {
        selectedPermissinos.value = selectedPermissinos.value
            .map((e) => {
                if (e.perfil.profile_id !== selectedProfile.value?.profile_id) {
                    return e;
                }
                return null;
            })
            .filter((e) => e);
    }

    onSelectProfile(selectedProfile.value as Profile);
};
</script>
<template>
    <form class="functions-form-container" @submit.prevent="onSubmit">
        <div class="form-body">
            <CommonInputWrapInput
                v-model="formData.name"
                label="Nome"
                :is-required="true"
            />
            <RichText
                v-model:content="formData.description"
                label="Descrição"
                :is-required="false"
            />

            <section class="permissions-list-container">
                <div class="profile-list-container">
                    <div class="title-container">
                        <h6>Perfis</h6>
                        <CommonInputCheckBoxSwitch
                            id="allProfiles"
                            label-on="Todos"
                            v-model="allProfiles"
                        />
                    </div>
                    <div class="list-section">
                        <ButtonComponent
                            v-for="profile in profileList"
                            :key="profile.profile_id"
                            class="profile-list-item"
                            :data-selected="
                                selectedProfile?.profile_id ===
                                profile.profile_id
                            "
                            @click="() => onSelectProfile(profile)"
                        >
                            {{ profile.profile_name }}
                            <span
                                v-if="
                                    selectedPermissinos.filter(
                                        (e) =>
                                            e?.perfil &&
                                            e.perfil.profile_id ===
                                                profile.profile_id
                                    ).length
                                "
                                >{{
                                    selectedPermissinos.filter(
                                        (e) =>
                                            e?.perfil &&
                                            e.perfil.profile_id ===
                                                profile.profile_id
                                    )[0].permission.length
                                }}</span
                            >
                        </ButtonComponent>
                    </div>
                </div>
                <div v-if="permissionList.length" class="permissions-container">
                    <div class="title-container">
                        <h6>Permissões</h6>
                        <CommonInputCheckBoxSwitch
                            id="allPermissions"
                            label-on="Todas"
                            :modelValue="
                                !!selectedPermissinos.filter(
                                    (e) =>
                                        e?.perfil &&
                                        e.perfil.profile_id ===
                                            selectedProfile?.profile_id
                                )?.[0]?.all
                            "
                            @update:modelValue="
                                (value) =>
                                    selectAllPermissionsInsideProfile(value)
                            "
                        />
                    </div>

                    <div class="list-section">
                        <AccordeonComponent
                            v-for="permission in permissionList"
                            :key="permission.id"
                            :options="permission.value"
                            :title="(title:string, data: Permission[]) => permission?.render?.(title, data, selectedPermissinos.filter(e => e?.perfil?.profile_id === selectedProfile?.profile_id)?.[0]?.permission?.filter(e => e?.name?.includes?.(permission.field)))"
                        />
                    </div>
                </div>
            </section>
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
.functions-form-container {
    display: grid;
    gap: 24px;

    .form-body {
        max-height: 80vh;
        display: grid;
        gap: 24px;
        padding: 0 12px 20px 0;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .permissions-list-container {
        display: grid;
        grid-template-columns: 200px minmax(350px, 1fr);
        gap: 60px;

        .title-container {
            display: flex;
            align-items: center;
            justify-content: space-between;

            h6 {
                color: var(--grey-800);
                font-size: 14px;
            }
        }

        .accordeon-trigger.accordeon-trigger {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 10px 12px;
            text-align: left;
            background: var(--grey-400);
            border: 0;
            color: var(--grey-900);
            transition: 0.3s;
            cursor: pointer;
            border-radius: 6px;

            &:hover {
                background: var(--grey-600);
            }

            .angle-right {
                width: 6px;
                justify-self: flex-end;
                transition: 0.3s;
                margin-left: auto;

                &[data-open="true"] {
                    transform: rotate(90deg);
                }
            }
        }

        .custom-trigger {
            display: grid;
            grid-template-columns: 13px 50px 20px 20px;
            align-items: center;
            gap: 6px;

            .amount-span {
                color: var(--grey-700);
                font-weight: 400;
            }

            .selected-amount-span {
                background-color: var(--blue-700);
                padding: 3px 1px;
                text-align: center;
                font-size: 11px;
                border-radius: 99px;
                color: var(--white);
            }
        }
    }

    .profile-list-container {
        padding: 21px;

        .list-section {
            margin-top: 20px;
            display: grid;
            gap: 10px;
            align-content: flex-start;
        }

        .profile-list-item.profile-list-item {
            width: 100%;
            justify-content: flex-start;
            background: var(--grey-400);
            color: var(--grey-800);
            padding: 10px 14px;
            transition: 0.1s;

            &[data-selected="true"] {
                border: solid 2px var(--blue-700);
            }
        }
    }

    .permissions-container {
        padding: 21px;
        border-radius: 12px;
        border: solid 1px var(--grey-500);

        .accordeon-menu-list {
            &[data-open="true"] {
                background: transparent;
            }
        }

        .list-section {
            margin-top: 20px;
            display: grid;
            gap: 10px;
            align-content: flex-start;

            ul {
                margin: 0;
            }
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
