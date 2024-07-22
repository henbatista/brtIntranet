const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

export const getHotelLocator = async (locator: string) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {
            locator,
        };
        const response: any = await useFetch(
            `${apiBaseUrl}/suporte/reserva-hotel/localizador/show`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body,
            }
        );
        if (response?.data?.value?.success) {
            return response.data.value;
        } else {
            throw new Error("Falha ao buscar Localizador!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const getCarLocator = async (locator: string) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {
            locator,
        };
        const response: any = await useFetch(
            `${apiBaseUrl}/suporte/reserva-carro/localizador/show`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body,
            }
        );
        if (response?.data?.value?.success) {
            return response.data.value;
        } else {
            throw new Error("Falha ao buscar Localizador!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const getAerialLocator = async (locator: string) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const body = {
            locator,
        };
        const response: any = await useFetch(
            `${apiBaseUrl}/suporte/reserva-aereo/localizador/show`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body,
            }
        );
        if (response?.data?.value?.success) {
            return response.data.value;
        } else {
            throw new Error("Falha ao buscar Localizador!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

type updateLocatorType = {
    locator: string;
    newLocator: string;
};

export const updateHotelLocator = async (body: updateLocatorType) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(
            `${apiBaseUrl}/suporte/reserva-hotel/localizador/update`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body,
            }
        );
        if (response?.data?.value?.success) {
            return response.data.value;
        } else {
            throw new Error("Falha ao atualizar Localizador!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const updateCarLocator = async (body: updateLocatorType) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(
            `${apiBaseUrl}/suporte/reserva-carro/localizador/update`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body,
            }
        );
        if (response?.data?.value?.success) {
            return response.data.value;
        } else {
            throw new Error("Falha ao atualizar Localizador!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const updateAerialLocator = async (body: updateLocatorType) => {
    try {
        const access_token = localStorage.getItem("authToken");
        const response = await useFetch(
            `${apiBaseUrl}/suporte/reserva-aereo/localizador/update`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                body,
            }
        );
        if (response?.data?.value?.success) {
            return response.data.value;
        } else {
            throw new Error("Falha ao atualizar Localizador!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
