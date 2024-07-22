<script lang="tsx" setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ref, shallowRef, onMounted, watch, nextTick } from 'vue';
import { useEfacilStore } from "@/stores/EfacilStore";
import { useCompanyStore } from "@/stores/CompanyStore";
import { useTourCodeStore } from "@/stores/TourCodeStore";
import { useAlertStore } from "~/stores/AlertStore";
import { formatDate } from "@/hooks/formatDate";
import InformacoesCIA from "@/components/pages/tourcode/informacoescia/InformacoesCIA.vue";
import InfoReemissao from "@/components/pages/tourcode/inforeemissao/InfoReemissao.vue";
import TourCodePlanoPagamento from "@/components/pages/tourcode/planopagamento/TourCodePlanoPagamento.vue";
import type { Company } from "@/types/frontend";

// State management
const efacilStore = useEfacilStore();
const companyStore = useCompanyStore();
const tourCodeStore = useTourCodeStore();
const alertStore = useAlertStore();

// Refs and reactive variables
const minLength = ref(2);
const DataPicker = shallowRef(VueDatePicker);
const date = ref(new Date());
const companyList = ref([]);
const unitsList = ref([]);
const showList = ref(true);
const showTourcode = ref(false);
const renderedTourCode = ref("");
const selectedUnit = ref(null);

interface fieldTourCodeInput {
    iata: string;
    dataEmissao: string;
    rebates: boolean;
    unidadeId?: string;
    unidadeNome?: string;
    company_id?: number;
}

const fieldTourCode = ref<fieldTourCodeInput>({
    iata: "",
    company_id: 0,
    dataEmissao: "",
    rebates: false,
    unidadeId: "",
    unidadeNome: "",
});



// Lifecycle hooks
onMounted(() => {
    companyResult();
    tourCodeStore.$reset();
});

// Methods

/**
 * Fetches the list of companies based on the search term.
 * @param {string} search - The search term for fetching companies.
 */
const companyResult = async (search = "") => {
    await companyStore.getCompanies(search, 1, 10, "company_name");
    companyList.value = companyStore.companies.map((e) => ({
        value: e,
        label: e.company_name,
    }));
};

/**
 * Fetches the list of units based on the search term.
 * @param {string} search - The search term for fetching units.
 */
const unitsResult = async (search = "") => {
    await efacilStore.getUnitsEfacil("nome", search, "contain");
    unitsList.value = efacilStore.unitsEfacil.map((e) => ({
        value: e,
        label: e.unit_name,
    }));
};



/**
 * Manages the selection of a company.
 * @param {Company} data - The selected company data.
 */
/**
 * Manages the selection of a company.
 * @param {Company} data - The selected company data.
 */
 const manageFieldCompany = async (data: Company) => {
    fieldTourCode.value.company_id = data.company_id;
    fieldTourCode.value.iata = data.company_iata_code;
    fieldTourCode.value.dataEmissao = formatDate(date.value);
    showList.value = false; // Enables the second input
    await unitsResult(); // Loads the options for the second input

    // Clear the unit field
    fieldTourCode.value.unidadeId = "";
    fieldTourCode.value.unidadeNome = "";
    selectedUnit.value = null; // Ensure the selectedUnit is cleared
    unitsList.value = []; // Clear the units list
    renderedTourCode.value = "";
    showTourcode.value = false;
};


watch(selectedUnit, (newVal) => {
    if (!newVal) {
        fieldTourCode.value.unidadeId = "";
        fieldTourCode.value.unidadeNome = "";
    }
});





/**
 * Manages the selection of a unit.
 * @param {any} data - The selected unit data.
 */
const manageFieldUnit = (data: any) => {
    if (!data) {
        fieldTourCode.value.unidadeId = undefined;
        fieldTourCode.value.unidadeNome = undefined;
        return;
    }
    fieldTourCode.value.unidadeId = data.unit_efacil_id;
    fieldTourCode.value.unidadeNome = data.unit_name;
    checkFieldsAndFetchTourCodes(); // Checks and fetches the Tour Codes
};

/**
 * Checks if all necessary fields are filled and fetches the Tour Codes.
 */
const checkFieldsAndFetchTourCodes = async () => {
    if (fieldTourCode.value.iata && fieldTourCode.value.unidadeId) {
        await getTourCodes();
    }
};

/**
 * Fetches the Tour Codes based on the current state of fieldTourCode.
 */
