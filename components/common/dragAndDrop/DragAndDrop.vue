<script setup lang="ts">
import { chain } from "lodash";

interface listType {
    field: string;
    id: string;
    value: any | any[];
    label: string;
    render: (value: string, data: any) => void;
    grouped?: boolean;
}

interface transferData {
    field: string;
    data: listType[];
    listToAdd: globalThis.Ref<listType[]>;
    listToRemove: globalThis.Ref<listType[]>;
}

interface transferSingleData {
    single: boolean;
    data: listType;
    listToAdd: globalThis.Ref<listType[]>;
    listToRemove: globalThis.Ref<listType[]>;
}

interface onChangeResponse {
    newList: listType[];
    data: {
        newList: listType[];
        oldList: listType[];
    };
}

const props = defineProps({
    oldList: {
        type: Array,
        required: true,
    },
    newList: {
        type: Array,
        default: [],
    },
    oldListTitle: {
        type: String,
    },
    newListTitle: {
        type: String,
    },
    groupBy: {
        type: [String, Function],
    },
    groupedHeader: {
        type: Array,
    },
    onChange: {
        type: Function,
    },
});

const oldList = ref<listType[]>([]);
const newList = ref<listType[]>([]);

const groupListFunction = (list: any[]): any[] => {
    return chain(list)
        .groupBy(props.groupBy)
        .map((e, i) => {
            if (props.groupedHeader) {
                const filterHeader = (props.groupedHeader as listType[]).filter(
                    (f) => f.field === i
                );

                if (filterHeader.length) {
                    return Object.assign(
                        { value: e, grouped: true },
                        filterHeader[0]
                    );
                }
            }

            return { label: i, value: e, grouped: true };
        })
        .value();
};

onMounted(() => {
    if (props.groupBy) {
        if (props.oldList) {
            let list = props.oldList;
            if (props.newList) {
                list = (props.oldList as listType[]).filter((e) => {
                    if (props.newList.length) {
                        return !(props.newList as listType[]).some(
                            (f) => e.id === f?.id
                        );
                    }
                    return e;
                });
            }

            oldList.value = groupListFunction(list);
            newList.value = groupListFunction(props.newList);
        }
    } else {
        oldList.value = (props.oldList as listType[]).filter((e) => {
            if (props.newList.length) {
                return !(props.newList as listType[]).some(
                    (f) => e.id === f?.id
                );
            }
            return e;
        });
        newList.value = props.newList as any;
    }
});

watch(newList, () => {
    const rawList = newList.value
        .map((e) => ({ ...e.value }))
        .flatMap((item) => Object.values(item));

    const data = {
        newList: newList.value,
        oldList: oldList.value,
    };

    props?.onChange?.(rawList, { data });
});

const handleGroupedData = ({
    listToAdd,
    listToRemove,
    data,
    field,
}: transferData) => {
    for (let i = 0; i < data.length; i++) {
        const currentData = data[i];

        (listToRemove.value as any) = listToRemove.value
            .map((e) => {
                if (e.field === field) {
                    const filteredList = e.value.filter(
                        (f: any) => f.id !== currentData.id
                    );

                    if (filteredList.length) {
                        return { ...e, value: filteredList };
                    }
                    return null;
                }
                return e;
            })
            .filter((e) => e);

        const findGroup = listToAdd.value.filter((e) => e.field === field);
        const alreadyExists = listToAdd.value.filter((e) =>
            e.value.some((f: any) => f.id === currentData.id)
        );

        if (alreadyExists.length) {
            i = data.length;
            return;
        }

        if (!findGroup.length) {
            listToAdd.value = listToAdd.value.concat(
                groupListFunction([currentData])
            );
        } else {
            listToAdd.value = listToAdd.value.map((e) => {
                if (e.field === field) {
                    return { ...e, value: e.value.concat([currentData]) };
                }
                return e;
            });
        }
    }
};

const handleSingleData = ({
    listToAdd,
    listToRemove,
    data,
}: transferSingleData) => {
    (listToRemove.value as any) = listToRemove.value.filter(
        (e) => e.id !== data.id
    );
    const alreadyExists = listToAdd.value.filter((e) => e.id === data.id);
    if (alreadyExists.length) return;

    listToAdd.value = listToAdd.value.concat(data);
};

