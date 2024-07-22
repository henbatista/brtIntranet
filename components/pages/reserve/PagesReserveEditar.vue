<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useModalStore } from '@/stores/ModalStore';

const modalStore = useModalStore();
const route = useRoute();
const router = useRouter();


const onSubmit = (event: any) => {
    event.preventDefault();
}

const redirectToStore = () => {
    const routePathActive = route.path;
    switch (routePathActive) {
        case '/agencia':
            modalStore.$reset();
            break;
        default:
            break;
    }
};

</script>
<template>
    <form @submit="onSubmit">
        <div class="row">
            <div class="col-12 col-sm-6 col-xl-4">
                <div class="wrap-input">
                    <input type="text" v-model="usuario" required>
                    <label>
                        Login Reserve
                    </label>
                </div>
            </div>
            <div class="col-12 col-sm-6 col-xl-4">
                <div class="wrap-input">
                    <input type="password" v-model="senha" required>
                    <label>
                        Senha Reserve
                    </label>
                </div>
            </div>
            <div class="col-12 col-sm-6 col-xl-4">
                <div class="wrap-input">
                    <input type="text" v-model="descricao" required>
                    <label>
                        Id Licenciado
                    </label>
                </div>
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