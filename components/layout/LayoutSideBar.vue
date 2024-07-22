<script lang="tsx" setup>
import { useAuthStore } from "@/stores/AuthStore";
import AccordeonComponent from "../common/accordeon/AccordeonComponent.vue";
import { useAlertStore } from "@/stores/AlertStore";
import { usePermissions } from "@/hooks/usePermission";
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const authStore = useAuthStore();
const alertStore = useAlertStore();
const router = useRouter();

const appVersion = "1.0.0"

const logout = async () => {
    try {
        await router.push({ path: "/" });
    } catch (error: any) {
        alertStore.message = error.message;
        alertStore.success = false;
        alertStore.loading = false;
    }
    await authStore.logout();
};

const rebateOptions = [
    {
        title: "Solicitar Incentivos",
        to: "/rebate/table-solicitar-rebate",
        permission: "rebate-table-solicitar-rebate",
        src: "/images/icons/svg-blank/regular/discountRequest.svg",
    },
    {
        title: "Configuração",
        to: "/rebate/table-configuracao-rebate",
        permission: "rebate-table-configuracao",
        src: "/images/icons/svg-blank/regular/config.svg",
    },
];

const accordeonOptions = [
    {
        parent: "admin",
        title: "Cartões",
        to: "/admin/plano-pagamento/cartoes",
        src: "/images/icons/svg-blank/regular/credit-card.svg",
        permission: "admin-plano-pagamento-cartoes",
    },
    {
        parent: "admin",
        title: "Usuários",
        to: "/admin/usuario",
        permission: "admin-usuario",
        src: "/images/icons/svg-blank/regular/user.svg",
    },
    {
        title: "Permissões",
        parent: "admin",
        to: "/admin/permissoes",
        permission: "admin-permissoes",
        src: "/images/icons/svg-blank/regular/lock-key-open.svg",
    },
    {
        title: "Cadastro FAQ",
        parent: "admin",
        to: "/admin/faq",
        permission: "admin-faq",
        src: "/images/icons/svg-blank/regular/question.svg",
    },
];

const implementOptions = [
    {
        title: "Tipo de Atendimento",
        to: "/tipoatendimento",
        src: "/images/icons/svg-blank/regular/painel.svg",
    },
    {
        title: "Atendimento",
        to: "/atendimento",
        src: "/images/icons/svg-blank/regular/atendimento.svg",
    },
    {
        title: "Avisos",
        to: "/aviso",
        src: "/images/icons/svg-blank/regular/avisos.svg",
    },
    {
        title: "Agências",
        to: "/agencia",
        src: "/images/icons/svg-blank/regular/agencias.svg",
    },
    {
        title: "Visitas",
        to: "/visita",
        src: "/images/icons/svg-blank/regular/visitas.svg",
    },
    {
        title: "Formas Contatos",
        to: "/formacontato",
        src: "/images/icons/svg-blank/regular/formas-contatos.svg",
    },
    {
        title: "Buscar Reserva",
        to: "/buscar-reserva",
        src: "/images/icons/svg-blank/regular/formas-contatos.svg",
    },
    {
        title: "Produtos",
        to: "/produto",
        src: "/images/icons/svg-blank/regular/produtos.svg",
    },
    {
        title: "Status de Crédito",
        to: "/statuscredito",
        src: "/images/icons/svg-blank/regular/credito.svg",
    },
];