const handleTrasferedData = (
    data: transferData & transferSingleData,
    type: "old" | "new"
) => {
    if (data.single) {
        if (type === "old") {
            handleSingleData({
                ...data,
                listToAdd: oldList,
                listToRemove: newList,
            });
        } else {
            handleSingleData({
                ...data,
                listToRemove: oldList,
                listToAdd: newList,
            });
        }
        return;
    }

    if (type === "old") {
        handleGroupedData({
            ...data,
            listToAdd: oldList,
            listToRemove: newList,
        });
    } else {
        handleGroupedData({
            ...data,
            listToRemove: oldList,
            listToAdd: newList,
        });
    }
};

const onDrop = (event: DragEvent) => {
    let eventData: any = event?.dataTransfer?.getData("data");

    if (eventData) {
        eventData = JSON.parse(eventData);
    } else return;

    handleTrasferedData(eventData, (event.target as any).dataset.type);
};
const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
};

const onDragStart = (event: DragEvent, data: any) => {
    if (event.dataTransfer) {
        event.dataTransfer.setData(
            "data",
            JSON.stringify({ single: true, data })
        );

        event.dataTransfer.dropEffect = "move";
    }
};
</script>

<template>
    <section class="drag-n-drop">
        <div class="left-side drag-n-drop-container">
            <div class="title">
                <h6>{{ props.oldListTitle }}</h6>
            </div>
            <div
                class="drop-zone"
                @drop.prevent="onDrop"
                @dragover="onDragOver"
                data-type="old"
            ></div>
            <div class="list-container">
                <div
                    class="list-item"
                    v-if="oldList.length"
                    v-for="(item) in (oldList as listType[])"
                    :key="item.field"
                >
                    <DragAndDropAccordeon
                        v-if="item.grouped"
                        :title="item.render"
                        :options="item.value"
                        :field="item.field"
                    />
                    <DragAndDropItem
                        v-else
                        class="drag-n-drop-single-item"
                        @dragstart="(event) => onDragStart(event, item)"
                    >
                        <span>
                            {{ item.label }}
                        </span>
                    </DragAndDropItem>
                </div>

                <p v-else class="empty-message">Arraste para remover</p>
            </div>
        </div>
        <div class="right-side drag-n-drop-container">
            <div class="title">
                <h6>{{ props.newListTitle }}</h6>
            </div>
            <div
                class="drop-zone"
                @drop.prevent="onDrop"
                @dragover="onDragOver"
                data-type="new"
            ></div>
            <div class="list-container">
                <div
                    class="list-item"
                    v-if="newList.length"
                    v-for="(item) in (newList as listType[])"
                    :key="item.field"
                >
                    <DragAndDropAccordeon
                        v-if="item.grouped"
                        :title="item.render"
                        :field="item.field"
                        :options="item.value"
                    />
                    <DragAndDropItem
                        v-else
                        class="drag-n-drop-single-item"
                        @dragstart="(event) => onDragStart(event, item)"
                    >
                        <span>
                            {{ item.label }}
                        </span>
                    </DragAndDropItem>
                </div>
                <p v-else class="empty-message">Arraste para Adicionar</p>
            </div>
        </div>
    </section>
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

.drag-n-drop {
    display: flex;
    gap: 20px;

    .title {
        margin-bottom: 15px;
        h6 {
            font-size: 16px;
        }
    }

    .drag-n-drop-container {
        min-height: 200px;
        min-width: 260px;
        padding: 20px;
        border: solid 1px var(--grey-500);
        border-radius: 14px;
        position: relative;
        overflow: hidden;

        &:hover .drop-zone {
            pointer-events: none;
        }
        .drop-zone {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
        }

        .empty-message {
            text-align: center;
            font-size: 12px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 100px;
            pointer-events: none;
            color: var(--grey-700);
        }

        .draggable-container {
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            pointer-events: none;
            bottom: 0;
        }

        .list-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
            .list-item {
                transform-origin: top;
                animation: 0.4s fadeIn ease;
            }
        }

        .drag-n-drop-single-item {
            width: 100%;
            padding: 10px 12px;
            justify-content: flex-start;
            border-width: 0 0 1px 0;
            border-radius: 0;
        }
    }
}
</style>
