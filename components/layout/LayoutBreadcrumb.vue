<script lang="ts" setup>
import { useAlertStore } from "@/stores/AlertStore";

const route = useRoute();
const router = useRouter();
const alertStore = useAlertStore();

const props = defineProps({
    title: {
        type: String,
        default: "",
    },
    subTitle: {
        type: String,
        default: "",
    },
    link: {
        type: String,
        default: "",
    },
    iconPath: {
        type: String,
        default: "",
    },
    titleButtonList: {
        type: Array,
        default: [],
    },
});

const emits = defineEmits([
    "emitButton0",
    "emitButton1",
    "emitButton2",
    "emitButton3",
    "emitButton4",
]);

function redirectTo(btnName): void {
    switch (btnName) {
        case props.titleButtonList[0]:
            emits("emitButton0");
            break;
        case props.titleButtonList[1]:
            emits("emitButton1");
            break;
        case props.titleButtonList[2]:
            emits("emitButton2");
            break;
        case props.titleButtonList[3]:
            emits("emitButton3");
            break;
        case props.titleButtonList[4]:
            emits("emitButton4");
            break;
        default:
            break;
    }
}
</script>
<template>
    <div class="breadCrumbHeader">
        <div class="title-container">
            <img :src="`${iconPath}`" />
            <h1>
                {{ title }}
            </h1>
            <span class="breadcrumb-sub-title">{{ subTitle }}</span>
        </div>
        <div class="breadcrumb-buttons-container">
            <ButtonComponent
                v-for="(btn, index) in titleButtonList"
                :key="index"
                @click.prevent="redirectTo(btn)"
            >
                {{ btn }}
            </ButtonComponent>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.breadCrumbHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.title-container {
    display: flex;
    gap: 6px;
    align-items: center;

    img {
        width: 26px;
        height: 26px;
    }

    h1 {
        font-size: 23px;
        color: var(--blue-800);
    }

    .breadcrumb-buttons-container {
        display: flex;
        align-items: center;
        gap: 10px;
    }
}
</style>
