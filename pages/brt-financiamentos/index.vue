<script lang="ts" setup>
import type { TFinance } from "@/types/finance";

definePageMeta({
    needAuthentication: false,
});

type searchOptions = "nacional" | "internacional";

const isLoading = ref(false);
const financeItems = ref<TFinance[]>([]);
const buttonActive = ref<searchOptions>("nacional");

const notFoundMessage = "Nenhuma companhia encontrada!";

const onGetFinancial = async (search: searchOptions = "nacional") => {
    isLoading.value = true;
    const { data }: any = await getFinancesFreeRoute(search);
    isLoading.value = false;
    buttonActive.value = search;
    financeItems.value = data;
    console.log("finance", financeItems.value);
};

onMounted(() => {
    onGetFinancial("nacional");
});
</script>

<template>
    <main class="fn-free-route">
        <header class="fn-header">
            <nav>
                <div class="left-side">
                    <img
                        src="/images/brt-logo.png"
                        alt="logo-img"
                        class="brt-logo"
                    />
                </div>

                <div class="right-side">
                    <div class="info-div">
                        <img
                            src="/images/whatsapp-icon.svg"
                            alt="whatsapp-icon"
                        />

                        <span> (41) 3219-5400 </span>
                    </div>

                    <div class="info-div">
                        <img src="/images/phone-icon.svg" alt="phone-icon" />

                        <span> 0800-6455400 </span>
                    </div>
                </div>
            </nav>
        </header>

        <section class="fb-hero">
            <div class="content">
                <h1>BRT</h1>

                <p>Financiamentos</p>
            </div>

            <img
                src="/images/john-mcarthur-X_MOr6oa4-k-unsplash-removebg-preview (4).png"
                alt="airplane"
                class="airplane-img"
            />
        </section>

        <main class="financial-content">
            <section class="buttons">
                <button
                    type="button"
                    :class="buttonActive === 'nacional' ? 'active' : ''"
                    @click="() => onGetFinancial('nacional')"
                >
                    <img src="/images/Flag_of_Brazil.svg.png" alt="" />

                    <span>Nacional</span>
                </button>

                <button
                    type="button"
                    :class="buttonActive === 'internacional' ? 'active' : ''"
                    @click="() => onGetFinancial('internacional')"
                >
                    <img src="/images/pngimg.com - globe_PNG34.png" alt="" />

                    <span>Internacional</span>
                </button>
            </section>

            <section class="air-company-logo-list">
                <div
                    v-if="isLoading"
                    v-for="a in [0, 1, 2]"
                    class="skeleton-buttons"
                ></div>

                <a v-else v-for="item in financeItems" class="logo-item">
                    <img
                        v-if="item.company?.company_logo?.includes?.('http')"
                        :src="item.company?.company_logo"
                    />
                    <span v-else>{{ item.company?.company_name }}</span>
                </a>
            </section>

            <section id="finance-root">
                <div
                    v-if="isLoading"
                    v-for="a in [0, 1, 2]"
                    class="skeleton-sections"
                ></div>

                <div
                    v-if="financeItems.length && !isLoading"
                    v-for="item in financeItems"
                    class="finance-div"
                >
                    <div class="title" :id="item?.finance_id">
                        <h3>{{ item?.company?.company_name }}</h3>
                    </div>

                    <div
                        class="description"
                        v-html="item?.finance_description"
                    ></div>
                </div>
                <p class="not-found" v-else>{{ notFoundMessage }}</p>
            </section>
        </main>
    </main>
</template>

