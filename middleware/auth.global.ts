export default defineNuxtRouteMiddleware((to) => {
    if (process.client) {
        const loginToken = localStorage.getItem("user/token");

        if (!loginToken && to.path !== "/") {
            return navigateTo("/");
        }
        if (loginToken) {
            // Prossiga com a lógica baseada em permissões para redirecionamento
            if (to.path === "/") {
                return navigateTo("/painel");
            }
        }
    }
});
