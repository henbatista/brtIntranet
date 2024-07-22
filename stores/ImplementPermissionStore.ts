import { defineStore, createPinia, Store } from "pinia";

interface ImplementPermission {
    userPermissions: string[];
}

export const ImplementPermissionStore = defineStore("user", {
    state: (): ImplementPermission => ({
        userPermissions: [],
    }),
    actions: {
        setUserPermissions(permissions: string[]) {
            this.userPermissions = permissions;
        },
    },
    getters: {
        hasPermission: (state) => (permission: string) => {
            return state.userPermissions.includes(permission);
        },
    },
});

const pinia = createPinia();
export const setupPinia = () => pinia;
export const useStore = (): Store => ImplementPermissionStore(pinia);
