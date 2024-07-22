<script setup>
const props = defineProps({
    oldListTitle: {
        type: String,
        default: "Lista Antiga",
    },
    newListTitle: {
        type: String,
        default: "Nova Lista",
    },
    oldList: {
        type: Array,
        default: () => [],
    },
    newList: {
        type: Array,
        default: () => [],
    },
});

const emits = defineEmits(["newListUpdate"]);

const selectedItems = ref([]);
const selectAllOld = ref(false);
const selectAllNew = ref(false);
const localOldList = ref([]);
const localNewList = ref([]);

const mountNewList = () => {
    localNewList.value = JSON.parse(JSON.stringify(props.newList));
    localOldList.value = JSON.parse(JSON.stringify(props.oldList));
};

const mountOldList = () => {
    localOldList.value = localOldList.value.filter((objeto) => {
        return !localNewList.value.some(
            (objetoParaRemover) => objetoParaRemover.id === objeto.id
        );
    });
};

onMounted(() => {
    nextTick(() => {
        mountNewList();
        mountOldList();
    });
});

watch(selectAllOld, (newValue) => {
    if (newValue) {
        selectedItems.value = [...localOldList.value];
    } else {
        selectedItems.value = [];
    }

    nextTick(() => {
        updateOldListCheckboxes();
    });
});

watch(selectAllNew, (newValue) => {
    if (newValue) {
        selectedItems.value = [...localNewList.value];
    } else {
        selectedItems.value = [];
    }

    nextTick(() => {
        updateNewListCheckboxes();
    });
});

const toggleSelectAllOld = () => {
    selectAllOld.value = !selectAllOld.value;

    if (selectAllOld.value) {
        selectedItems.value = [...localOldList.value];
    } else {
        selectedItems.value = [];
    }

    nextTick(() => {
        updateOldListCheckboxes();
    });
};

const toggleSelectAllNew = () => {
    selectAllNew.value = !selectAllNew.value;

    if (selectAllNew.value) {
        selectedItems.value = [...localNewList.value];
    } else {
        selectedItems.value = [];
    }

    nextTick(() => {
        updateNewListCheckboxes();
    });
};

const isItemChecked = (item, listType) => {
    if (listType === "old") {
        return selectedItems.value.some(
            (selectedItem) => selectedItem.id === item.id
        );
    } else if (listType === "new") {
        return selectedItems.value.some(
            (selectedItem) => selectedItem.id === item.id
        );
    }
    return false;
};

const toggleItemSelection = (item, listType) => {
    const selectedIndex = selectedItems.value.findIndex(
        (selectedItem) => selectedItem.id === item.id
    );
    if (selectedIndex !== -1) {
        selectedItems.value.splice(selectedIndex, 1);
    } else {
        selectedItems.value.push(item);
    }

    nextTick(() => {
        if (listType === "old") {
            updateOldListCheckboxes();
        } else if (listType === "new") {
            updateNewListCheckboxes();
        }
    });
};

const updateOldListCheckboxes = () => {
    selectAllNew.value = false;
    const oldListCheckboxes = document.querySelectorAll(".old-checkbox");
    oldListCheckboxes.forEach((checkbox) => {
        const item = JSON.parse(checkbox.value);
        checkbox.checked = isItemChecked(item, "old");
    });
};

const updateNewListCheckboxes = () => {
    selectAllOld.value = false;
    const newListCheckboxes = document.querySelectorAll(".new-checkbox");
    newListCheckboxes.forEach((checkbox) => {
        const item = JSON.parse(checkbox.value);
        checkbox.checked = isItemChecked(item, "new");
    });
};

const moveItemRight = () => {
    for (const item of selectedItems.value) {
        const itemIndex = localOldList.value.findIndex(
            (oldItem) => oldItem.id === item.id
        );
        if (itemIndex !== -1) {
            localOldList.value.splice(itemIndex, 1);
            localNewList.value.push(item);
        }
    }
    emits("newListUpdate", localNewList.value);
    selectedItems.value = [];

    nextTick(() => {
        updateOldListCheckboxes();
        updateNewListCheckboxes();
    });
};

const moveItemLeft = () => {
    for (const item of selectedItems.value) {
        const itemIndex = localNewList.value.findIndex(
            (newItem) => newItem.id === item.id
        );
        if (itemIndex !== -1) {
            localNewList.value.splice(itemIndex, 1);
            localOldList.value.push(item);
        }
    }
    emits("newListUpdate", localNewList.value);
    selectedItems.value = [];

    nextTick(() => {
        updateOldListCheckboxes();
        updateNewListCheckboxes();
    });
};
</script>

<template>
    <div class="row trv-drag-drop-container">
        <div class="trv-drag-drop-column col-10 col-sm-5 col-xl-5">
            <h2>{{ oldListTitle }}</h2>
            <div>
                <input
                    type="checkbox"
                    id="selectAllOld"
                    :checked="selectAllOld"
                    @change="toggleSelectAllOld"
                />
                <label for="selectAllOld">Selecionar Todos</label>
            </div>
            <div v-for="item in localOldList" :key="item.id">
                <input
                    type="checkbox"
                    class="old-checkbox"
                    :id="'oldItem' + item.id"
                    :value="JSON.stringify(item)"
                    :checked="isItemChecked(item, 'old')"
                    @change="toggleItemSelection(item, 'old')"
                />
                <label :for="'oldItem' + item.id">{{ item.name }}</label>
            </div>
        </div>
        <div class="trv-drag-drop-arrows col-1">
            <button class="trv-drag-drop-button" @click.prevent="moveItemRight">
                &rarr;
            </button>
            <button class="trv-drag-drop-button" @click.prevent="moveItemLeft">
                &larr;
            </button>
        </div>
        <div class="trv-drag-drop-column col-10 col-sm-5 col-xl-5">
            <h2>{{ newListTitle }}</h2>
            <div>
                <input
                    type="checkbox"
                    id="selectAllNew"
                    :checked="selectAllNew"
                    @change="toggleSelectAllNew"
                />
                <label for="selectAllNew">Selecionar Todos</label>
            </div>
            <div v-for="item in localNewList" :key="item.id">
                <input
                    type="checkbox"
                    class="new-checkbox"
                    :id="'newItem' + item.id"
                    :value="JSON.stringify(item)"
                    :checked="isItemChecked(item, 'new')"
                    @change="toggleItemSelection(item, 'new')"
                />
                <label :for="'newItem' + item.id">{{ item.name }}</label>
            </div>
        </div>
    </div>
</template>

<style></style>
