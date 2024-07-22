<script lang="ts" setup>
import { useAuthStore } from "@/stores/AuthStore";
import { useAlertStore } from "@/stores/AlertStore";
import type { FormLogin } from "@/types/frontend";
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";

const router = useRouter();
const authStore = useAuthStore();
const alertStore = useAlertStore();
const errorsRef: Ref<any[]> = ref([]);
const formData: Ref<FormLogin> = ref({
    user_email: "",
    user_password: "",
});

const rules = computed(() => {
    return {
        user_email: {
            required: helpers.withMessage(
                "Email é campo obrigatório",
                required
            ),
            email: helpers.withMessage("Email no formato inválido", email),
        },
        user_password: {
            required: helpers.withMessage(
                "Senha é campo obrigatório",
                required
            ),
        },
    };
});
const v$ = useVuelidate(rules, formData);

const submitForm = async () => {
    alertStore.loading = true;
    v$.value.$validate();

    if (v$.value.$error) {
        const errors = JSON.parse(JSON.stringify(v$.value.$errors));
        if (errors !== null && errors !== undefined) {
            errorsRef.value = [...errors];
        }
    } else {
        try {
            await authStore.login(formData.value);
            router.push("/painel");
            alertStore.message = "Login efetuado com sucesso!";
            alertStore.success = true;
        } catch (error: any) {
            alertStore.message = error.message;
            alertStore.success = false;
            alertStore.loading = false;
        }
    }
};
</script>
<template>
    <NuxtLayout name="auth">
        <section class="login-section">
            <div class="header">
                <img
                    src="/images/brt-2.svg"
                    alt="BRT Consolidadora - Operadora de Turismo"
                />
                <h1>Login Intranet</h1>
                <p>Digite seu email e senha para entrar</p>
            </div>
            <form>
                <CommonInputWrapInput
                    label="Email/Usuário"
                    v-model="formData.user_email"
                />
                <CommonInputWrapInput
                    label="Senha"
                    v-model="formData.user_password"
                    type="password"
                />

                <!-- <div class="col-4 text-right">
                                                    <a href="#">
                                                        Esqueci a senha
                                                    </a>
                                                </div> -->
                <div class="button-container">
                    <!-- <button type="submit" class="btn full" @click.prevent="login"> -->
                    <ButtonComponent @click="submitForm">
                        Entrar
                    </ButtonComponent>
                </div>
            </form>
        </section>
        <LayoutFooter />
    </NuxtLayout>
</template>

<style lang="scss" scoped>
.login-section {
    max-width: 400px;
    padding: 40px;
    border-radius: 3px;
    margin: 0 auto;
    background-color: var(--white);

    .header {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        img {
            max-width: 140px;
            margin-bottom: 20px;
        }

        h1 {
            font-size: 30px;
            font-weight: 900;
            color: var(--grey-900);
            margin-bottom: 6px;
        }

        p {
            font-weight: 400;
            color: var(--grey-800);
            margin: 0;
        }
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 18px;
        margin-top: 40px;
    }

    .button-container {
        margin-top: 10px;

        button {
            width: 100%;
        }
    }
}
</style>
