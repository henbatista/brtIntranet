<script lang="ts" setup>
interface tabOptions {
    label: string;
    value: string;
    component: Element;
}

const props = defineProps({
    options: {
        type: Array,
        required: true,
    },
    applyStyles: {
        type: Function,
        required: true,
    }
});

const activeTab = ref<tabOptions>(props.options[0] as tabOptions);

const tabHeaderRef = ref<HTMLDivElement>();

const buttonSelection = ref({
    left: "0px",
    right: "0px",
    to: "right",
    index: 0,
});

const handleChangeTab = (value: string, ref: PointerEvent, index: number) => {
    const buttonTarget: any = ref.target;

    const left = buttonTarget.offsetLeft + "px";
    const right = buttonTarget.offsetLeft + buttonTarget.offsetWidth + "px";

    buttonSelection.value = {
        left,
        right,
        to:
            buttonTarget.offsetLeft >
            Number(buttonSelection.value.left.replace("px", ""))
                ? "left"
                : "right",
        index: index,
    };

    const filterOptions = (props.options as tabOptions[]).filter(
        (e) => e.value === value
    );

    if (filterOptions.length) {
        activeTab.value = filterOptions[0];
    }
};

onMounted(() => {
    const button: any =
        tabHeaderRef.value?.getElementsByClassName("active-button")[0];

    if (button) {
        const initialValues = {
            left: button.offsetLeft + "px",
            right: button.offsetLeft + button.offsetWidth + "px",
            to:
                button.offsetLeft >
                Number(buttonSelection.value.left.replace("px", ""))
                    ? "left"
                    : "right",
            index: 0,
        };
        buttonSelection.value = initialValues;
    }
});

watch(
    () => activeTab.value,
    (newValue) => {
        if (newValue.value === 'tourcode') {
            nextTick(() => props.applyStyles());
        }
    }
);
</script>
<template>
    <div>
        <section class="tab-header" id="tab-header" ref="tabHeaderRef">
            <div class="tab-buttons-wrapper border-b">
                <div
                    class="button-selection"
                    :class="[
                        buttonSelection.to === 'right' ? 'move-to-right' : '',
                        buttonSelection.index === 0 ? 'rounded-left' : '',
                        buttonSelection.index === (props.options.length - 1) ? 'rounded-right' : ''
                    ]"
                ></div>
                <ButtonComponent
                    v-for="(item, index) in (props.options as tabOptions[])"
                    @click="(ref: any) => handleChangeTab(item.value, ref, index)" 
                    :class="['tab-button', activeTab.value === item.value ? 'active-button' : '']"
                    variant="text"
                    :key="index"
                    >{{ item.label }}</ButtonComponent>
            </div>
        </section>
        <section class="tab-content">
            <component :is="activeTab.component" />
        </section>
    </div>
</template>

<style lang="scss" scoped>
.tab-header {
    display: flex;
    align-items: center;
    position: relative;
    font-size: 14px;
    justify-content: center; 
    
    .tab-buttons-wrapper {
        display: flex;
        align-items: center;
        gap: 5px;
        position: relative;
        border-bottom: 2px solid var(--blue-800); 
        padding-bottom: 5px; 
        
    }

    .tab-button {
        border: 0 !important;
        position: relative;
        z-index: 1;
        padding-bottom: 5px;
        border-bottom: 2px solid red; 

        &:hover {
            background-color: transparent !important;
            
        }

        &.active-button {
            color: var(--white);
        }
    }

    .button-selection {
        background-color: var(--blue-800);
        top: 0;
        bottom: 0;
        position: absolute;
        left: v-bind("buttonSelection.left");
        right: calc(100% - v-bind("buttonSelection.right"));
        transition: right 0.2s, left 0.5s;
        border-radius: 2px;
        
        &.move-to-right {
            transition: left 0.2s, right 0.5s;
        }

        &.rounded-left {
            border-top-left-radius: 20px;
        }

        &.rounded-right {
            border-top-right-radius: 20px;
        }
    }
}

.tab-content {
    padding: 10px 0 0;   
}
</style>
