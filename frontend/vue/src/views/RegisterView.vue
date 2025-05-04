<template>
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div class="card shadow p-4" style="min-width: 360px;">
            <h3 class="card-title text-center mb-4">Register</h3>

            <form @submit.prevent="handleRegister">
                <div class="mb-3">
                    <label class="form-label">Username</label>
                    <input type="text" v-model="form.username" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" v-model="form.email" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label class="form-label">Password</label>
                    <input type="password" v-model="form.password" class="form-control" required />
                </div>
                <button class="btn btn-success w-100">
                    <i class="fas fa-user-plus me-2"></i>Register
                </button>
            </form>

            <div v-if="error" class="alert alert-danger mt-3 text-center">
                {{ error }}
            </div>

            <!-- Success message -->
            <div v-if="success" class="alert alert-success mt-3 text-center" role="alert">
                {{ success }}
            </div>


            <!-- Registration link -->
            <div class="text-center mt-3">
                <span class="text-muted">Already have an account?</span>
                <router-link to="/login" class="ms-1 text-decoration-none">Login now</router-link>
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
    email: '',
    password: ''
});
const error = ref('');
const success = ref('');
const store = useStore();
const router = useRouter();

const handleRegister = async () => {
    try {
        await store.dispatch('auth/register', form);
        success.value = 'Registration successful! Redirecting...';
        setTimeout(() => {
            router.push('/login');
        }, 1000);
    } catch (err) {
        error.value = err?.response?.data?.message || err.message || 'Registration failed';
    }
};
</script>