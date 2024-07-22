<script setup lang="ts">
import profileService from "@/utils/profile.service";
import ProfileCard from "@/components/pages/admin/perfil/card.vue";

const dataSource = ref([]);

const handleGetProfile = async (search: string = "", value: string = "") => {
    const {
        data: { data },
    }: any = await profileService.getProfiles(search, 1, 200, value);

    dataSource.value = data;
};

onBeforeMount(handleGetProfile);

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
    handleGetProfile(value.value, value.type);
};

const onOpenModal = () => {
    modalData.value = null;
    openModal.value = !openModal.value;
};
</script>

<template>
    <section class="perfil-list">
        <ModalComponent
            :title="modalData ? 'Editar Perfil' : 'Cadastro de Perfil'"
            :open="openModal"
        >
            <PagesPerfilCadastro
                :onCancel="onOpenModal"
                :data="modalData"
                :onSuccess="handleGetProfile"
            />
        </ModalComponent>

        <div class="perfil-header">
            <TableSearchBar
                :table_columns="searchColumns"
                :onSearch="handleSearch"
            />
            <ButtonComponent @click="onOpenModal"> Cadastrar </ButtonComponent>
        </div>

        <ProfileCard
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
</template>
<style lang="scss" scoped>
.perfil-header {
    display: flex;
    align-items: center;
    gap: 50px;
}
.perfil-list {
    display: grid;
    gap: 30px;
}
</style>
