<template>
    <div class="d-flex justify-content-center align-items-center vh-100 position-relative">
        <div class="background" :style="{ backgroundImage: 'url(/image/BG2.jpg)' }"></div>

        <transition name="fade">
            <div class="glass-card shadow p-4" v-show="showCard">
                <h3 class="text-center mb-4">Register</h3>

                <form @submit.prevent="handleRegister">
                    <div class="mb-3 input-icon-group">
                        <label for="username" class="form-label">Username</label>
                        <div class="input-group">
                            <span class="input-group-text">
                                <i class="fas fa-user"></i>
                            </span>
                            <input type="text" id="username" v-model="form.username" class="form-control" required />
                        </div>
                    </div>

                    <div class="mb-3 input-icon-group">
                        <label for="email" class="form-label">Email</label>
                        <div class="input-group">
                            <span class="input-group-text">
                                <i class="fas fa-envelope"></i>
                            </span>
                            <input type="email" id="email" v-model="form.email" class="form-control" required />
                        </div>
                    </div>

                    <div class="mb-3 input-icon-group">
                        <label for="password" class="form-label">Password</label>
                        <div class="input-group">
                            <span class="input-group-text">
                                <i class="fas fa-lock"></i>
                            </span>
                            <input type="password" id="password" v-model="form.password" class="form-control"
                                required />
                        </div>
                    </div>

                    <button class="btn btn-success w-100">
                        <i class="fas fa-user-plus me-2"></i>Register
                    </button>
                </form>

                <div v-if="error" class="alert alert-danger mt-3 text-center">
                    {{ error }}
                </div>

                <div v-if="success" class="alert alert-success mt-3 text-center" role="alert">
                    {{ success }}
                </div>

                <div class="text-center mt-3">
                    <span class="text-muted">Already have an account?</span>
                    <router-link to="/login" class="ms-1 text-decoration-none">Login now</router-link>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const showCard = ref(false);

onMounted(() => {
    setTimeout(() => {
        showCard.value = true;
    }, 100); // small delay to trigger fade-in
});


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
    error.value = '';
    success.value = '';
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

<style scoped>
.fade-enter-active {
    transition: opacity 0.8s ease;
}

.fade-enter-from {
    opacity: 0;
}

.fade-enter-to {
    opacity: 1;
}

.background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: blur(10px);
    z-index: -1;
}

.glass-card {
    min-width: 400px;
    max-width: 500px;
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 16px;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    color: white;
}

.input-group-text {
    background-color: rgba(255, 255, 255, 0.2);
    border: none;
    color: #fff;
}

.form-control {
    background-color: rgba(255, 255, 255, 0.15);
    border: none;
    color: #fff;
}

.form-control::placeholder {
    color: #ddd;
}

.form-control:focus {
    background-color: rgba(255, 255, 255, 0.25);
    color: #fff;
}
</style>