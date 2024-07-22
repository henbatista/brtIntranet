import piniaPluginPersistedState from "pinia-plugin-persistedstate"

export default defineNuxtPlugin(() => {
    return {
        provide: {
            piniaPluginPersistedState,
        }
    }
});