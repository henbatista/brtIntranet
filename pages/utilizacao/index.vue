<script lang="tsx" setup>
import { columnsType } from "@/components/common/table/TableComponent.vue";
import LogFilter from "./LogFilter.vue";

const tableData = ref({});
tableData.value = [];

const filter = ref(<LogFilter />);

const columns: columnsType<any>[] = [
    {
        field: "login",
        header: "Login Utilizado",
    },
    {
        field: "userName",
        header: "Nome do Usuário",
        style: "flex: 1",
    },

    {
        field: "qtdAccess",
        header: "Quantidade de Acessos",
    },
    {
        field: "date",
        header: "Data do Acesso",
    },
];
</script>
<template>
    <div>
        <NuxtLayout name="main">
            <main class="body-content">
                <TableComponent
                    title="Utilização"
                    :dataSource="[]"
                    :columns="columns"
                    :headerComponent="filter"
                />

                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>
