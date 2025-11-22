import api from "@/plugins/api";

class SignInService {
    async login(user) {
        const response = await api.post('/token/', user, { headers: { skipAuth: true } });
        return response;
    }
}

export default new SignInService();