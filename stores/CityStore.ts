import { defineStore } from "pinia";
import cityService from "../utils/city.service";
import type { TCity } from "@/types/city";

export const useCityStore = defineStore(
    "CityStore",
    () => {
        // state
        const cities = ref<TCity[]>([]);
        const city = ref({});
        // const regionPagination = ref({});

        // actions
        const $reset = (): void => {
            cities.value = [];
        };

        const getCities = async (
            search: string,
            page: string,
            per_page: string,
            field: string
        ) => {
            let citiesList: any = await cityService.getCities(
                search,
                page,
                per_page,
                field
            );

            console.log("cities", citiesList);

            if (citiesList === undefined) {
                cities.value = [];
            } else {
                cities.value = citiesList.data.cities;
            }
        };
        return {
            cities,
            city,
            getCities,
            $reset,
        };
    },
    {
        persist: {
            storage: persistedState.localStorage,
        },
    }
);
