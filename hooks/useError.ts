import { ToastProps, useToast } from "vue-toast-notification";

const toastOptions: ToastProps = {
    position: "top-right",
};

export const onPromisseError = (error: any, messages?: string) => {
    console.log({ error, messages });
    const $toast = useToast();

    if (error?.message) {
        $toast.error(error.message, toastOptions);
    } else {
        $toast.error(messages || "Algo deu errado", toastOptions);
    }
};
