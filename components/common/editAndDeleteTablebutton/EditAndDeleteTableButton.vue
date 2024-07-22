<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { usePermissions } from "@/hooks/usePermission";

defineProps({
    onEdit: {
        type: Function,
    },
    onDelete: {
        type: Function,
    },
    onClickDeleteButton: {
        type: Function,
    },
    showDeleteButton: {
        type: Boolean,
        default: true,
    },
});

const router = useRoute();

const permissions = ref({
    edit: false,
    delete: false,
});

onMounted(() => {
    const permissionname = router.name;

    const { canAccess: canEdit } = usePermissions(
        `edit ${permissionname as string}`
    );

    const { canAccess: canDelete } = usePermissions(
        `deleta ${permissionname as string}`
    );
    permissions.value = {
        edit: canEdit,
        delete: canDelete,
    };
});
</script>

<template>
    <div class="table-action-buttons">
        <ButtonComponent variant="text" @click="onEdit" v-if="permissions.edit">
            <Icon icon="ic:outline-edit" />
        </ButtonComponent>

        <FormDeleteButton
            :onClickDeleteButton="onClickDeleteButton"
            v-if="permissions.delete && showDeleteButton"
        >
            <Icon icon="material-symbols:delete" />
        </FormDeleteButton>
    </div>
</template>

<style lang="scss">
.table-action-buttons {
    display: flex;
    align-items: center;
    gap: 4px;

    button {
        padding: 8px !important;
        font-size: 16px;
        &[data-variant="text"] {
            color: var(--blue-700) !important;
        }
    }
}
</style>
