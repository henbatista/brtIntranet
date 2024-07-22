import { useToast } from "vue-toast-notification";
const toast = useToast({
    duration: 4000,
    position: "top-right",
    pauseOnHover: true,
});
export default defineNuxtPlugin(() => {
    return {
        provide: {
            toast,
        },
    };
});
