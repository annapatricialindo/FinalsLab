<template>
  <div>
    <!-- Background -->
    <div class="background" :style="{ backgroundImage: 'url(/image/BG1.jpg)' }"></div>

    <!-- Navbar -->
    <nav class="navbar px-4">
      <a class="navbar-brand" href="/home">
        <i class="fas fa-store"></i> MusicTrack
      </a>
      <div class="d-flex gap-3">
        <!-- Modal Button to open the Cart -->
        <button class="btn btn-outline-light" @click="showCart = true">
          <i class="fas fa-shopping-cart"></i> View Cart
          <span v-if="cartItemCount > 0" class="badge bg-light text-dark ml-2">{{ cartItemCount }}</span>
        </button>

        <button class="btn btn-outline-light" @click="logout">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </nav>

    <!-- Modal for Shopping Cart -->
    <transition name="modal-fade">
      <div class="modal fade show d-flex align-items-center justify-content-center" :class="{ 'd-block': showCart }"
        v-if="showCart" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered" @click="showCart = false">
          <div class="modal-content glassmorphism" @click.stop>
            <div class="modal-header">
              <h5 class="modal-title"><i class="fas fa-shopping-basket"></i> Shopping Cart</h5>
              <button type="button" class="btn-close" @click="showCart = false"></button>
            </div>
            <div class="modal-body">
              <ShoppingCart :cartItems="cart" @update-quantity="updateQuantity" @remove-item="removeItem"
                @clear-cart="clearCart" />
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Slot for Customer Page Content -->
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import ShoppingCart from '../components/Cart.vue'; // Import ShoppingCart component

const store = useStore();
const showCart = ref(false); // State for controlling the modal visibility

// Fetch cart items from Vuex store
const cart = computed(() => store.getters['cart/cartItems']);

// Fetch cart item count
const cartItemCount = computed(() => cart.value.reduce((total, item) => total + item.quantity, 0));

// Load cart data on mount
onMounted(() => {
  // Fetch the cart data from Vuex store on component mount
  store.dispatch('cart/fetchCart');
});

// Handle logout
const logout = () => {
  store.commit('auth/logout');
  window.location.href = '/';
};

// Cart actions
const updateQuantity = (id, quantity) => {
  store.dispatch('cart/updateQuantity', { id, quantity });
};

const removeItem = (id) => {
  store.dispatch('cart/removeItem', id);
};

const clearCart = () => {
  store.dispatch('cart/clearCart');
};
</script>

<style scoped>
/* Reuse existing styles from your original + slider styles */
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

/* Modal Styles */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter,
.modal-fade-leave-to

/* .modal-fade-leave-active in <2.1.8 */
  {
  opacity: 0;
}

.glassmorphism {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.modal-header .btn-close {
  color: #fff;
}


.modal-dialog {
  position: fixed;
  height: auto;
  /* Adjust height as needed */
  max-width: 600px;
  width: 100%;
  overflow-y: auto;
}

.modal-content {
  width: 100%;
  max-width: 100%;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.animate-modal {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
