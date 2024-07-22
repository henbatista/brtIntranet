<script lang="ts" setup>
import { useFaqStore } from "@/stores/FaqStore";

const faqStore = useFaqStore();

onMounted(async () => {
    await faqStore.fetchFaq("", 1, 7, "").then((res) => console.log(res));
});
</script>

<template>
    <div>
        <NuxtLayout name="main">
            <section class="body-content">
                <h1>
                    <img
                        src="/images/icons/svg-blue/regular/question.svg"
                        width="30"
                        height="30"
                    />
                    FAQ - Operacional
                </h1>
            </section>
        </NuxtLayout>
    </div>
</template>
