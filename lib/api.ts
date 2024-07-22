import type { FetchError, FetchOptions, SearchParameters } from "ofetch";
import { $fetch } from "ofetch";
import { useAuthStore } from "@/stores/AuthStore";
import { useAlertStore } from "@/stores/AlertStore";
import { Router } from "~/.nuxt/vue-router";

export interface AuthConfig {
  fetchOptions: FetchOptions<"json">;
  webURL: string;
  apiURL: string;
  redirect: {
    logout: string;
    login: undefined | string;
  };
}

const authConfigDefaults: AuthConfig = {
  fetchOptions: {},
  apiURL: "https://localhost:8001",
  webURL: "https://localhost:3000",
  redirect: {
    logout: "/",
    login: "/painel",
  },
};

export default class Api {
  public envConfig = useRuntimeConfig();
  public router = useRouter();
  public authStore = useAuthStore();
  public alertStore = useAlertStore();
  public config: AuthConfig;

  public nuxtApp = useNuxtApp();

  constructor(config: AuthConfig) {
    this.config = { ...authConfigDefaults, ...config };
  }

  private fetchOptions(
    params?: SearchParameters,
    method = "GET"
  ): FetchOptions<"json"> {
    const fetchOptions = this.config.fetchOptions;
    fetchOptions.headers = {
      Accept: "application/json",
      Authorization: this.authStore.accessToken() || "",
      Referer: this.config.webURL,
    };
    fetchOptions.method = method;
    fetchOptions.onRequest = () => {
      this.nuxtApp.callHook("page:start").catch(() => {
        this.alertStore.$patch((state) => {
          state.loading = true;
        });
      });
    };
    fetchOptions.onResponse = () => {
      this.nuxtApp.callHook("page:finish").catch(() => {
        this.alertStore.$patch((state) => {
          state.loading = true;
        });
      });
    };
    fetchOptions.onResponseError = (error) => {
      //   this.alertStore.$patch((state) => {
      //     state.loading = false;
      //   });
      this.handleError(error as unknown as FetchError).catch(() => {});
    };
    delete this.config.fetchOptions.body;
    delete this.config.fetchOptions.params;
    if (params) {
      if (method === "POST" || method === "PUT")
        this.config.fetchOptions.body = params;
      else this.config.fetchOptions.params = params;
    }
    return this.config.fetchOptions;
  }

  public async customFetchRequest<Response>(
    endpoint: string,
    params?: SearchParameters,
    method?: string
  ): Promise<Response | undefined> {
    return await $fetch<Response>(endpoint, this.fetchOptions(params, method));
  }

  public handleResponse<Response>(response: Response): Response {}

  public async handleError(error: FetchError): Promise<void> {
    if (error.response?.status === 401) return await this.invalidate();

    // if (error.response?.status === 402 && this.config.paymentToast)
    //   return this.$toast.show(this.config.paymentToast);

    // if (!this.$toast) throw error;

    if (error.response?._data && error.response._data.errors?.error?.reason) {
      for (const err of error.response._data.errors) {
        this.alertStore.$patch((state) => {
          state.success = false;
          state.message = err.detail ?? err.message ?? "";
        });
      }
    }

    if (error.response?.status === 403) {
      if (error.response !== undefined) {
        this.alertStore.$patch((state) => {
          state.success = false;
          state.message = error.response._data.message;
        });
      }
    }

    if (error.response?._data.exception) {
      if (error.response !== undefined) {
        this.alertStore.$patch((state) => {
          state.success = false;
          state.message = `
                  <b>[${error.response._data.exception}]</b><br />
                  ${error.response._data.message}<br />
                  <a href="phpstorm://open?file=/${error.response._data.file}&line=${error.response._data.line}">
                    ${error.response._data.file}:${error.response._data.line}
                  </a>`;
        });
      }
    }
  }

  public async invalidate(router?: Router): Promise<void> {
    this.authStore.$reset();

    if (router) {
      await router.push(this.config.redirect.logout);
    } else if (
      process.client &&
      document.location.pathname !== this.config.redirect.logout
    ) {
      document.location.href = this.config.redirect.logout;
    }
  }
}
