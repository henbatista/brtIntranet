<script setup>
import { useModalStore } from "@/stores/ModalStore";
import { useAlertStore } from "@/stores/AlertStore";
import { onMounted, onBeforeUnmount } from 'vue';


const modalStore = useModalStore();
const alertStore = useAlertStore();

const closeModal = (event) => {
    const modal = document.querySelector(".modal-section");
    if (event.target === modal) {
        modalStore.$patch((state) => {
            state.modalShow = false;
        });
    }
};

const closeModalReset = () => {
    modalStore.$patch((state) => {
        state.modalShow = false;
        modalStore.$reset();
    });
};

onMounted(() => {
    document.addEventListener("click", closeModal);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", closeModal);
});


const modalTop = () => {
    if (
        modalStore.modalType === "agencia" ||
        modalStore.modalType === "resultadoPesquisa"
    ) {
        return true;
    } else {
        return false;
    }
};
</script>
<template>
   <section class="modal-section" :class="{ active: modalStore.getModalShow }">
        <div class="modal"
            :class="{
                'modal-agency': modalTop(),
                active: modalStore.getModalShow,
            }"
        >
        <div v-if="modalStore.getModalType !== 'loader'" class="head">
            <img src="/images/edit.svg" alt="icone de fechar modal" />
            <h2>
                {{ modalStore.getModalTitle }}
            </h2>
            <div>
                <button class="close" @click.prevent="closeModalReset()">
                    <img
                        src="/images/icons/svg-blue/regular/x-circle.svg"
                        alt="icone de fechar modal"
                    />
                </button>
            </div>
        </div>
        <div class="body">
            <RebatesPage
                v-if="
                    modalStore.getModalType == 'RebatesPage' &&
                    modalStore.getModalShow == true
                "
            />
                <PagesCargoCadastro
                    v-if="
                        modalStore.getModalType == 'cargo' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesDepartamentoCadastro
                    v-if="
                        modalStore.getModalType == 'departamento' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesFuncaoCadastro
                    v-if="
                        modalStore.getModalType == 'funcao' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesPerfilCadastro
                    v-if="
                        modalStore.getModalType == 'perfil' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesPermissaoCadastro
                    v-if="
                        modalStore.getModalType == 'permissao' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesUsuarioCadastro
                    v-if="
                        modalStore.getModalType == 'usuario' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesAgenciaEditar
                    v-if="
                        modalStore.getModalType == 'agencia' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesAtendimentoCadastro
                    v-if="
                        modalStore.getModalType == 'atendimento' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesAvisoCadastro
                    v-if="
                        modalStore.getModalType == 'aviso' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesComandoCadastro
                    v-if="
                        modalStore.getModalType == 'comando' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesCompanhiaCadastro
                    v-if="
                        modalStore.getModalType == 'companhia' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesCreditoCadastro
                    v-if="
                        modalStore.getModalType == 'credito' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesFaqCadastro
                    v-if="
                        modalStore.getModalType == 'faq' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesFilialCadastro
                    v-if="
                        modalStore.getModalType == 'filial' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesFormacontatoCadastro
                    v-if="
                        modalStore.getModalType == 'formacontato' &&
                        modalStore.getModalShow == true
                    "
                />
                <!-- <PagesPainelCadastro
                    v-if="
                        modalStore.getModalType == 'painel' &&
                        modalStore.getModalShow == true
                    "
                /> -->
                <PagesProdutoCadastro
                    v-if="
                        modalStore.getModalType == 'produto' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesRegiaoCadastro
                    v-if="
                        modalStore.getModalType == 'regiao' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesReserveCadastro
                    v-if="
                        modalStore.getModalType == 'reserve' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesSistemaCadastro
                    v-if="
                        modalStore.getModalType == 'sistema' &&
                        modalStore.getModalShow == true
                    "
                />
                <!-- <PagesTourcodeCadastro
                    v-if="
                        modalStore.getModalType == 'tourcode' &&
                        modalStore.getModalShow == true
                    "
                /> -->
                <PagesUsuarioWhatsappCadastro
                    v-if="
                        modalStore.getModalType == 'usuariowhatsapp' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesVisitaCadastro
                    v-if="
                        modalStore.getModalType == 'visita' &&
                        modalStore.getModalShow == true
                    "
                />
                <!-- <PagesLoaderLoading v-if="alertStore.loading == true" /> -->
                <PagesReserveEditar
                    v-if="
                        modalStore.getModalType == 'agenciaReserve' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesTipoAtendimentoCadastro
                    v-if="
                        modalStore.getModalType == 'tipoatendimento' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesResultadoPesquisa
                    v-if="
                        modalStore.getModalType == 'resultadoPesquisa' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesStatusCreditoCadastro
                    v-if="
                        modalStore.getModalType == 'statuscredito' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesFinanciamentoCadastro
                    v-if="
                        modalStore.getModalType == 'financiamento' &&
                        modalStore.getModalShow == true
                    "
                />
                <PagesCartaoCadastro
                    v-if="
                        modalStore.getModalType == 'cartao' &&
                        modalStore.getModalShow == true
                    "
                />
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@keyframes fadeInModal {
    0% {
        transform: rotateY(180deg);
    }

    100% {
        transform: rotateY(0deg);
    }
}
@keyframes fadeOutModal {
    0% {
        transform: rotateY(0deg);
    }
    100% {
        transform: rotateY(-180deg);
    }
}

.modal-section {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(3px);
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    z-index: 999999999;
}

.modal {
    width: 50vw;
    height: 100%;
    padding: 0px 20px;
    background: var(--white);
    box-shadow: 0 4px 15px -5px rgba(0, 0, 0, 0.37),
        0 6px 25px -10px rgba(0, 0, 0, 0.2);
    transform-origin: right;
    animation: 0.5s fadeInModal forwards ease-out;
}

.modal-section.active .modal {
    transform: translateX(0);
}

.head {
    display: flex;
    padding: 10px 0px;
    border-bottom: 1px solid var(--grey-500);
    align-items: center;
    gap: 100px;
    justify-content: space-between;

    h2 {
        color: var(--grey-800);
        font-size: 16px;
        font-weight: 900;
    }

    .close {
        background-color: var(--white);
        padding: 6px 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--grey-800);
        font-size: 18px;
        border-radius: 7px;
        border: 1px solid var(--grey-500);
        }
    }

.body {
    height: 100%;
    padding: 20px 10px 10px;
}

.close-modal {
    .modal-content {
        transform-origin: right;
        animation: 0.5s fadeOutModal forwards ease-out;
    }
}
</style>