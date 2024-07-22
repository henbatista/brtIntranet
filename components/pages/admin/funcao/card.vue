<script setup lang="ts">
import type { Role } from "@/types/frontend";

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
    onClick: {
        type: Function,
    },
});

//function capitalizeFirstLetter(htmlString: string): string {
//    const parser = new DOMParser();
//    const doc = parser.parseFromString(htmlString, 'text/html');
//    const textNode = doc.body.childNodes[0];
//
//    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
//        textNode.textContent = textNode.textContent.charAt(0).toUpperCase() + textNode.textContent.slice(1);
//    } else if (textNode && textNode.nodeType === Node.ELEMENT_NODE) {
//       textNode.innerHTML = textNode.innerHTML.charAt(0).toUpperCase() + textNode.innerHTML.slice(1);
//    }
//
//    return doc.body.innerHTML;
//}

function capitalizeFirstLetterOfEachWord(htmlString: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);

    let node;
    while ((node = walker.nextNode())) {
        node.textContent = node.textContent
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    return doc.body.innerHTML;
}

const capitalizedDescription = computed(() => {
    const role = props.data as Role;
    return capitalizeFirstLetterOfEachWord(role.description);
});
</script>

<template>
    <button
        type="button"
        class="function-card-container"
        @click="() => props.onClick?.(props.data)"
    >
        <h4>{{ (props.data as Role).name }}</h4>

        <p v-html="capitalizedDescription"></p>

        <span class="permissions-amount">
            <b>{{ (props.data as Role).permissions.length }}</b>
            {{
                capitalizeFirstLetterOfEachWord(
                    (props.data as Role).permissions.length === 1
                        ? "Permissão"
                        : "Permissões"
                )
            }}
        </span>
    </button>
</template>

<style lang="scss" scoped>
.function-card-container {
    flex-basis: 338px;
    flex-grow: 1;
    background-color: var(--grey-400);
    padding: 32px 34px;
    border-radius: 12px;
    display: flex;
    border: 0;
    flex-direction: column;

    h4 {
        display: block;
        font-size: 20px;
        margin-bottom: 1px;
        text-transform: uppercase;
        color: var(--grey-800);
    }

    p {
        margin: 0 0 12px;
        color: var(--grey-800);
    }

    .sub-title {
        font-size: 12px;
        font-weight: 400;
        color: var(--grey-800);
        margin-bottom: 6px;
    }
    .permissions-list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 12px;
        margin: 0;
        padding: 0;

        li {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        span {
            font-size: 13px;
            color: var(--grey-800);
        }
    }
}
</style>