const getTourCodes = async () => {
    alertStore.loading = true;
    await tourCodeStore.getTourCodes(
        fieldTourCode.value.iata,
        fieldTourCode.value.dataEmissao,
        fieldTourCode.value.rebates,
        fieldTourCode.value.unidadeId,
        fieldTourCode.value.unidadeNome
    );
    alertStore.loading = false;
    if (tourCodeStore.tourcode.success == false) {
        tourCodeStore.$reset();
        renderedTourCode.value = "";
        showTourcode.value = false;
        alertStore.success = false;
        alertStore.message = "A busca não retornou dados";
    } else {
        renderedTourCode.value = tourCodeStore.tourcode;
        showTourcode.value = true;
        await nextTick(); 
        applyStyles(); 
    }
};

/**
 * Applies necessary styles to the rendered Tour Codes.
 */
 const applyStyles = () => {
    // Estilização conforme necessário
    const panelCompanhia = document.querySelector('#panelCompanhia');
    if (panelCompanhia) {
        panelCompanhia.classList.add('panel-companhia');
        const logo = panelCompanhia.querySelector('.div-logo img');
        if (logo) logo.classList.add('logo');
        const companyName = panelCompanhia.querySelector('div:nth-child(3)');
        if (companyName) companyName.classList.add('company-name');
        const address = panelCompanhia.querySelector('div:nth-child(4)');
        if (address) address.classList.add('address');
        const cityZip = panelCompanhia.querySelector('div:nth-child(5)');
        if (cityZip) cityZip.classList.add('city-zip');
        const website = panelCompanhia.querySelector('div:nth-child(6) a');
        if (website) website.classList.add('website-link');
    }

    const tableRows = document.querySelectorAll('.panelTourCodes .tbody tr');
    tableRows.forEach((row, index) => {
        row.classList.add(index % 2 === 0 ? 'even-row' : 'odd-row');
    });

    const importantCells = document.querySelectorAll('.tourcode-list .panelTourCodes td:nth-child(2), .tourcode-list .panelTourCodes td:nth-child(3)');
    importantCells.forEach(cell => {
        cell.classList.add('important-cell');
    });

    const panelTourCodes = document.querySelectorAll('.tourcode-list .panelTourCodes');
    panelTourCodes.forEach(panel => {
        panel.classList.add('panel-tourcodes');
    });

    const tableCells = document.querySelectorAll('.tourcode-list .panelTourCodes td');
    tableCells.forEach(cell => {
        cell.classList.add('table-cell');
    });

    const targetTdElements = document.querySelectorAll('.tourcode-list .panelTourCodes td[style*="text-align:center;width:20%;"]');
    targetTdElements.forEach(td => {
        const tourcode = td.querySelector('div:nth-child(1)');
        const emission = td.querySelector('div:nth-child(2) span:nth-child(1)');
        const emissionValue = td.querySelector('div:nth-child(2) span:nth-child(2)');
        const backoffice = td.querySelector('div:nth-child(3) span:nth-child(1)');
        const backofficeValue = td.querySelector('div:nth-child(3) span:nth-child(2)');

        if (tourcode) {
            tourcode.style.fontSize = '14px';
            tourcode.style.color = '#202D3B';
        }

        if (emission && emissionValue) {
            emission.style.fontSize = '12px';
            emissionValue.style.fontSize = '13px';
            emissionValue.style.fontWeight = '500';
            emissionValue.style.color = '#202D3B';
        }

        if (backoffice && backofficeValue) {
            backoffice.style.fontSize = '13px';
            backofficeValue.style.fontSize = '13px';
            backofficeValue.style.fontWeight = '500';
            backofficeValue.style.color = '#202D3B';
        }
    });

    const rebHeaders = document.querySelectorAll('td[id^="reb-head-"]');
    rebHeaders.forEach(td => {
        const agencyClientSpan = td.querySelector('span:nth-child(2)');
        if (agencyClientSpan) {
            const eyeButton = document.createElement('button');
            eyeButton.classList.add('eye-button');
            const tourcodeId = td.id.split('-').pop(); 
            agencyClientSpan.insertAdjacentElement('afterend', eyeButton);
        }
    });

    const flightTypeElements = document.querySelectorAll('.tourcode-list .div-secondarytext');
    flightTypeElements.forEach(element => {
        const title = element.querySelector('.div-st-title');
        const text = element.querySelector('.div-st-text div');
        if (title && text) {
            title.classList.add('flight-type-title');
            text.classList.add('flight-type-text');
            title.innerHTML = `${title.innerText} <span class="flight-type-text">${text.innerText.toUpperCase()}</span>`;
            text.remove();
        }
    });

    const targetTdElements10Percent = document.querySelectorAll('.tourcode-list .panelTourCodes td[style*="text-align:center;width:10%;"]');
    targetTdElements10Percent.forEach(td => {
        const duTitle = td.querySelector('div:nth-child(1)');
        const duValues = td.querySelectorAll('div:nth-child(2), div:nth-child(4), div:nth-child(6)');
        const ouTexts = td.querySelectorAll('div:nth-child(3), div:nth-child(5)');
        const additionalText = td.querySelector('div:nth-child(7)');

        if (duTitle) {
            duTitle.style.fontSize = '9px';
            duTitle.style.fontWeight = '500';
            duTitle.style.textTransform = 'uppercase';
        }

        duValues.forEach(value => {
            value.style.fontSize = '12px';
            value.style.fontWeight = '700';
            value.style.textTransform = 'uppercase';
        });

        ouTexts.forEach(text => {
            text.style.fontSize = '9px';
            text.style.fontWeight = 'normal';
        });

        if (additionalText) {
            additionalText.style.fontSize = '10px';
            additionalText.style.fontWeight = 'normal';
            additionalText.style.textTransform = 'uppercase';
            additionalText.style.color = '#202D3B';
        }
    });

    const orderIdSection = document.querySelectorAll('.tourcode-list td[style*="vertical-align:bottom;text-align:right;"]');
    orderIdSection.forEach(td => {
        const orderIdContainer = td.querySelector('.div-secondarytext');
        if (orderIdContainer) {
            const titles = orderIdContainer.querySelectorAll('.div-st-title');
            const texts = orderIdContainer.querySelectorAll('.div-st-text');
            let orderText = '';
            let idText = '';

            titles.forEach((title, index) => {
                if (title.textContent.trim() === 'Id:') {
                    idText = texts[index].textContent.trim();
                }
            });

        }
    });

    // Add container class to images without affecting table layout
    const imageSections = document.querySelectorAll('.tourcode-list td[style*="vertical-align:bottom;text-align:right;"]');
    imageSections.forEach(td => {
        const img1 = td.querySelector('img[alt="VÁLIDO"]');
        const img2 = td.querySelector('img[alt="INIBIDO"]');

        if (img1 || img2) {
            // Wrap images in a span with image-container class
            const containerSpan = document.createElement('span');
            containerSpan.classList.add('image-container');

            if (img1) {
                containerSpan.appendChild(img1);
            }
            if (img2) {
                containerSpan.appendChild(img2);
            }

            td.appendChild(containerSpan);
        }
    });

    // Seleciona a célula específica e adiciona o botão do olho após o texto "AGÊNCIA/CLIENTE"
    const conditionCells = document.querySelectorAll('td[id^="reb-head-"]');
    conditionCells.forEach(td => {
        const spans = td.querySelectorAll('span');
        const lastSpan = spans[spans.length - 2];
        if (lastSpan) {
            let eyeButton = td.querySelector('button.eye-button');
            if (!eyeButton) {
                eyeButton = document.createElement('button');
                eyeButton.classList.add('eye-button');
                const tourcodeId = td.id.split('-').pop(); // Obtém o tourcodeId do id do elemento td

                // Define o conteúdo inicial do botão como "Ver Rebates"
                eyeButton.innerHTML = getEyeButtonContent(false);

                // Adiciona o evento de clique que alterna entre mostrar e ocultar rebates
                eyeButton.onclick = () => toggleRebates(tourcodeId, eyeButton); // Adiciona o evento de clique
                lastSpan.insertAdjacentElement('afterend', eyeButton);
            }
        }
    });
};

