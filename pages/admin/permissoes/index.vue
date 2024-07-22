<script lang="tsx" setup>
import Permissions from "@/components/pages/admin/permissoes/componentes/permissions/index.vue";
import Perfil from "@/components/pages/admin/permissoes/componentes/perfil/index.vue";
import Function from "@/components/pages/admin/permissoes/componentes/funcao/index.vue";

const tabOptions = [
    {
        label: "Perfil",
        value: "function",
        component: <Function />,
    },
    {
        label: "Modulos",
        value: "perfil",
        component: <Perfil />,
    },

    {
        label: "Permissões",
        value: "permissions",
        component: <Permissions />,
    },
];
</script>

<template>
    <div>
        <NuxtLayout name="main">
            <main class="body-content">
                <div class="page-header">
                    <h1>Permissões</h1>
                </div>
                <TabComponent :options="tabOptions" />
                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>

<style lang="scss" scoped>

.page-header {
    margin-bottom: 20px;
    h1 {
        color: var(--grey-800);
        font-size: 27px;
    }
}

</style>
