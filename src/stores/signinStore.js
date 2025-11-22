import { defineStore } from "pinia";
import { SigninService } from "@/services";
import { reactive } from "vue";
import { useRouter } from "vue-router";

export const useSignInStore = defineStore('signin', () => {
    const state = reactive({
        isLogged: false
    });
    const router = useRouter();

    async function verifyLogin() {
        if (localStorage.getItem("access") == null) {
            return false;
        }
        return true;
    }

    async function login(user) {
        try {
            const response = await SigninService.login(user);
            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);
            router.push('/management');
        }
        catch(error) {
            console.error('Error in POST token: ', error);
        }
    };

    return {
        state,
        login,
        verifyLogin
    }
})