<script setup>
const selectedImages = ref({});

const emits = defineEmits(["image-selected"]);

const props = defineProps({
    id: String,
    title: String,
    onChange: Function,
});

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        selectedImages.value = {
            url,
            file,
        };

        props.onChange?.(file);
    }
};

const clearInput = () => {
    selectedImages.value = null;
    props.onChange?.(null);
};
</script>

<template>
    <div class="file-input-container">
        <label :for="id" v-if="!selectedImages?.url">
            <div class="icon">
                <img
                    src="/images/icons/svg-gray/bold/file-cloud-bold.svg"
                    width="40"
                    height="40"
                />
            </div>
            <div class="text">
                <span>{{ title }}</span>
            </div>
        </label>
        <div class="image" v-else>
            <img :src="selectedImages.url" />
            <ButtonComponent variant="error" @click="clearInput()">
                X
            </ButtonComponent>
        </div>

        <input
            :id="id"
            type="file"
            v-bind="$attrs"
            @change="(event) => handleFileChange(event)"
            multiple="false"
            style="display: none"
        />
    </div>
</template>

<style lang="scss" scoped>
.file-input-container {
    width: 180px;
    aspect-ratio: 1/1;
    border: 1px dashed #cacaca;
    position: relative;
    box-shadow: 0px 2px 15px -9px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    border-radius: 8px;

    label {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .image {
        width: 100%;
        height: 100%;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        button {
            position: absolute;
            top: 4px;
            right: 4px;
            padding: 4px 8px;
            border-radius: 6px;
        }
    }
}
</style>
