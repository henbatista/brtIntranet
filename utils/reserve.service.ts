import { getUserToken } from "@/hooks/getToken";
import type { TReserve } from "@/types/reserve";
const runtimeConfig = useRuntimeConfig();
const apiBaseUrl = runtimeConfig.public.apiBase;

export const saveReserve = async (body: TReserve) => {
    try {
        const { token } = getUserToken();

        const { data } = await useFetch(
            `${apiBaseUrl}/suporte/reserve/cadastrar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body,
            }
        );
        if ((data?.value as any)?.success) {
            return data.value;
        } else {
            throw new Error("Falha ao cadastrar Reserva!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const updateReserve = async (body: TReserve) => {
    try {
        const { token } = getUserToken();

        const { data } = await useFetch(
            `${apiBaseUrl}/suporte/reserve/atualizar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body,
            }
        );

        if ((data?.value as any)?.success) {
            return data.value;
        } else {
            throw new Error("Falha ao atualizar Reserva!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const deleteReserve = async (body: TReserve) => {
    try {
        const { token } = getUserToken();

        const { data } = await useFetch(
            `${apiBaseUrl}/suporte/reserve/desativar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    reserve_id: body.reserve_id,
                },
            }
        );

        if ((data?.value as any)?.success) {
            return data.value;
        } else {
            throw new Error("Falha ao atualizar Reserva!");
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
