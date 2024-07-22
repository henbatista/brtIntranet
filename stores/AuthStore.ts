import { ref, Ref } from "vue";
import { defineStore } from "pinia";
import authService from "../utils/auth.service";
import { useAlertStore } from "./AlertStore";
import type { FormLogin, User } from "../types/frontend";

const config = useRuntimeConfig();

export const useAuthStore = defineStore(
    "AuthStore",
    () => {
        const router = useRouter();
        const alertStore = useAlertStore();

        // state
        const apiBase = config.public.apiBase;
        const loggedIn: Ref<boolean> = ref(false);
        const loginType: Ref<string> = ref("");
        const loginToken: Ref<string> = ref("");
        const loginUser = ref<User>();

        // actions
        const $reset = (): void => {
            loggedIn.value = false;
            loginType.value = "";
            loginToken.value = "";
            loginUser.value = undefined;
            localStorage.removeItem("user/token");
            localStorage.removeItem("user/data");
            router.push("/");
        };

        const login = async ({ user_email, user_password }: FormLogin) => {
            alertStore.loading = true;
            const loginResponse: any = await authService.login(
                user_email,
                user_password
            );

            localStorage.setItem("user/token", loginResponse.token);
            localStorage.setItem(
                "user/data",
                JSON.stringify(loginResponse.data)
            );

            loggedIn.value = true;
            loginUser.value = loginResponse.data;
            loginToken.value = loginResponse.token;
        };
        const logout = async () => {
            $reset();
        };

        const getProfile = async () => {
            const profileResult: any = await authService.getProfile();
            return profileResult;
        };
        const updateProfile = async (userId: number, body: any) => {
            return await authService.updateProfile(userId, body);
        };

        // getters
        const getLoggedIn = computed(() => loggedIn.value);
        const getLoginType = computed(() => loginType.value);
        const getLoginToken = computed(() => loginToken.value);
        const getLoginUser = computed(() => loginUser.value);

        return {
            apiBase,
            loggedIn,
            loginType,
            loginToken,
            loginUser,
            $reset,
            login,
            logout,
            getProfile,
            updateProfile,
            getLoggedIn,
            getLoginType,
            getLoginToken,
            getLoginUser,
        };
    },
    {
        persist: {
            storage: persistedState.localStorage,
        },
    }
);
