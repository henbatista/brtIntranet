<script lang="ts" setup>
import { ref } from "vue";

export interface accordeonOptions {
    label: string;
    render: () => void;
    value: any;
}

const props = defineProps({
    title: {
        type: [String, Function],
    },
    src: {
        type: String,
    },
    options: {
        type: Array,
        required: true,
    },
    field: {
        type: String,
    },
});

const open = ref<boolean>(false);
const maxHeight = ref(props.options.length * 46 + "px");

watch(
    () => props.options,
    () => {
        maxHeight.value = props.options.length * 46 + "px";
    },
    {
        immediate: true,
    }
);

const onDragStart = (event: DragEvent, data: any) => {
    if (event.dataTransfer) {
        event.dataTransfer.setData(
            "data",
            JSON.stringify({ field: props.field, data })
        );

        event.dataTransfer.dropEffect = "move";
    }
};

const onHide = (event: MouseEvent) => {
    (event.target as HTMLButtonElement).classList.add("hide-button");
};

const onShow = (event: DragEvent) => {
    (event.target as HTMLButtonElement).classList.remove("hide-button");
};

const handleOpenAccordeon = () => {
    open.value = !open.value;
};
</script>

<template>
    <div>
        <DragAndDropItem
            type="button"
            class="accordeon-trigger"
            @click="handleOpenAccordeon"
            :data-open="open"
            @drag="onHide"
            @dragend="onShow"
            @dragstart="(event) => onDragStart(event, props.options)"
        >
            <span v-if="typeof props.title === 'string'">{{
                props.title
            }}</span>

            <component
                v-else
                :is="props?.title?.(props.title, props.options)"
            />

            <img
                src="/images/right.svg"
                class="angle-right"
                :data-open="open"
            />
        </DragAndDropItem>
        <ul class="accordeon-menu-list" :data-open="open">
            <li
                v-for="(item) in (props.options as accordeonOptions[])"
                :key="item.value"
            >
                <DragAndDropItem
                    type="button"
                    class="is-menu"
                    @drag="onHide"
                    @dragend="onShow"
                    @dragstart="(event) => onDragStart(event, [item])"
                >
                    <component v-if="item.render" :is="item.render()" />

                    <span v-else>
                        {{ item.label }}
                    </span>
                </DragAndDropItem>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: rotateX(90deg);
    }
    to {
        opacity: 1;
        transform: rotateX(0deg);
    }
}

img {
    width: 16px;
    height: 16px;
    filter: brightness(0);
}

.hide-button.hide-button.hide-button {
    opacity: 0.2;
    transition: 0s;
}
.accordeon-trigger.accordeon-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 12px;
    text-align: left;
    background: var(--grey-400);
    border: 0;
    color: var(--grey-900);
    transition: 0.3s;
    cursor: pointer;
    border-radius: 6px;

    &:hover {
        background: var(--grey-600);
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
    transition: 0.5s;
    pointer-events: none;
    margin: 0;

    &[data-open="true"] {
        margin: 12px 0 0;
        pointer-events: unset;
        max-height: v-bind(maxHeight);
    }

    li {
        animation: 0.4s fadeIn ease;
    }

    button {
        width: 100%;
        height: 40px;
        display: flex;
        gap: 6px;
        align-items: center;
        justify-content: flex-start;
        padding: 10px 15px 10px 13px;
        font-size: 14px;
        font-weight: 500;
        color: var(--grey-900);
        text-decoration: none;
        transition: all 0.4s ease;
        border-radius: 0;
        border-width: 0 0 1px !important;

        &:hover {
            background: var(--grey-600);
            border-radius: 6px;
        }
    }
}
</style>
