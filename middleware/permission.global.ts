import type { User } from "@/types/frontend";

interface permissionResponse {
    canAccess: boolean;
}

const usePermissions = (permission: string): permissionResponse => {
    const loginUser = JSON.parse(
        localStorage.getItem("user/data") as string
    ) as User;

    let canAccess = false;
    if (!loginUser?.user_permissions?.length) return { canAccess };

    if ((loginUser?.user_permissions as string[]).includes(permission)) {
        canAccess = true;
    }

    return { canAccess };
};

export default defineNuxtRouteMiddleware((to, from) => {
    if (process.client) {
        if (to.name === "index") return;

        if (
            typeof to.meta?.needAuthentication === "boolean" &&
            !to.meta?.needAuthentication
        ) {
            return;
        }

        const { canAccess } = usePermissions(`view ${to.name as string}`);

        if (!canAccess) {
            abortNavigation("Error");
        }
    }
});
