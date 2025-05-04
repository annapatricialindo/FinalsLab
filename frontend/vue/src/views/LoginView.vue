<template>
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div class="card shadow p-4" style="min-width: 360px;">
            <h3 class="card-title text-center mb-4">Login</h3>

            <form @submit.prevent="handleLogin">
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" id="username" v-model="form.username" class="form-control" required />
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" id="password" v-model="form.password" class="form-control" required />
                </div>

                <button type="submit" class="btn btn-primary w-100">
                    <i class="fas fa-sign-in-alt me-2"></i>Login
                </button>
            </form>

            <div v-if="error" class="alert alert-danger mt-3 text-center" role="alert">
                {{ error }}
            </div>

            <!-- Success message -->
            <div v-if="success" class="alert alert-success mt-3 text-center" role="alert">
                {{ success }}
            </div>


            <!-- Registration link -->
            <div class="text-center mt-3">
                <span class="text-muted">Don't have an account?</span>
                <router-link to="/register" class="ms-1 text-decoration-none">Register here</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const form = reactive({
    username: '',
    password: ''
});
const error = ref('');
const success = ref('');
const store = useStore();
const router = useRouter();

const handleLogin = async () => {
    error.value = '';
    success.value = '';
    try {
        await store.dispatch('auth/login', form);

        const role = store.getters['auth/userRole'];
        console.log('User role after login:', role); // ✅ confirm role

        success.value = 'Login successful! Redirecting...';
        setTimeout(() => {
            if (role === 'employee') {
                router.push('/admin');
            } else if (role === 'customer') {
                router.push('/product');
            } else {
                router.push('/');
            }
        }, 1000); // ✅ Delay to show success message
    } catch (err) {
        error.value = 'Invalid username or password.';
    }
};
</script>
