<script setup lang="ts">
import type { TCredit } from "@/types/credit";
import { useTableStore } from "@/stores/TableStore";

const props = defineProps({
    refetch: {
        type: Boolean,
    },
});

const tableStore = useTableStore();

const handleSelectStatus = (val: string) => {
    if (val === selectedButton.value) {
        tableStore.buildSearchParams({
            search: undefined,
            field: undefined,
        });
        selectedButton.value = "";

        return;
    }

    tableStore.buildSearchParams({
        search: val,
        field: "credit_status_name",
    });

    selectedButton.value = val;
};

const creditstatusList = ref<TCredit[]>([]);

const selectedButton = ref("");

const getCreditsStatusAndGroup = async () => {
    await getStatusCredits().then(({ data: { data } }) => {
        creditstatusList.value = data as TCredit[];
    });
};

const refetch = inject<boolean>("refetchSearch");

watch(
    [refetch],
    () => {
        console.log(refetch);
        getCreditsStatusAndGroup();
    },
    {
        immediate: true,
    }
);
</script>

<template>
    <div class="credit-status-list-buttons ">
        <ButtonComponent
            v-if="creditstatusList.length"
            v-for="item in creditstatusList"
            class="credit-status-button shadow-sm"
            :class="
                selectedButton === item.credit_status_name
                    ? 'selected-credit-button'
                    : ''
            "
            @click="() => handleSelectStatus(item.credit_status_name)"
            :style="{
                background: item?.credit_status_color,
            }"
        >
            <span
                :style="{
                    color: item?.credit_status_color,
                }"
            >
                {{ item?.credit_status_name }}
            </span>
        </ButtonComponent>
    </div>
</template>

<style lang="scss">
.selected-credit-button.selected-credit-button {
    border: solid 2px black;
    scale: 1.1;
}
</style>
