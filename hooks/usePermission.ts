import { useAuthStore } from "@/stores/AuthStore";

interface permissionResponse {
    canAccess: boolean;
}

export const usePermissions = (permission: string): permissionResponse => {
    const { loginUser } = useAuthStore();
    let canAccess = false;

    if (!loginUser?.user_permissions?.length) return { canAccess };

    if ((loginUser?.user_permissions as string[]).includes(permission)) {
        canAccess = true;
    }

    return { canAccess };
};
