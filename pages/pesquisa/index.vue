<script lang="ts" setup>
const router = useRouter();
const tableData = ref({});
const tablePaginate = ref({});

tableData.value = [];

const headConfig: Ref<
    {
        text: string;
        value: string;
    }[]
> = ref([
    { text: "Filial", value: "branch" },
    { text: "Departamento", value: "departament" },
    { text: "Usuário", value: "user" },
    { text: "Nome", value: "name" },
    { text: "Arquivo", value: "file" },
    { text: "Data", value: "date" },
    { text: "Acessar", value: "resultSearch" },
]);

const redirectToStore = () => {
    router.push("/pesquisa/cadastro");
};

const buttonsList = ref(["Pesquisar"]);
</script>

<template>
    <div>
        <NuxtLayout name="main">
            <section class="miolo">
                <div class="container-fluid min-ht">
                    <LayoutBreadcrumb
                        title="Pesquisas"
                        link="pesquisa"
                        iconPath="/images/icons/svg-blue/regular/magnifying-glass.svg"
                        :titleButtonList="buttonsList"
                        @emit-button0="redirectToStore"
                    />
                    <div class="row">
                        <div class="col-12">
                            <div class="block-lg">
                                <h2>Lista de Pesquisas</h2>
                                <CommonInputDataTable
                                    title="Formas de Contato"
                                    type="formacontato"
                                    :head-config="headConfig"
                                    :table-data="tableData"
                                    :table-pagination="tablePaginate"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <LayoutFooter />
            </section>
        </NuxtLayout>
    </div>
</template>
