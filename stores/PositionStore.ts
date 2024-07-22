import { defineStore } from "pinia";
import { useAlertStore } from "./AlertStore";
import positionService from "../utils/position.service";
import type { TPosition } from "@/types/position";

export const usePositionStore = defineStore(
    "PositionStore",
    () => {
        const alertStore = useAlertStore();
        // state
        const positions = ref<TPosition[]>([]);
        const position = ref<TPosition>();
        const positionsPagination = ref({});

        // actions
        const $reset = (): void => {
            positions.value = [];
            position.value = undefined;
            positionsPagination.value = {};
        };

        const getPositions = async (
            search: string,
            page: number,
            per_page: number,
            field: string
        ) => {
            try {
                let positionList: any = await positionService.getPositions(
                    search,
                    page,
                    per_page,
                    field
                );
                positions.value = positionList.data.data;
                positionsPagination.value = positionList.data;
            } catch (error: any) {
                alertStore.success = false;
                alertStore.message = `Erro ao retornar cargos: ${error.message}`;
            }
        };
        const savePosition = async (body: TPosition) => {
            try {
                let positionList: any = await positionService.savePosition(
                    body
                );
                positions.value = positionList.data.data;
                positionsPagination.value = positionList.data;
            } catch (error: any) {
                alertStore.success = false;
                alertStore.message = `Erro ao cadastrar cargo: ${error.message}`;
            }
        };
        const updatePosition = async (body: TPosition) => {
            try {
                let positionList: any = await positionService.updatePosition(
                    body
                );
                positions.value = positionList.data.data;
                positionsPagination.value = positionList.data;
            } catch (error: any) {
                alertStore.success = false;
                alertStore.message = `Erro ao atualizar cargo: ${error.message}`;
            }
        };
        const deletePosition = async (body: TPosition) => {
            try {
                let positionList: any = await positionService.deletePosition(
                    body
                );
                positions.value = positionList.data.data;
                positionsPagination.value = positionList.data;
            } catch (error: any) {
                alertStore.success = false;
                alertStore.message = `Erro ao cadastrar cargo: ${error.message}`;
            }
        };

        return {
            positions,
            position,
            positionsPagination,
            $reset,
            getPositions,
            savePosition,
            updatePosition,
            deletePosition,
        };
    },
    {
        persist: {
            storage: persistedState.localStorage,
        },
    }
);
