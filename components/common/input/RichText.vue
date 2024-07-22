<script setup>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

const props = defineProps({
    label: {
        type: String,
    },
    isRequired: {
        type: Boolean,
        default: false,
    },
    error: {
        type: String,
        default: "",
    },
});
</script>

<template>
    <div class="rich-editor-component">
        <span v-if="props.label">{{ props.label }}</span>
        <span class="error-message" v-if="error">erro: {{ error }}</span>

        <div class="editor-box">
            <QuillEditor v-bind="$attrs" contentType="html" />
        </div>
    </div>
</template>

<style lang="scss">
.rich-editor-component {
    max-width: 44.9vw;
    position: relative;

    .error-message {
        color: var(--error-900);
        position: absolute;
        pointer-events: none;
        bottom: -19px;
        font-size: 12px;
        left: 0;
    }
    span {
        font-size: 14px;
    }

    .editor-box {
        min-height: 200px;
        max-height: 500px;
        display: flex;
        flex-direction: column;
        margin-top: 6px;
        background-color: var(--white);
        .ql-container {
            max-height: 400px;
            flex: 1;
            display: flex;
            flex-direction: column;

            .ql-editor {
                flex: 1;
            }
        }
    }
}
</style>
