<script lang="ts" setup>
import { useAuthStore } from "@/stores/AuthStore";

const { loginUser } = useAuthStore();
const openModal = ref(false);

const formatedUserData = {
    ...loginUser,
    roles: loginUser?.user_roles,
    email: loginUser?.user_email,
    department: loginUser?.user_department,
    user_branch_id: loginUser?.branch?.branch_id,
    user_department_id: loginUser?.department?.department_id,
    user_position_id: loginUser?.position?.position_id,
};

const onOpenModal = async () => {
    console.log(loginUser);

    openModal.value = !openModal.value;
};
</script>

<template>
    <header class="dashboard-header">
        <ModalComponent title="Conta" :open="openModal">
            <PagesUsuarioCadastro
                :onCancel="onOpenModal"
                :data="formatedUserData"
            />
        </ModalComponent>
        <img
            src="/images/brt.svg"
            alt="BRT Consolidadora - Operadora de Turismo"
            class="brt-logo"
        />

        <ButtonComponent
            variant="text"
            class="profile-btn"
            @click="onOpenModal"
        >
            <span>{{ loginUser?.user_name }}</span>
            <img src="/images/user.svg" width="30" height="30" />
        </ButtonComponent>
    </header>
</template>

<style scoped lang="scss">
.dashboard-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;

    .brt-logo {
        width: 70px;
        filter: brightness(0);
    }
}

.profile-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0 4px;
    border: 0 !important;

    span {
        font-size: 12px;
        color: var(--grey-800);
    }

    img {
        filter: brightness(0);
    }
}
</style>