<style lang="scss">
@keyframes skeleton-loading {
    0% {
        background-color: hsl(200, 20%, 80%);
    }
    100% {
        background-color: hsl(200, 20%, 95%);
    }
}
.fn-free-route {
    .fn-header {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
    }

    .fn-header {
        nav {
            max-width: 1200px;
            display: flex;
            margin: 0 auto;
            padding: 18px 30px;
            justify-content: space-between;
            align-items: center;

            .left-side {
                .brt-logo {
                    max-width: 60px;
                }
            }

            .right-side {
                display: flex;
                align-items: center;
                gap: 20px;
            }

            span {
                color: white;
                margin-left: 6px;
            }
        }
    }

    .fb-hero {
        width: 100%;
        display: flex;
        justify-content: center;
        background-image: url("/images/maddison-mcmurrin-GDumtPpJsT4-unsplash.jpg");
        position: relative;

        &::after {
            content: "";
            width: 100%;
            height: 100%;
            background: radial-gradient(
                circle,
                rgba(0, 212, 255, 0) 35%,
                rgba(13, 24, 35, 1) 100%
            );
            mix-blend-mode: hard-light;
            position: absolute;
        }

        .content {
            width: 100%;
            max-width: 1200px;
            display: flex;
            padding: 130px 20px 80px;
            flex-direction: column;
            position: relative;
            z-index: 1;

            h1 {
                color: white;
                margin: 0;
                font-size: 48px;
                font-weight: 600;
            }

            p {
                color: white;
                margin: 0;
                font-size: 40px;
            }
        }
        .airplane-img {
            max-width: 600px;
            position: absolute;
            margin-right: -500px;
            bottom: -15px;
            z-index: 2;
        }
    }

    .financial-content {
        max-width: 1200px;
        margin: 0 auto;
        height: 100%;
        background-color: white;
        padding: 22px 30px;
        position: relative;
        z-index: 1;

        &::before {
            content: "";
            width: 100%;
            height: 200px;
            left: 0;
            top: -30px;
            position: absolute;
            border-radius: 33px 33px 0 0;
            box-shadow: 0 -10px 26px -4px rgba(0, 0, 0, 0.2);
            background-color: white;
        }

        &::after {
            content: "";
            width: 100%;
            height: 200px;
            left: 0;
            top: 150px;
            position: absolute;
            background-color: white;
        }

        button {
            background-color: transparent;
            border-radius: 10px;
            display: flex;
            align-items: center;
            border: 0;
            gap: 20px;
            padding: 17px;
            transition: 0.3s;

            img {
                max-width: 30px;
                filter: grayscale(100);
                border-radius: 4px;
            }

            span {
                font-size: 20px;
                color: #9b9b9b;
            }

            &.active {
                background-color: white;
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);

                span {
                    color: #2a2a2a;
                    font-weight: 600;
                }

                img {
                    filter: grayscale(0);
                }
            }
        }

        .buttons {
            width: 100%;
            max-width: 590px;
            margin: 0 auto;
            background-color: #fafafa;
            border-radius: 13px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            padding: 5px;
            box-shadow: inset 0 -1px 4px rgba(0, 0, 0, 0.04),
                inset 0 3px 3px rgba(0, 0, 0, 0.07);
            position: relative;
            z-index: 1;
        }
    }

    .air-company-logo-list {
        display: flex;
        margin-top: 30px;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 2;
        gap: 20px;

        p {
            text-align: center;
        }
    }

    .air-company-logo-list .skeleton-buttons {
        width: 118px;
        height: 58px;
        position: relative;
        animation: skeleton-loading 1s linear infinite alternate;
        border-radius: 12px;
    }

    .air-company-logo-list a {
        width: 118px;
        height: 48px;
        border: solid 1px #dedede;
        border-radius: 12px;
        padding: 5px;
        text-align: center;
        text-decoration: none;
    }

    .air-company-logo-list a img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    #finance-root {
        margin-top: 20px;
        position: relative;
        z-index: 2;

        .skeleton-sections {
            width: 100%;
            min-height: 130px;
            position: relative;
            animation: skeleton-loading 1s linear infinite alternate;
            z-index: 2;
            border-radius: 12px;
            margin-bottom: 10px;
        }

        .finance-div {
            padding: 10px 0;

            & + .finance-div {
                border-top: 1px solid rgb(166, 166, 166);
            }

            p {
                margin: 0;
            }

            .title {
                h3 {
                    padding: 10px 0;
                    margin: 0;
                    font-size: 20px;
                }
            }
        }
    }
}

@media (max-width: 760px) {
    .fb-hero .airplane-img {
        display: none;
    }

    .financial-content .buttons {
        padding: 2px;
    }
}
</style>
