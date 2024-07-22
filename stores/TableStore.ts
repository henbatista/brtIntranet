import { forEach } from "lodash";
import { ref } from "vue";
import { fetchData } from "~/hooks/tableService";
import type { APIRESPONSE } from "~/types/api";

let params = new URLSearchParams("");

export type fetchResponse = {
    data: APIRESPONSE & { data: any };
    status?: "success" | "error";
};

export const useTableStore = defineStore("table-component-store", () => {
    const router = useRouter();
    const apiUrl = ref<string | null>(null);
    const searchParam = ref<string>("?page=1&per_page=10");
    const isLoading = ref(false);
    const apiMeta = ref<Partial<APIRESPONSE> | null>({
        total: null,
        current_page: null,
        last_page: null,
        per_page: null,
        to: null,
    });

    const dataSource = ref<Array<any>>([]);
    const page = ref<number>(1);
    const resultsPerPage = ref<number>(15);

    const onFetchTable = (): any => {
        if (apiUrl.value) {
            isLoading.value = true;
            return fetchData(apiUrl.value, searchParam.value)
                .then((res) => {
                    if (res.data.value) {
                        const data = (res.data.value as fetchResponse).data;

                        isLoading.value = false;

                        dataSource.value = data.data;
                        apiMeta.value = data;
                    } else {
                        throw res.error.value;
                    }
                })
                .catch((err) => {
                    isLoading.value = false;
                    return { status: "error" } as fetchResponse;
                });
        }
    };

    function buildSearchParams(data: any) {
        forEach(data, (e: any, i) => {
            let paramsKey: string[] = [];

            for (const key of params.keys()) {
                paramsKey = [...paramsKey, key];
            }

            if (paramsKey.includes(i)) {
                if (!e) {
                    params.delete(i);
                    return;
                }

                params.set(i, e);
            } else {
                params.append(i, e);
            }
        });

        searchParam.value = "?" + params.toString();
        router.push(searchParam.value);
        onFetchTable();
    }

    function resetTable() {
        searchParam.value = "";
        apiUrl.value = "";
        apiMeta.value = {
            total: null,
            current_page: null,
            last_page: null,
            per_page: null,
            to: null,
        };
        params = new URLSearchParams("");
        router.push({ query: undefined });
        dataSource.value = [];
        page.value = 1;
        resultsPerPage.value = 15;
    }

    return {
        apiUrl,
        onFetchTable,
        searchParam,
        buildSearchParams,
        resetTable,
        isLoading,
        apiMeta,
        dataSource,
        page,
        resultsPerPage,
    };
});
