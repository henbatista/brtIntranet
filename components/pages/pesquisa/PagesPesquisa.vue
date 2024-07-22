<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useModalStore } from '@/stores/ModalStore';
import { ref } from 'vue';

const modalStore = useModalStore();
const router = useRouter();
const route = useRoute();

const locSelecionado = ref();
const idSearchType = ref();

const tipoPesquisa = ref([
    { id: 0, value: 'Localizador único' },
    { id: 1, value: 'Lista de localizadores' },
]);

const searchType = (data: any) => {
    if (data) {
        idSearchType.value = data.id;
    } else {
        idSearchType.value = -1;
    }
};

const onSubmit = (event: any) => {
    event.preventDefault();
}
const redirectToStore = () => {
    const routePathActive = route.path;
    switch (routePathActive) {
        case '/pesquisa':
            modalStore.$reset();
            break;
        case '/pesquisa/cadastro':
            router.push('/pesquisa');
            break;
        default:
            break;
    }
};
</script>
<template>
    <form @submit="onSubmit">
        <div class="row">
            <div class="col-12 col-sm-6 col-xl-6">
                <div class="wrap-input">
                    <input type="text" v-model="searchName" required>
                    <label>
                        Nome da Pesquisa
                    </label>
                </div>
            </div>
            <div class="col-12 col-sm-6 col-xl-6">
                <CommonInputTrvAutocomplete v-model="locSelecionado" :options="tipoPesquisa" label-key="value"
                    value-key="id" component-type="select" personal-class="wrap-input" label-input="Tipo de pesquisa"
                    :search-min-length="minLength" :clearable=true @select="searchType">
                    <template #iconLeft>
                        <img src="/images/icons/svg-blue/regular/magnifying-glass.svg" alt="icone de procura">
                    </template>
                    <template #iconRight>
                        <img src="/images/icons/svg-blue/regular/magnifying-glass.svg" alt="icone de procura">
                    </template>
                </CommonInputTrvAutocomplete>
            </div>
            <div v-if="idSearchType === 0" class="col-12 col-sm-6 col-xl-6">
                <div class="wrap-input">
                    <input type="text" v-model="loc" required>
                    <label>
                        Localizador
                    </label>
                </div>
            </div>
            <div v-if="idSearchType === 1" class="col-12 col-sm-12 col-xl-6">
                <div class="col-12 col-sm-12 col-xl-12">
                    <div class="block-lg cor1_lt">
                        <p>
                            A pesquisa por lista de localizadores deve ser feita a partir de um arquivo do tipo XLSX criado
                            pelo Excel;
                            O Arquivo deve conter pelo menos uma coluna com o nome de Loc ou Localizador e abaixo a lista de
                            localizadores;
                            Para visualizar uma lista de exemplo clique na imagem ao lado
                        </p>
                    </div>
                </div>
                Lista de Localizadores
                <input type="file">
            </div>
        </div>
        <div class="row button-align button-container">
            <div class="body-button">
                <button class="btn red" @click.prevent="redirectToStore">
                    <span>Cancelar</span>
                </button>
            </div>
            <div class="body-button">
                <button type="submit" class="btn">
                    <span>Salvar</span>
                </button>
            </div>
        </div>
    </form>
</template>