/**
 * Toggles the display of rebates for a given Tour Code.
 * @param {string} tourcodeId - The ID of the Tour Code.
 * @param {HTMLElement} button - The button element that triggered the toggle.
 */
 const toggleRebates = async (tourcodeId, button) => {
    const rebBody = document.querySelector(`#reb-body-${tourcodeId}`);
    if (rebBody && rebBody.innerHTML) {
        rebBody.innerHTML = ''; // Remove o conteúdo se já estiver renderizado
        button.classList.remove('open'); // Volta o estado do botão para fechado
        button.innerHTML = getEyeButtonContent(false); // Define o conteúdo para "Ver Rebates"
    } else {
        // Certifica-se de remover qualquer conteúdo duplicado antes de adicionar o novo
        rebBody.innerHTML = '';
        await viewRebates(tourcodeId);
        button.classList.add('open'); // Muda o estado do botão para aberto
        button.innerHTML = getEyeButtonContent(true); // Define o conteúdo para "Ocultar Rebates"
    }
};

/**
 * Gets the content of the eye button based on its state.
 * @param {boolean} isOpen - The state of the button (true for open, false for closed).
 * @returns {string} - The HTML content for the button.
 */
const getEyeButtonContent = (isOpen) => {
    if (isOpen) {
        return '<div class="teste"><div class="showRebates">Ocultar Rebates</div><img src="/images/icons/png-color/eye.png" alt="Ocultar Rebates" class="showEyesRebate" /><br></div>';
    } else {
        return '<div class="teste"><div class="showRebates">Ver Rebates</div><img src="/images/icons/png-color/eye-closed.png" alt="Ver Rebates" class="showEyesRebate" /><br></div>';
    }
};


