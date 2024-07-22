import Api from "@/lib/api";

let api: Api;

export const useApi = () => {
    if (!api) {
        const config = useRuntimeConfig();
        api = new Api({
            fetchOptions: {
                baseURL: config.public.apiBase as string,
                body: {
                    search: "",
                    page: 1,
                    per_page: 2,
                },
            },
            webURL: config.public.uriURL as string,
            apiURL: config.public.apiURL as string,
            redirect: {
                logout: "/",
                login: "/painel",
            },
        });
    }
    return api;
};
