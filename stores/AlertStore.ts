import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAlertStore = defineStore("AlertStore", () => {
    // state
    const errors = ref({});
    const message = ref("");
    const status = ref("");
    const loading = ref<boolean>(false);
    const success = ref<boolean | null>(null);

    // actions
    const $reset = (): void => {
        errors.value = {};
        message.value = "";
        status.value = "";
        loading.value = false;
        success.value = null;
    };

    // getters
    const getErrors = computed(() => errors.value);
    const getMessage = computed(() => message.value);
    const getStatus = computed(() => status.value);
    const getLoading = computed(() => loading.value);
    const getSuccess = computed(() => success.value);

    return {
        errors,
        message,
        status,
        loading,
        success,
        $reset,
        getErrors,
        getMessage,
        getStatus,
        getLoading,
        getSuccess,
    };
});