/**
 * Fetches and renders the rebates for a given Tour Code.
 * @param {string} tourcodeId - The ID of the Tour Code.
 */
 const viewRebates = async (tourcodeId) => {
    try {
        const unidadeId = fieldTourCode.value.unidadeId;
        const iata = fieldTourCode.value.iata;
        const dataValidade = formatDate(date.value);

        const tourcodeIdNumber = Number(tourcodeId);

        const response = await fetch(`${apiBaseUrl}/suporte/tourcode/rebates`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                unidadeId: unidadeId,
                iata: iata,
                dataValidade: dataValidade,
                tourcodeIds: [tourcodeIdNumber]
            })
        });

        const data = await response.json();
        const rebatesContent = renderRebatesContent(data.data[0].rebates);

        const rebBody = document.querySelector(`#reb-body-${tourcodeId}`);
        if (rebBody) {
            rebBody.innerHTML = '';
            rebBody.append(rebatesContent);
        }

        if (data.success) {
            console.log('Rebates content:', rebatesContent);
        } else {
            alertStore.success = false;
            alertStore.message = "Falha ao buscar rebates.";
        }
    } catch (error) {
        alertStore.success = false;
        alertStore.message = error.message;
    }
};


/**
 * Renders the content of rebates.
 * @param {Array} rebates - The list of rebates to be rendered.
 * @returns {HTMLElement} - The rendered rebates content.
 */
 const renderRebatesContent = (rebates) => {
    const container = document.createElement('div');
    container.classList.add('rebates-container');

    if (rebates.length === 0) {
        container.innerHTML = `<p class="no-rebates-message">Esse tourcode não contém dados de rebates</p>`;
    } else {
        rebates.forEach(rebate => {
            const rebateElement = document.createElement('div');
            rebateElement.classList.add('rebate-item');

            if (rebate.fee) {
                rebateElement.innerHTML = `
                <div class="bg-white">
                    <div class="bg-gray-50 text-slate-900 text-xs">
                        ${rebate.nomeAgencia}
                    </div>
                    <div class="mb-3 text-xs text-gray-500">
                        Fee: ${rebate.fee}
                    </div>
                </div>
                `;
            } else if (rebate.comissaoRepassada || rebate.comissaoBaseCalculo || rebate.incentivoRepassado || rebate.incentivoBaseCalculo) {
                rebateElement.innerHTML = `
                <div class="bg-white">
                    <div class="bg-gray-50 text-slate-900 text-xs">
                        ${rebate.nomeAgencia}
                    </div>
                    <div class="mb-3 text-xs text-gray-500">
                        Com: ${rebate.comissaoRepassada || 0}%/${rebate.comissaoBaseCalculo || 0}% + Inc: ${rebate.incentivoRepassado || 0}%/${rebate.incentivoBaseCalculo || 0}%
                    </div>
                </div>
                `;
            } else {
                rebateElement.innerHTML = `
                <div class="bg-white">
                    <div class="bg-gray-50 text-slate-900 text-xs m-2">
                        ${rebate.nomeAgencia}
                    </div>
                </div>
                `;
            }
            container.append(rebateElement);
        });
    }
    return container;
};


// Apply styles after the next DOM update cycle
nextTick(() => {
    applyStyles();
});

// Watchers

watch(date, (newDate) => {
    if (fieldTourCode.value.iata != "") {
        fieldTourCode.value.dataEmissao = formatDate(newDate);
    }
});

