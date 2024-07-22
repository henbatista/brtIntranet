<script lang="tsx" setup>
import { useAuthStore } from "@/stores/AuthStore";
import PagesAvisoCadastro from "@/components/pages/avisos/PagesAvisoCadastro.vue";
import PagesVisitaCadastro from "@/components/pages/visita/PagesVisitaCadastro.vue";
import CompanyHome from "@/components/pages/painel/components/company/CompanyHome.vue";
import VisitHome from "@/components/pages/painel/components/visit/VisitHome.vue";
import AgencyHome from "@/components/pages/painel/components/agency/AgencyHome.vue";
import AdviceHome from "@/components/pages/painel/components/advice/AdviceHome.vue";
import type { TVisit } from "@/types/visit";
import PagesAgenciaCadastro from "@/components/pages/agencia/PagesAgenciaCadastro.vue";
import type { Agency, Faq } from "@/types/frontend";

const { loginUser } = useAuthStore();

const greetingMessage = ref<string>("");

onBeforeMount(() => {
    const currentTime = new Date().getHours();
    if (currentTime <= 11) greetingMessage.value = "Bom Dia";
    else if (currentTime >= 12 && currentTime < 18) {
        greetingMessage.value = "Boa tarde";
    } else if (currentTime >= 18) greetingMessage.value = "Boa Noite";
});

const visitSource = ref<TVisit[]>([]);
const agencySource = ref<Agency[]>([]);
const faqSource = ref<Faq[]>([]);
const adviceSource = ref<any[]>([]);

const resultsLimit = 3;

const getHomeVisit = async () => {
    const {
        data: { data },
    }: any = await getVisit("", 1, 5, "");
    visitSource.value = data.slice(0, resultsLimit);
};
const getHomeAgency = async () => {
    const {
        data: { data },
    }: any = await getAgency("", 1, 5, "");

    agencySource.value = data.slice(0, resultsLimit);
};
const getHomeFAQ = async () => {
    const {
        data: { data },
    }: any = await getFaqs("", 1, 5, "");

    faqSource.value = data.slice(0, resultsLimit);
};
const getHomeAdvices = async () => {
    const {
        data: { data },
    }: any = await getAdvices("", 1, 5, "");

    adviceSource.value = data.slice(0, resultsLimit);
};

onBeforeMount(() => {
    getHomeVisit();
    getHomeAgency();
    getHomeFAQ();
    getHomeAdvices();
});

const newVisitElement = ref<any>(
    <PagesVisitaCadastro onSuccess={getHomeVisit} />
);

const newAgencyElement = ref<any>(
    <PagesAgenciaCadastro onSuccess={getHomeVisit} />
);
</script>

<template>
    <div>
        <NuxtLayout name="main">
            <main class="body-content">
                <div class="panel-container">
                    <section class="greeting-container">
                        <div class="greeting-title">
                     
                            <div>
                                <Card>
                                    <div>
                                        <div class="flex space-x-4 mb-5 rtl:space-x-reverse">
                                          <div class="flex-none">
              
                                          </div>
                                          <div class="flex-1">
                                            <h4 class="text-xl font-medium mb-2">
                                              <span class="block font-light"><span class="wave-emoji">👋</span> {{ greetingMessage }},</span>
                                              <span class="block">{{ loginUser?.user_name }}</span>
                                            </h4>

                                          </div>
                                        </div>
                                      </div>
                                  <div
                                    class="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5"
                                  >


                                    <PainelCardComponent
                                    title="Últimas visitas"
                                    to="/visita"
                                    modalTitle="Nova Visita"
                                    :addNewElement="newVisitElement"
                                    class="visit_card-container"
                                >
                                    <VisitHome
                                        :dataSource="visitSource"
                                        :onSuccess="getHomeVisit"
                                    />
                                </PainelCardComponent>
            
                                <PainelCardComponent
                                    title="Agências"
                                    to="/agencia"
                                    modalTitle="Nova Agência"
                                    :addNewElement="newAgencyElement"
                                    class="agency-container"
                                >
                                    <AgencyHome
                                        :dataSource="agencySource"
                                        :onSuccess="getHomeAgency"
                                    />
                                </PainelCardComponent>
            
                                <PainelCardComponent
                                    title="FAQ"
                                    to="/faq"
                                    class="faq-container"
                                >
                                    <FAQHome
                                        :dataSource="faqSource"
                                        :onSuccess="getHomeVisit"
                                    />
                                </PainelCardComponent>
        
                                  </div>
                                </Card>
                              </div>
                            
                        </div>
                    </section>



         

                    <PainelCardComponent
                        title="Companhias aéreas"
                        to="/companhia"
                        style="grid-column: span 2"
                    >
                        <CompanyHome />
                    </PainelCardComponent>

                    <PainelCardComponent
                        title="Últimos créditos"
                        to="/credito"
                        style="grid-row: span 2"
                    >
                        <ul>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                        </ul>
                    </PainelCardComponent>

                    <PainelCardComponent
                        title="Últimos avisos"
                        to="/aviso"
                        modalTitle="Novo Aviso"
                        :addNewElement="PagesAvisoCadastro"
                        style="grid-column: span 2"
                    >
                        <AdviceHome
                            :dataSource="adviceSource"
                            :onSuccess="getHomeAdvices"
                        />
                    </PainelCardComponent>

                    <PainelCardComponent
                        title="Últimos antedimentos"
                        to="/atendimento"
                    >
                        <ul>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                        </ul>
                    </PainelCardComponent>

                    <PainelCardComponent title="Usuários" to="/admin/usuario">
                        <ul>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                        </ul>
                    </PainelCardComponent>

                    <PainelCardComponent
                        title="API Whatsapp"
                        to="/usuariowhatsapp"
                    >
                        <ul>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                        </ul>
                    </PainelCardComponent>
                </div>

                <LayoutFooter />
            </main>
        </NuxtLayout>
    </div>
</template>

<style lang="scss">
.panel-container {
    padding: 0px 10px 20px;
    display: grid;
    grid-template-columns: repeat(3, minmax(300px, 1fr));
    gap: 30px;

    .greeting-container {
        grid-column: span 3;


    .visit_card-container {
        background-color: #b7d3ef;
    }
    .agency-container {
        background-color: #8994f8;
    }
    .faq-container {
        background-color: #d981f8;
    }
}

.wave-emoji {
    display: inline-block;
    animation: wave-animation 2s infinite;
}
}

@keyframes wave-animation {
    0% { transform: rotate(0deg); }
    15% { transform: rotate(14deg); }
    30% { transform: rotate(-8deg); }
    40% { transform: rotate(14deg); }
    50% { transform: rotate(-4deg); }
    60% { transform: rotate(10deg); }
    70% { transform: rotate(0deg); }
    100% { transform: rotate(0deg); }
}
</style>