const menuOptions = ref([
    {
        src: "/images/icons/svg-blank/regular/painel.svg",
        title: "Painel",
        to: "/painel",
        permission: "painel",
    },
    {
        src: "/images/icons/svg-blank/regular/tourcodes.svg",
        title: "Tour Codes",
        to: "/tourcode",
        permission: "tourcode",
    },
    {
        src: "/images/icons/svg-blank/regular/comando.svg",
        title: "Comando",
        to: "/comando",
        permission: "comando",
    },
    {
        src: "/images/icons/svg-blank/regular/companhias.svg",
        title: "Companhias",
        to: "/companhia",
        permission: "companhia",
    },
    {
        title: "Crédito",
        to: "/credito",
        src: "/images/icons/svg-blank/regular/credito.svg",
    },
    {
        src: "/images/icons/svg-blank/regular/departamentos.svg",
        title: "Departamentos",
        to: "/departamento",
        permission: "departamento",
    },
    {
        src: "/images/icons/svg-blank/regular/faq.svg",
        title: "FAQ",
        to: "/faq",
        permission: "faq",
    },
    {
        src: "/images/icons/svg-blank/regular/filiais.svg",
        title: "Filiais",
        to: "/filial",
        permission: "filial",
    },
    {
        src: "/images/icons/svg-blank/regular/regiao.svg",
        title: "Região",
        to: "/regiao",
        permission: "regiao",
    },
    {
        src: "/images/icons/svg-blank/regular/sistemas.svg",
        title: "Sistemas",
        to: "/sistema",
        permission: "sistema",
    },
    {
        src: "/images/icons/svg-blank/regular/chart-line-up.svg",
        title: "Utilização",
        to: "/utilizacao",
        permission: "utilizacao",
    },
    {
        title: "API Whatsapp",
        to: "/usuariowhatsapp",
        src: "/images/icons/svg-blank/regular/api-whatsapp.svg",
    },
    {
        title: "Financiamento",
        to: "/financiamento",
        src: "/images/icons/svg-blank/regular/atendimento.svg",
    },
]);

onMounted(() => {
    menuOptions.value = menuOptions.value.filter((e) => {
        const { canAccess } = usePermissions("view " + e.to?.replace("/", ""));
        return canAccess;
    });
});
</script>

<template>
    <nav class="nav-menu">
        <ul>
            <li>
                <AccordeonComponent
                    title="Administrativo"
                    src="/images/icons/svg-blank/regular/list.svg"
                    :options="accordeonOptions"
                    :checkPermission="true"
                />
            </li>

            <AccordeonComponent
                title="A Implementar"
                src="/images/icons/svg-blank/regular/list.svg"
                :options="implementOptions"
                :checkPermission="true"
            />

            <AccordeonComponent
                title="Incentivos"
                src="/images/icons/svg-blank/regular/discount.svg"
                :options="rebateOptions"
                :checkPermission="false"
            />

            <li v-for="item in menuOptions">
                <NuxtLink :to="item.to" class="is-menu">
                    <img :src="item.src" />
                    {{ item.title }}
                </NuxtLink>
            </li>

            <li>
                <button type="button" class="menu-button" @click="logout">
                    <img src="/images/icons/svg-blank/regular/logout.svg" />
                    Sair
                </button>
            </li>
            <li>
                <p class="app-version">Versão: {{ appVersion }}</p>
            </li>
        </ul>
    </nav>
</template>

<style scoped lang="scss">
.nav-menu {
    border-radius: 15px;
    padding: 14px 10px;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 4px;
    }

    ul {
        padding: 0;
        margin: 0;
        list-style: none;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;

        li {
            a,
            .menu-button {
                width: 100%;
                min-height: 40px;
                display: flex;
                gap: 6px;
                align-items: center;
                padding: 10px 15px 10px 13px;
                font-size: 14px;
                font-weight: 500;
                font-family: "Montserrat", sans-serif;
                color: var(--grey-900);
                transition: background 0.3s, color 0s;
                text-decoration: none;

                img {
                    width: 16px;
                    height: 16px;
                    filter: brightness(0);
                    transition: 0s;
                }

                &:hover {
                    background: var(--blue-800);
                    border-radius: 6px;
                    color: var(--white);

                    img {
                        filter: brightness(100);
                    }
                }

                &[aria-current="page"] {
                    background: var(--blue-800);
                    border-radius: 6px;
                    color: var(--white);

                    img {
                        filter: brightness(100);
                    }
                }
            }

            .menu-button {
                cursor: pointer;
                background-color: transparent;
                border: 0;
            }
        }
    }
}

.app-version {
    font-size: 12px;
    font-weight: 400;
    font-family: "Montserrat", sans-serif;
    color: var(--grey-700);
    text-align: center;
    margin-top: 10px;
}
</style>