// Tab options for the TabComponent
const tabOptions = [
    {
        label: "TourCode",
        value: "tourcode",
        component: () => (
            <div v-html={renderedTourCode.value} class="tourcode-list" />
        ),
    },
    {
        label: "Plano de Pagamento",
        value: "paymentPlan",
        component: () => (
            <TourCodePlanoPagamento
                company_id={fieldTourCode.value.company_id}
            />
        ),
    },
    {
        label: "Tabela de Reemissão",
        value: "reemission",
        component: () => (
            <InfoReemissao company_id={fieldTourCode.value.company_id} />
        ),
    },
    {
        label: "Informações Cia",
        value: "ciaInformation",
        component: () => (
            <InformacoesCIA company_id={fieldTourCode.value.company_id} />
        ),
    },
];

// Runtime configuration
const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

</script>

<template>
    <div>
        <NuxtLayout name="main">
            <section class="body-content">
                <div class="grid grid-cols-5 ">
                    <div>
                        <!-- Header name table -->
                        <section class="mt-1">
                            <TableHeader title="TourCode" src="/images/icons/png-color/pieChart.png" />
                        </section>
                    </div>
                
                    <!-- input table -->
                    <div class="col-span-4 ">
                        <section class="grid grid-cols-3 gap-4 ">
                            <!-- Company input -->
                            <CommonInputTrvAutocomplete
                                :options="companyList"
                                label-input="Companhias Aéreas"
                                :search-min-length="minLength"
                                :clearable="true"
                                :onSelect="manageFieldCompany"
                                @shouldSearch="companyResult"
                            />
                            <!-- Unit input -->
                            <CommonInputTrvAutocomplete
                            v-model="selectedUnit"
                            :options="unitsList"
                            label-input="Unidades"
                            :search-min-length="minLength"
                            :is-read-only="showList"
                            :clearable="true"
                            :onSelect="manageFieldUnit"
                            @shouldSearch="unitsResult"
                        />
                        
                        
                            <!-- Date picker -->
                            <DataPicker
                                v-model="date"
                                :auto-apply="true"
                                :format="formatDate"
                                class="date-input-picker"
                                placeholder="Data de Emissão"
                                label="Data de Emissão"
                            >
                                <template #input-icon>
                                    <img class="input-slot-image" src="/images/icons/svg-blue/regular/calendar-blank.svg" alt="icone calendario" />
                                </template>
                                <template #clear-icon="{ clear }">
                                    <img class="input-slot-image" src="/images/icons/svg-blue/regular/x-circle.svg" alt="icone limpar" @click="clear" />
                                </template>
                            </DataPicker>
                        </section>
                    </div>
                </div>
                <section class="tour-code-section ">
                    <!-- TourCode table -->
                    <Card>
                        <p class="empty-search border border-slate-900 font-semibold rounded-md p-5 bg-white text-slate-900  " v-if="!renderedTourCode">
                            Selecione uma "Companhia Aérea" e uma "Unidade" para visualizar o(s) tour code(s).
                        </p>
                        <TabComponent
                            :options="tabOptions"
                            v-if="renderedTourCode"
                            :apply-styles="applyStyles"
                        />
                    </Card>
                </section>
                <LayoutFooter />
            </section>
        </NuxtLayout>
    </div>
</template>

<style lang="scss">
.eye-button {
    background: none;
    border: none;
    cursor: pointer;
}

.teste {
    margin-left: -61px;
}

.showRebates {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -30px;
}

.eye-button img {
    width: 30px;
    height: 30px;
    margin-bottom: 10px;
    transition: transform 0.3s ease-in-out; /* Adiciona a transição */
}

.eye-button.open img {
    transform: scale(1.2); /* Aumenta o tamanho do olho quando aberto */
}

.tourcode-page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-height: 600px;

    h1 {
        font-size: 27px;
        font-weight: 900;
        color: var(--blue-700);
        margin-top: -30px;
    }

    .buttons-container {
        display: flex;
        align-items: center;
    }
}

.form-section {
    margin-top: -20px;
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(4, 1fr);
}

