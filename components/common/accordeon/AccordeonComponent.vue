<script lang="ts" setup>
import { usePermissions } from "@/hooks/usePermission";
import { ref } from "vue";

export interface accordeonOptions {
    title: string | ((title: string, data: any[]) => void);
    to?: string;
    src?: string;
    parent?: string;
    permission?: string;
    component?: Element;
}

const router = useRouter();

const props = defineProps({
    title: {
        required: true,
        type: [String, Function],
    },

    src: {
        type: String,
    },
    checkPermission: {
        type: Boolean,
        default: false,
    },
    options: {
        type: Array,
        required: true,
    },
});

const open = ref<boolean>(false);
const options = ref(props.options);

watch(
    props,
    () => {
        if (props.checkPermission) {
            const filterOptions = (props.options as accordeonOptions[]).filter(
                (e) => {
                    const { canAccess } = usePermissions(
                        "view " + (e?.permission || e.to?.replace("/", ""))
                    );
                    return canAccess;
                }
            );
            options.value = filterOptions;
        }
    },
    {
        immediate: true,
    }
);

const maxHeight = ref(options.value.length * 46 + "px");

const handleOpenAccordeon = () => {
    open.value = !open.value;
};

onMounted(() => {
    const { currentRoute } = router;

    const routerFilter = (options.value as accordeonOptions[]).filter((e) => {
        if (e?.parent) {
            return currentRoute.value.path.includes(e?.parent);
        }

        return currentRoute.value.path.includes(e?.to as string);
    });

    if (routerFilter.length) {
        handleOpenAccordeon();
    }
});
</script>

<template>
    <div v-if="options.length">
        <button
            type="button"
            class="accordeon-trigger"
            @click="handleOpenAccordeon"
            :data-open="open"
        >
            <template v-if="typeof props.title === 'string'">
                <img :src="props.src" />
                {{ props.title }}
            </template>
            <component v-else :is="props.title(props.title, options)" />

            <img
                src="/images/right.svg"
                class="angle-right"
                :data-open="open"
            />
        </button>
        <ul class="accordeon-menu-list" :data-open="open">
            <li
                v-for="(item, index) in (options as accordeonOptions[])"
                :key="index"
            >
                <component v-if="item.component" :is="item.component" />
                <NuxtLink v-else :to="item.to" class="is-menu">
                    <img :src="item.src" />

                    {{ item.title }}
                </NuxtLink>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
img {
    width: 16px;
    height: 16px;
    filter: brightness(0);
}
.accordeon-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 12px;
    text-align: left;
    background: transparent;
    border: 0;
    color: var(--grey-900);
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.3s, color 0s;

    &:hover {
        background: var(--blue-800);
        color: var(--white);
        img {
            filter: brightness(100);
        }
    }

    &[data-open="true"] {
        background: var(--blue-800);
        color: var(--white);
        border-radius: 6px 6px 0 0;
        img {
            filter: brightness(100);
        }
    }

    .angle-right {
        width: 6px;
        justify-self: flex-end;
        transition: 0.3s;
        margin-left: auto;

        &[data-open="true"] {
            transform: rotate(90deg);
        }
    }
}

.accordeon-menu-list {
    padding: 0;
    max-height: 0px;
    overflow: hidden;
    list-style: none;
    transform-origin: top;
    transition: 0.2s;
    pointer-events: none;

    &[data-open="true"] {
        padding: 0 6px 6px 20px;
        pointer-events: unset;
        max-height: minmax(v-bind(maxHeight), 100%);
        background: var(--blue-800);
        border-radius: 0 0 6px 6px;
    }

    a {
        width: 100%;
        max-height: 40px;
        display: flex;
        gap: 6px;
        align-items: center;
        padding: 10px 15px 10px 13px;
        font-size: 14px;
        font-weight: 500;
        font-family: "Montserrat", sans-serif;
        color: var(--white);
        text-decoration: none;
        transition: all 0.4s ease;

        img {
            filter: brightness(100);
        }
        &:hover {
            background: var(--blue-700);
            color: var(--white);
            border-radius: 6px;
        }

        &[aria-current="page"] {
            background: var(--blue-700);
            color: var(--white);
            border-radius: 6px;
            img {
                filter: brightness(100);
            }
        }
    }

    .accordeon-trigger {
        color: var(--white) !important;

        img {
            filter: brightness(100);
        }
    }
}
</style>
