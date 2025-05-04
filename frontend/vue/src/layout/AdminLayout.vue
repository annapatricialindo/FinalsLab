<template>
  <div>
    <div class="background" :style="{ backgroundImage: 'url(/image/BG1.jpg)' }"></div>
    <nav class="navbar px-4">
      <a class="navbar-brand" href="/home">
        <i class="fas fa-store"></i> MusicTrack
      </a>
      <div class="d-flex gap-3">
        <!-- Toggle Transaction/Admin Button -->
        <button class="btn btn-outline-light" @click="toggleRoute">
          <i class="fas" :class="isTransactionRoute ? 'fa-arrow-left' : 'fa-file-invoice'"></i>
          {{ isTransactionRoute ? 'Back to Admin' : 'View Transactions' }}
        </button>

        <!-- Logout -->
        <button class="btn btn-outline-light" @click="logout">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </nav>

    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isTransactionRoute = computed(() => route.path === '/transaction');

const toggleRoute = () => {
  if (isTransactionRoute.value) {
    router.push('/admin');
  } else {
    router.push('/transaction');
  }
};

const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/';
};
</script>

<style scoped>
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

.navbar {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.navbar a.navbar-brand,
.navbar button {
  color: #fff;
}
</style>