.tour-code-section {
    height: 88%;
    margin-top: 5px;
    position: relative;

    .tour-code-header {
        margin-bottom: 30px;
    }

    .tab-content {
        max-height: 72vh;
        padding: 20px;
        overflow-y: auto;
    }

    .empty-search {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 14px;
    }

    .tourcode-list {
        .panel-tourcodes {
            margin-top: 30px;
            border-radius: 3px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: none;
        }

        table {
            width: 100%;

            th, td {
                padding: 18px 12px;
                text-align: left;
            }

            th {
                background-color: #f8f9fa;
                font-weight: bold;
            }

            tr:nth-child(even) {
                background-color: #fff;
            }

            .table-cell {
                font-size: 14px;
                color: #202D3B;
            }

            .important-cell {
                color: #202D3B;
                font-weight: bold;
            }
        }

        .row-first {
            background-color: #F8F9FA;
            font-weight: bold;

            &:hover {
                background-color: #dee2e6;
            }
        }

        .div-secondarytext {
            .div-st-text {
                max-height: 30px;
                overflow: hidden;
                transition: 0.3s;
                &:hover {
                    max-height: 600px;
                }
            }
        }
    }
}

.flight-type-title {
    font-weight: bold;
}

.flight-type-text {
    text-transform: uppercase;
    font-weight: 400;
}

.panel-companhia {
    background-color: white;
    border-radius: 4px;
    padding: 5px;
    max-width: 300px;
    margin: 5px auto;
    font-family: 'Roboto', sans-serif;
    color: #202D3B;
}

.panel-companhia .div-logo {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
}

.panel-companhia .logo {
    width: 120px;
    height: auto;
}

.panel-companhia .company-name {
    font-size: 11px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 5px;
    color: #202D3B;
}

.panel-companhia .address,
.panel-companhia .city-zip,
.panel-companhia .website {
    font-size: 13px;
    text-align: center;
    margin-bottom: 5px;
    color: #202D3B;
}

.panel-companhia .address,
.panel-companhia .city-zip {
    display: none;
}

.website-link {
    display: flex;
    margin-top: -5px;
    justify-content: center;
    color: #007bff;
    font-size: 12px;
    text-decoration: none;
    transition: color 0.3s;
    &:hover {
        color: #0056b3;
    }
}

.tourcode-title {
    font-weight: bold;
    color: #202D3B;
    font-size: 18px;
}

.emission-title, .backoffice-title, .emission-value, .backoffice-value {
    font-size: 13px;
}

.emission-title, .backoffice-title {
    color: #202D3B;
    font-weight: bold;
    text-transform: uppercase;
}

.emission-value, .backoffice-value {
    color: #202D3B;
    font-weight: 500;
    text-transform: uppercase;
}

.du-title {
    font-weight: bold;
    font-size: 10px;
    text-transform: uppercase;
    color: #202D3B;
}

.du-value {
    font-weight: bold;
    font-size: 13px;
    text-transform: uppercase;
    color: #202D3B;
}

.ou-text {
    font-weight: normal;
    font-size: 10px;
    color: #202D3B;
}

.additional-text {
    font-weight: normal;
    font-size: 10px;
    text-transform: uppercase;
    color: #202D3B;
}

.flex-container {
    display: flex;
    align-items: center;
    color: #202D3B;
}

.flex-container .div-st-text {
    flex: 1;
}

.flex-container-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
    color: #202D3B;
}

.flex-container .div-st-title,
.flex-container .div-st-text,
.flex-container .div-r2-c2-row-fi,
.flex-container .div-r2-c2-row-tx {
    margin-right: 2px;
}

.div-secondarytext .div-st-title,
.div-secondarytext .div-st-text,
.div-r2-c2-row .div-r2-c2-row-fi,
.div-r2-c2-row .div-r2-c2-row-tx {
    display: inline-block;
    margin-right: 10px;
    color: #202D3B;
}

.div-secondarytext, .div-r2-c2-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    color: #202D3B;
}

#target-section .div-secondarytext .div-st-title,
#target-section .div-secondarytext .div-st-text,
#target-section .div-r2-c2-row .div-r2-c2-row-fi,
#target-section .div-r2-c2-row .div-r2-c2-row-tx {
    display: inline-block;
    margin-right: 2px;
}

#target-section .div-secondarytext,
#target-section .div-r2-c2-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

.image-container {
    display: flex !important;
    justify-content: center;
    align-items: center;
    color: #202D3B;
    width: 20px;
}

.hidden {
    display: none;
}

.visible {
    display: table-row;
}

.rebates-container {
    background-color: #f9f9f9;
    padding: 1px;
    border-radius: 3px;
    max-height: 175px;
    width: 300px;
    overflow-y: auto;
}

.no-rebates-message {
    font-size: 14px;
    color: #202D3B;
    text-align: center;
}

</style>
