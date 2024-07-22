const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;
const destinationClientId = runtimeConfig.public.destinationClientId;
const destinationClientSecret = runtimeConfig.public.destinationClientSecret;
const destinationBaseUrl = runtimeConfig.public.destinationBaseUrl;

const destinationLogin = async () => {
    try {
        clearNuxtData();
        const body = {
            client_id: destinationClientId,
            client_secret: destinationClientSecret,
            grant_type: "client_credentials",
            scopes: "[*]",
        };

        const response = await useFetch(`${destinationBaseUrl}/oauth/token`, {
            method: "POST",
            body,
        });
        if (response.data.value.access_token != null) {
            const access_token = response.data.value.access_token;
            if (process.client) {
                localStorage.setItem("authDestinationToken", access_token);
            }
            let loginDestinationResponse = response.data.value.access_token;
            return loginDestinationResponse;
        } else {
            throw new Error("Falha no login!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const login = async (email, password) => {
    destinationLogin();
    try {
        clearNuxtData();
        const body = {
            user_email: email,
            user_password: password,
        };

        const response = await useFetch(`${apiBaseUrl}/login`, {
            method: "POST",
            body,
        });

        if (response?.data?.value?.success) {
            const access_token = response.data.value.token;
            if (process.client) {
                localStorage.setItem("authToken", access_token);
            }
            let loginResponse = response.data.value;
            return loginResponse;
        } else {
            throw new Error("Falha no login!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const logout = async () => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(`${apiBaseUrl}/logout`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        if (response?.data?.value?.success) {
            localStorage.removeItem("authToken");
            let logoutResponse = response.data.value;
            return logoutResponse;
        } else {
            throw new Error("Falha ao realizar logout!");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const getProfile = async () => {
    const access_token = localStorage.getItem("authToken");
    const profileResponse = await useFetch(`${apiBaseUrl}/usuario`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    return profileResponse.data.value;
};

const updateProfile = async (userId, body) => {
    const access_token = localStorage.getItem("authToken");
    try {
        return await useFetch(`${apiBaseUrl}/users/${userId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: "application/vnd.api+json",
                "Content-type": "application/vnd.api+json",
            },
            body,
        });
    } catch (error) {
        useToast("error", error.message);
    }
};

export default {
    login,
    logout,
    getProfile,
    updateProfile,
};
