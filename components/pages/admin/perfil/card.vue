<script setup lang="ts">
import type { Permission, Profile } from "@/types/frontend";
import { Icon } from "@iconify/vue";

type ProfileCard = Profile & { permissions: Permission[] };

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
    onClick: {
        type: Function,
    },
});

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
    const profile = props.data as Profile;
    return capitalizeFirstLetterOfEachWord(profile.profile_description);
});
</script>

<template>
    <button
        type="button"
        class="profile-card-container"
        @click="() => props.onClick?.(props.data)"
    >
        <h4>{{ (props.data as ProfileCard).profile_name }}</h4>

        <p v-html="capitalizedDescription"></p>


        <h6 class="sub-title">Permissões</h6>

        <ul class="permissions-list">
            <li
                v-for="(item, index) in (props.data as ProfileCard).permissions.slice(0, 10)"
                :key="index"
            >
                <Icon
                    v-if="item.name.includes('create')"
                    icon="mdi:plus"
                    color="green"
                />
                <Icon v-if="item.name.includes('edit')" icon="mdi:pencil" />
                <Icon
                    v-if="item.name.includes('view')"
                    icon="mdi:eye-outline"
                />
                <Icon
                    v-if="item.name.includes('deleta')"
                    icon="mdi:trash-can-outline"
                />
                <span>{{ item.name }}</span>
            </li>

            <li v-if="(props.data as ProfileCard).permissions.length > 10">
                <span>
                    ... mais
                    {{ (props.data as ProfileCard).permissions.length - 10 }}
                </span>
            </li>
        </ul>
    </button>
</template>
<style lang="scss" scoped>
.profile-card-container {
    background-color: var(--grey-400);
    padding: 32px 34px;
    border-radius: 12px;
    display: flex;
    border: 0;
    flex-direction: column;

    h4 {
        display: block;
        font-size: 20px;
        margin-bottom: 6px;
        color: var(--grey-800);
        text-transform: uppercase;

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
            text-transform: uppercase;

        }

        span {
            font-size: 10px;
            color: var(--grey-800);
        }
    }
}
</style>
