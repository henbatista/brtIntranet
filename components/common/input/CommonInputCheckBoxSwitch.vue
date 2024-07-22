<script setup>
const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    labelOn: {
        type: String,
        default: "",
    },
    labelOff: {
        type: String,
        default: "",
    },
    modelValue: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["update:modelValue"]);

const isChecked = ref(props.modelValue);

const toggleSwitch = () => {
    isChecked.value = isChecked.value == true ? false : true;
    emit("update:modelValue", isChecked.value);
};

watch(
    () => props.modelValue,
    (newValue) => {
        isChecked.value = newValue;
    }
);
</script>
<template>
    <div class="trv-form-switcher">
        <label class="trv-form-switcher-label">{{ labelOff }}</label>
        <div
            class="trv-form-switcher-toggle"
            :class="{ active: isChecked }"
            @click="toggleSwitch"
        >
            <span
                class="trv-form-switcher-slider"
                :class="{ active: isChecked }"
            ></span>
        </div>
        <label v-if="labelOn" class="trv-form-switcher-label">{{
            labelOn
        }}</label>
    </div>
</template>

<style lang="scss" scoped>
.trv-form-switcher {
    display: flex;
    align-items: center;
}
.trv-form-switcher .trv-form-switcher-label {
    margin-right: 10px;
    margin-left: 10px;
}
.trv-form-switcher .trv-form-switcher-toggle {
    width: 48px;
    height: 26px;
    position: relative;
    border-radius: 13px;
    background-color: #707070;
    cursor: pointer;
}
.trv-form-switcher .trv-form-switcher-toggle .trv-form-switcher-slider {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #fff;
    cursor: pointer;
    transition: transform 0.3s, background-color 0.3s;
}
.trv-form-switcher .trv-form-switcher-toggle .trv-form-switcher-slider.active {
    transform: translateX(22px);
}
.trv-form-switcher .trv-form-switcher-toggle.active {
    background-color: #4cd964;
}
</style>
