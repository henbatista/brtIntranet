<script lang="ts" setup>
import { useDeleteItemStore } from "@/stores/deleteItemStore";
import { usePermissions } from "@/hooks/usePermission";

const deleteStore = useDeleteItemStore();

const props = defineProps({
    onSuccess: {
        type: Function,
    },
    text: {
        type: String,
        default: "Você tem certeza que deseja deletar este item?",
    },
    modalTitle: {
        type: String,
        default: "Deletar Item?",
    },
    onClickDeleteButton: {
        type: Function,
    },
});

const handleClick = () => {
    props.onClickDeleteButton?.();

    deleteStore.handleOpenPopUp();
};

const router = useRoute();

const permissions = ref({
    delete: false,
});

onMounted(() => {
    const permissionname = router.name;

    const { canAccess: canDelete } = usePermissions(
        `deleta ${permissionname as string}`
    );
    permissions.value = {
        delete: canDelete,
    };
});

watch(
    props,
    () => {
        if (props.onSuccess) {
            deleteStore.onDelete = props.onSuccess as () => Promise<void>;
        }
        deleteStore.props = {
            modalTitle: props.modalTitle,
            text: props.text,
        };
    },
    {
        immediate: true,
    }
);
</script>

<template>
    <div>
        <ButtonComponent
            variant="error"
            @click="handleClick"
            v-if="permissions.delete"
        >
            <slot>Deletar</slot>
        </ButtonComponent>
    </div>
</template>
