import { defineStore } from "pinia";
import CommandService from "../utils/commands.service";
import { useAlertStore } from "./AlertStore";

export const useCommandStore = defineStore(
    "CommandStore",
    () => {
        const alertStore = useAlertStore();

        // state
        const blankCommand = {
            command_airline: " ",
            command_description: " ",
            command_name: " ",
            command_status: false,
            command_system_type: " ",
            command_validity: " ",
        };

        const Commands = ref([]);
        const Command = ref({});
        const CommandPagination = ref({});

        // actions
        const $reset = (): void => {
            Command.value = [];
        };

        const getCommands = async (
            search: string,
            page: number,
            per_page: number,
            field: string
        ) => {
            let CommandList: any = await CommandService.getCommands(
                search,
                page,
                per_page,
                field
            );
            alertStore.loading = false;
            Commands.value = CommandList.data.data;
            CommandPagination.value = CommandList.data;
        };

        const saveCommand = async (data: any) => {
            alertStore.loading = true;
            try {
                await CommandService.saveCommand(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Comando salvo com sucesso!";
                Command.value = blankCommand;
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const updateCommand = async (data: any) => {
            alertStore.loading = true;
            try {
                await CommandService.updateCommand(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Comando atualizado com sucesso!";
                Command.value = {};
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        const deleteCommand = async (data: any) => {
            alertStore.loading = true;
            try {
                await CommandService.deleteCommand(data);
                alertStore.loading = false;
                alertStore.success = true;
                alertStore.message = "Comando deletado com sucesso!";
                Command.value = {};
            } catch (error: any) {
                alertStore.loading = false;
                alertStore.success = false;
                alertStore.message = error.message;
            }
        };

        return {
            CommandPagination,
            Commands,
            Command,
            $reset,
            getCommands,
            saveCommand,
            updateCommand,
            deleteCommand,
        };
    },
    { persist: true }
);
