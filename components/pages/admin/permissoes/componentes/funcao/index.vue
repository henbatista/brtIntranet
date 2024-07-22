<script setup lang="ts">
import roleService from "@/utils/role.service";
import FunctionCard from "@/components/pages/admin/funcao/card.vue";

const dataSource = ref([]);

const handleGetFunctions = async (search: string = "", value: string = "") => {
    const {
        data: { data },
    }: any = await roleService.getRoles(search, 1, 200, value);

    dataSource.value = data;
};

onBeforeMount(handleGetFunctions);

const openModal = ref(false);
const modalData = ref();

const searchColumns = [
    {
        field: "name",
        header: "Nome",
    },
    {
        field: "description",
        header: "Descrição",
    },
];

const handleSearch = (value: { type: string; value: string }) => {
    handleGetFunctions(value.value, value.type);
};

const onOpenModal = () => {
    modalData.value = null;
    openModal.value = !openModal.value;
};
</script>

<template>
    <section class="perfil-list">
        <ModalComponent
            :title="modalData ? 'Editar Funcão' : 'Cadastro de Funcão'"
            :open="openModal"
        >
            <PagesFuncaoCadastro
                :onCancel="onOpenModal"
                :data="modalData"
                :onSuccess="handleGetFunctions"
            />
        </ModalComponent>

        <div class="perfil-header">
            <TableSearchBar
                :table_columns="searchColumns"
                :onSearch="handleSearch"
            />
            <ButtonComponent @click="onOpenModal"> Cadastrar </ButtonComponent>
        </div>

        <section class="list-container">
            <FunctionCard
                v-for="(item, index) in dataSource"
                :data="item"
                :key="index"
                :onClick="
                    () => {
                        modalData = item;
                        openModal = !openModal;
                    }
                "
            />
        </section>
    </section>
</template>
<style lang="scss" scoped>
.perfil-header {
    display: flex;
    align-items: center;
    gap: 50px;
    margin-bottom: 30px;
}
.list-container {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
}

</style>
